import config from './config.json'

import gulp from 'gulp'
import gutil from 'gulp-util'
import sourcemaps from 'gulp-sourcemaps'
import sass from 'gulp-sass'
import template from 'gulp-template'
import file from 'gulp-file'
import s3 from 'gulp-s3-upload';
import size from 'gulp-size'
import webserver from 'gulp-webserver'

import fs from 'fs'
import del from 'del'
import runSequence from 'run-sequence'
import source from 'vinyl-source-stream'
import buffer from 'vinyl-buffer'
import inquirer from 'inquirer'
import rollup from 'rollup-stream'
import rp from 'request-promise-native'

const buildDir = '.build';
const cdnUrl = 'https://interactive.guim.co.uk';

const isDeploy = gutil.env._.includes('deploy');

const version = `v/${Date.now()}`;
const s3Path = `atoms/${config.path}`;
const s3VersionPath = `${s3Path}/${version}`;
const path = isDeploy ? `${cdnUrl}/${s3VersionPath}` : '.';

// hack to use same presets for rollup, but with custom es2015
const babelrc = JSON.parse(fs.readFileSync('.babelrc'));
const presets = babelrc.presets.filter(p => p !== 'es2015');

const rollupPlugins = [
    require('rollup-plugin-json')(),
    require('rollup-plugin-string')({
        'include': '**/*.html'
    }),
    require('rollup-plugin-node-resolve')({
        'jsnext': true
    }),
    require('rollup-plugin-commonjs')({
        'include': ['node_modules/**']
    }),
    require('rollup-plugin-babel')({
        'presets': [['es2015', {'modules': false}], ...presets],
        'plugins': ['external-helpers'],
        'babelrc': false,
        'exclude': 'node_modules/**'
    }),
    isDeploy && require('rollup-plugin-uglify')()
];

function buildJS(filename) {
    return () => {
        return rollup({
                'entry': `./src/js/${filename}`,
                'sourceMap': true,
                'plugins': rollupPlugins,
                'format': 'iife'
            })
            .pipe(source(filename, './src/js'))
            .pipe(buffer())
            .pipe(template({path}))
            .pipe(sourcemaps.init({'loadMaps': true}))
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest(buildDir));
    }
}

function s3Upload(cacheControl, keyPrefix) {
    return s3()({
        'Bucket': 'gdn-cdn',
        'ACL': 'public-read',
        'CacheControl': cacheControl,
        'keyTransform': fn => `${keyPrefix}/${fn}`
    });
}

function requireUncached(module) {
    delete require.cache[require.resolve(module)];
    return require(module);
}

gulp.task('clean', () => del(buildDir));

gulp.task('build:css', () => {
    return gulp.src('src/css/*.scss')
        .pipe(template({path}))
        .pipe(sourcemaps.init())
        .pipe(sass({
            'outputStyle': isDeploy ? 'compressed' : 'expanded'
        }).on('error', sass.logError))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(buildDir));
});

gulp.task('build:js.main', buildJS('main.js'));
gulp.task('build:js.app', buildJS('app.js'));
gulp.task('build:js', ['build:js.main', 'build:js.app']);

gulp.task('build:html', cb => {
    let render = requireUncached('./src/render.js').render;

    Promise.resolve(render()).then(html => {
        file('main.html', html, {'src': true})
            .pipe(template({path}))
            .pipe(gulp.dest(buildDir))
            .on('end', cb);
    }).catch(err => {
        gutil.log(err);
    });
});

gulp.task('build:assets', () => {
    return gulp.src('src/assets/**/*').pipe(gulp.dest(`${buildDir}/assets`));
});

gulp.task('_build', ['clean'], cb => {
    runSequence(['build:css', 'build:js', 'build:html', 'build:assets'], cb);
});

// TODO: less hacky build/_build?
gulp.task('build', ['_build'], () => {
    return gulp.src(`${buildDir}/**/!(*.map)`)
        .pipe(size({'gzip': true, 'showFiles': true}))
});

gulp.task('deploy', ['build'], cb => {
    inquirer.prompt({
        type: 'list',
        name: 'env',
        message: 'Where would you like to deploy to?',
        choices: ['preview', 'live']
    }).then(res => {
        gulp.src(`${buildDir}/**/*`)
            .pipe(s3Upload('max-age=31536000', s3VersionPath))
            .on('end', () => {
                gulp.src('config.json')
                    .pipe(file(res.env, version))
                    .pipe(s3Upload('max-age=30', s3Path))
                    .on('end', cb);
            });
    });
});

gulp.task('local', ['build'], () => {
    return gulp.src('harness/*')
        .pipe(template({
            'css': fs.readFileSync(`${buildDir}/main.css`),
            'html': fs.readFileSync(`${buildDir}/main.html`),
            'js': fs.readFileSync(`${buildDir}/main.js`)
        }))
        .pipe(gulp.dest(buildDir));
});

gulp.task('default', ['local'], () => {
    gulp.watch('src/**/*', ['local']).on('change', evt => {
        gutil.log(`File ${evt.path} was ${evt.type}`);
    });

    gulp.src(buildDir).pipe(webserver());
});

gulp.task('url', () => {
    gutil.log(gutil.colors.green(`Atom URL: https://content.guardianapis.com/atom/interactive/${config.path}`));
});

gulp.task('log', () => {
    function log(type) {
        return rp(`${cdnUrl}/atoms/${config.path}/${type}.log`).then(log => {
            gutil.log(gutil.colors.green(`Got ${type} log:`));
            console.log(log);
        }).catch(err => {
            if (err.statusCode === 404) {
                gutil.log(gutil.colors.yellow(`No ${type} log, have you ever deployed?`));
            } else {
                throw err;
            }
        });
    }

    return Promise.all([log('live'), log('preview')]);
});

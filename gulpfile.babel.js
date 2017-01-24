import config from './config.json'

import gulp from 'gulp'
import file from 'gulp-file'
import gutil from 'gulp-util'
import s3 from 'gulp-s3-upload';
import sass from 'gulp-sass'
import size from 'gulp-size'
import sourcemaps from 'gulp-sourcemaps'
import template from 'gulp-template'

import browserSync from 'browser-sync'
import buffer from 'vinyl-buffer'
import del from 'del'
import fs from 'fs'
import inquirer from 'inquirer'
import rollup from 'rollup-stream'
import rp from 'request-promise-native'
import runSequence from 'run-sequence'
import source from 'vinyl-source-stream'

const browser = browserSync.create();

const buildDir = '.build';
const cdnUrl = 'https://interactive.guim.co.uk';

const isDeploy = gutil.env._.indexOf('deploy') > -1;

const version = `v/${Date.now()}`;
const s3Path = `atoms/${config.path}`;
const s3VersionPath = `${s3Path}/${version}`;
const path = isDeploy ? `${cdnUrl}/${s3VersionPath}` : '.';

// hack to use .babelrc environments without env var, would be nice to
// be able to pass "client" env through to babel
const babelrc = JSON.parse(fs.readFileSync('.babelrc'));
const presets = (babelrc.presets || []).concat(babelrc.env.client.presets);
const plugins = (babelrc.plugins || []).concat(babelrc.env.client.plugins);

const rollupPlugins = [
    require('rollup-plugin-json')(),
    require('rollup-plugin-string')({
        'include': '**/*.html'
    }),
    require('rollup-plugin-node-resolve')({
        'jsnext': true, 'browser': true
    }),
    require('rollup-plugin-commonjs')({
        'include': ['node_modules/**']
    }),
    require('rollup-plugin-babel')({
        'exclude': 'node_modules/**',
        'babelrc': false,
        presets, plugins
    }),
    isDeploy && require('rollup-plugin-uglify')()
];

function logError(plugin, err) {
    console.error(new gutil.PluginError(plugin, err.message).toString());
    if (err instanceof SyntaxError) {
        console.error(err.codeFrame);
    }
}

function buildJS(filename) {
    return () => {
        return rollup({
                'entry': `./src/js/${filename}`,
                'sourceMap': true,
                'plugins': rollupPlugins,
                'format': 'iife'
            })
            .on('error', function (err) {
                logError('rollup', err);
                this.emit('end');
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

function readOpt(fn) {
    try {
        return fs.readFileSync(fn);
    } catch (err) {
        return '';
    }
}

gulp.task('clean', () => del(buildDir));

gulp.task('build:css', () => {
    return gulp.src('src/css/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            'outputStyle': isDeploy ? 'compressed' : 'expanded'
        }).on('error', sass.logError))
        .pipe(sourcemaps.write('.'))
        .pipe(template({path}))
        .pipe(gulp.dest(buildDir))
        .pipe(browser.stream({'match': '**/*.css'}));
});

gulp.task('build:js.main', buildJS('main.js'));
gulp.task('build:js.app', buildJS('app.js'));
gulp.task('build:js', ['build:js.main', 'build:js.app']);

gulp.task('build:html', cb => {
    try {
        let render = requireUncached('./src/render.js').render;

        Promise.resolve(render()).then(html => {
            file('main.html', html, {'src': true})
                .pipe(template({path}))
                .pipe(gulp.dest(buildDir))
                .on('end', cb);
        }).catch(err => {
            logError('render.js', err);
            cb();
        });
    } catch (err) {
        logError('render.js', err);
        cb();
    }
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
    if(s3Path === "atoms/2016/05/blah") {
        console.error("ERROR: You need to change the deploy path from its default value")
        return;
    }

    inquirer.prompt({
        type: 'list',
        name: 'env',
        message: 'Where would you like to deploy to?',
        choices: ['preview', 'live']
    }).then(res => {
        let isLive = res.env === 'live';
        gulp.src(`${buildDir}/**/*`)
            .pipe(s3Upload('max-age=31536000', s3VersionPath))
            .on('end', () => {
                gulp.src('config.json')
                    .pipe(file('preview', version))
                    .pipe(isLive ? file('live', version) : gutil.noop())
                    .pipe(s3Upload('max-age=30', s3Path))
                    .on('end', cb);
            });
    });
});

gulp.task('deploylive', ['build'], cb => {
    if(s3Path === "atoms/2016/05/blah") {
        console.error("ERROR: You need to change the deploy path from its default value")
        return;
    }

    gulp.src(`${buildDir}/**/*`)
        .pipe(s3Upload('max-age=31536000', s3VersionPath))
        .on('end', () => {
            gulp.src('config.json')
                .pipe(file('preview', version))
                .pipe(file('live', version))
                .pipe(s3Upload('max-age=30', s3Path))
                .on('end', cb);
        });
});

gulp.task('deploypreview', ['build'], cb => {
    if(s3Path === "atoms/2016/05/blah") {
        console.error("ERROR: You need to change the deploy path from its default value")
        return;
    }
    
    gulp.src(`${buildDir}/**/*`)
        .pipe(s3Upload('max-age=31536000', s3VersionPath))
        .on('end', () => {
            gulp.src('config.json')
                .pipe(file('preview', version))
                .pipe(s3Upload('max-age=30', s3Path))
                .on('end', cb);
        });
});

gulp.task('local', ['build'], () => {
    return gulp.src('harness/*')
        .pipe(template({
            'css': readOpt(`${buildDir}/main.css`),
            'html': readOpt(`${buildDir}/main.html`),
            'js': readOpt(`${buildDir}/main.js`)
        }))
        .pipe(gulp.dest(buildDir));
});

gulp.task('default', ['local'], () => {
    gulp.watch('src/**/*', ['local']).on('change', evt => {
        console.log();
        gutil.log(gutil.colors.yellow(`${evt.path} was ${evt.type}`));
    });

    browser.init({
        'server': {'baseDir': buildDir},
        'port': 8000
    });
});

gulp.task('url', () => {
    gutil.log(gutil.colors.green(`Atom URL: https://content.guardianapis.com/atom/interactive/interactives/${config.path}`));
});

gulp.task('log', () => {
    function log(type) {
        let url = `${cdnUrl}/atoms/${config.path}/${type}.log?${Date.now()}`;
        return rp(url).then(log => {
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

import * as d3 from "d3"
import palette from "./palette"

const width = d3.select(".i-wrapper").node().clientWidth;

console.log(width);

const height = 600;

d3.json("https://interactive.guim.co.uk/docsdata-test/1ptuRrQAghh7iSEuW_uVfrUJDAJAkOb8iW7rp4_uq-hc.json").then(sheets => {
    const data = sheets.sheets.Sheet1;

    const nested = d3.nest().key(d => d.state).key(d => d.chamber).entries(data);

    d3.json("https://interactive.guim.co.uk/docsdata-test/136QJBEnYCO_Rx_3XhMPU_JqsaQ1db8XDmOuG6KyG5Eo.json").then(doc => {
        const maleCount = data.filter(d => d.gender === "M").length;
        const femaleCount = data.filter(d => d.gender === "F").length;

        d3.select(".intro-numbers").html(`<span>${maleCount} male</span> and <span>${femaleCount} female</span> legislators have signed near-total abortion bans`);

        nested.forEach(state => {
            const docBlock = doc.body.blocks.find(b => b.state === state.key);

            drawState(state, docBlock);
        });
    });
});

const strokeColour = (obj) => {
    if(obj.race !== "W") {
        return "#333";
    } else {
        return "#eaeaea";
    }
}

const fillColour = (obj) => {
    if(obj.party === "D") {
        return "#0084c6";
    } else {
        return "#c70000";
    }
}

const barScale = d3.scaleLinear().domain([0, 55]).range([0, 180]);

function flatten(arr) {
    return arr.reduce(function (flat, toFlatten) {
      return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
    }, []);
  }


const drawState = (stateData, docData) => {
    const wrapper = d3.select(".i-main").append("div").classed("state-wrapper", true);
    const header = wrapper.append("h2")
        .text(stateData.key);

    const intro = wrapper.append("p")
        .classed("intro-text", true)
        .text(docData.copy);

    const dataVizWrapper = wrapper.append("div")
        .classed("data-viz-wrapper", true);

    const allStateData = flatten(stateData.values.map(d => d.values));

    const percentWomen = ((allStateData.filter(d => d.gender === "F").length / allStateData.length) * 100).toFixed(1);
    const percentNonWhite = ((allStateData.filter(d => d.race !== "W").length / allStateData.length) * 100).toFixed(1);

    dataVizWrapper.html(`
        <div class="box left-labels"><div class="row row--1"></div><div class="row row--2">Yes voters</div><div class="row row--3">State population</div></div>
        <div class="box percent-women"><div class="row row--1">Women</div><div class="row row--2"><div class="bar" style="width: ${barScale(percentWomen)}px;"></div>${percentWomen}%</div><div class="row row--3"><div class="bar" style="width: ${barScale(docData.percentWomen.replace(/%/g, ""))}px;"></div>${docData.percentWomen}</div></div>
        <div class="box percent-bme"><div class="row row--1">Non-white</div><div class="row row--2"><div class="bar" style="width: ${barScale(percentNonWhite)}px;"></div>${percentNonWhite}%</div><div class="row row--3"><div class="bar" style="width: ${barScale(docData.percentNonWhite.replace(/%/g, ""))}px;"></div>${docData.percentNonWhite}</div></div>
        `);
            
    ["s", "h"].forEach(chamber => {

        const chamberLabel = wrapper.append("h3")
            .classed("chamber-label", true)
            .text((chamber === "s") ? "Senate" : "House");

        const chamberLabelDate = wrapper.append("h3")
            .classed("chamber-label-date", true)
            .text("Passed " + (chamber === "s") ? docData.senatePassed : docData.housePassed);

        const chamberData = stateData.values.find(d => d.key === chamber);

        const svg = wrapper
            .append("svg")
            .attr("height", height)
            .attr("width", width);
            
        
    //     const defs = svg.html(`<pattern id="image-male" height="62" width="60">
    //     <image x="0" y="0" height="62" width="60" xlink:href="<%= path %>/assets/headshot-male.svg"></image>
    //   </pattern>`);

        const strength = 0.1;
        const radius = 25;
        const padding = 5;

        let nodes = chamberData.values;

        const isMobile = width < 700;

        const xStrength = (isMobile) ? strength*1.5 : strength;

        const yStrength = (isMobile) ? strength : strength*4;

        const xForce = (!isMobile) ? d3.forceX(d => d.gender === "M" ? -100 : 100).strength(strength*2) : d3.forceX().strength(xStrength);

        const yForce = (!isMobile) ? d3.forceY().strength(yStrength) : d3.forceY(d => d.gender === "M" ? -100 : 100).strength(yStrength)

        const simulation = d3.forceSimulation(nodes)
            .force("x", xForce)
            .force("x0", d3.forceX().strength(xStrength))
            .force("y0", d3.forceY().strength(yStrength))
            .force("y", yForce)
            .force("collide", d3.forceCollide(radius + padding))
            // .force("r", d3.forceRadial(function(d) { console.log(d); return d.gender === "M" ? 200 : 400; }))
            //   .on("tick", ticked);

        for (var i = 0, n = Math.ceil(Math.log(simulation.alphaMin()) / Math.log(1 - simulation.alphaDecay())); i < n; ++i) {
            simulation.tick()

            nodes.forEach(n => {
                if(n.x) {
                    n.x = Math.min(Math.max(n.x, (-width/2) + radius), width/2 - radius*2);
                }
                // console.log(n)
                return n;
            });
        }

        const heightExtent = d3.extent(nodes, d => d.y)

        const newHeight = (heightExtent[1] + radius*2) - (heightExtent[0] - radius*2);

        svg.attr("height", newHeight);

        svg.append("clipPath")
            .attr("id", "circle-clip")
            .html(`<circle cx="${radius - 4}" cy="${radius - 6}" r="${radius - 1}" />`);

        let labels = [];

        svg.selectAll("circle.bar")
            .data(nodes)
            .enter()
            .append("circle")
                .attr("cx", d => d.x + (width/2))
                .attr("cy", d => d.y + (newHeight/2 + radius/2))
                .attr("r", d => radius)
                .style("fill", (d, i) => fillColour(chamberData.values[i]))
                .style("stroke", (d, i) => strokeColour(chamberData.values[i]))
                .style("stroke-width", "3px")
                .on("mouseover", function(d,i) {
                    labels.push(svg.append("text")
                        .text(chamberData.values[i].firstname + " " + chamberData.values[i].lastname)
                        .classed("text-label", true)
                        .attr("x", d.x + width/2)
                        .style("text-anchor", "middle")
                        .attr("y", d.y + newHeight/2 + radius/2 - 6 + radius/2));
                })
                .on("mouseleave", function(d,i) {
                    labels.forEach((l) => {
                        l.node().remove();
                    })
                    labels = [];
                });

        svg.selectAll(".foo")
            .data(nodes)
            .enter()
                .append("g")
                .classed("overlay-image", true)
                .attr("transform", d => `translate(${d.x + (width/2) - radius + 4} ${d.y + (newHeight/2) - radius + 6 + radius/2})`)
                .html((d, i) => (chamberData.values[i].gender === "M") ? `<g>
                <g>
                    <path fill="#7B7B7B" d="M0,45.8v-5.7c0-4.1,2.8-7.4,6.3-7.4h30.4c3.5,0,6.3,3.3,6.3,7.4v5.7H0z"/>
                    <g>
                        <path fill="#C6C6C6" d="M29.3,17.9c0,1,0.8,1.8,1.8,1.8l0,0c1,0,1.8-0.8,1.8-1.8v-3.5c0-1-0.8-1.8-1.8-1.8l0,0
                            c-1,0-1.8,0.8-1.8,1.8V17.9z"/>
                        <path fill="#C6C6C6" d="M10,17.9c0,1,0.8,1.8,1.8,1.8l0,0c1,0,1.8-0.8,1.8-1.8v-3.5c0-1-0.8-1.8-1.8-1.8l0,0
                            c-1,0-1.8,0.8-1.8,1.8V17.9z"/>
                    </g>
                    <path fill="#C6C6C6" d="M15.8,34.7c0,0,1.9,2.9,5.7,2.9c3.8,0,5.7-2.9,5.7-2.9V24.2H15.8V34.7z"/>
                    <path fill="#D8D8D8" d="M11.8,21.5c0,5.3,4.3,9.6,9.6,9.6l0,0c5.3,0,9.6-4.3,9.6-9.6V10.7c0-5.3-4.3-9.6-9.6-9.6l0,0
                        c-5.3,0-9.6,4.3-9.6,9.6V21.5z"/>
                    <path fill="#666666" d="M11.8,3.8C14.3,0.6,18.1,0,21.6,0c3.5,0,7,0.6,9.5,3.8c2.5,3.2,0,12.4,0,12.4l-2.2-6.2
                        c0,0-3.3-1.4-7.7-1.4S14,9.9,14,9.9l-2.2,6.2C11.8,16.1,9.3,6.9,11.8,3.8z"/>
                    <g>
                        <path fill="#373737" d="M27.1,32.4c0,0-0.8,3.7-5.7,5.2c0,0,2.7,1.2,3.2,3.1c0,0,3.5-3.9,4-5.9c0,0-0.2-3.2-1.5-3.2V32.4z"/>
                        <path fill="#373737" d="M15.8,32.4c0,0,0.8,3.7,5.7,5.2c0,0-2.7,1.2-3.2,3.1c0,0-3.5-3.9-4-5.9c0,0,0.2-3.2,1.5-3.2V32.4z"/>
                    </g>
                </g>
                <polygon opacity="0.7" fill="#1A1A1A" points="14.6,32.7 14.6,32.7 14.6,32.7 	"/>
                <path opacity="0.7" fill="#CCCCCC" d="M21.3,31.1L21.3,31.1c-0.3,0-1.2-0.1-2.3-0.3C19.8,31,20.6,31.1,21.3,31.1z"/>
            </g>` : `<g>
            <g>
                <g>
                    <path fill="#7F7F7F" d="M21,1.3c2.9,1.3,8.4,0.9,10.7,5.8c2.3,4.9,0.8,7,2,9c1.1,2,1.7,4.1,0.9,7.2c-0.9,3.1,1.3,9.2,2.5,9.3
                        c0,0-2.4,0-3.3-4.3c0,0-0.6,3.4,1.1,4.6c1.7,1.3,2.9,4.2-1.9,5.3c-4.8,1.1-23.5,4-29.5-4.4c0,0,1.7,1.1,4-1.6
                        c2.3-2.8-1.5,0.1-2.2-0.7c0,0,2.7-1.5,2.6-2.6c-0.1-1.1-3.8-3.4-1.9-9s3.4-2.9,2.8-7.1C8.3,8.5,14.6-1.7,21,1.3z"/>
                    <path fill="#4E4E4E" d="M0,47v-5.3c0-3.8,2.6-6.9,5.8-6.9h28.3c3.2,0,5.8,3.1,5.8,6.9V47H0z"/>
                    <path fill="#D8D8D8" d="M15.4,38.8l3.1,5.6c0.6,1.1,2.3,1.1,2.9,0l3.1-5.6v-9.8h-9.2V38.8z"/>
                    <g>
                        <path fill="#E2E2E2" d="M11.2,22.5c0,5,4,9,9,9l0,0c5,0,9-4,9-9V12.5c0-5-4-9-9-9l0,0c-5,0-9,4-9,9V22.5z"/>
                    </g>
                </g>
            </g>
            <path fill="#7F7F7F" d="M34.9,31.4c-0.1-0.3-0.3-0.7-0.4-1c-0.6-1.8-0.5-3.4-0.3-5.3c0.7-6.2-0.2-15.4-3.9-20.6
                c-3.5-4.8-9.5-5.6-14.6-3.1C9.8,4.2,7.1,9.5,6.1,15.6c-0.5,3-0.9,6.2-0.6,9.2c0.1,0.8,0.2,1.5,0.4,2.3c0.2,0.6,0.5,1.4,0.3,2.1
                c-0.3,1-1.6,1.6-2.5,2c-2.1,1.1-0.2,4.3,1.8,3.1c2.2-1.2,4.3-2.8,4.3-5.5c0-1.5-0.7-2.8-0.8-4.3C9,23,9.2,21.4,9.3,19.8
                c0.2-2.5,0.4-5,1-7.4c-0.1,1.9,0.3,3.3,0.3,3.3h15.1l0.5-5.9v5.9h3.7c0.4,2.1,0.9,3.8,0.9,5.8c0,4-1.5,8.2,1.1,11.8
                c0.6,0.8,1.6,1.2,2.5,0.7C35.5,33.2,35.3,32.3,34.9,31.4z"/>
        </g>`)
                .style('clip-path', "url(#circle-clip")
                .style("mix-blend-mode", "screen")

        // svg.append("text")
        //     .text(22 + " men")
        //     .classed("big-number", true)
        //     .attr("x", 430)
        //     .attr("y", newHeight);

        // svg.append("text")
        //     .text(4 + " women")
        //     .classed("big-number", true)
        //     .attr("x", 1030)
        //     .attr("y", newHeight); 
    });
}


  

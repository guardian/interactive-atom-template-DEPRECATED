import * as d3 from "d3"
import palette from "./palette"
const width = 1260;
const height = 600;

d3.json("https://interactive.guim.co.uk/docsdata-test/1ptuRrQAghh7iSEuW_uVfrUJDAJAkOb8iW7rp4_uq-hc.json").then(sheets => {
    const data = sheets.sheets.Sheet1;

    const nested = d3.nest().key(d => d.state).key(d => d.chamber).entries(data);

    d3.json("https://interactive.guim.co.uk/docsdata-test/136QJBEnYCO_Rx_3XhMPU_JqsaQ1db8XDmOuG6KyG5Eo.json").then(doc => {
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

        const n = chamberData.values.length;

        const nodes = chamberData.values;

        const simulation = d3.forceSimulation(nodes)
            .force("x", d3.forceX(d => d.gender === "M" ? -200 : 400).strength(strength))
            .force("y", d3.forceY().strength(strength*2))
            .force("collide", d3.forceCollide(radius + padding))
            // .force("r", d3.forceRadial(function(d) { console.log(d); return d.gender === "M" ? 200 : 400; }))
            //   .on("tick", ticked);

        simulation.tick(300);

        const heightExtent = d3.extent(nodes, d => d.y)

        const newHeight = (heightExtent[1] + radius*2) - (heightExtent[0] - radius*2);

        svg.attr("height", newHeight);

        svg.append("clipPath")
            .attr("id", "circle-clip")
            .html(`<circle cx="${radius}" cy="${radius - 6}" r="${radius - 1}" />`);

        let labels = [];

        svg.selectAll("circle.bar")
            .data(nodes)
            .enter()
            .append("circle")
                .attr("cx", d => d.x + (width/2))
                .attr("cy", d => d.y + (newHeight/2))
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
                        .attr("y", d.y + newHeight/2 + radius/2 - 6));
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
                .attr("transform", d => `translate(${d.x + (width/2) - radius} ${d.y + (newHeight/2) - radius + 6})`)
                .html((d, i) => (chamberData.values[i].gender === "M") ? `<path fill="#fff" d="M50,51.3c0,0-0.2-11.8-2.7-13c-2.5-1.2-7.4-3.2-8.7-3.7c-5.7-2-2.6-3.2-7.6-5v-1.3c0,0,3.2-1.6,4.2-7.5
                c0,0,1.8,0.8,1.7-1.8c-0.1-2.4,0.8-5.5-1.8-4.1c0.3-1.2,1.4-5.4,0.5-10.5c0,0-3.4-4.3-10.5-4.3S14.6,4.3,14.6,4.3
                c-0.8,5.1,0.2,9.3,0.5,10.5c-2.6-1.3-1.7,1.8-1.8,4.1c-0.1,2.7,0.6,1.8,0.6,1.8c1,5.9,3.1,7.5,3.1,7.5v1.3c-6,1.8-0.7,3-6.4,5
                c-1.3,0.5-5.6,2.4-8.1,3.7C0,39.5,0,51.3,0,51.3l25,0.5L50,51.3z"/>` : `<path fill="#fff" d="M40.6,40.2c-0.4-0.5-0.8-0.9-1.3-1.2c-0.8-0.6-1.5-0.5-2.3-0.1c-0.1,0-0.3,0.1-0.4,0.2
                c-0.5-0.2-0.9-0.3-1.4-0.4c-0.7-1-1.7-1.8-2.5-2.3c-0.8-0.5-1.9-1.1-2.9-1.1c-0.1-0.6,0-1.4,0-2.1c3.4,0.1,7.1,0.2,8.7-0.2l-1.6-1.4
                c0,0,2.2,0.1,3.6-0.4l-1.7-1.3c0,0,1-0.2,2.3-0.2c0,0-2.4-5.4-2.4-7l1.1,0.1c0,0-1.7-4.7-2-8.7c0,0,1,0.9,2.4,0.4
                c0,0-2.2-2.6-2.9-5.2c-0.7-2.6-2.2-6.6-7.5-8.5S18.1,0.9,16.8,4c0,0-4.2,1.4-5.5,7.8S10.9,24,9.9,26.3l1.3-0.3c0,0-0.9,3.4-2.3,4.7
                l1.7-0.3c0,0,0.4,0.9-1.1,2.2c0,0,6.1,0.8,10.6,0.7c0.1,0.7,0.1,1.4,0,2c-1,0-2.1,0.5-2.9,1.1c-0.8,0.5-1.8,1.3-2.5,2.3
                c-0.4,0.1-0.9,0.3-1.4,0.4c-0.1-0.1-0.3-0.1-0.4-0.2c-0.9-0.3-1.5-0.4-2.3,0.1c-0.4,0.3-0.9,0.7-1.3,1.2c-2.2,0.7-3.9,1.5-5.5,4.3
                C1.6,48.5,0,58.2,0,58.2l25,0.4l25-0.4c0,0-1.6-9.7-3.9-13.7C44.6,41.7,42.8,40.9,40.6,40.2z"/>`)
                .style('clip-path', "url(#circle-clip")
    });
}


  

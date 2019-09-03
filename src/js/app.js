import * as d3 from "d3"
import lj from "../components/load-json"
import * as utils from "./util"
import { deflateRaw } from "zlib";

const el = d3.select(".interactive-wrapper");

const height = 620; 
const width = el.node().clientWidth;

const colours = ['#c70000', '#de6900', '#f1a800', '#ffe500'];

const addPlus = (t) => {
    if(t != "0" && t.slice(0, 1) !== "-") {
        return "+" + t
    } else {
        return t;
    }
}

lj("https://interactive.guim.co.uk/docsdata-test/1-i6Ee0DoFa0NFlXHpNZhR3-0kg6pGR0HKZkAMCU9SzI.json").then(sheet => {
    const data = sheet.sheets.Sheet1

    const nested = d3.nest()
        .key(d => d["Police Force"])
        .entries(data);
    
    el.append("div")
        .text("Select a police force")
        .classed("selector-label", true)

    const dropdown = el.append("select");

    dropdown.selectAll("option")
        .data(nested.map(k => k.key).slice(1))
        .enter()
        .append("option")
            .attr("value", d => d)
            .text(d => d);

    dropdown.on("change", () => {
        const newForce = dropdown.node().value;

        draw(nested.find(v => v.key === newForce));
    });

    const wrapper = el.append("div").classed("wrapper", true)
    // const widthScale = d3.scaleLinear().domain([0, d3.max(data, d => Number(d["2018"]))]).range([0, width])
    
    const draw = (pf) => {
        // if(j == 0) {
        //     return;
        // }

        wrapper.html("");

        const svg = wrapper
            .append("svg")
            .attr("width", width)
            .attr("height", height)

        const radius = (width < 375) ? 0.7: 1.15;
        const padding = (width < 375) ? 0.15 : 0.25;
        const labels = ["Recorded", "Referred", "Charged", "Convicted"];

        let minY = 0;
        let currentMinY = 0;
        const recordedCount = Number(pf.values[0]["2018"]);

        pf.values.forEach((p, i) => {
            const n = Number(p[(2018).toString()]);
            const circles = d3.packSiblings(d3.range(n).map(() => ({r: radius + padding + Math.random()})));
   
            if(i == 0) {
                minY = d3.min(circles, d => d.y)

                svg.attr("height", (Math.abs(minY*2) + 24) + 324)
            }

            let xOffset;
            let yOffset;

            if(recordedCount > 2000) {
                xOffset = ((i < 1) ? (i * (width/3)) + width/4 : ((i - 2) * (width/3)) + width/4) + width/4;
            
                yOffset = (i < 1) ? Math.abs(minY*1) + 84 + 24 : (Math.abs(minY)*2 + 240 + 24)
            } else {
                xOffset = (i < 2) ? (i * (width/2)) + width/4 : ((i - 2) * (width/2)) + width/4;
            
                yOffset = (i < 2) ? Math.abs(minY*1) + 84 + 24 : (Math.abs(minY)*2 + 240 + 24)
            }

            if((i < 2 && recordedCount <= 2000) || (i === 1 && recordedCount > 2000)) {
                currentMinY = Math.abs(d3.min(circles, d => d.y));
            }

            svg.append("g")
                .selectAll("circle")
                .data(circles)
                .enter()
                .append("circle")
                    .attr("cx", d => d.x + xOffset)
                    .attr("cy", d => d.y + yOffset)
                    .attr("r", 0)
                    .style("fill", colours[i])
                    // .transition()
                    // .ease(d3.easeSin)
                    // .delay((d, l) => l*(3000/circles.length))
                    .attr("r", radius)


            svg.append("text")
                .text(labels[i])
                .style("fill", colours[i])
                .attr("x", xOffset)
                .attr("y", ((i < 2 && recordedCount <= 2000) || (i < 1 && recordedCount > 2000)) ? 24 + 24 : yOffset + 24 + 24 - currentMinY - 112)
                .classed("header-label", true)

            svg.append("text")
                .text(utils.numberWithCommas(Number(p[(2018).toString()])))
                .style("fill", "#000")
                .attr("x", xOffset)
                .attr("y", ((i < 2 && recordedCount <= 2000) || (i < 1 && recordedCount > 2000))? 24 + 48 : yOffset + 24 + 48 - currentMinY - 112)
                .classed("header-number", true)

            svg.append("text")
                .text(`${addPlus(p["% change 14 to 18"])}${i === 0 ? ' since 2014' : ''}`)
                .style("fill", "#000")
                .attr("x", xOffset)
                .attr("y", ((i < 2 && recordedCount <= 2000) || (i < 1 && recordedCount > 2000)) ? 24 + 64 : yOffset + 24 + 64 - currentMinY - 112)
                .classed("header-change", true)
        });

        try {
            window.resize()
        } catch(err) {
            console.log(err);
        }

        // wrapper.append("div")
        //     .classed("label-tag", true)
        //     .text(pf.key)

            // window.resize();
    }

    draw(nested[2]);
});
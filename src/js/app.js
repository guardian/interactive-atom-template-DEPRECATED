import * as d3 from "d3"
import lj from "../components/load-json"
import * as utils from "./util"
import { deflateRaw } from "zlib";

const el = d3.select(".interactive-wrapper");

const height = 620; 

const colours = ['#c70000', '#de6900', '#f1a800', '#767676'];

const addPlus = (t, year) => {
    if(t != "0" && t.slice(0, 1) !== "-") {
        return " a " + t + " increase"
    } else {
        return " a " + t.slice(1) + " decrease"
    }
}

const cleanRate = (rate) => {
    return Math.round(1/rate);
}

lj("https://interactive.guim.co.uk/docsdata-test/1-i6Ee0DoFa0NFlXHpNZhR3-0kg6pGR0HKZkAMCU9SzI.json").then(sheet => {
    const data = sheet.sheets.Sheet1

    const nested = (d3.nest()
        .key(d => d["Police Force"])
        .entries(data))
        .map(pf => {
            pf.rate = ((Number(pf.values[3]["2018"])/Number(pf.values[0]["2018"]))*100).toFixed(2);
            return pf;
        });

    const dropdown = el.select("select");

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
    
    const draw = (pf) => {

        wrapper.html("");

        let perRow = 4;

        const boxWidth = el.node().clientWidth;

        if(boxWidth > 620 && Number(pf.values[0][(2018).toString()]) < 2000) {
            perRow = 4;
        } else if(boxWidth >= 620) {
            perRow = 2;
        } else if(boxWidth > 340 && Number(pf.values[0][(2018).toString()]) < 3000) {
            perRow = 2;
        } else {
            perRow = 1;
        }

        const width = el.node().clientWidth/perRow;

        const radius = (boxWidth > 620) ? 1.15 : 0.8;
        const padding = (boxWidth > 620) ? 0.25 : 0.2;
        const labels = ["Recorded", "Referred", "Charged", "Convicted"];

        let minY = 0;
        let currentMinY = 0;
        const recordedCount = Number(pf.values[0]["2018"]);
        
        el.select("#rate").text(cleanRate(Number(pf.values[3]["2018"])/Number(pf.values[0]["2018"])))

        pf.values.forEach((p, i) => {
            const innerWrapper = wrapper.append("div").classed("inner-wrapper", true).style("width", width + "px")

            if(i === 0) {
                innerWrapper.append("p")
                    .html(`<span style="color: ${colours[i]}")>${utils.numberWithCommas(Number(p[(2018).toString()]))}</span> rapes were <span style="color: ${colours[i]}")>recorded</span> in 2018,<span style="color: ${colours[i]}")>${addPlus(p["% change 14 to 18"])}</span> since 2014`)
            }

            if(i === 1) {
                innerWrapper.append("p")
                    .html(`<span style="color: ${colours[i]}")>${utils.numberWithCommas(Number(p[(2018).toString()]))}</span> cases were <span style="color: ${colours[i]}")>referred</span> to the CPS,<span style="color: ${colours[i]}")>${addPlus(p["% change 14 to 18"])}</span>`)
            }

            if(i === 2) {
                innerWrapper.append("p")
                    .html(`<span style="color: ${colours[i]}")>${utils.numberWithCommas(Number(p[(2018).toString()]))}</span> led to a <span style="color: ${colours[i]}")>charge</span>,<span style="color: ${colours[i]}")>${addPlus(p["% change 14 to 18"])}</span>`)
            }

            if(i === 3) {
                innerWrapper.append("p")
                    .html(`<span style="color: ${colours[i]}")>${utils.numberWithCommas(Number(p[(2018).toString()]))}</span> led to a <span style="color: ${colours[i]}")>conviction</span>,<span style="color: ${colours[i]}")>${addPlus(p["% change 14 to 18"])}</span>`)
            }

            const svg = innerWrapper
            .append("svg")
            .attr("width", width)
            .attr("height", height)

            const n = Number(p[(2018).toString()]);
            const circles = d3.packSiblings(d3.range(n).map(() => ({r: radius + padding + Math.random()})));
            
            if((i === 0) || (perRow === 1) || (perRow === 2 && i === 2)) {
                minY = d3.min(circles, d => d.y)
            }

            svg.attr("height", (Math.abs(minY*2)) + 12)

            let xOffset;
            let yOffset;
                
            xOffset = width/2
        
            yOffset = Math.abs(minY*1) 

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

            // svg.append("text")
            //     .text(labels[i])
            //     .style("fill", colours[i])
            //     .attr("x", xOffset)
            //     .attr("y", 24 + 24)
            //     .classed("header-label", true)

            // svg.append("text")
            //     .text(utils.numberWithCommas(Number(p[(2018).toString()])))
            //     .style("fill", "#000")
            //     .attr("x", xOffset)
            //     .attr("y", 24 + 48)
            //     .classed("header-number", true)

            // svg.append("text")
            //     .text(`${addPlus(p["% change 14 to 18"])}${i === 0 ? ' since 2014' : ''}`)
            //     .style("fill", "#000")
            //     .attr("x", xOffset)
            //     .attr("y", 24 + 64)
            //     .classed("header-change", true)
        });

        wrapper.append("h2")
            .text(`At ${((Number(pf.values[3]["2018"])/Number(pf.values[0]["2018"]))*100).toFixed(2)}% it has the 4th highest conviction rate of any police force in the country`)

        const chartWidth = boxWidth;        

        const h = 120;
        const bSvg = wrapper.append("svg")
            .attr("width", chartWidth)
            .attr("height", h)
            .classed("bottom-svg", true)

        const marginLeft = 20;

        const scaleY = d3.scaleLinear().domain([0, 8]).range([h, 0])

        bSvg.append("g")
        .classed("axis", true)
        // .attr("transform", `translate(${marginLeft} 0)`)
            .call(d3.axisLeft(scaleY).ticks(3))

        bSvg.append('g').selectAll("rect")
            .data(nested.sort((a,b) => b.rate - a.rate))
            .enter()
                .append("rect")
                    .attr("x", (d, i) => marginLeft + i*(Math.floor((chartWidth-marginLeft)/(nested.length))))
                    .attr("y", pf => scaleY(pf.rate)) 
                    .attr("height", pf => h - scaleY(pf.rate))
                    .attr("width", Math.floor((chartWidth - marginLeft)/nested.length)-1)
                    .style("fill", (d) => {
                        if(d.rate === pf.rate) {
                            return "#c70000"
                        }
                        return "#bdbdbd"
                    })

        bSvg.selectAll(".axis text")
            .attr("dy", -6)
            .attr("x", 0)
            .style("text-anchor", "start")

        bSvg.selectAll(".axis line")
            .attr("x1", 0)
            .attr("x2", chartWidth)

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
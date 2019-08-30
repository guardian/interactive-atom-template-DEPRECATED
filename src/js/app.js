import * as d3 from "d3"
import lj from "../components/load-json"
import * as utils from "./util"

const el = d3.select(".interactive-wrapper");

const height = 400;
const width = 620;

lj("https://interactive.guim.co.uk/docsdata-test/1-i6Ee0DoFa0NFlXHpNZhR3-0kg6pGR0HKZkAMCU9SzI.json").then(sheet => {
    const data = sheet.sheets.Sheet1

    const nested = d3.nest()
        .key(d => d["Police Force"])
        .entries(data);

    // const widthScale = d3.scaleLinear().domain([0, d3.max(data, d => Number(d["2018"]))]).range([0, width])

    nested.forEach(pf => {
        const wrapper = el.append("div").classed("wrapper", true)

        const widthScale = d3.scaleLinear().domain([0, d3.max(pf.values, d => Number(d["2018"]))]).range([0, width])

        wrapper.append("div")
            .text(pf.key)

        const years = ["2014","2018"];
        
        years.forEach(y => {
            console.log(y)
            const svg = wrapper
            .append("svg")
            .attr("width", width)
            .attr("height", height);
            

            svg.html(`<defs> <pattern id="lightstripe" patternUnits="userSpaceOnUse" width="5" height="5"> <image xlink:href="data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPSc1JyBoZWlnaHQ9JzUnPgogIDxyZWN0IHdpZHRoPSc1JyBoZWlnaHQ9JzUnIGZpbGw9J25vbmUnLz4KICA8cGF0aCBkPSdNMCA1TDUgMFpNNiA0TDQgNlpNLTEgMUwxIC0xWicgc3Ryb2tlPScjMDAwJyBzdHJva2Utd2lkdGg9JzEnLz4KPC9zdmc+" x="0" y="0" width="5" height="5"> </image> </pattern> </defs>`);
            
            svg.append("text")
                .attr("x", width/2)
                .attr("y", -12)
                .text(y)
                .classed("year-label", true);

            const colours = ['#c70000', '#de6900', '#f1a800', '#ffe500'];

            pf.values.forEach((b,i) => {
                if(i > 0) {
                    var gradient = svg.append("defs")
                    .append("linearGradient")
                        .attr("id", "gradient" + i)
                        .attr("x1", "0%")
                        .attr("y1", "0%")
                        .attr("x2", "0%")
                        .attr("y2", "100%")
                        .attr("spreadMethod", "pad");
        
                    gradient.append("stop")
                        .attr("offset", "0%")
                        .attr("stop-color", colours[i - 1])
                        .attr("stop-opacity", 1);
        
                    gradient.append("stop")
                        .attr("offset", "100%")
                        .attr("stop-color", colours[i])
                        .attr("stop-opacity", 1);

                    svg.append("path")
                        .attr("d", `M ${(width/2) - widthScale(pf.values[i-1][y])/2} ${((i - 1) * 96) + 48} 
                        L ${(width/2) - widthScale(pf.values[i][y])/2} ${(((i - 1) * 96) + 48) + 48}
                        L ${(width/2) + widthScale(pf.values[i][y])/2} ${(((i - 1) * 96) + 48) + 48}
                        L ${(width/2) + widthScale(pf.values[i - 1][y])/2} ${((i - 1) * 96) + 48} `)
                        // .style("fill", "#880105")
                        .style("fill", `url(#gradient${i})`)
                        .style("fill-opacity", 0.3)
                        // .style("fill-opacity", "0.25")

                }
                
                svg.append("rect")
                    .attr("x", (width/2) - widthScale(b[y])/2)
                    .attr("y", i * 96)
                    .attr("height", 48)
                    .attr("width", widthScale(b[y]))
                    .style("fill", colours[i])
                    // .style("transf);

                svg.append("text")
                    .text(utils.numberWithCommas(pf.values[i][y]))
                    .attr("x", (width/2))
                    .attr("y", (i * 96) + 30)
                    .style("text-anchor", "middle")
                    .style("stroke", colours[i]);

                if(i > 0) {
                    const labels = ["of reports were referred", "of reports led to a charge", "of reports led to a conviction"]

                    svg.append("text")
                        .text(utils.numberWithCommas(pf.values[i][y + " %"]) + " " + labels[i-1])
                        .attr("x", (width/2))
                        .attr("y", (i * 96) + 30 - 48)
                        .style("text-anchor", "middle")
                        .style("stroke", colours[i])
                        .classed("label-grad", true);
                }

                // svg.append("line")
                //     .attr("x1", width/2)
                //     .attr("x2", width/2)
                //     .attr("y1", 0)
                //     .attr("y2", height)
                //     .style("stroke", "#000") 
            });
        });

        // pf.values.forEach((b,i) => {
        //     svg.append("rect")
        //         .attr("x", (width/2) - widthScale(b["2014"])/2)
        //         .attr("y", i * 96)
        //         .attr("height", 48)
        //         .attr("width", widthScale(b["2014"]))
        //         .style("fill", "url(#lightstripe)")
        //         .style("stroke", "#000")
        //         .style("stroke-width", "2")
        //         // .style("transf);
        // });
        
    });
});
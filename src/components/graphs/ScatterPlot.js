import { useEffect, useState, useRef } from "react";
import useResizeObserver from '../common/useResizeObserver';
import * as d3 from "d3";

/* Draws the Scatter Plot*/
function ScatterPlot({ data, province, color }) {
    const svgRef = useRef();
    const wrapperRef = useRef();
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const dimensions = useResizeObserver(wrapperRef);
    var margin = {  // margins
        top: 20,
        bottom: 50,
        left: 40,
        right: 30
    };

    // Set width and height on every reload
    useEffect(() => {
        const { width, height } =
            dimensions || wrapperRef.current.getBoundingClientRect();

        setWidth(width);
        setHeight(height);
    }, [dimensions]);

    // Draw the graph
    useEffect(() => {
        if (data.length !== 0) {
            // Get the row of the provided province
            var results = data.filter(row => {
                return row['Province/State'] === province;
            })

            // Parse the date value in the given format
            let timeParser = d3.timeParse("%m/%d/%Y");

            // Convert row data to Object format
            var keys = Object.keys(results[0]);
            var newData = [];
            for (var i = 724; i < 755; i++) {
                newData.push({
                    country: results[0][keys[1]],
                    name: timeParser(keys[i]),
                    date: results[i],
                    value: +results[0][keys[i]]
                })
            }
            data = newData;

            // map x values along the x-axis
            const xScale = d3.scaleTime().range([margin.left, width - margin.right])
                .domain(d3.extent(data, d => d.name));

            // map y values along the y-axis
            const yScale = d3.scaleLinear()
                .domain([0, d3.max(data, d => d['value'])])
                .nice()
                .range([height - margin.bottom, margin.top]);

            // Position and style the x-axis
            const xAxis = g => {
                g.attr("transform", `translate(0, ${height - margin.bottom})`)
                    .call(
                        d3.axisBottom(xScale)
                            .tickSizeOuter(0)
                    )
            }

            // Position and style the y-axis
            const yAxis = g => {
                g.attr("transform", `translate(${margin.left}, 0)`)
                    .call(
                        d3.axisLeft(yScale)
                            .tickFormat(d3.format(".2s"))
                    );
            }

            // set width and height
            const svg = d3.select(svgRef.current)
                .attr("width", width)
                .attr("height", height);

            // Remove all svg elements
            svg.selectAll("*").remove();

            // Display the x-axis
            svg.append('g').call(xAxis).selectAll("text")
                .style("text-anchor", "end")
                .attr("dx", "-1em")
                .attr("dy", "0")
                .attr("transform", "rotate(-90)");

            // Display the y-axis
            svg.append('g').call(yAxis);

            // Map value to x,y co-ordinates
            var line = d3.line()
                .x((d) => { return xScale(d.name); })
                .y((d) => { return yScale(d.value); });

            // Draw the line
            svg.append("path")
                .data([data])
                .attr("class", "line")
                .attr("fill", "none")
                .attr("stroke", d3.schemeCategory10[color])
                .attr("stroke-width", 1.5)
                .attr("d", line)

            // Draw circle at each data point
            svg.append("g")
                .selectAll("circle")
                .data(data)
                .enter()
                .append("circle")
                .attr("cx", d => xScale(d.name))
                .attr("cy", d => yScale(d.value))
                .attr("r", 3)
                .attr("fill", d3.schemeCategory10[color]);
        }
    }, [data, color, province, width, height]);

    return (
        <div ref={wrapperRef}>
            <svg style={{ height: '200px' }} ref={svgRef}></svg>
        </div>
    );
}

export default ScatterPlot;
import { useEffect, useState, useRef } from "react";
import useResizeObserver from '../common/useResizeObserver';
import * as d3 from "d3";

/* Draws the Line Chart */
function LineChart({ data, largest }) {
    const svgRef = useRef();
    const wrapperRef = useRef();
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const dimensions = useResizeObserver(wrapperRef);
    var margin = {  // margins
        top: 20,
        bottom: 20,
        left: 40,
        right: 30
    };

    // Set width and height on every reload
    useEffect(() => {
        const { width } =
            dimensions || wrapperRef.current.getBoundingClientRect();

        setWidth(width);
        setHeight(width / 2);
    }, [dimensions]);

    // Draw the chart
    useEffect(() => {
        if (data.length !== 0 && largest.length !== 0) {
            // Parse the date value in the given format
            let timeParser = d3.timeParse("%m/%d/%Y");

            // Convert row data to Object format
            var largeArray = [];
            largest.forEach(large => {
                var result = data.filter(row => {
                    return row['ISO 3166-1 Alpha 3-Codes'] === large['iso3'];
                })
                largeArray.push({ name: result[0]['Country/Region'], value: result[0] });
            })

            // Extract required information
            var keys = Object.keys(data[0]);
            var newLargeArray = [];
            largeArray.forEach(large => {
                var newData = [];
                for (var i = 724; i < 755; i++) {
                    newData.push({
                        name: timeParser(keys[i]),
                        date: keys[i],
                        value: +large.value[keys[i]]
                    })
                }
                newLargeArray.push({ name: large.name, value: newData });
            })

            data = newLargeArray;

            // map x values along the x-axis
            const xScale = d3.scaleTime().range([margin.left, width - margin.right])
                .domain(d3.extent(data[0].value, d => d.name));

            // map y values along the y-axis
            const yScale = d3.scaleLinear()
                .domain([
                    0,
                    d3.max(data[0].value, (d) => +d.value)
                ])
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
                .attr("transform", "rotate(-90)"); // Rotate tick text

            // Display the y-axis
            svg.append('g').call(yAxis);

            // Map value to x,y co-ordinates
            var line = d3.line()
                .x((d) => { return xScale(d.name); })
                .y((d) => { return yScale(d.value); });

            // Draw the lines
            svg.selectAll(".line")
                .data(data)
                .enter()
                .append("path")
                .attr("class", "line")
                .attr("fill", "none")
                .attr("stroke", (_, i) => d3.schemeCategory10[i])
                .attr("stroke-width", 1.5)
                .attr("d", (d) => line(d.value))
        }
    }, [data, largest, width, height]);

    return (
        <div ref={wrapperRef}>
            <svg style={{ height: '250px' }} ref={svgRef}></svg>
        </div>
    );
}

export default LineChart;
import React, { useEffect, useRef } from 'react';
import useResizeObserver from "../common/useResizeObserver";
import * as d3 from 'd3';

/* Draws Pie Chart */
function PieChart(props) {
    const svgRef = useRef();
    const wrapperRef = useRef();
    const dimensions = useResizeObserver(wrapperRef);
    const padding = 10;
    const { data } = props;

    useEffect(() => {
        const { width, height } =
            dimensions || wrapperRef.current.getBoundingClientRect();

        // Set svg dimensions
        const svg = d3.select(svgRef.current)
            .attr("width", width)
            .attr("height", height);

        // Remove all svg elements
        svg.selectAll("*").remove();

        // Set the radii of the donut
        const outerRadius = ((width > height) ? height : width) / 2 - padding;
        const innerRadius = outerRadius / 2;

        // Center the donut in the svg
        var g = svg.append('g')
            .attr('transform', `translate(${width / 2}, ${height / 2})`);


        // Generate the arcs
        const arcGenerator = d3
            .arc()
            .innerRadius(innerRadius)
            .outerRadius(outerRadius);

        const pieGenerator = d3
            .pie()
            .padAngle(0)
            .value((d) => d.value);

        const arc = g
            .selectAll()
            .data(pieGenerator(data))
            .enter();

        // Append arcs
        arc
            .append('path')
            .attr('d', arcGenerator)
            .style('fill', (_, i) => d3.schemeCategory10[i])
            .style('stroke', '#ffffff')
            .style('stroke-width', 0);

        // Append text labels
        arc
            .append('text')
            .attr('text-anchor', 'middle')
            .attr('alignment-baseline', 'middle')
            .text((d) => d.data.label)
            .style('font-size', '11px')
            .style('fill', "#000000")
            .attr('transform', (d) => {
                const [x, y] = arcGenerator.centroid(d);
                return `translate(${x}, ${y})`;
            });
    }, [data, dimensions]);

    return (
        <div ref={wrapperRef}>
            <svg style={{ height: '250px' }} ref={svgRef}></svg>
        </div>
    );
}

export default PieChart;
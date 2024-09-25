import { select, scaleBand, scaleLinear, max, axisBottom, axisLeft, range, schemeBlues, format } from 'd3';
import useResizeObserver from '../common/useResizeObserver';
import { useEffect, useState, useRef } from 'react';

/* Draws Bar Graph */
function BarGraph({ data }) {
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
        if (width !== 0) {
            // Colors for the bars
            const colorScale = scaleLinear()
                .domain([10000, 100000, 1000000, 3000000, 10000000, 50000000])
                .range(schemeBlues[5]);

            // map x values along the x-axis
            const xScale = scaleBand()
                .domain(range(data.length))
                .range([margin.left, width - margin.right])
                .padding(0.2);

            // map y values along the y-axis
            const yScale = scaleLinear()
                .domain([0, max(data, d => d['value'])])
                .nice()
                .range([height - margin.bottom, margin.top]);

            // Position and style the x-axis
            const xAxis = g => {
                g.attr("transform", `translate(0, ${height - margin.bottom})`)
                    .call(
                        axisBottom(xScale)
                            .tickFormat(i => data[i]['name'])
                            .tickSizeOuter(0)
                    )
            }

            // Position and style the y-axis
            const yAxis = g => {
                g.attr("transform", `translate(${margin.left}, 0)`)
                    .call(
                        axisLeft(yScale)
                            .tickFormat(format(".2s"))
                    );
            }

            // set width and height
            const svg = select(svgRef.current)
                .attr("width", width)
                .attr("height", height);

            // Remove all svg elements
            svg.selectAll("*").remove();

            // Display the axes
            svg.append('g').call(xAxis);
            svg.append('g').call(yAxis);

            // Display the bars
            var selection = svg.selectAll("rect").data(data);
            selection.enter()
                .append("rect")
                .attr("x", (_, i) => xScale(i))
                .attr("y", (d) => yScale(d.value))
                .attr("width", xScale.bandwidth())
                .attr("height", (d) => height - yScale(d.value) - margin.bottom)
                .attr("fill", (d) => colorScale(d.value));
        }
    }, [data, width, height]);

    return (
        <div ref={wrapperRef}>
            <svg style={{ height: '200px' }} ref={svgRef}></svg>
        </div>
    );
}

export default BarGraph;
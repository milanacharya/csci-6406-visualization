import React, { useRef, useEffect, useState, useCallback } from "react";
import { Container, Dropdown, Row, Col, Card, Table } from 'react-bootstrap';
import { select, geoPath, geoNaturalEarth1, scaleLinear, schemeBlues, csv } from "d3";
import useResizeObserver from "../common/useResizeObserver";
import GeoData from '../../assets/data/GeoChart.world.geo.json';
import '../../assets/css/WorldMap.css';
import Converted from '../../assets/data/converted.csv';
import BarGraph from "../graphs/BarGraph";

/* Displays the Cumulative Figures */
function WorldMap() {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const toolTipRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);
  const [displayData, setDisplayData] = useState([]);       // Data to be displayed on the table and on the bar chart
  const [largest, setLargest] = useState([]);               // Holds the top 10 contributing countries
  const [selection, setSelection] = useState("Confirmed");  // Current value of the dropdown
  const [countryDataSelected, setCountryDataSelected] = useState([]);   // Data of the selected country
  const [countrySelected, setCountrySelected] = useState("World");      // The country selected on the map

  // load the CSV files
  const loadCSV = (file) => {
    csv(file).then((csvData) => {
      setDisplayData(csvData);
    });
  }

  // find the largest country in each category
  const findLargest = useCallback(() => {
    var largeSet = new Set();
    while (largeSet.size < 10) {
      var index = 0;
      var large = 0;
      for (var i = 0; i < displayData.length; i++) {
        if (+displayData[i][selection] > large) {
          if (!largeSet.has(i)) {
            large = +displayData[i][selection];
            index = +i;
          }
        }
      }
      largeSet.add(index);
    }
    setLargest([...largeSet]);
  }, [displayData, selection]);

  // Handle data change of drop down
  const setData = (type) => {
    switch (type) {
      case "1":
        setSelection("Confirmed");
        findLargest();
        break;
      case "2":
        setSelection("Death");
        findLargest();
        break;
      case "3":
        setSelection("Recovered");
        findLargest();
        break;
      default:
        console.log("Invalid Input");
    }
  }

  // Sets the data to be displayed on the bar chart
  const setWorldData = useCallback(() => {
    var confirm = 0;
    var death = 0;
    var recover = 0;

    displayData.forEach(country => {
      confirm = confirm + parseInt(country['Confirmed']);
      death = death + parseInt(country['Death']);
      recover = recover + parseInt(country['Recovered']);
    })

    setCountryDataSelected([
      { name: "Confirmed", value: confirm },
      { name: "Death", value: death },
      { name: "Recovered", value: recover }
    ]);
  }, [displayData]);

  // will be called initially and on every data change
  useEffect(() => {
    if (displayData.length === 0) {
      loadCSV(Converted)
    } else if (largest.length === 0) {
      findLargest();
      setWorldData();
    }

    // select the svg
    const svg = select(svgRef.current);

    const colorScale = scaleLinear()
      .domain([10000, 100000, 1000000, 3000000, 10000000, 50000000])
      .range(schemeBlues[5]);

    // use resized dimensions
    // but fall back to getBoundingClientRect, if no dimensions yet.
    const { width, height } =
      dimensions || wrapperRef.current.getBoundingClientRect();

    // projects geo-coordinates on a 2D plane
    const projection = geoNaturalEarth1()
      .fitSize([width, height], GeoData)
      .precision(100);

    // takes geojson data,
    // transforms that into the d attribute of a path element
    const pathGenerator = geoPath().projection(projection);

    // color for the country
    var colorData = {};
    displayData.forEach(country => (colorData[country['Iso A3']] = + country[selection]));

    // tooltip to display the stats
    var tooltip = select(toolTipRef.current)
      .attr("class", "tooltip");

    // render each country
    svg
      .selectAll(".country")
      .data(GeoData.features)
      .join("path")
      .on("click", (event, feature) => {  // Handle click on the country
        var result = displayData.filter(row => {
          return row['Iso A3'] === feature.properties.iso_a3;
        });

        setCountrySelected(result[0]['Country']);
        setCountryDataSelected([
          { name: "Confirmed", value: +result[0]['Confirmed'] },
          { name: "Death", value: +result[0]['Death'] },
          { name: "Recovered", value: +result[0]['Recovered'] }
        ]);
      })
      .on("mousemove", (event, feature) => {  // Display the tooltip on hovering over the countries
        var result = displayData.filter(row => {
          return row['Iso A3'] === feature.properties.iso_a3;
        })
        var country = "<pre>" + result[0]['Country'] +
          "\nActive cases: " + result[0]['Active'] +
          "\nConfirmed cases: " + result[0]['Confirmed'] +
          "\nDeath cases: " + result[0]['Death'] +
          "\nRecovered cases: " + result[0]['Recovered'] +
          "</pre>";

        tooltip.style("left", (event.pageX) + "px")
          .style("top", (event.pageY - 28) + "px")
          .style("opacity", 0.9);

        tooltip.html(country);
      })
      .on("mouseout", () => { // Hide the tooltip on hovering out
        tooltip.style('opacity', 0);
      })
      .attr("class", "country")
      .transition()
      .attr("fill", feature => colorScale(colorData[feature.properties.iso_a3]))
      .attr("d", feature => pathGenerator(feature));
  }, [dimensions, displayData, selection, largest, findLargest, setWorldData]);

  return (
    <Container className="p-2 mb-4 rounded-3" fluid>
      <Row>
        <Col lg={8}>
          <Card bg="light" className="text-center full-height">
            <Card.Header>
              <div className="home-heading">Cumulative Figures</div>
              <div>Click the countries on the map to view the country specific data</div>
            </Card.Header>
            <Card.Body>
              <div>Select the data to view</div>
              <Dropdown onSelect={setData}>
                <Dropdown.Toggle variant="secondary" id="type-cases">
                  {selection}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item eventKey="1">Confirmed</Dropdown.Item>
                  <Dropdown.Item eventKey="2">Death</Dropdown.Item>
                  <Dropdown.Item eventKey="3">Recovered</Dropdown.Item>
                </Dropdown.Menu>
                <p></p>
              </Dropdown>
              <div ref={wrapperRef} style={{ marginBottom: "2rem" }}>
                <svg ref={svgRef} className="map"></svg>
                <div ref={toolTipRef}></div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4}>
          <Card bg="light" className="text-center">
            <Card.Body>
              <div className="red">World Top 10: {selection} Cases</div>
              <Table className="tableDiv">
                <thead>
                  <tr>
                    <th>Country</th>
                    <th className="rightAlign">Confirmed</th>
                    <th className="rightAlign">Death</th>
                    <th className="rightAlign">Recovered</th>
                  </tr>
                </thead>
                <tbody>
                  {largest.map((row) => (
                    <tr key={displayData[row]['Iso A3']}>
                      <td>{displayData[row]['Country']}</td>
                      <td className="rightAlign">{displayData[row]['Confirmed']}</td>
                      <td className="rightAlign">{displayData[row]['Death']}</td>
                      <td className="rightAlign">{displayData[row]['Recovered']}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
          <p></p>
          <Card bg="light" className="text-center">
            <Card.Body>
              <div className="red">Corona Cases: {countrySelected}</div>
              <p></p>
              <BarGraph data={countryDataSelected} />
              <p></p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default WorldMap;
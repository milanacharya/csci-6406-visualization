import React, { useRef, useEffect, useState, useCallback } from "react";
import { Container, Dropdown, Row, Col, Card, Button } from 'react-bootstrap';
import { select, geoPath, geoNaturalEarth1, scaleLinear, csv } from "d3";
import useResizeObserver from "../common/useResizeObserver";
import GeoData from '../../assets/data/GeoChart.world.geo.json';
import '../../assets/css/WorldMapBubble.css';
import CovidConfirmed from '../../assets/data/time_series_covid19_confirmed_global_iso3_regions.csv';
import CovidDeaths from '../../assets/data/time_series_covid19_deaths_global_iso3_regions.csv';
import CovidRecovered from '../../assets/data/time_series_covid19_recovered_global_iso3_regions.csv';
import Converted from '../../assets/data/converted.csv';
import PieChart from "../graphs/PieChart";
import LineChart from "../graphs/LineChart";

/* Displays the Time Series Animation */
function WorldMapBubble() {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const inputRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);
  const [confirmed, setConfirmed] = useState([]);           // Holds the CSV data of confirmed cases
  const [death, setDeath] = useState([]);                   // Holds the CSV data of deaths
  const [recovered, setRecovered] = useState([]);           // Holds the CSV data of recovred cases
  const [locations, setLocations] = useState([]);           // Holds the data of the currently selected locations
  const [cumulative, setCumulative] = useState([]);         // Holds the cumulative data
  const [largest, setLargest] = useState([]);               // Data of the top 10 contributors
  const [selection, setSelection] = useState("Confirmed");  // Dropdown value
  const [dateIndex, setDateIndex] = useState(0);            // Index of the range control

  // load the data from the files
  const loadCSV = useCallback((file, type) => {
    csv(file).then((csvData) => {
      /*
      1 - Confirmed
      2 - Death
      3 - Recovered
      4 - All Cumulative
      */
      switch (type) {
        case 1:
          setConfirmed(csvData);
          setLocations(csvData);
          break;
        case 2:
          setDeath(csvData);
          break;
        case 3:
          setRecovered(csvData);
          break;
        case 4:
          setCumulative(csvData);
          break;
        default:
          console.log("Invalid Input");
      }
    });
  }, []);

  // find the top 10 contributing countries 
  const findLargest = useCallback(() => {
    var largeSet = new Set();
    while (largeSet.size < 10) {
      var index = 0;
      var large = 0;
      for (var i = 0; i < cumulative.length; i++) {
        if (+cumulative[i][selection] > large) {
          if (!largeSet.has(i)) {
            large = +cumulative[i][selection];
            index = +i;
          }
        }
      }
      largeSet.add(index);
    }

    var largeCases = []
    largeSet.forEach((item) => {
      largeCases.push({
        label: cumulative[item]['Country'],
        value: +cumulative[item][selection],
        iso3: cumulative[item]['Iso A3']
      })
    })
    setLargest(largeCases);
  }, [cumulative, selection]);

  // handle data change from the dropdown
  const setData = (type) => {
    switch (type) {
      case "1":
        setSelection("Confirmed");
        setLocations(confirmed);
        findLargest();
        break;
      case "2":
        setSelection("Death");
        setLocations(death);
        findLargest();
        break;
      case "3":
        setSelection("Recovered");
        setLocations(recovered);
        findLargest();
        break;
      default:
        console.log("Invalid Input");
    }
  }

  // will be called initially and on every data change
  useEffect(() => {
    loadCSV(CovidConfirmed, 1);
    loadCSV(CovidDeaths, 2);
    loadCSV(CovidRecovered, 3);
    loadCSV(Converted, 4);
  }, [loadCSV]);

  useEffect(() => {
    if (cumulative.length !== 0)
      findLargest();

    if (locations.length !== 0) {
      const svg = select(svgRef.current);

      // remove all bubbles
      svg.selectAll(".circles").remove();

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

      // map no. of cases to size of bubble
      var size = scaleLinear()
        .domain([0, 80000000])
        .range([0, 50]);

      // render each country
      svg
        .selectAll(".country")
        .data(GeoData.features)
        .join("path")
        .attr("class", "country")
        .transition()
        .attr("fill", "#e5ecf5")
        .attr("d", feature => pathGenerator(feature))
        .style("stroke", "gray");

      // Get the column names
      var keys = Object.keys(locations[0]);

      // rendere the bubbles
      svg
        .selectAll(".circles")
        .data(locations)
        .enter()
        .append("circle")
        .attr("class", "circles")
        .attr("cx", d => { return projection([d[keys[3]], d[keys[2]]])[0] })
        .attr("cy", d => { return projection([d[keys[3]], d[keys[2]]])[1] })
        .attr("r", d => { return size(d[keys[dateIndex + 4]]) })
        .attr("fill", "#5d7ef7")
        .transition().duration(500);

      // handle slider drag
      select('#slider').on('input', () => {
        setDateIndex(+inputRef.current.value);
      })

      // handle start button click
      var myTimer;
      select("#start").on("click", function () {
        clearInterval(myTimer);
        myTimer = setInterval(function () {
          var b = select("#slider");
          var t = (+b.property("value") + 1) % (+b.property("max") + 1);
          if (t === 0) { t = +b.property("min"); }
          b.property("value", t);
          setDateIndex(t);
        }, 1000);
      });

      // handle stop button click
      select("#stop").on("click", function () {
        clearInterval(myTimer);
      });
    }
  }, [dimensions, locations, dateIndex, cumulative, findLargest]);

  return (
    <Container className="p-2 mb-4 rounded-3" fluid>
      <Row>
        <Col lg={8}>
          <Card bg="light" className="text-center full-height">
            <Card.Header>
              <div className="home-heading">Time-Series Animation of Corona Virus Spread</div>
              <div>Click the Play button to generate the map over time</div>
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
              </div>
              <div className="inputcontainer">
                <Button variant="secondary" id="start" size="sm">&#9658;</Button>
                <Button variant="secondary" id="stop" size="sm">&#9632;</Button>
                <input ref={inputRef} type="range" className="slider" min="0" max="751" step="1" id="slider" list="datelist" value={dateIndex} />
                <datalist id="datelist">
                  <option>0</option>
                  <option>50</option>
                  <option>100</option>
                  <option>150</option>
                  <option>200</option>
                  <option>250</option>
                  <option>300</option>
                  <option>350</option>
                  <option>400</option>
                  <option>450</option>
                  <option>500</option>
                  <option>550</option>
                  <option>600</option>
                  <option>650</option>
                  <option>700</option>
                  <option>751</option>
                </datalist>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4}>
          <Card bg="light" className="text-center">
            <Card.Body>
              <div className="red">Top 10 Countries: {selection}</div>
              <p></p>
              <LineChart data={locations} largest={largest} />
            </Card.Body>
          </Card>
          <p></p>
          <Card bg="light" className="text-center">
            <Card.Body>
              <div className="red">Top 10 Countries: {selection}</div>
              <p></p>
              <PieChart {...{ data: largest }} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default WorldMapBubble;
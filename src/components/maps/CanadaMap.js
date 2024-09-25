import React, { useRef, useEffect, useState } from "react";
import { Container, Row, Col, Card } from 'react-bootstrap';
import { select, geoPath, geoMercator, scaleLinear, csv } from "d3";
import useResizeObserver from "../common/useResizeObserver";
import GeoData from '../../assets/data/GeoChart.world.geo.json';
import '../../assets/css/WorldMapBubble.css';
import CovidConfirmed from '../../assets/data/time_series_covid19_confirmed_canada_iso3_regions.csv';
import CovidDeaths from '../../assets/data/time_series_covid19_deaths_canada_iso3_regions.csv';
import ScatterPlot from "../graphs/ScatterPlot";

/* Displays the Canada Trends */
function CanadaMap() {
  const svgRef1 = useRef();
  const wrapperRef1 = useRef();
  const svgRef2 = useRef();
  const wrapperRef2 = useRef();
  const dimensions = useResizeObserver(wrapperRef1);
  const [confirmed, setConfirmed] = useState([]);   // Holds CSV data of confirmed cases
  const [death, setDeath] = useState([]);           // Holds CSV dataa of deaths
  const [provinceConfirm, setProvinceConfirm] = useState('Ontario');  // Currently selected province of the Confirmed cases on map
  const [provinceDeath, setProvinceDeath] = useState('Ontario');      // Currently selected province of the Death cases on map
  const [confirmCumulative, setConfirmCumulative] = useState(0);      // Total value of confirmed cases 
  const [deathCumulative, setDeathCumulative] = useState(0);          // Total value of death cases 

  const loadCSV = (file, type) => {
    csv(file).then((csvData) => {
      /*
      1 - Confirmed
      2 - Death
      */
      switch (type) {
        case 1:
          setConfirmed(csvData);
          setConfirmCumulative(csvData[0]['Cumulative']);
          break;
        case 2:
          setDeath(csvData);
          setDeathCumulative(csvData[0]['Cumulative']);
          break;
        default:
          console.log("Invalid Input");
      }
    });
  }

  // Load data from files on page load
  useEffect(() => {
    loadCSV(CovidConfirmed, 1);
    loadCSV(CovidDeaths, 2);
  }, [])

  // will be called initially and on every data change
  useEffect(() => {
    if (confirmed.length !== 0 && death.length !== 0) {
      const svg1 = select(svgRef1.current);
      const svg2 = select(svgRef2.current);

      // Remove the bubbles from the map
      svg1.selectAll(".circles1").remove();
      svg2.selectAll(".circles2").remove();

      // use resized dimensions
      // but fall back to getBoundingClientRect, if no dimensions yet.
      const { width, height } =
        dimensions || wrapperRef1.current.getBoundingClientRect();

      // projects geo-coordinates on a 2D plane
      const projection = geoMercator()
        .fitSize([width, height], GeoData)
        .center([-100, 55])
        .scale(280)
        .precision(100);

      // takes geojson data,
      // transforms that into the d attribute of a path element
      const pathGenerator = geoPath().projection(projection);

      // map values to bubble size
      var size = scaleLinear()
        .domain([2000, 1000000])
        .range([10, 50]);

      // render each country on left side
      svg1
        .selectAll(".country")
        .data(GeoData.features)
        .join("path")
        .attr("class", "country")
        .transition()
        .attr("fill", "#e5ecf5")
        .attr("d", feature => pathGenerator(feature))
        .style("stroke", "gray");

      // render each country on right side
      svg2
        .selectAll(".country")
        .data(GeoData.features)
        .join("path")
        .attr("class", "country")
        .transition()
        .attr("fill", "#e5ecf5")
        .attr("d", feature => pathGenerator(feature))
        .style("stroke", "gray");

      // render bubbles on the left map
      svg1
        .selectAll(".circles1")
        .data(confirmed)
        .enter()
        .append("circle")
        .attr("class", "circles1")
        .attr("cx", d => { return projection([d['Long'], d['Lat']])[0] })
        .attr("cy", d => { return projection([d['Long'], d['Lat']])[1] })
        .attr("r", d => { return size(d['Cumulative']) })
        .attr("fill", "#5d7ef7")
        .style("stroke", "#b8c4d4")
        .on('mouseover', (_, i) => {
          setProvinceConfirm(i['Province/State']);
          setConfirmCumulative(i['Cumulative']);
        });

      svg1.selectAll(".text1")
        .data(confirmed)
        .enter()
        .append("text")
        .attr("class", "text1")
        .text(d => {
          return d['Province/State']
        })
        .style("fill", "black")
        .style("font-size", "10px")
        .style("text-anchor", "middle")
        .style("fill-opacity", 0.5)
        .attr("x", d => { return projection([d['Long'], d['Lat']])[0] })
        .attr("y", d => { return projection([d['Long'], d['Lat']])[1] });

      // render bubbles on the right map
      svg2
        .selectAll(".circles2")
        .data(death)
        .enter()
        .append("circle")
        .attr("class", "circles2")
        .attr("cx", d => { return projection([d['Long'], d['Lat']])[0] })
        .attr("cy", d => { return projection([d['Long'], d['Lat']])[1] })
        .attr("r", d => { return size(d['Cumulative']) })
        .attr("fill", "#5d7ef7")
        .style("stroke", "#b8c4d4")
        .on('mouseover', (_, i) => {
          setProvinceDeath(i['Province/State']);
          setDeathCumulative(i['Cumulative']);
        });

      svg2.selectAll(".text2")
        .data(confirmed)
        .enter()
        .append("text")
        .attr("class", "text2")
        .text(d => {
          return d['Province/State']
        })
        .style("fill", "black")
        .style("font-size", "10px")
        .style("text-anchor", "middle")
        .style("fill-opacity", 0.5)
        .attr("x", d => { return projection([d['Long'], d['Lat']])[0] })
        .attr("y", d => { return projection([d['Long'], d['Lat']])[1] });
    }
  }, [dimensions, confirmed, death]);

  return (
    <Container className="p-2 mb-4 rounded-3" fluid>
      <Row>
        <Col>
          <Card bg="light" className="text-center">
            <Card.Body>
              <div className="home-heading">Corona Virus Canada Cases by Province</div>
              <div>Hover over the provinces to view the trends in province-wise confirmed and death cases</div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <p></p>
      <Row>
        <Col>
          <Card bg="light" className="text-center full-height">
            <Card.Body>
              <p className="red">Canada: Confirmed Cases</p>
              <div ref={wrapperRef1} style={{ marginBottom: "2rem" }}>
                <svg className="map" ref={svgRef1}></svg>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card bg="light" className="text-center full-height">
            <Card.Body>
              <p className="red">Canada: Death Cases</p>
              <div ref={wrapperRef2} style={{ marginBottom: "2rem" }}>
                <svg className="map" ref={svgRef2}></svg>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <p></p>
      <Row>
        <Col lg={6}>
          <Card bg="light" className="text-center">
            <Card.Body>
              <p><span className="red">{provinceConfirm} Total Confirmed Cases: </span>{confirmCumulative}</p>
              <ScatterPlot data={confirmed} province={provinceConfirm} color={1} />
            </Card.Body>
          </Card>
        </Col>
        <Col lg={6}>
          <Card bg="light" className="text-center">
            <Card.Body>
              <p><span className="red">{provinceDeath} Total Deaths: </span>{deathCumulative}</p>
              <ScatterPlot data={death} province={provinceDeath} color={3} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default CanadaMap;
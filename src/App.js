import React, { useRef, useEffect, useState } from "react";
import "./App.css";
import { 
  select, 
  axisBottom, 
  axisRight,
  scaleLinear,
  scaleBand
} from "d3";

const initialData = [25, 45, 30, 74, 38, 80, 160, 240, 200, 100];
const dimensions = {
  height: 300,
  width: 450
}

function App() {
  const [data, setData] = useState(initialData)
  const svgRef = useRef();
  useEffect(() => {
    const svg = select(svgRef.current);

    const xScale = scaleBand()
      .domain(data.map( (val, idx) => idx))
      .range([0, dimensions.width])
      .padding(0.5);

    const yScale = scaleLinear()
      .domain([0, Math.max(...data)*1.2])
      .range([dimensions.height, 0]);

    const colorScale = scaleLinear()
      .domain([75, 150, 300])
      .range(["green", "orange", "red"])
      .clamp(true);

    svg
      .style("width", `${dimensions.width}px`);

    const xAxis = axisBottom(xScale).ticks(data.length).tickFormat( idx => idx + 1);
    svg
      .select(".x-axis")
      .style("transform", "translateY(300px)")
      .call(xAxis);

    const yAxis = axisRight(yScale).ticks(5);
    svg
      .select(".y-axis")
      .style("transform", `translateX(${dimensions.width}px)`)
      .call(yAxis);      

    svg
      .selectAll(".bar")
      .data(data)
      .join("rect")
      .attr("class", "bar")
      .style("transform", "scale(1, -1)")
      .attr("x", (value, index) => xScale(index))
      .attr("y", -300)
      .attr("index", (value, index) => index)
      .attr("width", xScale.bandwidth())
      .on("mouseenter", (event, value) => {
        const index = event.target.attributes.index.value;
        svg
          .selectAll(".tooltip")
          .data([value])
          .join( enter => enter.append("text").attr("y", yScale(value) - 4))
          .attr("class", "tooltip")
          .text(value)
          .attr("x", xScale(index) + xScale.bandwidth()/2)
          .attr("text-anchor", "middle")
          .transition()
          .attr("y", yScale(value) - 8)
          .attr("opacity", 1)
      })
      .on("mouseleave", () => svg.select(".tooltip").remove())
      .transition()
      .attr("fill", colorScale)
      .attr("height", value => 300 - yScale(value));

    }, [data]);
  return <React.Fragment>
    <svg ref={svgRef}>
      <g className="x-axis" />
      <g className="y-axis" />
    </svg>
    <br/>
    <button onClick={() => setData(data.map( val => val + 25))}>Update Data</button>
    <button onClick={() => setData(data.filter( value => value  < 50))}> Filter Data</button>
    <button onClick={() => setData([...data, Math.round(Math.random()*300)])}>Add Data</button>
    </React.Fragment>;
}

export default App;

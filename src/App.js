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

function App() {
  const [data, setData] = useState(initialData)
  const svgRef = useRef();
  useEffect(() => {
    const svg = select(svgRef.current);

    const xScale = scaleBand()
      .domain(data.map( (val, idx) => idx))
      .range([0, (data.length - 1)*50])
      .padding(0.5);

    const yScale = scaleLinear()
      .domain([0, Math.max(...data)*1.2])
      .range([300, 0]);

    const colorScale = scaleLinear()
      .domain([75, 150, 300])
      .range(["green", "orange", "red"])
      .clamp(true);

    const xAxis = axisBottom(xScale).ticks(data.length).tickFormat( idx => idx + 1);
    svg
      .select(".x-axis")
      .style("transform", "translateY(300px)")
      .call(xAxis);

    const yAxis = axisRight(yScale).ticks(5);
    svg
      .select(".y-axis")
      .style("transform", `translateX(${50*(data.length -1)}px)`)
      .call(yAxis);      

    svg
      .selectAll(".bar")
      .data(data)
      .join("rect")
      .attr("class", "bar")
      .style("transform", "scale(1, -1)")
      .attr("x", (value, index) => xScale(index))
      .attr("y", -300)
      .attr("width", xScale.bandwidth())
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
    </React.Fragment>;
}

export default App;

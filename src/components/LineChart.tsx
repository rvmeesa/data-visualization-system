"use client";

import React, { useEffect } from "react";
import * as d3 from "d3";

const LineChart: React.FC = () => {
  useEffect(() => {
    const svgWidth = 700;
    const svgHeight = 500;
    const margin = { top: 50, right: 50, bottom: 100, left: 70 };
    const chartWidth = svgWidth - margin.left - margin.right;
    const chartHeight = svgHeight - margin.top - margin.bottom;

    const svg = d3
      .select("#line-chart")
      .append("svg")
      .attr("width", svgWidth)
      .attr("height", svgHeight);

    const chartArea = svg
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Add chart title
    svg
      .append("text")
      .attr("x", svgWidth / 2)
      .attr("y", 30)
      .attr("text-anchor", "middle")
      .text("Trend of Systolic Blood Pressure (SysBP) by Age")
      .style("font-size", "18px")
      .style("font-weight", "bold")
      .style("fill", "#6B46C1");

    d3.csv("/data.csv", (d) => ({
      age: +d.age!,
      sysBP: +d.sysBP!,
    })).then((data: { age: number; sysBP: number }[]) => {
      data.sort((a, b) => a.age - b.age);

      const x = d3
        .scaleLinear()
        .domain([d3.min(data, (d) => d.age) || 0, d3.max(data, (d) => d.age) || 0])
        .range([0, chartWidth]);

      const y = d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => d.sysBP) || 0])
        .range([chartHeight, 0]);

      // Add x-axis
      chartArea
        .append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(d3.axisBottom(x).tickFormat(d3.format("d")))
        .selectAll("text")
        .attr("transform", "translate(0,10)")
        .style("text-anchor", "middle")
        .style("font-size", "12px")
        .style("fill", "#6B46C1");

      // Add y-axis
      chartArea
        .append("g")
        .call(d3.axisLeft(y).ticks(6).tickSize(-chartWidth))
        .selectAll("text")
        .style("font-size", "12px")
        .style("fill", "#6B46C1");

      // Add x-axis label
      svg
        .append("text")
        .attr("x", svgWidth / 2)
        .attr("y", svgHeight - 20)
        .attr("text-anchor", "middle")
        .text("Age")
        .style("font-size", "14px")
        .style("fill", "#6B46C1");

      // Add y-axis label
      svg
        .append("text")
        .attr("x", -svgHeight / 2)
        .attr("y", 20)
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .text("Systolic Blood Pressure (SysBP)")
        .style("font-size", "14px")
        .style("fill", "#6B46C1");

      // Add line to chart
      chartArea
        .append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2)
        .attr(
          "d",
          d3
            .line<{ age: number; sysBP: number }>()
            .x((d) => x(d.age))
            .y((d) => y(d.sysBP))
        );

      // Add points to the line
      chartArea
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", (d) => x(d.age))
        .attr("cy", (d) => y(d.sysBP))
        .attr("r", 4)
        .attr("fill", "#D53F8C")
        .on("mouseover", (event, d) => {
          d3.select(event.target).attr("r", 6).attr("fill", "#6B46C1");
        })
        .on("mouseout", (event) => {
          d3.select(event.target).attr("r", 4).attr("fill", "#D53F8C");
        });
    });
  }, []);

  return (
    <div className="p-6 bg-gradient-to-br from-pink-100 via-purple-100 to-green-100 rounded-lg shadow-lg">
      <div id="line-chart" className="mb-8"></div>
      <p className="text-center text-sm text-gray-600">
        This chart shows the trend of systolic blood pressure (SysBP) across different ages, providing insight into age-related changes.
      </p>
    </div>
  );
};

export default LineChart;

"use client";

import React, { useEffect } from "react";
import * as d3 from "d3";

const ScatterChart: React.FC = () => {
  useEffect(() => {
    const svgWidth = 700;
    const svgHeight = 500;
    const margin = { top: 50, right: 50, bottom: 100, left: 70 };
    const chartWidth = svgWidth - margin.left - margin.right;
    const chartHeight = svgHeight - margin.top - margin.bottom;

    const svg = d3
      .select("#scatter-chart")
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
      .text("Scatter Chart of BMI vs Heart Rate")
      .style("font-size", "18px")
      .style("font-weight", "bold")
      .style("fill", "#6B46C1");

    d3.csv("/data.csv", (d) => ({
      BMI: +d.BMI!,
      heartRate: +d.heartRate!,
    })).then((data: { BMI: number; heartRate: number }[]) => {
      const x = d3
        .scaleLinear()
        .domain([d3.min(data, (d) => d.BMI) || 0, d3.max(data, (d) => d.BMI) || 0])
        .range([0, chartWidth]);

      const y = d3
        .scaleLinear()
        .domain([d3.min(data, (d) => d.heartRate) || 0, d3.max(data, (d) => d.heartRate) || 0])
        .range([chartHeight, 0]);

      // Add x-axis
      chartArea
        .append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
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
        .text("BMI")
        .style("font-size", "14px")
        .style("fill", "#6B46C1");

      // Add y-axis label
      svg
        .append("text")
        .attr("x", -svgHeight / 2)
        .attr("y", 20)
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .text("Heart Rate")
        .style("font-size", "14px")
        .style("fill", "#6B46C1");

      // Add points
      chartArea
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", (d) => x(d.BMI))
        .attr("cy", (d) => y(d.heartRate))
        .attr("r", 5)
        .attr("fill", "steelblue")
        .attr("opacity", 0.8)
        .on("mouseover", (event, d) => {
          d3.select(event.target)
            .transition()
            .duration(200)
            .attr("r", 8)
            .attr("fill", "#D53F8C");
          tooltip
            .style("display", "block")
            .html(`BMI: ${d.BMI.toFixed(2)}<br>Heart Rate: ${d.heartRate.toFixed(2)}`)
            .style("left", `${event.pageX + 10}px`)
            .style("top", `${event.pageY - 20}px`);
        })
        .on("mouseout", (event) => {
          d3.select(event.target)
            .transition()
            .duration(200)
            .attr("r", 5)
            .attr("fill", "steelblue");
          tooltip.style("display", "none");
        });

      // Add tooltips
      const tooltip = d3
        .select("#scatter-chart")
        .append("div")
        .style("position", "absolute")
        .style("background-color", "white")
        .style("padding", "5px")
        .style("border", "1px solid #ccc")
        .style("border-radius", "5px")
        .style("display", "none")
        .style("pointer-events", "none");
    });
  }, []);

  return (
    <div className="p-6 bg-gradient-to-br from-pink-100 via-purple-100 to-green-100 rounded-lg shadow-lg">
      <div id="scatter-chart"></div>
      <p className="text-center text-sm text-gray-600 mt-4">
        This scatter chart visualizes the relationship between BMI and Heart Rate for individuals in the dataset.
      </p>
    </div>
  );
};

export default ScatterChart;

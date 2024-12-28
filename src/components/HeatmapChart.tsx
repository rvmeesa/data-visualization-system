"use client";

import React, { useEffect } from "react";
import * as d3 from "d3";

const HeatmapChart: React.FC = () => {
  useEffect(() => {
    const margin = { top: 60, right: 50, bottom: 100, left: 120 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Remove any existing SVG content to avoid duplicates
    d3.select("#heatmap-chart").selectAll("*").remove();

    const svg = d3
      .select("#heatmap-chart")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    d3.csv("/data.csv").then((data) => {
      // Extract unique labels for axes
      const xLabels = Array.from(new Set(data.map((d) => d.education || "Unknown")));
      const yLabels = Array.from(new Set(data.map((d) => d.age || "Unknown")));

      // Create scales
      const x = d3.scaleBand().range([0, width]).domain(xLabels).padding(0.05);
      const y = d3.scaleBand().range([height, 0]).domain(yLabels).padding(0.05);

      const color = d3
        .scaleSequential(d3.interpolateBlues)
        .domain([0, d3.max(data, (d) => +d.BMI) || 1]);

      // Append x-axis
      svg
        .append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x).tickSize(0))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("transform", "rotate(-45)");

      // Add x-axis label
      svg
        .append("text")
        .attr("transform", `translate(${width / 2}, ${height + 50})`)
        .style("text-anchor", "middle")
        .style("font-size", "14px")
        .text("Education Levels");

      // Append y-axis
      svg.append("g").call(d3.axisLeft(y));

      // Add y-axis label
      svg
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left + 40)
        .attr("x", -(height / 2))
        .style("text-anchor", "middle")
        .style("font-size", "14px")
        .text("Age Groups");

      // Add squares for heatmap
      svg
        .selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", (d) => x(d.education || "Unknown") || 0)
        .attr("y", (d) => y(d.age || "Unknown") || 0)
        .attr("width", x.bandwidth())
        .attr("height", y.bandwidth())
        .style("fill", (d) => color(+d.BMI || 0))
        .style("stroke", "#e4e4e4")
        .on("mouseover", (event, d) => {
          d3.select(event.currentTarget).style("stroke", "#000").style("stroke-width", 2);
          tooltip
            .style("opacity", 1)
            .html(
              `Education: ${d.education || "N/A"}<br>Age: ${d.age || "N/A"}<br>BMI: ${+d.BMI?.toFixed(2) || "N/A"}`
            )
            .style("left", `${event.pageX + 10}px`)
            .style("top", `${event.pageY - 30}px`);
        })
        .on("mouseout", (event) => {
          d3.select(event.currentTarget).style("stroke", "#e4e4e4").style("stroke-width", 1);
          tooltip.style("opacity", 0);
        });

      // Add a tooltip
      const tooltip = d3
        .select("#heatmap-chart")
        .append("div")
        .style("position", "absolute")
        .style("background-color", "white")
        .style("padding", "8px")
        .style("border", "1px solid #ccc")
        .style("border-radius", "5px")
        .style("opacity", 0)
        .style("pointer-events", "none");

      // Add a legend
      const legendWidth = 200;
      const legendHeight = 20;

      const gradient = svg
        .append("defs")
        .append("linearGradient")
        .attr("id", "gradient");

      const colorDomain = color.domain();
      const legendSteps = 10;
      const step = (colorDomain[1] - colorDomain[0]) / legendSteps;

      for (let i = 0; i <= legendSteps; i++) {
        gradient
          .append("stop")
          .attr("offset", `${(i / legendSteps) * 100}%`)
          .attr("stop-color", color(colorDomain[0] + step * i));
      }

      const legend = svg
        .append("g")
        .attr("transform", `translate(${width / 2 - legendWidth / 2}, ${height + 50})`);

      legend
        .append("rect")
        .attr("width", legendWidth)
        .attr("height", legendHeight)
        .style("fill", "url(#gradient)");

      const legendScale = d3
        .scaleLinear()
        .domain(color.domain())
        .range([0, legendWidth]);

      legend
        .append("g")
        .attr("transform", `translate(0, ${legendHeight})`)
        .call(d3.axisBottom(legendScale).ticks(5));
    });
  }, []);

  return (
    <div>
      <div id="heatmap-chart"></div>
      <p className="text-center mt-4 text-purple-600 font-medium">
        Heatmap showing the relationship between Education, Age, and BMI.
      </p>
    </div>
  );
};

export default HeatmapChart;

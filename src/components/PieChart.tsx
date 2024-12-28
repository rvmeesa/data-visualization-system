"use client";

import React, { useEffect } from "react";
import * as d3 from "d3";

const PieChart: React.FC = () => {
  useEffect(() => {
    // Mapping for education levels
    const educationLabels = {
      1: "Primary Education",
      2: "Secondary Education",
      3: "Higher Education",
      4: "Postgraduate Education",
      NaN: "Unknown",
    };

    // Set dimensions and radius
    const width = 600;
    const height = 400;
    const radius = Math.min(width, height) / 2 - 40;

    // Append the SVG element
    const svg = d3
      .select("#pie-chart")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    // Load and process the data
    d3.csv("/data.csv").then((data) => {
      // Aggregate data for the pie chart (e.g., sum by education)
      const aggregatedData = d3.rollup(
        data,
        (v) => v.length, // Count the occurrences
        (d) => educationLabels[d.education] || "Unknown" // Use mapped names
      );

      // Transform the aggregated data into an array
      const pieData = Array.from(aggregatedData, ([key, value]) => ({
        label: key,
        value,
      }));

      // Create color scale
      const color = d3
        .scaleOrdinal()
        .domain(pieData.map((d) => d.label))
        .range(d3.schemeSet3);

      // Create the pie generator
      const pie = d3
        .pie<{ label: string; value: number }>()
        .value((d) => d.value);

      // Create the arc generator
      const arc = d3
        .arc<d3.PieArcDatum<{ label: string; value: number }>>()
        .innerRadius(0)
        .outerRadius(radius);

      // Append pie slices
      svg
        .selectAll("path")
        .data(pie(pieData))
        .enter()
        .append("path")
        .attr("d", arc)
        .attr("fill", (d) => color(d.data.label || "Unknown")) // Ensure fallback for undefined labels
        .attr("stroke", "#ffffff")
        .attr("stroke-width", 2)
        .on("mouseover", (event, d) => {
          d3.select(event.currentTarget).style("opacity", 0.8);
          tooltip
            .style("display", "block")
            .html(
              `<strong>${d.data.label}</strong>: ${d.data.value}`
            )
            .style("left", `${event.pageX + 10}px`)
            .style("top", `${event.pageY - 20}px`);
        })
        .on("mouseout", (event) => {
          d3.select(event.currentTarget).style("opacity", 1);
          tooltip.style("display", "none");
        });

      // Add tooltips
      const tooltip = d3
        .select("#pie-chart")
        .append("div")
        .style("position", "absolute")
        .style("background-color", "white")
        .style("padding", "5px")
        .style("border", "1px solid #ccc")
        .style("border-radius", "5px")
        .style("display", "none")
        .style("pointer-events", "none");

      // Add labels
      svg
        .selectAll("text")
        .data(pie(pieData))
        .enter()
        .append("text")
        .attr("transform", (d) => `translate(${arc.centroid(d)})`)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .text((d) => d.data.label || "Unknown");
    });
  }, []);

  return (
    <div>
      <div id="pie-chart"></div>
      <p className="text-center mt-4 text-purple-600 font-medium">
        Proportion of education levels visualized using a pie chart.
      </p>
      <p className="text-center text-sm text-gray-600 italic mt-2">
        This chart represents the distribution of various education levels in the dataset.
      </p>
    </div>
  );
};

export default PieChart;

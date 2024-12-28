"use client";

import React, { useEffect } from "react";
import * as d3 from "d3";

const MultiBarCharts: React.FC = () => {
  useEffect(() => {
    createAvgBMIChart();
  }, []);

  const educationLevels = {
    1: "Primary Education",
    2: "Secondary Education",
    3: "High School",
    4: "College",
    NaN: "Unknown",
  };

  const createAvgBMIChart = () => {
    const svgWidth = 700;
    const svgHeight = 500;
    const margin = { top: 50, right: 50, bottom: 100, left: 70 };
    const chartWidth = svgWidth - margin.left - margin.right;
    const chartHeight = svgHeight - margin.top - margin.bottom;

    const svg = d3
      .select("#avg-bmi-chart")
      .append("svg")
      .attr("width", svgWidth)
      .attr("height", svgHeight);

    const chartArea = svg
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    svg
      .append("text")
      .attr("x", svgWidth / 2)
      .attr("y", 30)
      .attr("text-anchor", "middle")
      .text("Average BMI by Education Level")
      .style("font-size", "18px")
      .style("font-weight", "bold")
      .style("fill", "#6B46C1");

    d3.csv("/data.csv", (d) => ({
      education: +d.education!,
      BMI: +d.BMI!,
    })).then((data: { education: number; BMI: number }[]) => {
      const groupedData = Array.from(
        d3.group(data, (d) => d.education),
        ([key, values]) => ({
          education: key,
          avgBMI: d3.mean(values, (d) => d.BMI) || 0,
        })
      );

      const x = d3
        .scaleBand()
        .domain(groupedData.map((d) => educationLevels[d.education] || "Unknown"))
        .range([0, chartWidth])
        .padding(0.1);

      const y = d3
        .scaleLinear()
        .domain([0, d3.max(groupedData, (d) => d.avgBMI) || 0])
        .nice()
        .range([chartHeight, 0]);

      chartArea
        .append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .style("text-anchor", "middle")
        .style("font-size", "12px")
        .style("fill", "#6B46C1");

      chartArea
        .append("g")
        .call(d3.axisLeft(y).ticks(6).tickSize(-chartWidth))
        .selectAll("text")
        .style("font-size", "12px")
        .style("fill", "#6B46C1");

      chartArea
        .selectAll("rect")
        .data(groupedData)
        .enter()
        .append("rect")
        .attr("x", (d) => x(educationLevels[d.education] || "Unknown") || 0)
        .attr("y", chartHeight)
        .attr("width", x.bandwidth())
        .attr("height", 0)
        .attr("fill", "url(#gradient)")
        .on("mouseover", (event, d) => {
          tooltip
            .style("opacity", 1)
            .html(
              `Education: ${educationLevels[d.education]}<br>Average BMI: ${d.avgBMI.toFixed(
                2
              )}`
            )
            .style("left", `${event.pageX + 10}px`)
            .style("top", `${event.pageY - 20}px`);
          d3.select(event.currentTarget).style("opacity", 0.8);
        })
        .on("mouseout", (event) => {
          tooltip.style("opacity", 0);
          d3.select(event.currentTarget).style("opacity", 1);
        })
        .transition()
        .duration(1000)
        .attr("y", (d) => y(d.avgBMI))
        .attr("height", (d) => chartHeight - y(d.avgBMI));

      const defs = svg.append("defs");
      const gradient = defs
        .append("linearGradient")
        .attr("id", "gradient")
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "0%")
        .attr("y2", "100%");

      gradient.append("stop").attr("offset", "0%").attr("stop-color", "#D53F8C");
      gradient.append("stop").attr("offset", "100%").attr("stop-color", "#6B46C1");

      const tooltip = d3
        .select("#avg-bmi-chart")
        .append("div")
        .style("position", "absolute")
        .style("background-color", "white")
        .style("padding", "5px")
        .style("border", "1px solid #ccc")
        .style("border-radius", "5px")
        .style("pointer-events", "none")
        .style("opacity", 0);
    });
  };

  return (
    <div className="p-6 bg-gradient-to-br from-pink-100 via-purple-100 to-green-100 rounded-lg shadow-lg">
      <div id="avg-bmi-chart"></div>
    </div>
  );
};

export default MultiBarCharts;

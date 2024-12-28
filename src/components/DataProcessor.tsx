"use client";

import React, { useEffect, useState } from "react";
import * as d3 from "d3";

interface DataPoint {
  [key: string]: number | string | null;
}

const DataProcessor: React.FC = () => {
  const [data, setData] = useState<DataPoint[]>([]);
  const [processedData, setProcessedData] = useState<DataPoint[]>([]);
  const [missingValues, setMissingValues] = useState<Record<string, number>>({});
  const [headData, setHeadData] = useState<DataPoint[]>([]);
  const [tailData, setTailData] = useState<DataPoint[]>([]);
  const [stats, setStats] = useState({
    totalRows: 0,
    totalColumns: 0,
  });

  useEffect(() => {
    d3.csv("/data.csv", (d) => ({
      male: +d.male! || null,
      age: +d.age! || null,
      education: +d.education! || null,
      currentSmoker: +d.currentSmoker! || null,
      cigsPerDay: +d.cigsPerDay! || null,
      BPMeds: +d.BPMeds! || null,
      prevalentStroke: +d.prevalentStroke! || null,
      prevalentHyp: +d.prevalentHyp! || null,
      diabetes: +d.diabetes! || null,
      totChol: +d.totChol! || null,
      sysBP: +d.sysBP! || null,
      diaBP: +d.diaBP! || null,
      BMI: +d.BMI! || null,
      heartRate: +d.heartRate! || null,
      glucose: +d.glucose! || null,
      TenYearCHD: +d.TenYearCHD! || null,
    })).then((loadedData: DataPoint[]) => {
      setData(loadedData);
      setProcessedData(loadedData);
      setHeadData(loadedData.slice(0, 5)); // First 5 rows
      setTailData(loadedData.slice(-5)); // Last 5 rows
      calculateStats(loadedData);
      calculateMissingValues(loadedData);
    });
  }, []);

  const calculateStats = (dataset: DataPoint[]) => {
    const totalRows = dataset.length;
    const totalColumns = dataset[0] ? Object.keys(dataset[0]).length : 0;
    setStats({ totalRows, totalColumns });
  };

  const calculateMissingValues = (dataset: DataPoint[]) => {
    const missingCounts: Record<string, number> = {};
    if (dataset.length > 0) {
      Object.keys(dataset[0]).forEach((key) => {
        missingCounts[key] = dataset.filter(
          (row) => row[key] === null || row[key] === undefined || row[key] === ""
        ).length;
      });
    }
    setMissingValues(missingCounts);
  };

  const handleMissingValues = (strategy: string) => {
    let updatedData = [...processedData]; // Use a copy of the current processed data
  
    switch (strategy) {
      case "drop-rows":
        updatedData = updatedData.filter((row) =>
          Object.values(row).every((value) => value !== null && value !== "")
        );
        break;
  
      case "fill-mean":
        updatedData = updatedData.map((row) => {
          const filledRow: DataPoint = { ...row };
          Object.keys(row).forEach((key) => {
            if (row[key] === null || row[key] === "") {
              const columnValues = processedData
                .map((r) => r[key])
                .filter((v) => v !== null && v !== "" && !isNaN(Number(v))); // Ensure numeric values only
  
              if (columnValues.length > 0) {
                const mean =
                  columnValues.reduce((acc, val) => acc + Number(val), 0) /
                  columnValues.length;
                filledRow[key] = parseFloat(mean.toFixed(2)); // Round to 2 decimal places
              } else {
                filledRow[key] = 0; // Default to 0 if no valid values are found
              }
            }
          });
          return filledRow;
        });
        break;
  
      case "fill-default":
        updatedData = updatedData.map((row) => {
          const filledRow: DataPoint = { ...row };
          Object.keys(row).forEach((key) => {
            if (row[key] === null || row[key] === "") {
              filledRow[key] = 0; // Default to 0
            }
          });
          return filledRow;
        });
        break;
  
      default:
        break;
    }
  
    // Update the processed data and re-calculate missing values
    setProcessedData(updatedData);
    calculateMissingValues(updatedData);
  };
  
  return (
    <div className="p-6 bg-gradient-to-br from-pink-100 via-purple-100 to-green-100 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-center mb-6 text-purple-600">
        Data Viewer and Preprocessor
      </h2>

      {/* Dataset Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <h3 className="text-lg font-semibold text-purple-600">Total Rows</h3>
          <p className="text-2xl font-bold text-gray-800">{stats.totalRows}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <h3 className="text-lg font-semibold text-purple-600">Total Columns</h3>
          <p className="text-2xl font-bold text-gray-800">{stats.totalColumns}</p>
        </div>
      </div>

      {/* Head and Tail */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-purple-600 mb-4">
          First 5 Rows (Head)
        </h3>
        {/* Head Table */}
        <Table data={headData} />
        <h3 className="text-xl font-semibold text-purple-600 mt-8 mb-4">
          Last 5 Rows (Tail)
        </h3>
        {/* Tail Table */}
        <Table data={tailData} />
      </div>

      {/* Missing Values Handling */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <h3 className="text-xl font-semibold text-purple-600">Handle Missing Values</h3>
        <div className="flex gap-4 mt-4">
          <button
            onClick={() => handleMissingValues("drop-rows")}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Drop Rows
          </button>
          <button
            onClick={() => handleMissingValues("fill-mean")}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Fill with Mean
          </button>
          <button
            onClick={() => handleMissingValues("fill-default")}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Fill with Default (0)
          </button>
        </div>

        {/* Processed Data Table */}
        <div className="mt-6">
          <h3 className="text-xl font-semibold text-purple-600 mb-4">
            Processed Data (First 5 Rows, All Columns)
          </h3>
          <Table data={processedData.slice(0, 5)} />
        </div>
      </div>
    </div>
  );
};

const Table: React.FC<{ data: DataPoint[] }> = ({ data }) => (
  <div className="overflow-x-auto">
    <table className="table-auto border-collapse border border-gray-300 w-full text-sm">
      <thead className="bg-purple-200">
        <tr>
          {data.length > 0 &&
            Object.keys(data[0]).map((key) => (
              <th key={key} className="border border-gray-300 px-4 py-2">
                {key}
              </th>
            ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={i} className="hover:bg-pink-100">
            {Object.values(row).map((value, j) => (
              <td key={j} className="border border-gray-300 px-4 py-2">
                {value === null || value === undefined || value === ""
                  ? "N/A"
                  : value}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default DataProcessor;

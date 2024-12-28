import Link from "next/link";
import DataProcessor from "@/components/DataProcessor";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-r from-pink-100 via-purple-50 to-green-100 text-gray-800">
      {/* Header Section */}
      <header className="bg-purple-600 text-white py-8 shadow-lg">
        <h1 className="text-5xl font-extrabold text-center">Data Visualization System</h1>
        <p className="text-center mt-2 text-lg font-medium">
          Preprocess and visualize your data efficiently.
        </p>
      </header>

      {/* Data Processor Section */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto">
          <DataProcessor />
        </div>
      </section>

      {/* Visualization Links */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8 text-purple-600">Explore Visualizations</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-8">
            {/* Bar Chart */}
            <li>
              <Link
                href="/bar-chart"
                className="block bg-white shadow-md hover:shadow-lg p-6 rounded-lg transition-transform transform hover:scale-105"
              >
                <h3 className="text-2xl font-semibold text-pink-600">Bar Chart</h3>
                <p className="text-gray-600 mt-2">Visualize categorical data distributions.</p>
              </Link>
            </li>

            {/* Line Chart */}
            <li>
              <Link
                href="/line-chart"
                className="block bg-white shadow-md hover:shadow-lg p-6 rounded-lg transition-transform transform hover:scale-105"
              >
                <h3 className="text-2xl font-semibold text-purple-600">Line Chart</h3>
                <p className="text-gray-600 mt-2">Explore trends and changes over time.</p>
              </Link>
            </li>

            {/* Scatter Chart */}
            <li>
              <Link
                href="/scatter-chart"
                className="block bg-white shadow-md hover:shadow-lg p-6 rounded-lg transition-transform transform hover:scale-105"
              >
                <h3 className="text-2xl font-semibold text-green-600">Scatter Chart</h3>
                <p className="text-gray-600 mt-2">Understand relationships between variables.</p>
              </Link>
            </li>

            {/* Pie Chart */}
            <li>
              <Link
                href="/pie-chart"
                className="block bg-white shadow-md hover:shadow-lg p-6 rounded-lg transition-transform transform hover:scale-105"
              >
                <h3 className="text-2xl font-semibold text-blue-500">Pie Chart</h3>
                <p className="text-gray-600 mt-2">Visualize proportions of categories.</p>
              </Link>
            </li>

            <li>
        <Link
          href="/heatmap-chart"
          className="block bg-white shadow-md hover:shadow-lg p-6 rounded-lg transition-transform transform hover:scale-105"
        >
          <h3 className="text-2xl font-semibold text-red-500">Heatmap</h3>
          <p className="text-gray-600 mt-2">Identify patterns and correlations.</p>
        </Link>
      </li>
          </ul>
        </div>
      </section>
    </main>
  );
}

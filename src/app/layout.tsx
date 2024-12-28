import '../styles/globals.css'; // Correct relative path


export const metadata = {
  title: 'Data Visualization System',
  description: 'Interactive Data Visualizations using D3.js',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-800">{children}</body>
    </html>
  );
}

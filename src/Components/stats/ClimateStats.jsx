import LineGraph from './LineGraph';

export default function StatsSection() {
  const revenueData = {
    "2020": 1.29,
    "2021": 1.46,
    "2022": 1.51,
    "2023": 1.82,
    "2024": 1.79,
    "2025": 1.94,
    "2026": 2.09,
    "2027": 2.22
  };

  const userGrowthData = {
    "2020": 2.5,
    "2021": 3.2,
    "2022": 4.1,
    "2023": 5.8,
    "2024": 7.2,
    "2025": 8.9,
    "2026": 10.5,
    "2027": 12.3
  };

  const profitData = {
    "2020": 0.45,
    "2021": 0.62,
    "2022": 0.78,
    "2023": 0.95,
    "2024": 1.12,
    "2025": 1.35,
    "2026": 1.58,
    "2027": 1.82
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
          <p className="text-gray-600">Interactive data visualizations with smooth animations</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <LineGraph
            data={revenueData}
            title="Revenue Growth (in billions)"
            gradientColors={['#3b82f6', '#8b5cf6']}
          />

          <LineGraph
            data={userGrowthData}
            title="User Growth (in millions)"
            gradientColors={['#10b981', '#06b6d4']}
          />

          <LineGraph
            data={profitData}
            title="Net Profit (in billions)"
            gradientColors={['#f59e0b', '#ef4444']}
          />

          <LineGraph
            data={revenueData}
            title="Market Share (%)"
            gradientColors={['#ec4899', '#8b5cf6']}
          />
        </div>
      </div>
    </div>
  );
}

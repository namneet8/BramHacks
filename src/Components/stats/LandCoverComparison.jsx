import { useState, useEffect, useMemo } from 'react';

export default function LandCoverComparison({ percentage_summary }) {
  const [animatedData, setAnimatedData] = useState({});
  const [hoveredBar, setHoveredBar] = useState(null);

  const metrics = [
    { key: 'NDVI_vegetation_%', label: 'Vegetation', color: '#10b981' },
    { key: 'NDBI_builtup_%', label: 'Built-up', color: '#ef4444' },
    { key: 'NDWI_water_%', label: 'Water', color: '#3b82f6' },
    { key: 'MNDWI_enhanced_water_%', label: 'Enhanced Water', color: '#8b5cf6' }
  ];

  const yearColors = { '2018': '#10b981', '2024': '#3b82f6' };

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedData(percentage_summary), 200);
    return () => clearTimeout(timer);
  }, [percentage_summary]);

  const parseValue = (val) => parseFloat((val || '0%').replace('%', '')) || 0;

  const maxY = useMemo(() => {
    if (!animatedData['2018'] || !animatedData['2024']) return 100;
    let max = 0;
    metrics.forEach(m => {
      max = Math.max(max, parseValue(animatedData['2018'][m.key]), parseValue(animatedData['2024'][m.key]));
    });
    return Math.ceil((max + 5) / 10) * 10;
  }, [animatedData]);

  const chartWidth = 600;
  const chartHeight = 380;
  const padding = { top: 50, right: 60, bottom: 80, left: 60 };
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  const groupWidth = innerWidth / metrics.length;
  const barWidth = (groupWidth * 0.7) / 2;
  const gapBetweenBars = barWidth * 0.2;

  const getY = (value) => padding.top + innerHeight * (1 - value / maxY);
  const getBarHeight = (value) => (value / maxY) * innerHeight;

  const axisColor = '#9ca3af';
  const labelColor = '#f3f4f6';
  const gridColor = '#1f2937';

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-black rounded-3xl shadow-[0_0_50px_rgba(0,255,200,0.1)]">
      <h2 className="text-3xl font-extrabold mb-6 text-center text-white tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-blue-500">
        Land Cover Analysis: 2018 vs 2024
      </h2>

      <div className="relative bg-black border border-gray-800 rounded-2xl p-6 shadow-inner">
        <svg width="100%" height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="overflow-visible">
          {/* Grid + Y labels */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const y = padding.top + innerHeight * (1 - ratio);
            const val = Math.round(maxY * ratio);
            return (
              <g key={i}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={chartWidth - padding.right}
                  y2={y}
                  stroke={gridColor}
                  strokeWidth="1"
                  strokeDasharray={i === 0 ? '0' : '8,6'}
                  opacity="0.5"
                />
                <text
                  x={padding.left - 14}
                  y={y + 4}
                  fill={labelColor}
                  className="text-xs font-semibold"
                  textAnchor="end"
                >
                  {val}%
                </text>
              </g>
            );
          })}

          {/* Y and X Axes */}
          <line x1={padding.left} y1={padding.top} x2={padding.left} y2={chartHeight - padding.bottom} stroke={axisColor} strokeWidth="3" />
          <line x1={padding.left} y1={chartHeight - padding.bottom} x2={chartWidth - padding.right} y2={chartHeight - padding.bottom} stroke={axisColor} strokeWidth="3" />

          {/* Bars */}
          {metrics.map((metric, idx) => {
            const groupCenterX = padding.left + (idx + 0.5) * groupWidth;
            const val2018 = animatedData['2018'] ? parseValue(animatedData['2018'][metric.key]) : 0;
            const val2024 = animatedData['2024'] ? parseValue(animatedData['2024'][metric.key]) : 0;

            const x2018 = groupCenterX - barWidth - gapBetweenBars / 2;
            const x2024 = groupCenterX + gapBetweenBars / 2;

            return (
              <g key={metric.key}>
                <rect
                  x={x2018}
                  y={getY(val2018)}
                  width={barWidth}
                  height={getBarHeight(val2018)}
                  fill={yearColors['2018']}
                  rx="12"
                  className="cursor-pointer"
                  style={{
                    filter:
                      hoveredBar?.year === '2018' && hoveredBar?.metric === metric.label
                        ? 'brightness(1.4) drop-shadow(0 0 25px currentColor)'
                        : 'drop-shadow(0 0 10px rgba(0,255,150,0.3))',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={() => setHoveredBar({ year: '2018', value: val2018, metric: metric.label })}
                  onMouseLeave={() => setHoveredBar(null)}
                >
                  <animate attributeName="height" from="0" to={getBarHeight(val2018)} dur="1.2s" begin={`${idx * 0.15}s`} fill="freeze" />
                  <animate attributeName="y" from={chartHeight - padding.bottom} to={getY(val2018)} dur="1.2s" begin={`${idx * 0.15}s`} fill="freeze" />
                </rect>

                <rect
                  x={x2024}
                  y={getY(val2024)}
                  width={barWidth}
                  height={getBarHeight(val2024)}
                  fill={yearColors['2024']}
                  rx="12"
                  opacity={0.85}
                  className="cursor-pointer"
                  style={{
                    filter:
                      hoveredBar?.year === '2024' && hoveredBar?.metric === metric.label
                        ? 'brightness(1.5) drop-shadow(0 0 35px white)'
                        : 'drop-shadow(0 0 10px rgba(0,150,255,0.3))',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={() => setHoveredBar({ year: '2024', value: val2024, metric: metric.label })}
                  onMouseLeave={() => setHoveredBar(null)}
                >
                  <animate attributeName="height" from="0" to={getBarHeight(val2024)} dur="1.2s" begin={`${idx * 0.15 + 0.3}s`} fill="freeze" />
                  <animate attributeName="y" from={chartHeight - padding.bottom} to={getY(val2024)} dur="1.2s" begin={`${idx * 0.15 + 0.3}s`} fill="freeze" />
                </rect>

                {/* Values */}
                {[{ year: '2018', val: val2018, x: x2018 }, { year: '2024', val: val2024, x: x2024 }].map((d, i) => (
                  <text
                    key={i}
                    x={d.x + barWidth / 2}
                    y={getY(d.val) - 8}
                    fill="white"
                    textAnchor="middle"
                    className="text-xs font-bold"
                    style={{ textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}
                  >
                    {d.val.toFixed(1)}%
                  </text>
                ))}

                {/* X-axis labels */}
                <text x={groupCenterX} y={chartHeight - padding.bottom + 32} fill={labelColor} textAnchor="middle" className="text-sm font-bold">
                  {metric.label.split(' ')[0]}
                </text>
                {metric.label.includes(' ') && (
                  <text x={groupCenterX} y={chartHeight - padding.bottom + 46} fill={labelColor} textAnchor="middle" className="text-xs opacity-90">
                    {metric.label.split(' ').slice(1).join(' ')}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Legend */}
        <div className="flex justify-center gap-10 mt-6 text-sm">
          <div className="flex items-center gap-2 bg-gray-900/90 px-4 py-2 rounded-full">
            <div className="w-8 h-5 rounded-lg" style={{ backgroundColor: yearColors['2018'] }}></div>
            <span className="text-white font-bold">2018</span>
          </div>
          <div className="flex items-center gap-2 bg-gray-900/90 px-4 py-2 rounded-full">
            <div className="w-8 h-5 rounded-lg" style={{ backgroundColor: yearColors['2024'] }}></div>
            <span className="text-white font-bold">2024</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse-glow {
          0%, 100% { filter: brightness(1) drop-shadow(0 0 15px currentColor); }
          50% { filter: brightness(1.6) drop-shadow(0 0 35px currentColor); }
        }
        rect:hover { animation: pulse-glow 2s ease-in-out infinite; }
      `}</style>
    </div>
  );
}

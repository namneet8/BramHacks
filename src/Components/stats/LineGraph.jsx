import { useEffect, useRef, useState } from 'react';

export default function LineGraph({
  data,
  title,
  color = '#3b82f6',
  gradientColors = ['#3b82f6', '#8b5cf6']
}) {
  const canvasRef = useRef(null);
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [animationProgress, setAnimationProgress] = useState(0);
  const containerRef = useRef(null);

  const entries = Object.entries(data).map(([key, value]) => ({
    label: key,
    value: Number(value)
  }));

  useEffect(() => {
    let animationFrame;
    const startTime = Date.now();
    const duration = 1500;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      setAnimationProgress(eased);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animate();

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [data]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    ctx.scale(dpr, dpr);

    const padding = { top: 30, right: 30, bottom: 50, left: 60 };
    const chartWidth = rect.width - padding.left - padding.right;
    const chartHeight = rect.height - padding.top - padding.bottom;

    const values = entries.map(e => e.value);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const valueRange = maxValue - minValue;

    const points = entries.map((entry, index) => {
      const x = padding.left + (chartWidth / (entries.length - 1)) * index;
      const y = padding.top + chartHeight - ((entry.value - minValue) / valueRange) * chartHeight;
      return { x, y, label: entry.label, value: entry.value };
    });

    ctx.clearRect(0, 0, rect.width, rect.height);

    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = padding.top + (chartHeight / 5) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(padding.left + chartWidth, y);
      ctx.stroke();

      const value = maxValue - (valueRange / 5) * i;
      ctx.fillStyle = '#6b7280';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillText(value.toFixed(2), padding.left - 10, y);
    }

    entries.forEach((entry, index) => {
      const x = padding.left + (chartWidth / (entries.length - 1)) * index;
      ctx.fillStyle = '#6b7280';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(entry.label, x, padding.top + chartHeight + 10);
    });

    const gradient = ctx.createLinearGradient(0, 0, chartWidth, 0);
    gradient.addColorStop(0, gradientColors[0]);
    gradient.addColorStop(1, gradientColors[1]);

    const animatedPoints = points.map((point, index) => ({
      ...point,
      y: padding.top + chartHeight - ((point.value - minValue) / valueRange) * chartHeight * animationProgress
    }));

    ctx.beginPath();
    ctx.moveTo(animatedPoints[0].x, animatedPoints[0].y);
    for (let i = 1; i < animatedPoints.length; i++) {
      const xMid = (animatedPoints[i - 1].x + animatedPoints[i].x) / 2;
      ctx.quadraticCurveTo(animatedPoints[i - 1].x, animatedPoints[i - 1].y, xMid, (animatedPoints[i - 1].y + animatedPoints[i].y) / 2);
      ctx.quadraticCurveTo(animatedPoints[i].x, animatedPoints[i].y, animatedPoints[i].x, animatedPoints[i].y);
    }
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

    ctx.lineTo(animatedPoints[animatedPoints.length - 1].x, padding.top + chartHeight);
    ctx.lineTo(animatedPoints[0].x, padding.top + chartHeight);
    ctx.closePath();

    const areaGradient = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartHeight);
    areaGradient.addColorStop(0, `${gradientColors[0]}40`);
    areaGradient.addColorStop(1, `${gradientColors[1]}00`);
    ctx.fillStyle = areaGradient;
    ctx.fill();

    animatedPoints.forEach((point) => {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2;
      ctx.stroke();
    });

  }, [entries, animationProgress, gradientColors]);

  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const padding = { top: 30, right: 30, bottom: 50, left: 60 };
    const chartWidth = rect.width - padding.left - padding.right;
    const chartHeight = rect.height - padding.top - padding.bottom;

    const values = entries.map(e => e.value);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const valueRange = maxValue - minValue;

    const points = entries.map((entry, index) => {
      const px = padding.left + (chartWidth / (entries.length - 1)) * index;
      const py = padding.top + chartHeight - ((entry.value - minValue) / valueRange) * chartHeight;
      return { x: px, y: py, label: entry.label, value: entry.value };
    });

    let closestPoint = null;
    let minDistance = Infinity;

    for (const point of points) {
      const distance = Math.sqrt(Math.pow(x - point.x, 2) + Math.pow(y - point.y, 2));
      if (distance < 20 && distance < minDistance) {
        minDistance = distance;
        closestPoint = point;
      }
    }

    setHoveredPoint(closestPoint);
  };

  const handleMouseLeave = () => {
    setHoveredPoint(null);
  };

  return (
    <div ref={containerRef} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">{title}</h3>
      <div className="relative">
        <canvas
          ref={canvasRef}
          className="w-full cursor-crosshair"
          style={{ height: '300px' }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        />
        {hoveredPoint && (
          <div
            className="absolute bg-gray-900 text-white px-3 py-2 rounded-lg shadow-lg pointer-events-none transform -translate-x-1/2 -translate-y-full -mt-2"
            style={{
              left: `${hoveredPoint.x}px`,
              top: `${hoveredPoint.y}px`,
            }}
          >
            <div className="text-sm font-semibold">{hoveredPoint.label}</div>
            <div className="text-lg">{hoveredPoint.value.toFixed(2)}</div>
          </div>
        )}
      </div>
    </div>
  );
}

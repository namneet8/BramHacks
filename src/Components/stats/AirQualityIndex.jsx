import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const AirQualityIndex = ({ monthly_aqi, city = "Toronto" }) => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  // Build clean data array
  const data = Object.entries(monthly_aqi || {}).map(([date, aqi]) => {
    const value = typeof aqi === "string" ? parseFloat(aqi) : aqi;
    const [year, month] = date.split("-").map(Number);
    const isForecast = year > currentYear || (year === currentYear && month > currentMonth);

    return {
      date,
      aqi: isNaN(value) ? 0 : Number(value.toFixed(2)),
      isForecast,
    };
  });

  const historicalData = data.filter(d => !d.isForecast);
  const forecastData = data.filter(d => d.isForecast);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload[0]) {
      const { aqi, isForecast } = payload[0].payload;
      const [year, month] = label.split("-");
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthName = monthNames[parseInt(month) - 1];

      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          style={{
            background: isForecast
              ? "linear-gradient(135deg, #f59e0b, #ec4899)"
              : "linear-gradient(135deg, #06b6d4, #a855f7)",
            padding: "16px 20px",
            borderRadius: "16px",
            color: "white",
            boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
            border: "1px solid rgba(255,255,255,0.3)",
            backdropFilter: "blur(10px)",
          }}
        >
          <p style={{ margin: 0, fontWeight: "bold", fontSize: "1rem" }}>
            {monthName} {year}
          </p>
          <p style={{ margin: "8px 0 0", fontSize: "1.2rem", fontWeight: "600" }}>
            AQI: {aqi}
          </p>
          {isForecast && (
            <p style={{
              color: "#fef3c7",
              fontSize: "0.85rem",
              margin: "6px 0 0",
              fontWeight: "500"
            }}>
              🔮 Predicted Value
            </p>
          )}
        </motion.div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      style={{ width: "100%", height: 500, background: "transparent", padding: 20 }}
    >
      <h2
        style={{
          textAlign: "center",
          background: "linear-gradient(to right, #06b6d4, #a855f7)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          fontSize: "2rem",
          marginBottom: 20,
        }}
      >
        Air Quality Index Trend — {city}
      </h2>

      <ResponsiveContainer width="100%" height={380}>
        <LineChart margin={{ top: 10, right: 30, left: 20, bottom: 10 }}>

          <defs>
            <linearGradient id="historicalGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
            <linearGradient id="forecastGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>

          <XAxis
            dataKey="date"
            tick={{ fill: "#e0e7ff", fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: "#6366f1", strokeWidth: 1.5 }}
            tickFormatter={(value) => {
              const [year, month] = value.split("-");
              return `${month}/${year.slice(2)}`;
            }}
            interval="preserveStartEnd"
            type="category"
            allowDuplicatedCategory={false}
          />

          <YAxis
            domain={[1, 3]}
            tick={{ fill: "#e0e7ff", fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: "#6366f1", strokeWidth: 1.5 }}
          />

          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#818cf8', strokeWidth: 2, strokeDasharray: '5 5' }} />

          {/* Historical Line */}
          <Line
            data={historicalData}
            type="monotone"
            dataKey="aqi"
            stroke="url(#historicalGradient)"
            strokeWidth={4}
            dot={false}
            activeDot={{ r: 8, stroke: "#10b981", strokeWidth: 3, fill: "#06b6d4" }}
          />

          {/* Forecast Line */}
          {forecastData.length > 0 && (
            <Line
              data={forecastData}
              type="monotone"
              dataKey="aqi"
              stroke="url(#forecastGradient)"
              strokeWidth={4}
              strokeDasharray="8 8"
              dot={false}
              activeDot={{ r: 8, stroke: "#ec4899", strokeWidth: 3, fill: "#f59e0b" }}
            />
          )}
        </LineChart>
      </ResponsiveContainer>

      <p style={{ textAlign: "center", color: "#67e8f9", marginTop: 16, fontStyle: "italic", display: "flex", alignItems: "center", justifyContent: "center", gap: "20px" }}>
        <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{
            width: "30px",
            height: "3px",
            background: "linear-gradient(to right, #06b6d4, #10b981)",
            borderRadius: "2px"
          }}></span> Historical
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{
            width: "30px",
            height: "3px",
            background: "linear-gradient(to right, #f59e0b, #ec4899)",
            borderRadius: "2px",
            backgroundImage: "repeating-linear-gradient(90deg, #f59e0b, #f59e0b 8px, transparent 8px, transparent 16px)"
          }}></span> Forecast
        </span>
      </p>
    </motion.div>
  );
};

export default AirQualityIndex;

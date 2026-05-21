"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Filler,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { apiGet } from "@/apis/ApiRequest";
import { ApiEndpoints } from "@/utils/ApiEndpoints";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Filler
);

// ─── Helpers ────────────────────────────────────────────────────────────────
const FILTERS = [
  { label: "Last week", value: "week" },
  { label: "Last month", value: "month" },
  { label: "Last 6 months", value: "6months" },
  { label: "Last year", value: "year" },
  { label: "All time", value: "all" },
];

function fmtMoney(n) {
  if (n >= 1_000_000) return "$" + (n / 1_000_000).toFixed(2) + "M";
  if (n >= 1_000) return "$" + (n / 1_000).toFixed(1).replace(/\.0$/, "") + "k";
  return "$" + n.toLocaleString();
}

// ─── Sub-components ──────────────────────────────────────────────────────────
function MetricCard({ label, value, sub, badge }) {
  return (
    <div className="metric-card">
      <p className="metric-label">{label}</p>
      <p className="metric-value">{value}</p>
      <p className="metric-sub">
        {sub}
        {badge !== null && badge !== undefined && (
          <span className={`badge ${badge >= 0 ? "badge-up" : "badge-down"}`}>
            {badge >= 0 ? "▲" : "▼"} {Math.abs(badge)}%
          </span>
        )}
      </p>
    </div>
  );
}

function ChartCard({ title, valueLabel, color, chartData, isMoney }) {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) =>
            isMoney ? fmtMoney(ctx.parsed.y) : ctx.parsed.y + " orders",
        },
        backgroundColor: "#1a1a1a",
        titleColor: "#aaa",
        bodyColor: "#fff",
        padding: 10,
        cornerRadius: 6,
        displayColors: false,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: {
          font: { size: 11, family: "inherit" },
          color: "#888",
          maxRotation: 30,
          autoSkip: true,
          maxTicksLimit: 8,
        },
      },
      y: {
        grid: { color: "rgba(0,0,0,0.05)" },
        border: { display: false },
        ticks: {
          font: { size: 11, family: "inherit" },
          color: "#888",
          callback: (v) => (isMoney ? fmtMoney(v) : v),
        },
      },
    },
  };

  const data = {
    labels: chartData.map((b) => b.label),
    datasets: [
      {
        label: isMoney ? "Revenue" : "Orders",
        data: chartData.map((b) => (isMoney ? b.sales : b.orders)),
        backgroundColor: color + "cc",
        hoverBackgroundColor: color,
        borderRadius: 4,
        borderSkipped: false,
      },
    ],
  };

  return (
    <div className="chart-card">
      <div className="chart-header">
        <div>
          <p className="chart-label">{title}</p>
          <p className="chart-value">{valueLabel}</p>
        </div>
        <span className="chart-dot" style={{ background: color }} />
      </div>
      <div className="chart-wrap">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}

// ─── Main Dashboard Page ─────────────────────────────────────────────────────
export default function Home() {
  const [activeRange, setActiveRange] = useState("month");
  const [metrics, setMetrics] = useState(null);
  const [buckets, setBuckets] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const endpoint = `${ApiEndpoints.home.dashboard}?range=${activeRange}`;
    
    apiGet(
      endpoint,
      (response) => {
        if (response?.success && response?.data) {
          setMetrics(response.data.metrics);
          setBuckets(response.data.chart || []);
        }
        setLoading(false);
      },
      (error) => {
        console.error("Failed to fetch dashboard data:", error);
        setLoading(false);
      }
    );
  }, [activeRange]);

  return (
    <>

      <div className="layout">
        {/* Sidebar */}

        {/* Main Content */}
        <main className="main">
          <div className="page-header">
            <div>
              <h1 className="page-title">Dashboard</h1>
              <p className="page-sub">Track your store performance at a glance</p>
            </div>
            <div className="header-date">
              {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </div>
          </div>

          {/* Filters */}
          <div className="filters">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                className={`filter-btn ${activeRange === f.value ? "active" : ""}`}
                onClick={() => setActiveRange(f.value)}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Metric Cards */}
          {metrics && (
            <div className="metrics-grid">
              <MetricCard
                label="Total Orders"
                value={metrics.totalOrders.toLocaleString()}
                sub="vs prev period"
                badge={metrics.orderChange}
              />
              <MetricCard
                label="Total Sales"
                value={fmtMoney(metrics.totalSales)}
                sub="vs prev period"
                badge={metrics.salesChange}
              />
              <MetricCard
                label="Avg Order Value"
                value={"$" + metrics.aov}
                sub="per order"
                badge={null}
              />
              <MetricCard
                label="Avg Daily Orders"
                value={metrics.dailyAvg}
                sub="per day"
                badge={null}
              />
            </div>
          )}

          {/* Charts */}
          {metrics && (
            <div className="charts-grid">
              <ChartCard
                title="Total Orders"
                valueLabel={metrics.totalOrders.toLocaleString() + " orders"}
                color="#1D9E75"
                chartData={buckets}
                isMoney={false}
              />
              <ChartCard
                title="Sales Revenue"
                valueLabel={fmtMoney(metrics.totalSales)}
                color="#EF9F27"
                chartData={buckets}
                isMoney={true}
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="action-buttons" style={{ display: "flex", gap: "12px", marginTop: "24px", flexWrap: "wrap" }}>
            <Link href="/dashboard/products/products">
              <button style={{ padding: "10px 20px", borderRadius: "6px", border: "none", backgroundColor: "#1D9E75", color: "white", cursor: "pointer", fontSize: "14px", fontWeight: "500" }}>
                View Classes
              </button>
            </Link>
            <Link href="/dashboard/products/category">
              <button style={{ padding: "10px 20px", borderRadius: "6px", border: "none", backgroundColor: "#EF9F27", color: "white", cursor: "pointer", fontSize: "14px", fontWeight: "500" }}>
                View Collections
              </button>
            </Link>
            <Link href="/dashboard/orders">
              <button style={{ padding: "10px 20px", borderRadius: "6px", border: "none", backgroundColor: "#3B82F6", color: "white", cursor: "pointer", fontSize: "14px", fontWeight: "500" }}>
                View Orders
              </button>
            </Link>
          </div>
        </main>
      </div>
    </>
  );
}
"use client";

import React from "react";

const timeList = [
  "2026-09-01",
  "2026-09-02",
  "2026-09-03",
  "2026-09-04",
  "2026-09-05",
  "2026-09-06",
  "2026-09-07",
];

const yTicks = [1, 0.8, 0.6, 0.4, 0.2, 0];

export default function AdminDashboardCharts() {
  const width = 640;
  const height = 240;
  const padding = { top: 35, right: 30, bottom: 40, left: 45 };

  const getX = (i: number) =>
    padding.left + (i / (timeList.length - 1)) * (width - padding.left - padding.right);

  const getY = (val: number) =>
    padding.top + (1 - val) * (height - padding.top - padding.bottom);

  return (
    <div className="dash-charts">
      {/* Chart 1: 财务 7 天趋势 */}
      <div className="dash-chart-box">
        <div className="chart-hd">
          <span className="chart-title">
            <i className="fa fa-bar-chart" style={{ color: "#667eea", marginRight: 8 }}></i>
            财务 7 天趋势
          </span>
          <span className="chart-badge">近 7 天</span>
        </div>

        {/* Legend */}
        <div className="chart-legend">
          <span className="legend-item">
            <span className="legend-square" style={{ backgroundColor: "#c23531" }}></span>
            CNY充值
          </span>
          <span className="legend-item">
            <span className="legend-square" style={{ backgroundColor: "#2f4554" }}></span>
            CNY提现
          </span>
          <span className="legend-item">
            <span className="legend-square" style={{ backgroundColor: "#61a0a8" }}></span>
            USDT充值
          </span>
          <span className="legend-item">
            <span className="legend-square" style={{ backgroundColor: "#d48265" }}></span>
            USDT提现
          </span>
        </div>

        {/* SVG Chart */}
        <div className="chart-area">
          <svg viewBox={`0 0 ${width} ${height}`} className="chart-svg">
            {/* Grid lines & Y-axis labels */}
            {yTicks.map((val, i) => {
              const y = getY(val);
              return (
                <g key={i}>
                  <line
                    x1={padding.left}
                    y1={y}
                    x2={width - padding.right}
                    y2={y}
                    stroke="#eee"
                    strokeDasharray="2 2"
                  />
                  <text
                    x={padding.left - 10}
                    y={y + 4}
                    textAnchor="end"
                    fontSize="11"
                    fill="#666"
                  >
                    {val}
                  </text>
                </g>
              );
            })}

            {/* X-axis date labels */}
            {timeList.map((time, i) => {
              const x = getX(i);
              return (
                <text
                  key={i}
                  x={x}
                  y={height - 12}
                  textAnchor="middle"
                  fontSize="11"
                  fill="#666"
                >
                  {time}
                </text>
              );
            })}

            {/* Baseline at 0 with dots */}
            <line
              x1={getX(0)}
              y1={getY(0)}
              x2={getX(timeList.length - 1)}
              y2={getY(0)}
              stroke="#d48265"
              strokeWidth="2"
            />
            {timeList.map((_, i) => (
              <circle
                key={i}
                cx={getX(i)}
                cy={getY(0)}
                r="3"
                fill="#d48265"
                stroke="#ffffff"
                strokeWidth="1.5"
              />
            ))}
          </svg>
        </div>
      </div>

      {/* Chart 2: 订单 7 天趋势 */}
      <div className="dash-chart-box">
        <div className="chart-hd">
          <span className="chart-title">
            <i className="fa fa-area-chart" style={{ color: "#48bb78", marginRight: 8 }}></i>
            订单 7 天趋势
          </span>
          <span className="chart-badge">近 7 天</span>
        </div>

        {/* Legend */}
        <div className="chart-legend">
          <span className="legend-item">
            <span className="legend-square" style={{ backgroundColor: "#c23531" }}></span>
            买涨
          </span>
          <span className="legend-item">
            <span className="legend-square" style={{ backgroundColor: "#2f4554" }}></span>
            买跌
          </span>
        </div>

        {/* SVG Chart */}
        <div className="chart-area">
          <svg viewBox={`0 0 ${width} ${height}`} className="chart-svg">
            {/* Grid lines & Y-axis labels */}
            {yTicks.map((val, i) => {
              const y = getY(val);
              return (
                <g key={i}>
                  <line
                    x1={padding.left}
                    y1={y}
                    x2={width - padding.right}
                    y2={y}
                    stroke="#eee"
                    strokeDasharray="2 2"
                  />
                  <text
                    x={padding.left - 10}
                    y={y + 4}
                    textAnchor="end"
                    fontSize="11"
                    fill="#666"
                  >
                    {val}
                  </text>
                </g>
              );
            })}

            {/* X-axis date labels */}
            {timeList.map((time, i) => {
              const x = getX(i);
              return (
                <text
                  key={i}
                  x={x}
                  y={height - 12}
                  textAnchor="middle"
                  fontSize="11"
                  fill="#666"
                >
                  {time}
                </text>
              );
            })}

            {/* Baseline at 0 with dots */}
            <line
              x1={getX(0)}
              y1={getY(0)}
              x2={getX(timeList.length - 1)}
              y2={getY(0)}
              stroke="#2f4554"
              strokeWidth="2"
            />
            {timeList.map((_, i) => (
              <circle
                key={i}
                cx={getX(i)}
                cy={getY(0)}
                r="3"
                fill="#2f4554"
                stroke="#ffffff"
                strokeWidth="1.5"
              />
            ))}
          </svg>
        </div>
      </div>

      <style jsx>{`
        .dash-charts {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }

        @media (max-width: 992px) {
          .dash-charts {
            grid-template-columns: 1fr;
          }
        }

        .dash-chart-box {
          background: #ffffff;
          border-radius: 14px;
          padding: 22px 24px;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
          position: relative;
        }

        .chart-hd {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .chart-title {
          font-size: 15px;
          font-weight: 700;
          color: #1e293b;
          display: flex;
          align-items: center;
        }

        .chart-badge {
          font-size: 11px;
          padding: 3px 10px;
          border-radius: 20px;
          background: #f1f5f9;
          color: #64748b;
          font-weight: 500;
        }

        .chart-legend {
          display: flex;
          justify-content: flex-end;
          gap: 14px;
          margin-bottom: 10px;
          font-size: 12px;
          color: #333333;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .legend-square {
          width: 10px;
          height: 10px;
          border-radius: 2px;
          display: inline-block;
        }

        .chart-area {
          width: 100%;
          height: 240px;
        }

        .chart-svg {
          width: 100%;
          height: 100%;
          overflow: visible;
        }
      `}</style>
    </div>
  );
}

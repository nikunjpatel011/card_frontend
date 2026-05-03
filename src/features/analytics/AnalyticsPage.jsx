import { BarChart3, Calendar } from "lucide-react";
import { useState } from "react";

// Helper function to create smooth SVG path using Catmull-Rom spline
function createSmoothPath(points, height) {
  if (points.length === 0) return "";
  if (points.length === 1) {
    const x = 50;
    const maxValue = Math.max(points[0].value, 1);
    const y = height - (points[0].value / maxValue) * height;
    return `M 0 ${height} L 0 ${y} L 100 ${y} L 100 ${height} Z`;
  }
  
  const maxValue = Math.max(...points.map(p => p.value), 1);
  const width = 100;
  const stepX = width / (points.length - 1);
  
  // Convert points to coordinates
  const coords = points.map((point, i) => ({
    x: i * stepX,
    y: height - ((point.value / maxValue) * (height - 5)) - 5, // Leave 5% padding
  }));
  
  // Create smooth curve path
  let linePath = `M ${coords[0].x},${coords[0].y}`;
  
  for (let i = 0; i < coords.length - 1; i++) {
    const curr = coords[i];
    const next = coords[i + 1];
    const controlX = (curr.x + next.x) / 2;
    
    linePath += ` C ${controlX},${curr.y} ${controlX},${next.y} ${next.x},${next.y}`;
  }
  
  // Create filled area path
  let areaPath = `M ${coords[0].x},${height}`;
  areaPath += ` L ${coords[0].x},${coords[0].y}`;
  
  for (let i = 0; i < coords.length - 1; i++) {
    const curr = coords[i];
    const next = coords[i + 1];
    const controlX = (curr.x + next.x) / 2;
    
    areaPath += ` C ${controlX},${curr.y} ${controlX},${next.y} ${next.x},${next.y}`;
  }
  
  areaPath += ` L ${coords[coords.length - 1].x},${height} Z`;
  
  return { linePath, areaPath };
}

export function AnalyticsPage({ contacts, cards, usage }) {
  const [timeFilter, setTimeFilter] = useState("day"); // "day", "month", "year"
  
  const queueTotals = ["Pending", "Processing", "Completed", "Failed"].map((status) => ({
    status,
    count: cards.filter((card) => card.status === status).length,
  }));

  // Generate data based on selected filter
  const generateChartData = () => {
    const today = new Date();
    
    if (timeFilter === "day") {
      // Last 30 days
      return Array.from({ length: 30 }, (_, i) => {
        const date = new Date(today);
        date.setDate(date.getDate() - (29 - i));
        const dateStr = date.toLocaleDateString();
        
        const count = contacts.filter((contact) => contact.scannedAt === dateStr).length;
        
        return {
          label: date.getDate().toString(),
          date: dateStr,
          value: count,
        };
      });
    } else if (timeFilter === "month") {
      // Last 12 months
      return Array.from({ length: 12 }, (_, i) => {
        const date = new Date(today);
        date.setMonth(date.getMonth() - (11 - i));
        const monthStr = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        const month = date.getMonth();
        const year = date.getFullYear();
        
        const count = contacts.filter((contact) => {
          const contactDate = new Date(contact.scannedAt);
          return contactDate.getMonth() === month && contactDate.getFullYear() === year;
        }).length;
        
        return {
          label: date.toLocaleDateString('en-US', { month: 'short' }),
          date: monthStr,
          value: count,
        };
      });
    } else {
      // Last 5 years
      const currentYear = today.getFullYear();
      return Array.from({ length: 5 }, (_, i) => {
        const year = currentYear - (4 - i);
        
        const count = contacts.filter((contact) => {
          const contactDate = new Date(contact.scannedAt);
          return contactDate.getFullYear() === year;
        }).length;
        
        return {
          label: year.toString(),
          date: year.toString(),
          value: count,
        };
      });
    }
  };

  const dailyScans = generateChartData();

  const maxQueue = Math.max(...queueTotals.map((item) => item.count), usage, 1);
  const totalScans = dailyScans.reduce((sum, day) => sum + day.value, 0);
  const avgScans = (totalScans / dailyScans.length).toFixed(1);
  
  const filterLabel = {
    day: "Last 30 Days",
    month: "Last 12 Months", 
    year: "Last 5 Years"
  }[timeFilter];

  return (
    <div className="space-y-6 fade-slide">
      <section className="premium-panel rounded-[18px] p-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-ink">Daily Scan Activity</h2>
            <p className="mt-1 text-sm text-brand/60">{filterLabel} scan trends.</p>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Filter Buttons */}
            <div className="flex gap-1 rounded-full border border-brand/10 bg-white p-1">
              {[
                { value: "day", label: "Day" },
                { value: "month", label: "Month" },
                { value: "year", label: "Year" },
              ].map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setTimeFilter(filter.value)}
                  className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${
                    timeFilter === filter.value
                      ? "bg-brand text-white shadow-sm"
                      : "text-brand/60 hover:text-brand"
                  }`}
                  type="button"
                >
                  {filter.label}
                </button>
              ))}
            </div>
            
            {/* Stats */}
            <div className="flex items-center gap-3 rounded-full border border-brand/10 bg-white px-4 py-2">
              <div className="text-right">
                <p className="text-[10px] font-semibold text-brand/50">Total</p>
                <p className="text-lg font-extrabold text-brand">{totalScans}</p>
              </div>
              <div className="h-6 w-px bg-brand/10" />
              <div className="text-right">
                <p className="text-[10px] font-semibold text-brand/50">Average</p>
                <p className="text-lg font-extrabold text-accent">{avgScans}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="relative h-64 w-full rounded-2xl bg-gradient-to-br from-surface/30 to-brand/5 p-6 pb-8">
          <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Grid lines */}
            {[20, 40, 60, 80].map((y) => (
              <line
                key={y}
                x1="0"
                y1={y}
                x2="100"
                y2={y}
                stroke="currentColor"
                strokeWidth="0.15"
                className="text-brand/10"
                strokeDasharray="2,2"
              />
            ))}
            
            {/* Area chart */}
            <path
              d={createSmoothPath(dailyScans, 100).areaPath}
              fill="url(#areaGradient)"
            />
            
            {/* Line on top */}
            <path
              d={createSmoothPath(dailyScans, 100).linePath}
              fill="none"
              stroke="#23979E"
              strokeWidth="0.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            
            {/* Gradient definition */}
            <defs>
              <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#23979E" stopOpacity="0.3" />
                <stop offset="50%" stopColor="#23979E" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#23979E" stopOpacity="0.02" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* X-axis labels */}
          <div className="absolute bottom-2 left-6 right-6 flex justify-between text-[11px] font-bold text-brand/50">
            {timeFilter === "day" && [0, 7, 14, 21, 29].map((index) => (
              <span key={index}>{dailyScans[index]?.label}</span>
            ))}
            {timeFilter === "month" && [0, 3, 6, 9, 11].map((index) => (
              <span key={index}>{dailyScans[index]?.label}</span>
            ))}
            {timeFilter === "year" && dailyScans.map((item, index) => (
              <span key={index}>{item.label}</span>
            ))}
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-1">
        <section className="premium-panel rounded-[18px] p-5">
          <div className="mb-8 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-ink">Scan Volume</h2>
              <p className="mt-1 text-sm text-brand/60">Live queue and usage data.</p>
            </div>
            <span className="rounded-2xl bg-brand/10 p-3 text-brand">
              <BarChart3 className="h-5 w-5" />
            </span>
          </div>
          <div className="flex h-72 items-end justify-between gap-4">
            {[...queueTotals, { status: "Used Today", count: usage }].map((item) => (
              <div className="flex flex-1 flex-col items-center gap-4" key={item.status}>
                <div className="relative flex h-56 w-full items-end overflow-hidden rounded-2xl bg-gradient-to-br from-surface/50 to-brand/5 p-2">
                  <div
                    className="w-full rounded-xl bg-gradient-to-t from-brand via-accent/80 to-accent shadow-lg transition-all duration-500 hover:scale-[1.02] hover:shadow-xl"
                    style={{ 
                      height: `${Math.max(12, (item.count / maxQueue) * 100)}%`,
                      opacity: item.count === 0 ? 0.3 : 1
                    }}
                  >
                    {item.count > 0 && (
                      <div className="flex h-full items-center justify-center">
                        <span className="text-lg font-extrabold text-white drop-shadow-md">
                          {item.count}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-center">
                  <span className="text-xs font-bold text-brand/50">{item.status}</span>
                  {item.count === 0 && (
                    <p className="mt-1 text-lg font-extrabold text-brand/30">0</p>
                  )}
                  {item.count > 0 && (
                    <p className="mt-1 text-lg font-extrabold text-brand">{item.count}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

import {
  ArrowUpRight,
  ContactRound,
  MoreHorizontal,
  ScanLine,
  Target,
} from "lucide-react";
import { useEffect, useState } from "react";
import { getDailyStats } from "../../services/scannerApi.js";

// Counter animation hook
function useCountUp(end, duration = 2000) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let startTime;
    let animationFrame;
    
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      setCount(Math.floor(progress * end));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    
    animationFrame = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [end, duration]);
  
  return count;
}

export function DashboardPage({ contacts, cards, dailyLimit, stats, usage }) {
  const [chartProgress, setChartProgress] = useState(0);
  const [dailyStatistics, setDailyStatistics] = useState({
    pending: 0,
    processing: 0,
    completed: 0,
    failed: 0,
    total: 0
  });

  // Animate chart fill on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setChartProgress(1);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Animated counters
  const animatedTotalScanned = useCountUp(stats.totalScanned, 2000);
  const animatedTotalContacts = useCountUp(stats.totalContacts, 2000);
  const animatedUsage = useCountUp(usage, 1500);
  const animatedDailyLimit = useCountUp(dailyLimit, 1500);

  useEffect(() => {
    const fetchDailyStats = async () => {
      try {
        const response = await getDailyStats();
        if (response.success && response.stats) {
          setDailyStatistics(response.stats);
        }
      } catch (error) {
        console.error('Failed to fetch daily stats:', error);
      }
    };

    fetchDailyStats();
    // Refresh every 30 seconds
    const interval = setInterval(fetchDailyStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const completedToday = cards.filter((card) => card.status === "Completed").length;
  const usagePercent = dailyLimit ? Math.min(100, Math.round((usage / dailyLimit) * 100)) : 0;
  const savedThisWeek = contacts.slice(0, 4);
  
  // Use browser session data for real-time queue statistics
  const statusData = ["Pending", "Processing", "Completed", "Failed"].map((status) => ({
    label: status,
    value: cards.filter((card) => card.status === status).length,
  }));
  const maxStatusCount = Math.max(...statusData.map((item) => item.value), 1);

  return (
    <div className="fade-slide space-y-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-normal text-brand sm:text-4xl">
            Scan Overview
          </h1>
          <p className="mt-2 text-sm font-medium text-brand/60">
            Analyze scans, OCR quality, and saved business card contacts.
          </p>
        </div>
      </div>

      <section className="grid gap-4 xl:grid-cols-[1.08fr_1fr_1fr]">
        <article className="dashboard-card overflow-hidden bg-accent p-5 text-brand">
          <div className="mb-8 flex items-start justify-between">
            <div>
              <p className="text-sm font-bold text-brand/70">Total Cards Scanned</p>
              <h2 className="mt-4 text-4xl font-extrabold tracking-normal">{animatedTotalScanned.toLocaleString()}</h2>
            </div>
            <button className="rounded-full bg-white/60 p-2 text-brand">
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
          <div className="inline-flex rounded-full bg-brand px-3 py-1.5 text-xs font-bold text-white">
            {completedToday} completed this session
          </div>
        </article>

        <article className="dashboard-card p-5">
          <div className="mb-8 flex items-start justify-between">
            <div>
              <p className="text-sm font-bold text-brand/60">Today Cards Scanned</p>
              <h2 className="mt-4 text-4xl font-extrabold tracking-normal text-brand">
                {useCountUp(dailyStatistics.total, 2000)}
              </h2>
            </div>
            <button className="rounded-full border border-brand/10 bg-white p-2 text-brand">
              <ScanLine className="h-4 w-4" />
            </button>
          </div>
          <div className="inline-flex rounded-full bg-accent/40 px-3 py-1.5 text-xs font-bold text-brand">
            {dailyStatistics.completed} completed • {dailyStatistics.failed} failed
          </div>
        </article>

        <article className="dashboard-card p-5">
          <div className="mb-5 flex items-start justify-between">
            <div>
              <p className="text-sm font-bold text-brand/60">Daily Scan Target</p>
              <h2 className="mt-4 text-4xl font-extrabold tracking-normal text-brand">{animatedUsage} / {animatedDailyLimit}</h2>
            </div>
            <button className="rounded-full border border-brand/10 bg-white p-2 text-brand">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-2">
            <div className="h-3 overflow-hidden rounded-full bg-brand/10">
              <div
                className="h-full rounded-full bg-brand transition-all duration-1000 ease-out"
                style={{ width: `${usagePercent * chartProgress}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] font-bold text-brand/50">
              <span>Used</span>
              <span>Remaining</span>
              <span>Target</span>
            </div>
          </div>
        </article>
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.85fr_1.65fr]">
        <article className="dashboard-card p-5">
          <div className="mb-5 flex items-start justify-between">
            <div>
              <h2 className="text-base font-extrabold text-brand">Language Distribution</h2>
              <p className="mt-1 text-xs font-semibold text-brand/50">Scanned cards by language</p>
            </div>
            <MoreHorizontal className="h-5 w-5 text-brand/50" />
          </div>

          {/* Donut Chart */}
          <div className="relative mx-auto h-48 w-48">
            <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
              {(() => {
                const languageData = [
                  { lang: "EN", count: contacts.filter(c => c.language === "EN").length, color: "#0E3438" },
                  { lang: "HI", count: contacts.filter(c => c.language === "HI").length, color: "#23979E" },
                  { lang: "GU", count: contacts.filter(c => c.language === "GU").length, color: "#F27A5E" }
                ];
                
                const total = languageData.reduce((sum, item) => sum + item.count, 0);
                if (total === 0) {
                  return (
                    <circle
                      cx="50"
                      cy="50"
                      r="35"
                      fill="none"
                      stroke="#E5E7EB"
                      strokeWidth="12"
                    />
                  );
                }
                
                const radius = 35;
                const circumference = 2 * Math.PI * radius;
                let currentAngle = 0;
                
                return languageData.map((item, index) => {
                  const percentage = (item.count / total) * 100;
                  const dashArray = (percentage / 100) * circumference * chartProgress;
                  const dashOffset = -currentAngle;
                  currentAngle += (percentage / 100) * circumference;
                  
                  if (item.count === 0) return null;
                  
                  return (
                    <circle
                      key={item.lang}
                      cx="50"
                      cy="50"
                      r={radius}
                      fill="none"
                      stroke={item.color}
                      strokeWidth="12"
                      strokeDasharray={`${dashArray} ${circumference}`}
                      strokeDashoffset={dashOffset}
                      style={{ 
                        transition: 'stroke-dasharray 1.5s ease-out, stroke-dashoffset 1.5s ease-out'
                      }}
                    />
                  );
                });
              })()}
              
              {/* Center circle for donut effect */}
              <circle cx="50" cy="50" r="23" fill="white" />
            </svg>
            
            {/* Center text with animation */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-3xl font-extrabold text-brand">{useCountUp(contacts.length, 2000)}</p>
              <p className="text-xs font-bold text-brand/50">Total Cards</p>
            </div>
          </div>

          {/* Legend */}
          <div className="mt-6 space-y-2">
            {[
              { lang: "EN", label: "English", color: "#0E3438" },
              { lang: "HI", label: "Hindi", color: "#23979E" },
              { lang: "GU", label: "Gujarati", color: "#F27A5E" }
            ].map((item) => {
              const count = contacts.filter(c => c.language === item.lang).length;
              const animatedCount = useCountUp(count, 2000);
              const percentage = contacts.length > 0 ? ((count / contacts.length) * 100).toFixed(1) : 0;
              
              return (
                <div key={item.lang} className="flex items-center justify-between rounded-xl bg-surface/50 px-3 py-2">
                  <div className="flex items-center gap-2">
                    <div 
                      className="h-3 w-3 rounded-full transition-all duration-1000" 
                      style={{ 
                        backgroundColor: item.color,
                        transform: `scale(${chartProgress})`
                      }}
                    />
                    <span className="text-sm font-semibold text-brand/75">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-extrabold text-brand">{animatedCount}</span>
                    <span className="text-xs font-bold text-brand/50">({percentage}%)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </article>

        <article className="dashboard-card p-5">
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-base font-extrabold text-brand">Queue Statistics</h2>
              <p className="mt-1 text-xs font-semibold text-brand/50">Live status from current session</p>
            </div>
          </div>

          <div className="flex h-72 items-end gap-3 rounded-[22px] bg-surface/70 px-4 py-5">
            {statusData.map((item) => (
              <div className="relative flex h-full flex-1 flex-col justify-end gap-3" key={item.label}>
                <div className="flex flex-1 items-end">
                  <div
                    className="w-full rounded-t-2xl bg-[repeating-linear-gradient(-45deg,#23979E_0,#23979E_5px,#0E3438_5px,#0E3438_10px)]"
                    style={{ height: `${Math.max(8, (item.value / maxStatusCount) * 100)}%` }}
                  />
                </div>
                <span className="text-center text-[11px] font-bold text-brand/50">{item.label}</span>
                <span className="text-center text-sm font-extrabold text-brand">{item.value}</span>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="dashboard-card p-5">
          <div className="mb-4 flex items-center gap-3">
            <span className="rounded-2xl bg-accent/40 p-3 text-brand">
              <ScanLine className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-base font-extrabold text-brand">Queue Health</h2>
              <p className="text-xs font-semibold text-brand/50">Cards move through pending, processing, completed.</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {["Pending", "Processing", "Completed", "Failed"].map((status) => (
              <div className="rounded-2xl bg-surface/70 p-4 text-center" key={status}>
                <p className="text-2xl font-extrabold text-brand">
                  {cards.filter((card) => card.status === status).length}
                </p>
                <p className="mt-1 text-xs font-bold text-brand/50">{status}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="dashboard-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-brand">Recent Contacts</h2>
              <p className="text-xs font-semibold text-brand/50">Latest saved business cards</p>
            </div>
            <Target className="h-5 w-5 text-brand/50" />
          </div>
          <div className="space-y-2">
            {savedThisWeek.length > 0 ? savedThisWeek.map((contact) => (
              <div className="flex items-center gap-3 rounded-2xl bg-surface/70 p-3" key={contact.id}>
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
                  {contact.name
                    .split(" ")
                    .map((part) => part[0])
                    .join("")
                    .slice(0, 2)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-extrabold text-brand">{contact.name}</p>
                  <p className="truncate text-xs font-semibold text-brand/50">{contact.company}</p>
                </div>
                <span className="rounded-full bg-accent/50 px-2.5 py-1 text-[11px] font-extrabold text-brand">
                  {contact.language}
                </span>
              </div>
            )) : (
              <div className="rounded-2xl border border-dashed border-brand/15 bg-surface/70 p-4 text-sm font-semibold text-brand/50">
                No saved contacts yet.
              </div>
            )}
          </div>
        </article>
      </section>
    </div>
  );
}

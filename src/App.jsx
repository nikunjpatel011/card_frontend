import { useState } from "react";
import { Menu } from "lucide-react";
import { Sidebar } from "./components/layout/Sidebar.jsx";
import { AnalyticsPage } from "./features/analytics/AnalyticsPage.jsx";
import { DashboardPage } from "./features/dashboard/DashboardPage.jsx";
import { ScanCardsPage } from "./features/scanner/ScanCardsPage.jsx";
import { SettingsPage } from "./features/settings/SettingsPage.jsx";
import { useScannerWorkflow } from "./hooks/useScannerWorkflow.js";

export default function App() {
  const [activePage, setActivePage] = useState("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const scanner = useScannerWorkflow();

  const handleNavigate = (page) => {
    setActivePage(page);
    setMobileMenuOpen(false);
  };

  const renderPage = () => {
    if (activePage === "dashboard") {
      return (
        <DashboardPage
          cards={scanner.cards}
          contacts={scanner.contacts}
          dailyLimit={scanner.dailyLimit}
          stats={scanner.stats}
          usage={scanner.usage}
        />
      );
    }

    if (activePage === "analytics") {
      return (
        <AnalyticsPage
          cards={scanner.cards}
          contacts={scanner.contacts}
          usage={scanner.usage}
        />
      );
    }

    if (activePage === "settings") {
      return <SettingsPage limit={scanner.dailyLimit} usage={scanner.usage} />;
    }

    return <ScanCardsPage scanner={scanner} />;
  };

  return (
    <div className="app-shell min-h-screen font-sans text-ink">
      <Sidebar
        activePage={activePage}
        limit={scanner.dailyLimit}
        mobileOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        onNavigate={handleNavigate}
        usage={scanner.usage}
      />
      <div className="relative z-10 min-h-screen w-full lg:pl-72">
        <div className="mx-auto min-h-screen w-full max-w-[1440px] px-3 py-4 sm:px-5 lg:px-8">
          {/* Mobile Menu Button */}
          <div className="mb-4 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-brand/10 bg-white text-brand shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              type="button"
              aria-label="Open navigation"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
          
          <main className="pt-5">
            {renderPage()}
          </main>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { Menu, LogOut } from "lucide-react";
import { Sidebar } from "./components/layout/Sidebar.jsx";
import { AnalyticsPage } from "./features/analytics/AnalyticsPage.jsx";
import { DashboardPage } from "./features/dashboard/DashboardPage.jsx";
import { ScanCardsPage } from "./features/scanner/ScanCardsPage.jsx";
import { SettingsPage } from "./features/settings/SettingsPage.jsx";
import { LoginPage } from "./features/auth/LoginPage.jsx";
import { useScannerWorkflow } from "./hooks/useScannerWorkflow.js";
import { checkAuth, logout } from "./services/scannerApi.js";

export default function App() {
  const [activePage, setActivePage] = useState("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const scanner = useScannerWorkflow(isAuthenticated && !authChecking);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const response = await checkAuth();
        
        // If auth is disabled on backend, allow access
        if (!response.authEnabled) {
          setIsAuthenticated(true);
          setAuthChecking(false);
          return;
        }
        
        setIsAuthenticated(response.authenticated);
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setAuthChecking(false);
      }
    };

    verifyAuth();
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsAuthenticated(false);
      setActivePage("dashboard");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleNavigate = (page) => {
    setActivePage(page);
    setMobileMenuOpen(false);
  };

  // Show loading while checking auth
  if (authChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-surface via-white to-accent/10">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-brand border-r-transparent"></div>
          <p className="mt-4 text-sm font-semibold text-brand/60">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  const renderPage = () => {
    if (activePage === "dashboard") {
      return (
        <DashboardPage
          cards={scanner.cards}
          contacts={scanner.contacts}
          dailyLimit={scanner.dailyLimit}
          stats={scanner.stats}
          usage={scanner.usage}
          dbStats={scanner.dbStats}
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
          <div className="mb-4 flex items-center justify-between lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-brand/10 bg-white text-brand shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              type="button"
              aria-label="Open navigation"
            >
              <Menu className="h-5 w-5" />
            </button>
            
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-full border border-brand/10 bg-white px-4 py-2 text-sm font-semibold text-brand shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              type="button"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>

          {/* Desktop Logout Button */}
          <div className="hidden lg:flex justify-end mb-4">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-full border border-brand/10 bg-white px-4 py-2 text-sm font-semibold text-brand shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              type="button"
            >
              <LogOut className="h-4 w-4" />
              Logout
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

import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { AppShell } from './components/layout/AppShell';

// Pages
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Portfolio } from './pages/Portfolio';
import { CashFlow } from './pages/CashFlow';
import { Opportunities } from './pages/Opportunities';
import { Projects } from './pages/Projects';
import { Investors } from './pages/Investors';
import { Assets } from './pages/Assets';
import { LandAndProperty } from './pages/LandAndProperty';
import { ColdStorage } from './pages/ColdStorage';
import { Leases } from './pages/Leases';
import { Microfinance } from './pages/Microfinance';
import { MachineryHire } from './pages/MachineryHire';
import { WorkforceHire } from './pages/WorkforceHire';
import { Equity } from './pages/Equity';
import { Currency } from './pages/Currency';
import { Accounts } from './pages/Accounts';
import { Transactions } from './pages/Transactions';
import { Reports } from './pages/Reports';
import { UsersAndRoles } from './pages/UsersAndRoles';
import { AuditLog } from './pages/AuditLog';
import { Settings } from './pages/Settings';

export const App: React.FC = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!isAuthenticated) {
    return <Login onSuccess={() => navigate('/')} />;
  }

  const renderContent = () => {
    switch (currentPath) {
      case '/':
      case '/dashboard':
        return <Dashboard onNavigate={navigate} />;
      case '/portfolio':
        return <Portfolio />;
      case '/cash-flow':
        return <CashFlow />;
      case '/opportunities':
        return <Opportunities />;
      case '/projects':
        return <Projects />;
      case '/investors':
        return <Investors />;
      case '/assets':
        return <Assets />;
      case '/properties':
        return <LandAndProperty />;
      case '/cold-storage':
        return <ColdStorage />;
      case '/leases':
        return <Leases />;
      case '/microfinance':
        return <Microfinance />;
      case '/machinery':
        return <MachineryHire />;
      case '/workforce':
        return <WorkforceHire />;
      case '/stocks':
        return <Equity />;
      case '/currency':
        return <Currency />;
      case '/accounts':
        return <Accounts />;
      case '/transactions':
        return <Transactions />;
      case '/reports':
      case '/reports/portfolio':
      case '/reports/projects':
      case '/reports/cash-flow':
      case '/reports/assets':
      case '/reports/investors':
      case '/reports/microfinance':
      case '/reports/rental':
      case '/reports/profit-loss':
        return <Reports />;
      case '/admin/users':
        return isAdmin ? <UsersAndRoles /> : <Dashboard onNavigate={navigate} />;
      case '/audit':
        return isAdmin ? <AuditLog /> : <Dashboard onNavigate={navigate} />;
      case '/settings':
        return isAdmin ? <Settings /> : <Dashboard onNavigate={navigate} />;
      default:
        return <Dashboard onNavigate={navigate} />;
    }
  };

  return (
    <AppShell currentPath={currentPath} onNavigate={navigate}>
      {renderContent()}
    </AppShell>
  );
};
export default App;

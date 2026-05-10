// MathSprout — Root: providers + router + auth-guarded routes

import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import { AppProvider, useApp } from './context/app-context.jsx';
import { ToastProvider } from './components/ui/toast.jsx';

import WelcomePage from './pages/welcome-page.jsx';
import SignupPage from './pages/signup-page.jsx';
import DashboardPage from './pages/dashboard-page.jsx';
import PracticePage from './pages/practice-page.jsx';
import ResultPage from './pages/result-page.jsx';
import SkillMapPage from './pages/skill-map-page.jsx';
import ProgressPage from './pages/progress-page.jsx';
import AchievementsPage from './pages/achievements-page.jsx';
import SettingsPage from './pages/settings-page.jsx';
import ChatPage from './pages/chat-page.jsx';
import RewardsPage from './pages/rewards-page.jsx';
import ShopPage from './pages/shop-page.jsx';

function RequireUser({ children }) {
  const { state } = useApp();
  if (!state.user) return <Navigate to="/" replace />;
  return children;
}

function RedirectIfUser({ children }) {
  const { state } = useApp();
  if (state.user) return <Navigate to="/dashboard" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RedirectIfUser><WelcomePage /></RedirectIfUser>} />
      <Route path="/signup" element={<RedirectIfUser><SignupPage /></RedirectIfUser>} />
      <Route path="/dashboard" element={<RequireUser><DashboardPage /></RequireUser>} />
      <Route path="/practice" element={<RequireUser><PracticePage /></RequireUser>} />
      <Route path="/result" element={<RequireUser><ResultPage /></RequireUser>} />
      <Route path="/skill-map" element={<RequireUser><SkillMapPage /></RequireUser>} />
      <Route path="/progress" element={<RequireUser><ProgressPage /></RequireUser>} />
      <Route path="/achievements" element={<RequireUser><AchievementsPage /></RequireUser>} />
      <Route path="/rewards" element={<RequireUser><RewardsPage /></RequireUser>} />
      <Route path="/shop" element={<RequireUser><ShopPage /></RequireUser>} />
      <Route path="/settings" element={<RequireUser><SettingsPage /></RequireUser>} />
      <Route path="/chat" element={<RequireUser><ChatPage /></RequireUser>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AppProvider>
      <ToastProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ToastProvider>
    </AppProvider>
  );
}

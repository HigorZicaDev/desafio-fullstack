import { Route, Routes, Navigate } from 'react-router-dom';
import Profile from './pages/Profile';
import Plans from './pages/Plans';
import SignaturesPage from './pages/Signatures';
import { useApp } from './context/AppContext';

function ProtectedRoute({ children, condition }: { children: JSX.Element, condition: boolean }) {
  if (!condition) {
    return <Navigate to="/plans" replace />;
  }
  return children;
}

export function Router() {
  const { currentPlan } = useApp();
  const userHasActivePlan = !!currentPlan;

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/profile" />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/plans" element={<Plans />} />

      <Route
        path="/signatures"
        element={
          <ProtectedRoute condition={userHasActivePlan}>
            <SignaturesPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

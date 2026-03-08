import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import "./styles/global.scss";

const PolicyDashboard = React.lazy(() =>
  import("policyDashboard/PolicyDashboard")
);
const PremiumPayment = React.lazy(() =>
  import("premiumPayment/PremiumPayment")
);

const Loading = () => (
  <div className="container-loading">
    <div className="spinner"></div>
    <p>Loading module...</p>
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Header />
        <main className="app-main">
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<PolicyDashboard />} />
              <Route path="/payment" element={<PremiumPayment />} />
            </Routes>
          </Suspense>
        </main>
        <footer className="app-footer">
          <p>&copy; 2026 SecureLife Insurance. All rights reserved.</p>
        </footer>
      </div>
    </BrowserRouter>
  );
}

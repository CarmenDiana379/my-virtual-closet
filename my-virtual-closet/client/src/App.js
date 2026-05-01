import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { WardrobeProvider } from "./store/WardrobeStore";

import ProtectedRoute from "./components/ProtectedRoute";

import HomePage from "./pages/HomePage";
import SignupPage from "./pages/SignupPage";
import StyleSelectionPage from "./pages/StyleSelectionPage";
import DashboardPage from "./pages/DashboardPage";

import WardrobeCheckPage from "./pages/WardrobeCheckPage";
import WardrobePlanningPage from "./pages/WardrobePlanningPage";
import WishlistPage from "./pages/WishlistPage";
import SellPage from "./pages/SellPage";
import RecyclePage from "./pages/RecyclePage";
import BinPage from "./pages/BinPage";

function App() {
  return (
    <WardrobeProvider>
      <Router>

        <Routes>

          {/* PUBLIC */}
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/choose-style" element={<StyleSelectionPage />} />

          {/* PROTECTED */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/wardrobe-check"
            element={
              <ProtectedRoute>
                <WardrobeCheckPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/wardrobe-planning"
            element={
              <ProtectedRoute>
                <WardrobePlanningPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/wishlist"
            element={
              <ProtectedRoute>
                <WishlistPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/sell"
            element={
              <ProtectedRoute>
                <SellPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/recycle"
            element={
              <ProtectedRoute>
                <RecyclePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/bin"
            element={
              <ProtectedRoute>
                <BinPage />
              </ProtectedRoute>
            }
          />

        </Routes>

      </Router>
    </WardrobeProvider>
  );
}

export default App;
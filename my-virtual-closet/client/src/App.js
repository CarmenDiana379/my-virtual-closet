import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { WardrobeProvider } from "./store/WardrobeStore";

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
import ActivityTimelinePage from "./pages/ActivityTimelinePage";

import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminRoute from "./components/AdminRoute";
import SustainabilityDashboardPage from "./pages/SustainabilityDashboardPage";
import ContactPage from "./pages/ContactPage";
import SubscribePage from "./pages/SubscribePage";
import FAQPage from "./pages/FAQPage";

function App() {
  return (
    <WardrobeProvider>
      <Router>
        <Routes>
          {/* PUBLIC ROUTES */}

          <Route path="/" element={<HomePage />} />

          <Route path="/signup" element={<SignupPage />} />

          <Route path="/choose-style" element={<StyleSelectionPage />} />

          {/* USER ROUTES */}

          <Route path="/dashboard" element={<DashboardPage />} />

          <Route path="/wardrobe-check" element={<WardrobeCheckPage />} />

          <Route path="/wardrobe-planning" element={<WardrobePlanningPage />} />

          <Route path="/wishlist" element={<WishlistPage />} />

          <Route path="/sell" element={<SellPage />} />

          <Route path="/recycle" element={<RecyclePage />} />

          <Route path="/bin" element={<BinPage />} />

          <Route path="/activity-timeline" element={<ActivityTimelinePage />} />
          <Route path="/contact" element={<ContactPage />} />

<Route path="/subscribe" element={<SubscribePage />} />

<Route path="/faq" element={<FAQPage />} />
          <Route
          
  path="/sustainability-dashboard"
  element={<SustainabilityDashboardPage />}
/>

          {/* ADMIN ROUTE */}

          <Route
            path="/admin-dashboard"
            element={
              <AdminRoute>
                <AdminDashboardPage />
              </AdminRoute>
            }
          />
        </Routes>
      </Router>
    </WardrobeProvider>
  );
}

export default App;
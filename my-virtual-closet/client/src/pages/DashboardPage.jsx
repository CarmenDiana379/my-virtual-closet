import React from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import PageLayout from "../components/PageLayout";

import { auth } from "../firebase";
import Wardrobe from "../components/Wardrobe";
import FeatureIcons from "../components/FeatureIcons";
import { useTheme } from "../store/ThemeStore";
import { useWardrobe } from "../store/WardrobeStore";


function DashboardPage() {
  const navigate = useNavigate();

  const { theme, selectedTheme } = useTheme();

  const {
    items,
    wishlistItems,
    recycleItems,
    savedOutfits,
    sellItems
  } = useWardrobe();

  const sustainabilityScore = Math.min(
    recycleItems.length * 12 + savedOutfits.length * 6,
    100
  );

  const badges = [];

  if (recycleItems.length >= 1) {
    badges.push("♻️ Eco Starter");
  }

  if (recycleItems.length >= 5) {
    badges.push("🌿 Recycling Expert");
  }

  if (savedOutfits.length >= 3) {
    badges.push("👗 Outfit Creator");
  }

  if (items.length >= 15) {
    badges.push("🧥 Wardrobe Builder");
  }

  if (wishlistItems.length <= 5) {
    badges.push("🛍 Conscious Shopper");
  }
  const categoryCounts = items.reduce((counts, item) => {
  counts[item.category] = (counts[item.category] || 0) + 1;
  return counts;
}, {});

const overloadedCategories = Object.entries(categoryCounts).filter(
  ([category, count]) => count >= 10
);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      alert(error.message);
    }
  };

  const statCard = (title, value, icon) => (
    <div
      style={{
        border: `3px solid ${theme.border}`,
        background: theme.card,
        borderRadius: theme.radius,
        padding: "22px",
        textAlign: "center",
        minHeight: "120px"
      }}
    >
      <h2 style={{ marginBottom: "8px" }}>
        {icon} {value}
      </h2>

      <p style={{ margin: 0, fontWeight: "bold" }}>{title}</p>
    </div>
  );

  return (
    <div
      style={{
        fontFamily: theme.font,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background:
          theme.pattern !== "none"
            ? theme.pattern
            : theme.background,
        backgroundSize: "40px 40px",
        color: theme.text
      }}
    >
      <div
        style={{
          padding: "20px",
          borderBottom: `4px solid ${theme.border}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: theme.card
        }}
      >
        <div
  style={{
    display: "flex",
    alignItems: "center",
    gap: "12px"
  }}
>
  <img
    src="/images/logo1.png"
    alt="My Virtual Closet Logo"
    style={{
      width: "250px",
      height: "110px",
      objectFit: "contain"
    }}
  />

  <small>{selectedTheme}</small>
</div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={() => navigate("/choose-style")}
            style={{
              background: theme.accent,
              border: `2px solid ${theme.border}`,
              color: theme.text,
              borderRadius: theme.radius,
              padding: "8px 14px",
              fontWeight: "bold"
            }}
          >
            Change Style
          </button>

          <button
            onClick={handleLogout}
            style={{
              background: theme.accent,
              border: `2px solid ${theme.border}`,
              color: theme.text,
              borderRadius: theme.radius,
              padding: "8px 14px",
              fontWeight: "bold"
            }}
          >
            Logout
          </button>
        </div>
      </div>

      <div
        style={{
          flex: 1,
          padding: "30px",
          textAlign: "center"
        }}
      >
        <div
          style={{
            border: `4px solid ${theme.border}`,
            background: theme.card,
            borderRadius: theme.radius,
            padding: "24px",
            maxWidth: "1450px",
            margin: "0 auto",
            boxShadow:
              selectedTheme === "Y2K"
                ? "0 0 25px pink"
                : selectedTheme === "Gothic"
                ? "none"
                : selectedTheme === "Scene"
                ? "0 0 20px #00ccff"
                : "none"
          }}
        >
          <h1>
            {theme.symbol} Welcome to your wardrobe {theme.symbol}
          </h1>

          <p>
            Intelligent wardrobe management and sustainable fashion planning.
          </p>

          {/* QUICK ACTIONS */}

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "12px",
              flexWrap: "wrap",
              marginTop: "25px",
              marginBottom: "35px"
            }}
          >
            {[
  ["Add Item", "/wardrobe-check"],
  ["Create Outfit", "/wardrobe-planning"],
  ["Saved Outfits", "/wardrobe-planning"],
  ["Activity Timeline", "/activity-timeline"],
  ["Sustainability", "/sustainability-dashboard"],
  ["Wishlist", "/wishlist"],
  ["Recycle", "/recycle"],
  ["Sell Items", "/sell"]
].map(([label, path]) => (
              <button
                key={label}
                onClick={() => navigate(path)}
                style={{
                  padding: "12px 18px",
                  border: `2px solid ${theme.border}`,
                  background: theme.accent,
                  color: theme.text,
                  borderRadius: theme.radius,
                  fontWeight: "bold",
                  cursor: "pointer"
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* STATISTICS */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "16px",
              marginBottom: "35px"
            }}
          >
            {statCard(
              "Wardrobe Items",
              items.length,
              "👕"
            )}

            {statCard(
              "Wishlist",
              wishlistItems.length,
              "🛍"
            )}

            {statCard(
              "Saved Outfits",
              savedOutfits.length,
              "👗"
            )}

            {statCard(
              "Recycle Items",
              recycleItems.length,
              "♻️"
            )}

            {statCard(
              "Selling Items",
              sellItems.length,
              "💸"
            )}
          </div>

          {/* SUSTAINABILITY */}

          <div
            style={{
              border: `3px solid ${theme.border}`,
              background: theme.background,
              borderRadius: theme.radius,
              padding: "25px",
              marginBottom: "35px"
            }}
          >
            <h2>🌿 Sustainability Score</h2>

            <div
              style={{
                height: "24px",
                background: "#d1d5db",
                borderRadius: "30px",
                overflow: "hidden",
                maxWidth: "700px",
                margin: "20px auto"
              }}
            >
              <div
                style={{
                  width: `${sustainabilityScore}%`,
                  height: "100%",
                  background:
                    "linear-gradient(135deg, #10b981, #14b8a6)"
                }}
              />
            </div>

            <h1>{sustainabilityScore}/100</h1>

            <p>
              Your sustainability score is based on outfit
              reuse and recycling behaviour.
            </p>
          </div>

          {/* BADGES */}

          <div
            style={{
              border: `3px solid ${theme.border}`,
              background: theme.background,
              borderRadius: theme.radius,
              padding: "25px",
              marginBottom: "35px"
            }}
          >
            <h2>🏆 Achievements & Badges</h2>

            {badges.length === 0 ? (
              <p>No badges unlocked yet.</p>
            ) : (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "12px",
                  flexWrap: "wrap",
                  marginTop: "20px"
                }}
              >
                {badges.map((badge) => (
                  <div
                    key={badge}
                    style={{
                      padding: "12px 18px",
                      border: `2px solid ${theme.border}`,
                      borderRadius: theme.radius,
                      background: theme.card,
                      fontWeight: "bold"
                    }}
                  >
                    {badge}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* MINDFUL WARDROBE WARNINGS */}

{(wishlistItems.length >= 10 || overloadedCategories.length > 0) && (
  <div
    style={{
      border: `3px solid ${theme.border}`,
      background: theme.background,
      borderRadius: theme.radius,
      padding: "25px",
      marginBottom: "35px",
      textAlign: "left"
    }}
  >
    <h2>⚠️ Mindful Wardrobe Reminder</h2>

    {wishlistItems.length >= 10 && (
      <p>
        Your wishlist currently has <strong>{wishlistItems.length}</strong>{" "}
        items. This may suggest planned overconsumption, so consider reviewing
        whether each item is truly needed before buying more.
      </p>
    )}

    {overloadedCategories.map(([category, count]) => (
      <p key={category}>
        You currently have <strong>{count}</strong> items in{" "}
        <strong>{category}</strong>. This may be more than needed, so consider
        styling what you already own, recycling unused pieces, or moving suitable
        items to sell.
      </p>
    ))}
  </div>
)}

          {/* SMART OUTFIT ENGINE */}

          <div
            style={{
              border: `3px solid ${theme.border}`,
              background: theme.background,
              borderRadius: theme.radius,
              padding: "25px",
              marginBottom: "35px"
            }}
          >
            <h2>✨ Smart Outfit Recommendation</h2>

            <p>
              Use the outfit planner to generate intelligent
              outfit combinations based on your wardrobe items,
              season and occasion.
            </p>

            <button
              onClick={() => navigate("/wardrobe-planning")}
              style={{
                marginTop: "12px",
                padding: "12px 18px",
                border: `2px solid ${theme.border}`,
                background: theme.accent,
                color: theme.text,
                borderRadius: theme.radius,
                fontWeight: "bold",
                cursor: "pointer"
              }}
            >
              Open Outfit Planner
            </button>
          </div>

          <Wardrobe />
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          paddingBottom: "20px"
        }}
      >
        <FeatureIcons />
      </div>

      <div
        style={{
          borderTop: `4px solid ${theme.border}`,
          padding: "15px 20px",
          display: "flex",
          justifyContent: "space-between",
          background: theme.card
        }}
      >
      
        <div style={{ display: "flex", gap: "12px" }}>
  <a
    href="https://www.facebook.com"
    target="_blank"
    rel="noopener noreferrer"
    style={{ color: "inherit", textDecoration: "none" }}
  >
    Facebook
  </a>

  <a
    href="https://www.instagram.com"
    target="_blank"
    rel="noopener noreferrer"
    style={{ color: "inherit", textDecoration: "none" }}
  >
    Instagram
  </a>

  <a
    href="https://www.tiktok.com"
    target="_blank"
    rel="noopener noreferrer"
    style={{ color: "inherit", textDecoration: "none" }}
  >
    TikTok
  </a>
</div>

        <div
  style={{
    display: "flex",
    gap: "14px",
    alignItems: "center"
  }}
>
  <span
    onClick={() => navigate("/contact")}
    style={{ cursor: "pointer" }}
  >
    Contact Us
  </span>

  <span
    onClick={() => navigate("/subscribe")}
    style={{ cursor: "pointer" }}
  >
    Subscribe
  </span>

  <span
    onClick={() => navigate("/faq")}
    style={{ cursor: "pointer" }}
  >
    FAQ
  </span>

  {theme.symbol}
</div>
      </div>
    </div>
  );
}

export default DashboardPage;
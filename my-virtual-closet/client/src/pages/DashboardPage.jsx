import React from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";

import { auth } from "../firebase";
import Wardrobe from "../components/Wardrobe";
import FeatureIcons from "../components/FeatureIcons";
import { useTheme } from "../store/ThemeStore";

function DashboardPage() {
  const navigate = useNavigate();
  const { theme, selectedTheme } = useTheme();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div
      style={{
        fontFamily: theme.font,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: theme.pattern !== "none" ? theme.pattern : theme.background,
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
        <div>
          <h2 style={{ margin: 0 }}>
            {theme.symbol} LOGO {theme.symbol}
          </h2>
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
            padding: "20px",
            maxWidth: "1400px",
            margin: "0 auto",
            boxShadow:
              selectedTheme === "Y2K"
                ? "0 0 25px pink"
                : selectedTheme === "Gothic"
                ? "0 0 20px red"
                : selectedTheme === "Scene"
                ? "0 0 20px #00ccff"
                : "none"
          }}
        >
          <h1>
            {theme.symbol} Welcome to your wardrobe {theme.symbol}
          </h1>

          <p>Create outfits by mixing items in your wardrobe</p>

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
        <div>{theme.symbol} Facebook Instagram TikTok</div>
        <div>Contact Us | Subscribe | FAQ {theme.symbol}</div>
      </div>
    </div>
  );
}

export default DashboardPage;
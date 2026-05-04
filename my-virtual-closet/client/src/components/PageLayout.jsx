import { useNavigate } from "react-router-dom";
import FeatureIcons from "./FeatureIcons";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useTheme } from "../store/ThemeStore";

function PageLayout({ title, children, showDashboardButton = true }) {
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
      {/* NAVBAR */}
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
          {showDashboardButton && (
            <button
              onClick={() => navigate("/dashboard")}
              style={{
                background: theme.accent,
                border: `2px solid ${theme.border}`,
                padding: "8px 14px",
                color: theme.text,
                borderRadius: theme.radius,
                fontWeight: "bold"
              }}
            >
              Dashboard
            </button>
          )}

          <button
            onClick={handleLogout}
            style={{
              background: theme.accent,
              border: `2px solid ${theme.border}`,
              padding: "8px 14px",
              color: theme.text,
              borderRadius: theme.radius,
              fontWeight: "bold"
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div
        style={{
          flex: 1,
          textAlign: "center",
          padding: "40px"
        }}
      >
        <div
          style={{
            border: `4px solid ${theme.border}`,
            background: theme.card,
            padding: "25px",
            maxWidth: "1300px",
            margin: "0 auto",
            borderRadius: theme.radius,
            boxShadow:
              selectedTheme === "Y2K"
                ? "0 0 20px pink"
                : selectedTheme === "Gothic"
                ? "0 0 15px red"
                : "none"
          }}
        >
          <h1>
            {theme.symbol} {title} {theme.symbol}
          </h1>

          {children}
        </div>
      </div>

      {/* ICON ROW */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          paddingBottom: "20px"
        }}
      >
        <FeatureIcons />
      </div>

      {/* FOOTER */}
      <div
        style={{
          borderTop: `4px solid ${theme.border}`,
          padding: "15px 20px",
          display: "flex",
          justifyContent: "space-between",
          background: theme.card
        }}
      >
        <div>
          {theme.symbol} Facebook Instagram TikTok
        </div>

        <div>
          Contact Us | Subscribe | FAQ {theme.symbol}
        </div>
      </div>
    </div>
  );
}

export default PageLayout;
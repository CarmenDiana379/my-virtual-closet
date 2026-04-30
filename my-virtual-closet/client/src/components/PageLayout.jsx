import { useNavigate } from "react-router-dom";
import FeatureIcons from "./FeatureIcons";

function PageLayout({ title, children, showDashboardButton = true }) {
  const navigate = useNavigate();

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column"
      }}
    >
      {/* HEADER */}
      <div
        style={{
          padding: "20px",
          borderBottom: "1px solid black",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <h2>LOGO</h2>

        {showDashboardButton && (
          <button onClick={() => navigate("/dashboard")}>
            Dashboard
          </button>
        )}
      </div>

      {/* PAGE CONTENT */}
      <div
        style={{
          flex: 1,
          textAlign: "center",
          padding: "40px"
        }}
      >
        <h1>{title}</h1>

        {children}
      </div>

      {/* FEATURE BUTTONS */}
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
          borderTop: "1px solid black",
          padding: "15px 20px",
          display: "flex",
          justifyContent: "space-between"
        }}
      >
        <div>Facebook Instagram TikTok</div>
        <div>Contact Us | Subscribe | FAQ</div>
      </div>
    </div>
  );
}

export default PageLayout;
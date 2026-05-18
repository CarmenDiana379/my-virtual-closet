import { useNavigate } from "react-router-dom";
import { useTheme } from "../store/ThemeStore";

function FeatureIcons() {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const features = [
    {
      label: "Wardrobe Check",
      icon: "👕",
      path: "/wardrobe-check"
    },
    {
      label: "Wardrobe Planning",
      icon: "✨",
      path: "/wardrobe-planning"
    },
    {
      label: "Wishlist",
      icon: "💖",
      path: "/wishlist"
    },
    {
      label: "Sell",
      icon: "💸",
      path: "/sell"
    },
    {
      label: "Recycle",
      icon: "♻️",
      path: "/recycle"
    },
    {
      label: "Bin",
      icon: "🗑️",
      path: "/bin"
    },
    {
      label: "Activity Timeline",
      icon: "📈",
      path: "/activity-timeline"
    },
    {
      label: "Sustainability",
      icon: "🌿",
      path: "/sustainability-dashboard"
    }
  ];

  return (
    <div
      style={{
        display: "flex",
justifyContent: "center",
alignItems: "center",
gap: "18px",
width: "100%",
flexWrap: "nowrap",
overflowX: "auto",
padding: "10px 20px"
      }}
    >
      {features.map((feature) => (
        <button
          key={feature.label}
          onClick={() => navigate(feature.path)}
          style={{
            border: `2px solid ${theme.border}`,
            background: theme.card,
            color: theme.text,
            borderRadius: theme.radius,
            padding: "18px 14px",
            cursor: "pointer",
            transition: "0.2s",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
            fontWeight: "bold",
            minHeight: "120px",
            minWidth: "150px",
flexShrink: 0,
            boxShadow: "0 6px 14px rgba(0,0,0,0.08)"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-4px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0px)";
          }}
        >
          <span style={{ fontSize: "34px" }}>{feature.icon}</span>

          <span>{feature.label}</span>
        </button>
      ))}
    </div>
  );
}

export default FeatureIcons;
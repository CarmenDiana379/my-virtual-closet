import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../store/ThemeStore";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";

function StyleSelectionPage() {
  const navigate = useNavigate();
  const { saveTheme, themes, selectedTheme } = useTheme();

  const [selectedStyle, setSelectedStyle] = useState(selectedTheme);

  const styles = [
    "Minimalistic Chic",
    "Urban Streetwear",
    "Y2K",
    "Coquette",
    "Scene",
    "Gothic",
    "Vintage Revival",
    "Activewear / Sports",
    "Preppy",
    "Smart / Professional",
    "Tech Futuristic",
    "Sustainable Eco"
  ];

  const descriptions = {
    "Minimalistic Chic":
      "Simple, clean and neutral for a calm wardrobe experience.",
    "Urban Streetwear":
      "Strong, bold and edgy with high-contrast streetwear styling.",
    Y2K:
      "Glossy, playful and bling-inspired with bright nostalgic colour.",
    Coquette:
      "Soft, romantic and delicate with pink tones and bow-like styling.",
    Scene:
      "Bold, chaotic, neon and expressive with animal-print energy.",
    Gothic:
      "Dark, dramatic and atmospheric with gothic contrast and web details.",
    "Vintage Revival":
      "Warm, nostalgic and retro with earthy tones and soft textures.",
    "Activewear / Sports":
      "Fresh, energetic and practical with bright sporty contrast.",
    Preppy:
      "Clean, polished and structured with academic-inspired colours.",
    "Smart / Professional":
      "Neat, calm and formal with a professional interface feel.",
    "Tech Futuristic":
      "Digital, neon and holographic, inspired by futuristic interfaces.",
    "Sustainable Eco":
      "Calm, ethical and nature-inspired, supporting mindful clothing choices."
  };

  const handleStyleSelect = async (style) => {
    setSelectedStyle(style);
    await saveTheme(style);
    navigate("/dashboard");
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const getDoorBackground = (styleName, side) => {
    const theme = themes[styleName];

    if (styleName === "Y2K") {
      return side === "left"
        ? "linear-gradient(135deg, #ffb3f1, #b3f0ff, #ffff66)"
        : "linear-gradient(135deg, #ffff66, #b3f0ff, #ffb3f1)";
    }

    if (styleName === "Gothic") {
      return side === "left"
        ? "radial-gradient(circle at top, #3b0a45, #000000 65%)"
        : "radial-gradient(circle at top, #000000, #3b0a45 80%)";
    }

    if (styleName === "Scene") {
      return side === "left"
        ? "repeating-linear-gradient(45deg, #00ff99 0px, #00ff99 12px, #ff00ff 12px, #ff00ff 24px)"
        : "repeating-linear-gradient(-45deg, #00ccff 0px, #00ccff 12px, #ff00ff 12px, #ff00ff 24px)";
    }

    if (styleName === "Vintage Revival") {
      return "linear-gradient(90deg, #8b5a2b, #c49a6c, #8b5a2b)";
    }

    if (styleName === "Preppy") {
      return "repeating-linear-gradient(90deg, #dbeafe 0px, #dbeafe 20px, #ffffff 20px, #ffffff 40px)";
    }

    if (styleName === "Tech Futuristic") {
      return side === "left"
        ? "linear-gradient(135deg, #020617, #0f172a, #22d3ee)"
        : "linear-gradient(135deg, #22d3ee, #0f172a, #020617)";
    }

    if (styleName === "Sustainable Eco") {
      return "linear-gradient(135deg, #dcfce7, #86efac, #bbf7d0)";
    }

    return theme.card;
  };

  const getPreviewShadow = (styleName, theme) => {
    if (styleName === "Y2K") return "0 0 18px #ff00cc";
    if (styleName === "Gothic") return "0 0 18px #8b0000";
    if (styleName === "Scene") return "0 0 18px #00ccff";
    if (styleName === "Tech Futuristic") return "0 0 18px #22d3ee";
    if (styleName === "Sustainable Eco") return "0 0 18px #4ade80";
    return `0 0 8px ${theme.border}`;
  };

  const getSecondSymbol = (styleName, theme) => {
    if (styleName === "Gothic") return "🦇";
    if (styleName === "Tech Futuristic") return "✧";
    if (styleName === "Sustainable Eco") return "🍃";
    return theme.symbol;
  };

  const renderMiniWardrobe = (styleName) => {
    const theme = themes[styleName];

    return (
      <div
        style={{
          height: "230px",
          border: `4px solid ${theme.border}`,
          background: theme.pattern !== "none" ? theme.pattern : theme.background,
          backgroundSize: "35px 35px",
          borderRadius: theme.radius,
          position: "relative",
          overflow: "hidden",
          boxShadow: getPreviewShadow(styleName, theme)
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "0",
            top: "0",
            width: "50%",
            height: "100%",
            background: getDoorBackground(styleName, "left"),
            borderRight: `3px solid ${theme.border}`
          }}
        />

        <div
          style={{
            position: "absolute",
            right: "0",
            top: "0",
            width: "50%",
            height: "100%",
            background: getDoorBackground(styleName, "right"),
            borderLeft: `3px solid ${theme.border}`
          }}
        />

        <div
          style={{
            position: "absolute",
            top: "12px",
            left: "20px",
            fontSize: "34px"
          }}
        >
          {theme.symbol}
        </div>

        <div
          style={{
            position: "absolute",
            bottom: "12px",
            right: "20px",
            fontSize: "34px"
          }}
        >
          {getSecondSymbol(styleName, theme)}
        </div>

        <div
          style={{
            position: "absolute",
            top: "42%",
            left: "48%",
            width: "5px",
            height: "55px",
            background: theme.border
          }}
        />

        <div
          style={{
            position: "absolute",
            top: "42%",
            right: "48%",
            width: "5px",
            height: "55px",
            background: theme.border
          }}
        />

        <div
          style={{
            position: "absolute",
            bottom: "18px",
            left: "50%",
            transform: "translateX(-50%)",
            background: theme.card,
            color: theme.text,
            border: `2px solid ${theme.border}`,
            padding: "6px 14px",
            borderRadius: theme.radius,
            fontFamily: theme.font,
            fontWeight: "bold",
            textAlign: "center"
          }}
        >
          {styleName} Preview
        </div>
      </div>
    );
  };

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f7f7f7, #e6e6e6)",
        display: "flex",
        flexDirection: "column"
      }}
    >
      <div
        style={{
          padding: "20px",
          borderBottom: "4px solid black",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "white"
        }}
      >
        <h2 style={{ margin: 0 }}>✦ My Virtual Closet ✦</h2>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={() => navigate("/dashboard")}
            style={{
              padding: "8px 14px",
              border: "2px solid black",
              background: "#eeeeee",
              fontWeight: "bold"
            }}
          >
            Dashboard
          </button>

          <button
            onClick={handleLogout}
            style={{
              padding: "8px 14px",
              border: "2px solid black",
              background: "#eeeeee",
              fontWeight: "bold"
            }}
          >
            Logout
          </button>
        </div>
      </div>

      <div
        style={{
          textAlign: "center",
          padding: "30px 20px 15px"
        }}
      >
        <h1 style={{ fontSize: "34px", marginBottom: "8px" }}>
          Choose Your Wardrobe Style
        </h1>

        <p>
          Select one visual template. Your chosen wardrobe design will apply
          across your dashboard and main pages.
        </p>
      </div>

      <div
        style={{
          width: "90%",
          maxWidth: "1400px",
          margin: "0 auto 40px",
          border: "4px solid black",
          background: "white",
          padding: "30px",
          boxSizing: "border-box"
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "30px"
          }}
        >
          {styles.map((style) => {
            const theme = themes[style];
            const isSelected = selectedStyle === style;

            return (
              <div
                key={style}
                style={{
                  border: isSelected
                    ? `5px solid ${theme.border}`
                    : "2px solid black",
                  background: theme.card,
                  color: theme.text,
                  padding: "18px",
                  borderRadius: theme.radius,
                  fontFamily: theme.font,
                  boxShadow: isSelected ? getPreviewShadow(style, theme) : "none"
                }}
              >
                {renderMiniWardrobe(style)}

                <h2 style={{ marginBottom: "5px" }}>
                  {theme.symbol} {style}
                </h2>

                <p style={{ minHeight: "42px", fontSize: "14px" }}>
                  {descriptions[style]}
                </p>

                <button
                  onClick={() => handleStyleSelect(style)}
                  style={{
                    marginTop: "10px",
                    padding: "10px 35px",
                    border: `2px solid ${theme.border}`,
                    background: theme.accent,
                    color: theme.text,
                    borderRadius: theme.radius,
                    fontWeight: "bold",
                    cursor: "pointer"
                  }}
                >
                  {isSelected ? "Selected" : "Select Style"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default StyleSelectionPage;
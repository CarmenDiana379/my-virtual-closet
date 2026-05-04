import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../store/ThemeStore";

function StyleSelectionPage() {
  const navigate = useNavigate();
  const { saveTheme } = useTheme();

  const [selectedStyle, setSelectedStyle] = useState(null);

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
    "Smart / Professional"
  ];

  const handleStyleSelect = async (style) => {
    setSelectedStyle(style);
    await saveTheme(style);
    navigate("/dashboard");
  };

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column"
      }}
    >
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

        <button onClick={() => navigate("/")}>
          Logout
        </button>
      </div>

      <div
        style={{
          textAlign: "center",
          padding: "25px 20px 10px"
        }}
      >
        <h1>Choose your style</h1>

        <p>Choose the style that best represents your wardrobe</p>
      </div>

      <div
        style={{
          width: "85%",
          margin: "0 auto",
          border: "1px solid black",
          padding: "40px",
          overflowY: "auto",
          maxHeight: "520px"
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "50px"
          }}
        >
          {styles.map((style, index) => (
            <div key={index} style={{ textAlign: "center" }}>
              <div
                style={{
                  height: "260px",
                  border:
                    selectedStyle === style
                      ? "4px solid black"
                      : "2px solid black",
                  marginBottom: "15px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#f2f2f2"
                }}
              >
                <span>{style} Preview</span>
              </div>

              <h2>{style}</h2>

              <button
                onClick={() => handleStyleSelect(style)}
                style={{
                  padding: "10px 60px",
                  marginTop: "10px"
                }}
              >
                Select
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default StyleSelectionPage;
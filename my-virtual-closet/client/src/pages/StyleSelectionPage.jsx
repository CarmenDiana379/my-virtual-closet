import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function StyleSelectionPage() {

  const navigate = useNavigate();

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

  const handleStyleSelect = (style) => {

    setSelectedStyle(style);

    console.log("Selected style:", style);

    // Later → save to Firestore
    // For now → go to dashboard

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

      {/* NAVBAR */}
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


      {/* TITLE */}
      <div
        style={{
          textAlign: "center",
          padding: "25px 20px 10px"
        }}
      >
        <h1>Choose your style</h1>

        <p>
          Choose the style that best represents your wardrobe
        </p>
      </div>


      {/* BIG STYLE CONTAINER */}
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

        {/* GRID */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "50px"
          }}
        >

          {styles.map((style, index) => (

            <div
              key={index}
              style={{
                textAlign: "center"
              }}
            >

              {/* STYLE IMAGE BOX */}
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
                {/* Placeholder text */}
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


      {/* FEATURE BUTTON ROW */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "40px",
          padding: "25px 0"
        }}
      >
        <p>Wardrobe Check</p>
        <p>Wardrobe Planning</p>
        <p>Wishlist</p>
        <p>Sell</p>
        <p>Recycle</p>
        <p>Bin</p>
      </div>


      {/* FOOTER */}
      <div
        style={{
          marginTop: "auto",
          borderTop: "1px solid black",
          padding: "15px 20px",
          display: "flex",
          justifyContent: "space-between"
        }}
      >
        <div>
          Facebook Instagram TikTok
        </div>

        <div>
          Contact Us | Subscribe | FAQ
        </div>
      </div>

    </div>
  );
}

export default StyleSelectionPage;
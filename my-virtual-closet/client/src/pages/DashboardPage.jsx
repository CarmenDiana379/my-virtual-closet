import React from "react";
import Wardrobe from "../components/Wardrobe";
import FeatureIcons from "../components/FeatureIcons";

function DashboardPage() {
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
        <button>Logout</button>
      </div>

      <div style={{ textAlign: "center", padding: "25px" }}>
        <h1>Welcome to your wardrobe [ User Name ]!</h1>
        <p>Create outfits by mixing items in your wardrobe</p>

        <Wardrobe />
      </div>

      <FeatureIcons />

      <div
        style={{
          marginTop: "auto",
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

export default DashboardPage;
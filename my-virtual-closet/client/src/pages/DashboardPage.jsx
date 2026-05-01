import React from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";

import { auth } from "../firebase";
import Wardrobe from "../components/Wardrobe";
import FeatureIcons from "../components/FeatureIcons";

function DashboardPage() {
  const navigate = useNavigate();

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

        <button onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center"
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h1>Welcome to your wardrobe [ User Name ]!</h1>
          <p>Create outfits by mixing items in your wardrobe</p>
        </div>

        <Wardrobe />
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

export default DashboardPage;
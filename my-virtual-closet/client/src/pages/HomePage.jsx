import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

function HomePage() {
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;
      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (!userDoc.exists()) {
        alert("User profile not found");
        return;
      }

      const userData = userDoc.data();

      setShowLogin(false);
      setEmail("");
      setPassword("");

      if (userData.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const featureCards = [
    { title: "Wardrobe Check", icon: "▦", text: "Organise your clothes." },
    { title: "Planning", icon: "✦", text: "Create outfit combinations." },
    { title: "Wishlist", icon: "♡", text: "Save future pieces." },
    { title: "Sell", icon: "£", text: "Resell unused items." },
    { title: "Recycle", icon: "♻", text: "Reduce fashion waste." },
    { title: "Bin", icon: "⌫", text: "Review removed items." }
  ];

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background:
          "radial-gradient(circle at top left, #f3e8ff 0%, transparent 30%), linear-gradient(135deg, #f8fafc 0%, #e0f2f1 45%, #fdf2f8 100%)",
        color: "#1f2933"
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "18px 34px",
          background: "rgba(255,255,255,0.82)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(31,41,51,0.18)"
        }}
      >
        <div
  onClick={() => navigate("/")}
  style={{
    display: "flex",
    alignItems: "center",
    gap: "10px",
    cursor: "pointer"
  }}
>
  <img
  src="/images/logo1.png"
  alt="My Virtual Closet Logo"
  style={{
    width: "200px",
    height: "100px",
    objectFit: "contain",
    borderRadius: "50%",
    transform: "scale(1.8)"
  }}
/>

  <h2
    style={{
      margin: 0,
      letterSpacing: "1px",
      fontSize: "22px"
    }}
  >

  </h2>
</div>

        <div>
          <button
            onClick={() => setShowLogin(true)}
            style={{
              marginRight: "10px",
              padding: "9px 18px",
              border: "1px solid #2f6f73",
              background: "white",
              color: "#2f6f73",
              borderRadius: "24px",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            Login
          </button>

          <button
            onClick={() => navigate("/signup")}
            style={{
              padding: "9px 18px",
              border: "1px solid #2f6f73",
              background: "#2f6f73",
              color: "white",
              borderRadius: "24px",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            Signup
          </button>
        </div>
      </div>

      {/* HERO */}
      <div
        style={{
          maxWidth: "1180px",
          margin: "55px auto 28px",
          padding: "0 30px",
          display: "grid",
          gridTemplateColumns: "1.15fr 0.85fr",
          gap: "34px",
          alignItems: "center"
        }}
      >
        <div
          style={{
            padding: "48px",
            border: "1px solid rgba(31,41,51,0.15)",
            background: "rgba(255,255,255,0.76)",
            borderRadius: "34px",
            boxShadow: "0 25px 60px rgba(31,41,51,0.12)"
          }}
        >
          <p
            style={{
              margin: "0 0 14px",
              fontWeight: "bold",
              letterSpacing: "2px",
              fontSize: "12px",
              color: "#2f6f73"
            }}
          >
            DIGITAL WARDROBE SYSTEM
          </p>

          <h1
            style={{
              fontSize: "46px",
              lineHeight: "1.1",
              margin: "0 0 18px"
            }}
          >
            Style smarter. Wear more of what you already own.
          </h1>

          <p
            style={{
              fontSize: "16px",
              lineHeight: "1.7",
              maxWidth: "620px",
              color: "#374151"
            }}
          >
            A personalised wardrobe platform for organising clothes, planning
            outfits, managing wishlists and making more mindful fashion choices.
          </p>

          <button
            onClick={() => navigate("/signup")}
            style={{
              marginTop: "24px",
              padding: "14px 34px",
              border: "none",
              background: "linear-gradient(135deg, #2f6f73, #6d5dfc)",
              color: "white",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "14px",
              borderRadius: "26px",
              boxShadow: "0 12px 25px rgba(47,111,115,0.28)"
            }}
          >
            Get Started →
          </button>
        </div>

        {/* WARDROBE PREVIEW */}
        <div
          style={{
            border: "1px solid rgba(31,41,51,0.15)",
            background: "rgba(255,255,255,0.82)",
            padding: "24px",
            borderRadius: "30px",
            boxShadow: "0 25px 55px rgba(47,111,115,0.16)"
          }}
        >
          <h2 style={{ marginTop: 0 }}>Wardrobe Preview</h2>

          <div
            style={{
              border: "2px solid #2f6f73",
              borderRadius: "24px",
              padding: "16px",
              background:
                "linear-gradient(135deg, rgba(224,242,241,0.75), rgba(243,232,255,0.65))"
            }}
          >
            {["Headwear", "Tops", "Dresses", "Shoes"].map((item, index) => (
              <div
                key={item}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "13px 0",
                  borderBottom:
                    index === 3 ? "none" : "1px solid rgba(31,41,51,0.18)"
                }}
              >
                <strong>{item}</strong>
                <span
                  style={{
                    border: "1px solid rgba(31,41,51,0.25)",
                    padding: "6px 13px",
                    background: "rgba(255,255,255,0.85)",
                    borderRadius: "18px",
                    color: "#2f6f73",
                    fontWeight: "bold"
                  }}
                >
                  ← →
                </span>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: "16px",
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "10px"
            }}
          >
            {["Upload", "Mix", "Save"].map((step) => (
              <div
                key={step}
                style={{
                  padding: "12px",
                  textAlign: "center",
                  borderRadius: "18px",
                  background: "#ffffff",
                  border: "1px solid rgba(31,41,51,0.12)",
                  fontWeight: "bold"
                }}
              >
                {step}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FEATURE CARDS */}
      <div
        style={{
          maxWidth: "1180px",
          margin: "15px auto 45px",
          padding: "0 30px",
          width: "100%",
          boxSizing: "border-box"
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "24px" }}>
          Core Features
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(6, 1fr)",
            gap: "14px"
          }}
        >
          {featureCards.map((card) => (
            <div
              key={card.title}
              style={{
                minHeight: "135px",
                padding: "18px 12px",
                border: "1px solid rgba(31,41,51,0.14)",
                borderRadius: "24px",
                background: "rgba(255,255,255,0.82)",
                textAlign: "center",
                boxShadow: "0 14px 30px rgba(31,41,51,0.08)"
              }}
            >
              <div
                style={{
                  fontSize: "28px",
                  marginBottom: "8px",
                  color: "#2f6f73"
                }}
              >
                {card.icon}
              </div>
              <h3 style={{ fontSize: "15px", margin: "8px 0" }}>
                {card.title}
              </h3>
              <p style={{ fontSize: "12px", margin: 0, color: "#4b5563" }}>
                {card.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div
        style={{
          maxWidth: "850px",
          margin: "0 auto 50px",
          padding: "28px",
          border: "1px solid rgba(31,41,51,0.14)",
          background: "rgba(255,255,255,0.78)",
          textAlign: "center",
          borderRadius: "30px",
          boxShadow: "0 20px 45px rgba(31,41,51,0.1)"
        }}
      >
        <h2 style={{ marginTop: 0 }}>How it works</h2>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "35px",
            flexWrap: "wrap"
          }}
        >
          <strong>1. Upload clothes</strong>
          <strong>2. Build outfits</strong>
          <strong>3. Save or recycle</strong>
        </div>
      </div>

      {/* FOOTER */}
      <div
        style={{
          marginTop: "auto",
          borderTop: "1px solid rgba(31,41,51,0.18)",
          padding: "18px 32px",
          display: "flex",
          justifyContent: "space-between",
          background: "rgba(255,255,255,0.82)"
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
        <div>Contact Us | Subscribe | FAQ</div>
      </div>

      {/* LOGIN POPUP */}
      {showLogin && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.45)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 99
          }}
        >
          <div
            style={{
              width: "360px",
              background: "white",
              padding: "30px",
              borderRadius: "28px",
              textAlign: "center",
              position: "relative",
              boxShadow: "0 25px 70px rgba(0,0,0,0.25)"
            }}
          >
            <button
              onClick={() => setShowLogin(false)}
              style={{
                position: "absolute",
                top: "12px",
                right: "12px",
                border: "1px solid rgba(31,41,51,0.18)",
                background: "white",
                borderRadius: "50%",
                cursor: "pointer"
              }}
            >
              X
            </button>

            <h2>Login</h2>

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%",
                marginBottom: "10px",
                padding: "11px",
                border: "1px solid rgba(31,41,51,0.22)",
                borderRadius: "14px",
                boxSizing: "border-box"
              }}
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                marginBottom: "20px",
                padding: "11px",
                border: "1px solid rgba(31,41,51,0.22)",
                borderRadius: "14px",
                boxSizing: "border-box"
              }}
            />

            <button
              onClick={handleLogin}
              style={{
                padding: "11px 30px",
                border: "none",
                background: "linear-gradient(135deg, #2f6f73, #6d5dfc)",
                color: "white",
                borderRadius: "24px",
                fontWeight: "bold",
                cursor: "pointer"
              }}
            >
              Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;
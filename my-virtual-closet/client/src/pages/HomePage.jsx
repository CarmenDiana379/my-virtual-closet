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

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        position: "relative"
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px",
          borderBottom: "1px solid black"
        }}
      >
        <h2>LOGO</h2>

        <div>
          <button
            onClick={() => setShowLogin(true)}
            style={{ marginRight: "10px" }}
          >
            Login
          </button>

          <button onClick={() => navigate("/signup")}>
            Signup
          </button>
        </div>
      </div>

      {/* HERO SECTION */}
      <div
        style={{
          textAlign: "center",
          padding: "60px 20px"
        }}
      >
        <h1>WELCOME TO YOUR VIRTUAL CLOSET</h1>

        <p style={{ marginTop: "20px" }}>
          ORGANISE YOUR WARDROBE AND PLAN OUTFITS EFFORTLESSLY
        </p>

        <button
          onClick={() => navigate("/signup")}
          style={{
            marginTop: "20px",
            padding: "10px 30px"
          }}
        >
          GET STARTED
        </button>

        <div
          style={{
            width: "300px",
            height: "180px",
            border: "1px solid black",
            margin: "40px auto"
          }}
        />
      </div>

      {/* FEATURE ICONS */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "40px",
          paddingBottom: "40px"
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
          padding: "20px",
          display: "flex",
          justifyContent: "space-between"
        }}
      >
        <div>Facebook Instagram TikTok</div>
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
            backgroundColor: "rgba(0,0,0,0.4)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <div
            style={{
              width: "350px",
              background: "white",
              padding: "30px",
              border: "2px solid black",
              position: "relative",
              textAlign: "center"
            }}
          >
            <button
              onClick={() => setShowLogin(false)}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px"
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
                padding: "8px"
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
                padding: "8px"
              }}
            />

            <button
              onClick={handleLogin}
              style={{ padding: "8px 20px" }}
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
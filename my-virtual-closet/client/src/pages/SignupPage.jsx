import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSignup = async () => {
    if (!fullName || !email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        fullName,
        email,
        role: "user",
        createdAt: new Date()
      });

      alert("Account created successfully");
      navigate("/choose-style");
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
        background:
          "radial-gradient(circle at top left, #f3e8ff 0%, transparent 30%), linear-gradient(135deg, #f8fafc 0%, #e0f2f1 45%, #fdf2f8 100%)",
        color: "#1f2933"
      }}
    >
      <div
        style={{
          padding: "18px 34px",
          background: "rgba(255,255,255,0.82)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(31,41,51,0.18)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <h2 style={{ margin: 0 }}>My Virtual Closet</h2>

        <button
          onClick={() => navigate("/")}
          style={{
            padding: "9px 18px",
            border: "1px solid #2f6f73",
            background: "white",
            color: "#2f6f73",
            borderRadius: "24px",
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >
          Back Home
        </button>
      </div>

      <main
        style={{
          flex: 1,
          maxWidth: "1100px",
          margin: "55px auto",
          padding: "0 30px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "35px",
          alignItems: "center"
        }}
      >
        <section
          style={{
            padding: "42px",
            border: "1px solid rgba(31,41,51,0.14)",
            background: "rgba(255,255,255,0.78)",
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
            CREATE YOUR DIGITAL WARDROBE
          </p>

          <h1
            style={{
              fontSize: "40px",
              lineHeight: "1.1",
              margin: "0 0 18px"
            }}
          >
            Start organising your closet in a smarter way.
          </h1>

          <p style={{ lineHeight: "1.7", color: "#374151" }}>
            Create an account to upload clothing items, choose your personal
            wardrobe style, plan outfits and manage items you want to sell,
            recycle or reuse.
          </p>

          <div
            style={{
              marginTop: "24px",
              display: "grid",
              gap: "12px"
            }}
          >
            <strong>✓ Choose from multiple wardrobe themes</strong>
            <strong>✓ Build outfits from your own clothes</strong>
            <strong>✓ Reduce clutter and avoid overbuying</strong>
          </div>
        </section>

        <section
          style={{
            padding: "34px",
            border: "1px solid rgba(31,41,51,0.14)",
            background: "rgba(255,255,255,0.86)",
            borderRadius: "34px",
            boxShadow: "0 25px 60px rgba(47,111,115,0.16)",
            textAlign: "center"
          }}
        >
          <h1 style={{ marginTop: 0 }}>Create Account</h1>

          <p style={{ color: "#4b5563" }}>
            Your wardrobe journey starts here.
          </p>

          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "12px",
              border: "1px solid rgba(31,41,51,0.22)",
              borderRadius: "14px",
              boxSizing: "border-box"
            }}
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "12px",
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
              padding: "12px",
              marginBottom: "22px",
              border: "1px solid rgba(31,41,51,0.22)",
              borderRadius: "14px",
              boxSizing: "border-box"
            }}
          />

          <button
            onClick={handleSignup}
            style={{
              padding: "12px 34px",
              border: "none",
              background: "linear-gradient(135deg, #2f6f73, #6d5dfc)",
              color: "white",
              borderRadius: "24px",
              fontWeight: "bold",
              cursor: "pointer",
              boxShadow: "0 12px 25px rgba(47,111,115,0.28)"
            }}
          >
            Sign Up →
          </button>

          <p style={{ marginTop: "18px", fontSize: "13px" }}>
            Already have an account?{" "}
            <span
              onClick={() => navigate("/")}
              style={{
                color: "#2f6f73",
                fontWeight: "bold",
                cursor: "pointer"
              }}
            >
              Login from homepage
            </span>
          </p>
        </section>
      </main>

      <footer
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
      </footer>
    </div>
  );
}

export default SignupPage;
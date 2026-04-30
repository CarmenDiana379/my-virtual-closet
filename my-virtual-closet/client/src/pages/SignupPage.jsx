import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function SignupPage() {

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSignup = () => {

    if (!fullName || !email || !password) {
      alert("Please fill all fields");
      return;
    }

    // later this will connect to Firebase

    navigate("/choose-style");
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
          borderBottom: "1px solid black"
        }}
      >
        <h2>LOGO</h2>
      </div>


      {/* SIGNUP FORM */}
      <div
        style={{
          width: "350px",
          margin: "80px auto",
          border: "2px solid black",
          padding: "30px",
          textAlign: "center"
        }}
      >

        <h1>Create Account</h1>

        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          style={{
            width: "100%",
            padding: "8px",
            marginBottom: "10px"
          }}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            padding: "8px",
            marginBottom: "10px"
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: "8px",
            marginBottom: "20px"
          }}
        />

        <button
          onClick={handleSignup}
          style={{
            padding: "10px 30px"
          }}
        >
          Sign Up
        </button>

      </div>

    </div>
  );
}

export default SignupPage;
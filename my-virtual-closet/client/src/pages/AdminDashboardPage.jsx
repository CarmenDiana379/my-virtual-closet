import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  addDoc
} from "firebase/firestore";

function AdminDashboardPage() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    users: 0,
    wardrobeItems: 0,
    wishlistItems: 0,
    savedOutfits: 0,
    sellItems: 0,
    binItems: 0
  });

  const [styleName, setStyleName] = useState("");
  const [styleDescription, setStyleDescription] = useState("");
  const [styles, setStyles] = useState([]);

  const cardStyle = {
    border: "1px solid rgba(31,41,51,0.14)",
    borderRadius: "24px",
    background: "rgba(255,255,255,0.82)",
    boxShadow: "0 14px 30px rgba(31,41,51,0.08)"
  };

  const buttonStyle = {
    padding: "9px 18px",
    border: "1px solid #2f6f73",
    background: "#2f6f73",
    color: "white",
    borderRadius: "24px",
    fontWeight: "bold",
    cursor: "pointer"
  };

  const loadUsers = async () => {
    const data = await getDocs(collection(db, "users"));
    setUsers(data.docs.map((document) => ({ id: document.id, ...document.data() })));
  };

  const loadStats = async () => {
    const usersData = await getDocs(collection(db, "users"));
    const wardrobeData = await getDocs(collection(db, "wardrobeItems"));
    const wishlistData = await getDocs(collection(db, "wishlistItems"));
    const outfitsData = await getDocs(collection(db, "savedOutfits"));
    const sellData = await getDocs(collection(db, "sellItems"));
    const binData = await getDocs(collection(db, "binItems"));

    setStats({
      users: usersData.size,
      wardrobeItems: wardrobeData.size,
      wishlistItems: wishlistData.size,
      savedOutfits: outfitsData.size,
      sellItems: sellData.size,
      binItems: binData.size
    });
  };

  const loadStyles = async () => {
    const data = await getDocs(collection(db, "styleTemplates"));
    setStyles(data.docs.map((document) => ({ id: document.id, ...document.data() })));
  };

  useEffect(() => {
    loadUsers();
    loadStats();
    loadStyles();
  }, []);

  const promoteToAdmin = async (userId) => {
    await updateDoc(doc(db, "users", userId), { role: "admin" });
    loadUsers();
  };

  const removeUserProfile = async (userId) => {
    const confirmDelete = window.confirm("Remove this user profile from Firestore?");
    if (!confirmDelete) return;

    await deleteDoc(doc(db, "users", userId));
    loadUsers();
    loadStats();
  };

  const addStyleTemplate = async () => {
    if (!styleName || !styleDescription) {
      alert("Please add style name and description");
      return;
    }

    await addDoc(collection(db, "styleTemplates"), {
      name: styleName,
      description: styleDescription,
      createdAt: new Date()
    });

    setStyleName("");
    setStyleDescription("");
    loadStyles();
  };

  const deleteStyleTemplate = async (styleId) => {
    await deleteDoc(doc(db, "styleTemplates", styleId));
    loadStyles();
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
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
        <h2 style={{ margin: 0 }}>Admin Panel</h2>

        <button onClick={handleLogout} style={buttonStyle}>
          Logout
        </button>
      </div>

      <main style={{ padding: "45px 30px", maxWidth: "1250px", margin: "0 auto", width: "100%" }}>
        <section
          style={{
            ...cardStyle,
            padding: "34px",
            marginBottom: "30px",
            textAlign: "center"
          }}
        >
          <p style={{ margin: 0, fontWeight: "bold", letterSpacing: "2px", color: "#2f6f73" }}>
            SYSTEM MANAGEMENT
          </p>
          <h1 style={{ fontSize: "38px", marginBottom: "10px" }}>Admin Dashboard</h1>
          <p>Manage users, monitor wardrobe activity and maintain style templates.</p>
        </section>

        <h2>System Statistics</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
            gap: "16px",
            margin: "20px 0 35px"
          }}
        >
          {[
            ["Users", stats.users],
            ["Wardrobe Items", stats.wardrobeItems],
            ["Wishlist Items", stats.wishlistItems],
            ["Saved Outfits", stats.savedOutfits],
            ["Sell Items", stats.sellItems],
            ["Bin Items", stats.binItems]
          ].map(([label, value]) => (
            <div key={label} style={{ ...cardStyle, padding: "22px", textAlign: "center" }}>
              <h3 style={{ margin: "0 0 8px" }}>{label}</h3>
              <strong style={{ fontSize: "28px", color: "#2f6f73" }}>{value}</strong>
            </div>
          ))}
        </div>

        <section style={{ ...cardStyle, padding: "24px", marginBottom: "35px" }}>
          <h2>Registered Users</h2>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "15px" }}>
              <thead>
                <tr style={{ background: "#e0f2f1" }}>
                  {["Full Name", "Email", "Role", "Actions"].map((header) => (
                    <th key={header} style={{ padding: "13px", textAlign: "left" }}>
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr key={user.id} style={{ borderBottom: "1px solid rgba(31,41,51,0.12)" }}>
                    <td style={{ padding: "13px" }}>{user.fullName}</td>
                    <td style={{ padding: "13px" }}>{user.email}</td>
                    <td style={{ padding: "13px" }}>{user.role}</td>
                    <td style={{ padding: "13px" }}>
                      {user.role !== "admin" && (
                        <button
                          onClick={() => promoteToAdmin(user.id)}
                          style={{ ...buttonStyle, marginRight: "8px", padding: "7px 12px" }}
                        >
                          Promote
                        </button>
                      )}

                      <button
                        onClick={() => removeUserProfile(user.id)}
                        style={{
                          ...buttonStyle,
                          background: "white",
                          color: "#2f6f73",
                          padding: "7px 12px"
                        }}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section style={{ ...cardStyle, padding: "24px" }}>
          <h2>Manage Style Templates</h2>

          <div
            style={{
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
              marginBottom: "22px"
            }}
          >
            <input
              type="text"
              placeholder="Style name"
              value={styleName}
              onChange={(e) => setStyleName(e.target.value)}
              style={{
                padding: "11px",
                border: "1px solid rgba(31,41,51,0.22)",
                borderRadius: "14px",
                flex: "1"
              }}
            />

            <input
              type="text"
              placeholder="Style description"
              value={styleDescription}
              onChange={(e) => setStyleDescription(e.target.value)}
              style={{
                padding: "11px",
                border: "1px solid rgba(31,41,51,0.22)",
                borderRadius: "14px",
                flex: "2"
              }}
            />

            <button onClick={addStyleTemplate} style={buttonStyle}>
              Add Template
            </button>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))",
              gap: "16px"
            }}
          >
            {styles.map((style) => (
              <div key={style.id} style={{ ...cardStyle, padding: "18px" }}>
                <h3>{style.name}</h3>
                <p>{style.description}</p>

                <button
                  onClick={() => deleteStyleTemplate(style.id)}
                  style={{
                    ...buttonStyle,
                    background: "white",
                    color: "#2f6f73"
                  }}
                >
                  Delete Style
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default AdminDashboardPage;
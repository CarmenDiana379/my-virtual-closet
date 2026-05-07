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
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from "recharts";

function AdminDashboardPage() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [styles, setStyles] = useState([]);
  const [topUsers, setTopUsers] = useState([]);
  const [mostUsedCategory, setMostUsedCategory] = useState("");
  const [mostUsedOutfitType, setMostUsedOutfitType] = useState("");

  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserStats, setSelectedUserStats] = useState({
    wardrobeItems: 0,
    wishlistItems: 0,
    savedOutfits: 0,
    recycleItems: 0,
    sellItems: 0,
    binItems: 0
  });

  const [stats, setStats] = useState({
    users: 0,
    wardrobeItems: 0,
    wishlistItems: 0,
    savedOutfits: 0,
    sellItems: 0,
    recycleItems: 0,
    binItems: 0
  });

  const [styleName, setStyleName] = useState("");
  const [styleDescription, setStyleDescription] = useState("");
  const [styleSymbol, setStyleSymbol] = useState("✦");
  const [styleBackground, setStyleBackground] = useState("#f8fafc");
  const [styleCard, setStyleCard] = useState("#ffffff");
  const [styleBorder, setStyleBorder] = useState("#2f6f73");
  const [styleAccent, setStyleAccent] = useState("#2f6f73");
  const [styleText, setStyleText] = useState("#1f2933");
  const [styleRadius, setStyleRadius] = useState("18px");
  const [styleDoorStyle, setStyleDoorStyle] = useState("custom");
  const [stylePattern, setStylePattern] = useState("none");

 
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

  const inputStyle = {
    padding: "11px",
    border: "1px solid rgba(31,41,51,0.22)",
    borderRadius: "14px",
    boxSizing: "border-box",
    width: "100%"
  };

  const loadUsers = async () => {
    const data = await getDocs(collection(db, "users"));
    setUsers(data.docs.map((document) => ({ id: document.id, ...document.data() })));
  };

  const countUserSubcollection = async (userId, collectionName) => {
    const data = await getDocs(collection(db, "users", userId, collectionName));
    return data.size;
  };

  const loadStats = async () => {
    const usersData = await getDocs(collection(db, "users"));

    let wardrobeItems = 0;
    let wishlistItems = 0;
    let savedOutfits = 0;
    let sellItems = 0;
    let recycleItems = 0;
    let binItems = 0;

    for (const userDocument of usersData.docs) {
      const userId = userDocument.id;

      wardrobeItems += await countUserSubcollection(userId, "wardrobeItems");
      wishlistItems += await countUserSubcollection(userId, "wishlistItems");
      savedOutfits += await countUserSubcollection(userId, "savedOutfits");
      sellItems += await countUserSubcollection(userId, "sellItems");
      recycleItems += await countUserSubcollection(userId, "recycleItems");
      binItems += await countUserSubcollection(userId, "binItems");
    }

    setStats({
      users: usersData.size,
      wardrobeItems,
      wishlistItems,
      savedOutfits,
      sellItems,
      recycleItems,
      binItems
    });
  };

  const loadAdvancedStats = async () => {
    
    const logsData = await getDocs(collection(db, "activityLogs"));

    const userActivityCount = {};
    const categoryCount = {};
    const outfitTypeCount = {};

    logsData.docs.forEach((document) => {
     
      const log = document.data();

      if (log.userId) {
        userActivityCount[log.userId] = (userActivityCount[log.userId] || 0) + 1;
      }

      if (log.category) {
        categoryCount[log.category] = (categoryCount[log.category] || 0) + 1;
      }

      if (log.outfitCategory) {
        outfitTypeCount[log.outfitCategory] =
          (outfitTypeCount[log.outfitCategory] || 0) + 1;
      }
    });

    setTopUsers(
      Object.entries(userActivityCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
    );

    const topCategory = Object.entries(categoryCount).sort((a, b) => b[1] - a[1])[0];
    const topOutfit = Object.entries(outfitTypeCount).sort((a, b) => b[1] - a[1])[0];

    setMostUsedCategory(topCategory ? topCategory[0] : "");
    setMostUsedOutfitType(topOutfit ? topOutfit[0] : "");
  };

  const inspectUser = async (user) => {
    const wardrobeData = await getDocs(collection(db, "users", user.id, "wardrobeItems"));
    const wishlistData = await getDocs(collection(db, "users", user.id, "wishlistItems"));
    const outfitsData = await getDocs(collection(db, "users", user.id, "savedOutfits"));
    const recycleData = await getDocs(collection(db, "users", user.id, "recycleItems"));
    const sellData = await getDocs(collection(db, "users", user.id, "sellItems"));
    const binData = await getDocs(collection(db, "users", user.id, "binItems"));

    setSelectedUser(user);

    setSelectedUserStats({
      wardrobeItems: wardrobeData.size,
      wishlistItems: wishlistData.size,
      savedOutfits: outfitsData.size,
      recycleItems: recycleData.size,
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
    loadAdvancedStats();
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

  const resetTemplateForm = () => {
    setStyleName("");
    setStyleDescription("");
    setStyleSymbol("✦");
    setStyleBackground("#f8fafc");
    setStyleCard("#ffffff");
    setStyleBorder("#2f6f73");
    setStyleAccent("#2f6f73");
    setStyleText("#1f2933");
    setStyleRadius("18px");
    setStyleDoorStyle("custom");
    setStylePattern("none");
  };

  const addStyleTemplate = async () => {
    if (!styleName || !styleDescription) {
      alert("Please add style name and description");
      return;
    }

    await addDoc(collection(db, "styleTemplates"), {
      name: styleName,
      description: styleDescription,
      symbol: styleSymbol,
      background: styleBackground,
      card: styleCard,
      border: styleBorder,
      accent: styleAccent,
      text: styleText,
      font: "Arial, sans-serif",
      radius: styleRadius,
      pattern: stylePattern,
      doorStyle: styleDoorStyle,
      createdAt: new Date()
    });

    resetTemplateForm();
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

  const getUserNameById = (userId) => {
    const foundUser = users.find((user) => user.id === userId);
    return foundUser?.fullName || userId;
  };

  const chartData = [
    { name: "Wardrobe", value: stats.wardrobeItems },
    { name: "Wishlist", value: stats.wishlistItems },
    { name: "Outfits", value: stats.savedOutfits },
    { name: "Sell", value: stats.sellItems },
    { name: "Recycle", value: stats.recycleItems },
    { name: "Bin", value: stats.binItems }
  ];

  const sustainabilityScore = selectedUser
    ? Math.min(
        selectedUserStats.recycleItems * 10 + selectedUserStats.savedOutfits * 6,
        100
      )
    : 0;

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

      <main
        style={{
          padding: "45px 30px",
          maxWidth: "1250px",
          margin: "0 auto",
          width: "100%"
        }}
      >
        <section
          style={{
            ...cardStyle,
            padding: "34px",
            marginBottom: "30px",
            textAlign: "center"
          }}
        >
          <p
            style={{
              margin: 0,
              fontWeight: "bold",
              letterSpacing: "2px",
              color: "#2f6f73"
            }}
          >
            SYSTEM MANAGEMENT
          </p>

          <h1 style={{ fontSize: "38px", marginBottom: "10px" }}>
            Admin Dashboard
          </h1>

          <p>
            Monitor real user activity, manage accounts, inspect user behaviour
            and create persistent style templates.
          </p>
        </section>

        <h2>Real User Activity Statistics</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
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
            ["Recycle Items", stats.recycleItems],
            ["Bin Items", stats.binItems]
          ].map(([label, value]) => (
            <div
              key={label}
              style={{
                ...cardStyle,
                padding: "22px",
                textAlign: "center"
              }}
            >
              <h3 style={{ margin: "0 0 8px" }}>{label}</h3>

              <strong style={{ fontSize: "28px", color: "#2f6f73" }}>
                {value}
              </strong>
            </div>
          ))}
        </div>

        <section style={{ ...cardStyle, padding: "26px", marginBottom: "35px" }}>
          <h2>Platform Analytics</h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "30px",
              marginTop: "25px"
            }}
          >
            <div>
              <h3>User Activity Overview</h3>

              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#2f6f73" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div>
              <h3>Wardrobe Distribution</h3>

              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={110}
                    label
                  >
                    <Cell fill="#2f6f73" />
                    <Cell fill="#6d5dfc" />
                    <Cell fill="#14b8a6" />
                    <Cell fill="#f59e0b" />
                    <Cell fill="#10b981" />
                    <Cell fill="#ef4444" />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          
        </section>

        <section style={{ ...cardStyle, padding: "24px", marginBottom: "35px" }}>
          <h2>Advanced Insights</h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "16px"
            }}
          >
            <div style={{ ...cardStyle, padding: "20px" }}>
              <h3>Top Users</h3>

              {topUsers.length === 0 ? (
                <p>No data yet</p>
              ) : (
                topUsers.map(([userId, count]) => (
                  <p key={userId}>
                    {getUserNameById(userId)} → {count} actions
                  </p>
                ))
              )}
            </div>

            <div style={{ ...cardStyle, padding: "20px" }}>
              <h3>Most Used Category</h3>
              <p>{mostUsedCategory || "No data yet"}</p>
            </div>

            <div style={{ ...cardStyle, padding: "20px" }}>
              <h3>Most Saved Outfit Type</h3>
              <p>{mostUsedOutfitType || "No data yet"}</p>
            </div>
          </div>
        </section>

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
                      <button
                        onClick={() => inspectUser(user)}
                        style={{
                          ...buttonStyle,
                          marginRight: "8px",
                          padding: "7px 12px",
                          background: "#6d5dfc",
                          border: "1px solid #6d5dfc"
                        }}
                      >
                        Inspect
                      </button>

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

        {selectedUser && (
          <section style={{ ...cardStyle, padding: "28px", marginBottom: "35px" }}>
            <h2>User Inspection Panel</h2>

            <p>
              Viewing analytics for: <strong>{selectedUser.fullName}</strong>
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "16px",
                marginTop: "24px"
              }}
            >
              {[
                ["Wardrobe", selectedUserStats.wardrobeItems],
                ["Wishlist", selectedUserStats.wishlistItems],
                ["Outfits", selectedUserStats.savedOutfits],
                ["Recycle", selectedUserStats.recycleItems],
                ["Sell", selectedUserStats.sellItems],
                ["Bin", selectedUserStats.binItems]
              ].map(([label, value]) => (
                <div key={label} style={{ ...cardStyle, padding: "20px", textAlign: "center" }}>
                  <h3>{label}</h3>
                  <strong style={{ fontSize: "28px", color: "#2f6f73" }}>
                    {value}
                  </strong>
                </div>
              ))}
            </div>

            <div style={{ marginTop: "35px" }}>
              <h3>Sustainability Score</h3>

              <div
                style={{
                  height: "22px",
                  background: "#e5e7eb",
                  borderRadius: "20px",
                  overflow: "hidden"
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${sustainabilityScore}%`,
                    background: "linear-gradient(135deg, #10b981, #14b8a6)",
                    borderRadius: "20px"
                  }}
                />
              </div>

              <p style={{ marginTop: "12px", color: "#4b5563" }}>
                Sustainability score is based on recycling and outfit reuse behaviour.
              </p>
            </div>
          </section>
        )}

        <section style={{ ...cardStyle, padding: "24px" }}>
          <h2>Create Style Template</h2>

          <p style={{ color: "#4b5563" }}>
            Admin-created templates are stored in Firestore and can be loaded into the style selection page.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "24px",
              marginTop: "22px"
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
                gap: "12px"
              }}
            >
              <input
                type="text"
                placeholder="Style name"
                value={styleName}
                onChange={(e) => setStyleName(e.target.value)}
                style={inputStyle}
              />

              <input
                type="text"
                placeholder="Symbol"
                value={styleSymbol}
                onChange={(e) => setStyleSymbol(e.target.value)}
                style={inputStyle}
              />

              <textarea
                placeholder="Style description"
                value={styleDescription}
                onChange={(e) => setStyleDescription(e.target.value)}
                style={{
                  ...inputStyle,
                  minHeight: "90px",
                  gridColumn: "1 / -1"
                }}
              />

              <label>
                Background
                <input
                  type="color"
                  value={styleBackground}
                  onChange={(e) => setStyleBackground(e.target.value)}
                  style={{ width: "100%", height: "42px" }}
                />
              </label>

              <label>
                Card
                <input
                  type="color"
                  value={styleCard}
                  onChange={(e) => setStyleCard(e.target.value)}
                  style={{ width: "100%", height: "42px" }}
                />
              </label>

              <label>
                Border
                <input
                  type="color"
                  value={styleBorder}
                  onChange={(e) => setStyleBorder(e.target.value)}
                  style={{ width: "100%", height: "42px" }}
                />
              </label>

              <label>
                Accent
                <input
                  type="color"
                  value={styleAccent}
                  onChange={(e) => setStyleAccent(e.target.value)}
                  style={{ width: "100%", height: "42px" }}
                />
              </label>

              <label>
                Text
                <input
                  type="color"
                  value={styleText}
                  onChange={(e) => setStyleText(e.target.value)}
                  style={{ width: "100%", height: "42px" }}
                />
              </label>

              <select
                value={styleRadius}
                onChange={(e) => setStyleRadius(e.target.value)}
                style={inputStyle}
              >
                <option value="0px">Sharp</option>
                <option value="8px">Slightly Rounded</option>
                <option value="18px">Soft Rounded</option>
                <option value="28px">Very Rounded</option>
              </select>

              <select
                value={stylePattern}
                onChange={(e) => setStylePattern(e.target.value)}
                style={inputStyle}
              >
                <option value="none">No Pattern</option>
                <option value="radial-gradient(circle, rgba(255,255,255,0.45) 2px, transparent 3px)">
                  Dot Pattern
                </option>
                <option value="repeating-linear-gradient(45deg, rgba(0,0,0,0.08) 0px, rgba(0,0,0,0.08) 10px, transparent 10px, transparent 20px)">
                  Diagonal Pattern
                </option>
              </select>

              <select
                value={styleDoorStyle}
                onChange={(e) => setStyleDoorStyle(e.target.value)}
                style={inputStyle}
              >
                <option value="custom">Custom</option>
                <option value="plain">Plain</option>
                <option value="bling">Bling</option>
                <option value="gothic">Gothic</option>
                <option value="eco">Eco</option>
                <option value="tech">Tech</option>
              </select>

              <button onClick={addStyleTemplate} style={buttonStyle}>
                Add Template
              </button>

              <button
                onClick={resetTemplateForm}
                style={{
                  ...buttonStyle,
                  background: "white",
                  color: "#2f6f73"
                }}
              >
                Reset
              </button>
            </div>

            <div
              style={{
                padding: "24px",
                borderRadius: styleRadius,
                border: `3px solid ${styleBorder}`,
                background:
                  stylePattern !== "none"
                    ? `${stylePattern}, ${styleBackground}`
                    : styleBackground,
                color: styleText
              }}
            >
              <h2>
                {styleSymbol} {styleName || "Template Preview"}
              </h2>

              <p>{styleDescription || "Preview how this template will look before saving it."}</p>

              <div
                style={{
                  marginTop: "20px",
                  padding: "18px",
                  borderRadius: styleRadius,
                  background: styleCard,
                  border: `2px solid ${styleBorder}`
                }}
              >
                <strong>Wardrobe Card Preview</strong>

                <div
                  style={{
                    marginTop: "16px",
                    display: "flex",
                    gap: "10px"
                  }}
                >
                  <button
                    style={{
                      ...buttonStyle,
                      background: styleAccent,
                      border: `1px solid ${styleBorder}`,
                      color: styleText
                    }}
                  >
                    Select
                  </button>

                  <button
                    style={{
                      ...buttonStyle,
                      background: "white",
                      border: `1px solid ${styleBorder}`,
                      color: styleText
                    }}
                  >
                    Preview
                  </button>
                </div>
              </div>
            </div>
          </div>

          <h2 style={{ marginTop: "35px" }}>Stored Style Templates</h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
              gap: "16px"
            }}
          >
            {styles.map((style) => (
              <div
                key={style.id}
                style={{
                  padding: "18px",
                  borderRadius: style.radius || "18px",
                  border: `2px solid ${style.border || "#2f6f73"}`,
                  background: style.card || "white",
                  color: style.text || "#1f2933"
                }}
              >
                <h3>
                  {style.symbol} {style.name}
                </h3>

                <p>{style.description}</p>

                <div
                  style={{
                    height: "50px",
                    borderRadius: "14px",
                    background: style.background,
                    border: `1px solid ${style.border}`,
                    marginBottom: "12px"
                  }}
                />

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
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

  const loadUsers = async () => {
    const data = await getDocs(collection(db, "users"));

    const loadedUsers = data.docs.map((document) => ({
      id: document.id,
      ...document.data()
    }));

    setUsers(loadedUsers);
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

    const loadedStyles = data.docs.map((document) => ({
      id: document.id,
      ...document.data()
    }));

    setStyles(loadedStyles);
  };

  useEffect(() => {
    loadUsers();
    loadStats();
    loadStyles();
  }, []);

  const promoteToAdmin = async (userId) => {
    await updateDoc(doc(db, "users", userId), {
      role: "admin"
    });

    loadUsers();
  };

  const removeUserProfile = async (userId) => {
    const confirmDelete = window.confirm(
      "Remove this user profile from Firestore?"
    );

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
        <h2>ADMIN PANEL</h2>

        <button onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div style={{ padding: "40px", textAlign: "center" }}>
        <h1>Admin Dashboard</h1>

        <h2>System Statistics</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "15px",
            maxWidth: "900px",
            margin: "20px auto"
          }}
        >
          <div style={{ border: "2px solid black", padding: "15px" }}>
            Users: {stats.users}
          </div>

          <div style={{ border: "2px solid black", padding: "15px" }}>
            Wardrobe Items: {stats.wardrobeItems}
          </div>

          <div style={{ border: "2px solid black", padding: "15px" }}>
            Wishlist Items: {stats.wishlistItems}
          </div>

          <div style={{ border: "2px solid black", padding: "15px" }}>
            Saved Outfits: {stats.savedOutfits}
          </div>

          <div style={{ border: "2px solid black", padding: "15px" }}>
            Sell Items: {stats.sellItems}
          </div>

          <div style={{ border: "2px solid black", padding: "15px" }}>
            Bin Items: {stats.binItems}
          </div>
        </div>

        <h2>Registered Users</h2>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "20px"
          }}
        >
          <thead>
            <tr>
              <th style={{ border: "1px solid black", padding: "10px" }}>
                Full Name
              </th>
              <th style={{ border: "1px solid black", padding: "10px" }}>
                Email
              </th>
              <th style={{ border: "1px solid black", padding: "10px" }}>
                Role
              </th>
              <th style={{ border: "1px solid black", padding: "10px" }}>
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td style={{ border: "1px solid black", padding: "10px" }}>
                  {user.fullName}
                </td>

                <td style={{ border: "1px solid black", padding: "10px" }}>
                  {user.email}
                </td>

                <td style={{ border: "1px solid black", padding: "10px" }}>
                  {user.role}
                </td>

                <td style={{ border: "1px solid black", padding: "10px" }}>
                  {user.role !== "admin" && (
                    <button
                      onClick={() => promoteToAdmin(user.id)}
                      style={{ marginRight: "8px" }}
                    >
                      Promote to Admin
                    </button>
                  )}

                  <button onClick={() => removeUserProfile(user.id)}>
                    Remove Profile
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 style={{ marginTop: "50px" }}>Manage Style Templates</h2>

        <div
          style={{
            border: "2px solid black",
            padding: "20px",
            maxWidth: "600px",
            margin: "20px auto"
          }}
        >
          <input
            type="text"
            placeholder="Style name"
            value={styleName}
            onChange={(e) => setStyleName(e.target.value)}
            style={{
              padding: "8px",
              margin: "8px",
              width: "220px"
            }}
          />

          <input
            type="text"
            placeholder="Style description"
            value={styleDescription}
            onChange={(e) => setStyleDescription(e.target.value)}
            style={{
              padding: "8px",
              margin: "8px",
              width: "260px"
            }}
          />

          <br />

          <button
            onClick={addStyleTemplate}
            style={{
              padding: "8px 20px",
              marginTop: "10px"
            }}
          >
            Add Style Template
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: "15px",
            maxWidth: "900px",
            margin: "30px auto"
          }}
        >
          {styles.map((style) => (
            <div
              key={style.id}
              style={{
                border: "2px solid black",
                padding: "15px",
                background: "white"
              }}
            >
              <h3>{style.name}</h3>
              <p>{style.description}</p>

              <button onClick={() => deleteStyleTemplate(style.id)}>
                Delete Style
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboardPage;
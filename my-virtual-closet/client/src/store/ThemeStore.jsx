import { createContext, useContext, useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "./AuthStore";

const ThemeContext = createContext();

const themes = {
  "Minimalistic Chic": {
    background: "#ffffff",
    card: "#f4f4f4",
    border: "#111111",
    accent: "#d9d9d9",
    text: "#111111",
    font: "Arial, sans-serif",
    radius: "4px",
    pattern: "none",
    symbol: "◇",
    doorStyle: "plain"
  },

  "Urban Streetwear": {
    background: "#1f2937",
    card: "#374151",
    border: "#facc15",
    accent: "#facc15",
    text: "#ffffff",
    font: "Impact, Arial Black, sans-serif",
    radius: "2px",
    pattern:
      "linear-gradient(135deg, #1f2937 25%, #111827 25%, #111827 50%, #1f2937 50%, #1f2937 75%, #111827 75%)",
    symbol: "★",
    doorStyle: "graffiti"
  },

  Y2K: {
    background: "#ffb3f1",
    card: "#b3f0ff",
    border: "#ff00cc",
    accent: "#ffff66",
    text: "#111111",
    font: "Comic Sans MS, Arial, sans-serif",
    radius: "22px",
    pattern:
      "radial-gradient(circle, rgba(255,255,255,0.9) 2px, transparent 3px)",
    symbol: "✦",
    doorStyle: "bling"
  },

  Coquette: {
    background: "#ffd6e8",
    card: "#fff0f7",
    border: "#ff69a6",
    accent: "#ffb6d5",
    text: "#4a1028",
    font: "Georgia, serif",
    radius: "20px",
    pattern:
      "linear-gradient(45deg, rgba(255,255,255,0.45) 25%, transparent 25%)",
    symbol: "♡",
    doorStyle: "bow"
  },

  Scene: {
    background: "#00ff99",
    card: "#ff00ff",
    border: "#000000",
    accent: "#00ccff",
    text: "#000000",
    font: "Comic Sans MS, Arial Black, sans-serif",
    radius: "0px",
    pattern:
      "repeating-linear-gradient(45deg, #00ff99 0px, #00ff99 12px, #ff00ff 12px, #ff00ff 24px)",
    symbol: "⚡",
    doorStyle: "animal"
  },

  Gothic: {
    background: "#000000",
    card: "#1a1a1a",
    border: "#8b0000",
    accent: "#3b0a45",
    text: "#ffffff",
    font: "Georgia, serif",
    radius: "0px",
    pattern:
      "radial-gradient(circle at top left, rgba(139,0,0,0.45), transparent 35%)",
    symbol: "🕸",
    doorStyle: "gothic"
  },

  "Vintage Revival": {
    background: "#d9a066",
    card: "#f3d6a3",
    border: "#6b3f1d",
    accent: "#b8793b",
    text: "#2b1708",
    font: "Georgia, serif",
    radius: "10px",
    pattern:
      "linear-gradient(90deg, rgba(255,255,255,0.18) 50%, transparent 50%)",
    symbol: "✿",
    doorStyle: "wood"
  },

  "Activewear / Sports": {
    background: "#ccff00",
    card: "#ffffff",
    border: "#008000",
    accent: "#00cc66",
    text: "#111111",
    font: "Arial Black, Arial, sans-serif",
    radius: "14px",
    pattern:
      "repeating-linear-gradient(90deg, rgba(0,128,0,0.15) 0px, rgba(0,128,0,0.15) 8px, transparent 8px, transparent 18px)",
    symbol: "●",
    doorStyle: "sport"
  },

  Preppy: {
    background: "#dbeafe",
    card: "#ffffff",
    border: "#1e3a8a",
    accent: "#f87171",
    text: "#111111",
    font: "Trebuchet MS, Arial, sans-serif",
    radius: "8px",
    pattern:
      "linear-gradient(90deg, rgba(30,58,138,0.15) 25%, transparent 25%, transparent 50%, rgba(248,113,113,0.15) 50%, rgba(248,113,113,0.15) 75%, transparent 75%)",
    symbol: "◆",
    doorStyle: "stripe"
  },

  "Smart / Professional": {
    background: "#d1d5db",
    card: "#ffffff",
    border: "#111827",
    accent: "#60a5fa",
    text: "#111827",
    font: "Arial, sans-serif",
    radius: "6px",
    pattern: "none",
    symbol: "▣",
    doorStyle: "professional"
  },

  "Tech Futuristic": {
    background: "#0f172a",
    card: "#020617",
    border: "#22d3ee",
    accent: "#38bdf8",
    text: "#e0f2fe",
    font: "Arial Black, Arial, sans-serif",
    radius: "12px",
    pattern:
      "linear-gradient(135deg, rgba(34,211,238,0.18) 25%, transparent 25%, transparent 50%, rgba(34,211,238,0.18) 50%, rgba(34,211,238,0.18) 75%, transparent 75%)",
    symbol: "✧",
    doorStyle: "tech"
  },

  "Sustainable Eco": {
    background: "#f0fdf4",
    card: "#dcfce7",
    border: "#166534",
    accent: "#4ade80",
    text: "#14532d",
    font: "Georgia, serif",
    radius: "14px",
    pattern:
      "radial-gradient(circle, rgba(34,197,94,0.25) 1px, transparent 2px)",
    symbol: "🌿",
    doorStyle: "eco"
  }
};

export function ThemeProvider({ children }) {
  const { user } = useAuth();

  const [selectedTheme, setSelectedTheme] = useState(
    localStorage.getItem("selectedTheme") || "Minimalistic Chic"
  );

  useEffect(() => {
    const loadTheme = async () => {
      if (!user) return;

      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (userDoc.exists() && userDoc.data().selectedTheme) {
        const savedTheme = userDoc.data().selectedTheme;
        setSelectedTheme(savedTheme);
        localStorage.setItem("selectedTheme", savedTheme);
      }
    };

    loadTheme();
  }, [user]);

  useEffect(() => {
    const currentTheme = themes[selectedTheme];

    if (currentTheme) {
      document.body.style.backgroundColor = currentTheme.background;
      document.body.style.color = currentTheme.text;
      document.body.style.fontFamily = currentTheme.font;
    }
  }, [selectedTheme]);

  const saveTheme = async (themeName) => {
    setSelectedTheme(themeName);
    localStorage.setItem("selectedTheme", themeName);

    if (user) {
      await updateDoc(doc(db, "users", user.uid), {
        selectedTheme: themeName
      });
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        selectedTheme,
        theme: themes[selectedTheme],
        saveTheme,
        themes
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
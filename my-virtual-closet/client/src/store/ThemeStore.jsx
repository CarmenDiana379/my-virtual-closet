import { createContext, useContext, useEffect, useState } from "react";
import { collection, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "./AuthStore";

const ThemeContext = createContext();

const defaultThemes = {
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

  "Rococo Lace": {
  background: "#ffffff",
  card: "rgba(255, 255, 255, 0.99)",
  border: "#d6c2b3",
  accent: "#efe3d9",
  text: "#46332c",
  font: "'Cormorant Garamond', serif",
  radius: "50px",

  pattern: `
    /* === LACE THREAD HOLES (micro perforation) === */
    radial-gradient(circle at 6% 10%, rgba(210,200,195,0.55) 0.8px, transparent 1.6px),
    radial-gradient(circle at 18% 22%, rgba(210,200,195,0.45) 0.8px, transparent 1.8px),
    radial-gradient(circle at 32% 14%, rgba(210,200,195,0.5) 0.8px, transparent 1.7px),
    radial-gradient(circle at 70% 30%, rgba(210,200,195,0.45) 0.8px, transparent 1.8px),
    radial-gradient(circle at 85% 75%, rgba(210,200,195,0.5) 0.8px, transparent 1.7px),

    /* === LACE KNOT CLUSTERS (embroidered stitch nodes) === */
    radial-gradient(circle at 25% 40%, rgba(240,235,232,0.9) 1px, transparent 3px),
    radial-gradient(circle at 28% 43%, rgba(220,210,205,0.6) 0.8px, transparent 2.5px),
    radial-gradient(circle at 60% 55%, rgba(240,235,232,0.85) 1px, transparent 3px),
    radial-gradient(circle at 63% 58%, rgba(220,210,205,0.55) 0.8px, transparent 2.5px),

    /* === LACE MESH (woven fabric structure) === */
    repeating-linear-gradient(
      0deg,
      rgba(214,196,184,0.08) 0px,
      rgba(214,196,184,0.08) 1px,
      transparent 1px,
      transparent 4px
    ),

    repeating-linear-gradient(
      90deg,
      rgba(214,196,184,0.06) 0px,
      rgba(214,196,184,0.06) 1px,
      transparent 1px,
      transparent 5px
    ),

    /* diagonal stitch tension */
    repeating-linear-gradient(
      45deg,
      rgba(255,255,255,0.35) 0px,
      rgba(255,255,255,0.35) 1px,
      transparent 1px,
      transparent 6px
    ),

    repeating-linear-gradient(
      -45deg,
      rgba(240,235,230,0.25) 0px,
      rgba(240,235,230,0.25) 1px,
      transparent 1px,
      transparent 7px
    ),

    /* === DAMASK BASE (Victorian wallpaper floral ghost pattern) === */
    radial-gradient(circle at 20% 30%, rgba(214,196,184,0.10) 0px, transparent 18px),
    radial-gradient(circle at 80% 70%, rgba(214,196,184,0.08) 0px, transparent 22px),
    radial-gradient(circle at 50% 50%, rgba(214,196,184,0.06) 0px, transparent 26px),

    /* === FABRIC BLEED / TEXTURE WASH === */
    linear-gradient(
      to bottom,
      rgba(255,255,255,1),
      rgba(252,250,248,0.95),
      rgba(255,255,255,0.98)
    )
  `,

  symbol: "⚜",
  doorStyle: "victorian-lace-damask-hybrid"
},

  "Gothic": {
  background: "#060507",
  card: "rgba(14, 10, 12, 0.98)",
  border: "#4a363a",
  accent: "#201014",
  text: "#e9dccf",
  font: "'Cormorant Garamond', serif",
  radius: "18px",

  pattern: `
    /* =====================================================
       VICTORIAN LACE BLACK BASE (Rococo structure, but dark)
    ===================================================== */

    /* === THREAD HOLES (aged embroidery perforation) === */
    radial-gradient(circle at 6% 10%, rgba(120,110,115,0.25) 0.8px, transparent 1.6px),
    radial-gradient(circle at 18% 22%, rgba(110,100,105,0.22) 0.8px, transparent 1.8px),
    radial-gradient(circle at 32% 14%, rgba(130,120,125,0.20) 0.8px, transparent 1.7px),
    radial-gradient(circle at 70% 30%, rgba(100,90,95,0.18) 0.8px, transparent 1.8px),
    radial-gradient(circle at 85% 75%, rgba(120,110,115,0.22) 0.8px, transparent 1.7px),

    /* === EMBROIDERED KNOT CLUSTERS (damask stitch nodes) === */
    radial-gradient(circle at 25% 40%, rgba(210,200,205,0.08) 1px, transparent 3px),
    radial-gradient(circle at 28% 43%, rgba(170,160,165,0.10) 0.8px, transparent 2.5px),
    radial-gradient(circle at 60% 55%, rgba(200,190,195,0.07) 1px, transparent 3px),
    radial-gradient(circle at 63% 58%, rgba(160,150,155,0.09) 0.8px, transparent 2.5px),

    /* === VICTORIAN LACE MESH (fabric weave structure) === */
    repeating-linear-gradient(
      0deg,
      rgba(160,140,145,0.05) 0px,
      rgba(160,140,145,0.05) 1px,
      transparent 1px,
      transparent 4px
    ),

    repeating-linear-gradient(
      90deg,
      rgba(140,120,125,0.04) 0px,
      rgba(140,120,125,0.04) 1px,
      transparent 1px,
      transparent 5px
    ),

    /* === DIAGONAL LACE TENSION (ornamental stitching) === */
    repeating-linear-gradient(
      45deg,
      rgba(200,190,195,0.06) 0px,
      rgba(200,190,195,0.06) 1px,
      transparent 1px,
      transparent 6px
    ),

    repeating-linear-gradient(
      -45deg,
      rgba(90,80,85,0.05) 0px,
      rgba(90,80,85,0.05) 1px,
      transparent 1px,
      transparent 7px
    ),

    /* === VICTORIAN DAMASK BASE (ghost floral wallpaper) === */
    radial-gradient(circle at 20% 30%, rgba(80,70,75,0.08) 0px, transparent 18px),
    radial-gradient(circle at 80% 70%, rgba(70,60,65,0.07) 0px, transparent 22px),
    radial-gradient(circle at 50% 50%, rgba(60,50,55,0.06) 0px, transparent 26px),

    /* === AGED VELVET WASH (deep darkness, no glow) === */
    linear-gradient(
      to bottom,
      rgba(6,5,7,1),
      rgba(10,8,10,0.98),
      rgba(5,4,6,1)
    )
  `,

  symbol: "⚜",
  doorStyle: "victorian-rococo-goth-hybrid"
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

  const [themes, setThemes] = useState(defaultThemes);

  const [selectedTheme, setSelectedTheme] = useState(
    localStorage.getItem("selectedTheme") || "Minimalistic Chic"
  );

  const loadAdminTemplates = async () => {
    const data = await getDocs(collection(db, "styleTemplates"));

    const adminThemes = {};

    data.docs.forEach((document) => {
      const template = document.data();

      if (!template.name) return;

      adminThemes[template.name] = {
        background: template.background || "#f8fafc",
        card: template.card || "#ffffff",
        border: template.border || "#2f6f73",
        accent: template.accent || "#2f6f73",
        text: template.text || "#1f2933",
        font: template.font || "Arial, sans-serif",
        radius: template.radius || "18px",
        pattern: template.pattern || "none",
        symbol: template.symbol || "✦",
        doorStyle: template.doorStyle || "custom",
        description: template.description || "Admin-created wardrobe template."
      };
    });

    setThemes({
      ...defaultThemes,
      ...adminThemes
    });
  };

  useEffect(() => {
    loadAdminTemplates();
  }, []);

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
    const currentTheme = themes[selectedTheme] || defaultThemes["Minimalistic Chic"];

    document.body.style.backgroundColor = currentTheme.background;
    document.body.style.color = currentTheme.text;
    document.body.style.fontFamily = currentTheme.font;
  }, [selectedTheme, themes]);

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
        theme: themes[selectedTheme] || defaultThemes["Minimalistic Chic"],
        saveTheme,
        themes,
        reloadThemes: loadAdminTemplates
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
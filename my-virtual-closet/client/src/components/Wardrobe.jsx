import { useState } from "react";
import { useWardrobe } from "../store/WardrobeStore";
import { useTheme } from "../store/ThemeStore";

function Wardrobe() {
  const { items, saveOutfit } = useWardrobe();
  const { theme, selectedTheme } = useTheme();

  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState("Two-piece");
  const [selectedOutfit, setSelectedOutfit] = useState({});
  const [draggedItem, setDraggedItem] = useState(null);
  const [outfitName, setOutfitName] = useState("");
  const [outfitCategory, setOutfitCategory] = useState("Casual");

  const [indexes, setIndexes] = useState({
    Headwear: 0,
    Neckwear: 0,
    Tops: 0,
    Dresses: 0,
    Bottoms: 0,
    Shoes: 0,
    Accessories: 0,
    Jackets: 0
  });

  const getDoorBackground = () => {
    if (selectedTheme === "Y2K") {
      return "linear-gradient(135deg, #ffb3f1, #b3f0ff, #ffff66)";
    }

    if (selectedTheme === "Gothic") {
      return "radial-gradient(circle at top, #3b0a45, #000000 65%)";
    }

    if (selectedTheme === "Scene") {
      return "repeating-linear-gradient(45deg, #00ff99 0px, #00ff99 14px, #ff00ff 14px, #ff00ff 28px)";
    }

    if (selectedTheme === "Vintage Revival") {
      return "linear-gradient(90deg, #8b5a2b, #c49a6c, #8b5a2b)";
    }

    if (selectedTheme === "Preppy") {
      return "repeating-linear-gradient(90deg, #dbeafe 0px, #dbeafe 20px, #ffffff 20px, #ffffff 40px)";
    }

    if (selectedTheme === "Tech Futuristic") {
      return "linear-gradient(135deg, #020617, #0f172a, #22d3ee)";
    }

    if (selectedTheme === "Sustainable Eco") {
      return "linear-gradient(135deg, #dcfce7, #86efac, #bbf7d0)";
    }

    return theme.card;
  };

  const getItemsByCategory = (category) => {
    if (category === "Neckwear") {
      return items.filter(
        (item) =>
          item.category === "Accessories" &&
          (item.name.toLowerCase().includes("necklace") ||
            item.name.toLowerCase().includes("scarf"))
      );
    }

    if (category === "Accessories") {
      return items.filter(
        (item) =>
          item.category === "Accessories" &&
          !item.name.toLowerCase().includes("necklace") &&
          !item.name.toLowerCase().includes("scarf")
      );
    }

    return items.filter((item) => item.category === category);
  };

  const moveCarousel = (category, direction) => {
    const categoryItems = getItemsByCategory(category);
    if (categoryItems.length === 0) return;

    setIndexes((prev) => {
      let newIndex = prev[category] + direction;

      if (newIndex < 0) newIndex = categoryItems.length - 1;
      if (newIndex >= categoryItems.length) newIndex = 0;

      return { ...prev, [category]: newIndex };
    });
  };

  const getVisibleItems = (category) => {
    const categoryItems = getItemsByCategory(category);
    const currentIndex = indexes[category] || 0;

    if (categoryItems.length === 0) return [];

    if (categoryItems.length === 1) {
      return [{ item: categoryItems[0], position: "center" }];
    }

    const previousIndex =
      currentIndex === 0 ? categoryItems.length - 1 : currentIndex - 1;

    const nextIndex =
      currentIndex === categoryItems.length - 1 ? 0 : currentIndex + 1;

    return [
      { item: categoryItems[previousIndex], position: "side" },
      { item: categoryItems[currentIndex], position: "center" },
      { item: categoryItems[nextIndex], position: "side" }
    ];
  };

  const addToOutfit = (section, item) => {
    setSelectedOutfit((prev) => ({
      ...prev,
      [section]: item
    }));
  };

  const clearOutfit = () => {
    setSelectedOutfit({});
    setOutfitName("");
    setOutfitCategory("Casual");
  };

  const handleSaveOutfit = async () => {
    if (!outfitName) {
      alert("Please give your outfit a name");
      return;
    }

    if (Object.keys(selectedOutfit).length === 0) {
      alert("No items selected");
      return;
    }

    await saveOutfit(outfitName, outfitCategory, Object.values(selectedOutfit));

    alert("Outfit saved!");

    setOutfitName("");
    setOutfitCategory("Casual");
    setSelectedOutfit({});
  };

  const buttonStyle = {
    background: theme.accent,
    border: `2px solid ${theme.border}`,
    color: theme.text,
    borderRadius: theme.radius,
    fontWeight: "bold",
    cursor: "pointer"
  };

  const renderRow = (category, label, outfitKey) => {
    const visibleItems = getVisibleItems(category);

    return (
      <div
        style={{
          borderBottom: `2px solid ${theme.border}`,
          padding: "6px 0"
        }}
      >
        <strong
          style={{
            display: "block",
            marginBottom: "4px",
            fontSize: "13px"
          }}
        >
          {theme.symbol} {label}
        </strong>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "6px",
            minHeight: "90px"
          }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              moveCarousel(category, -1);
            }}
            style={buttonStyle}
          >
            ←
          </button>

          {visibleItems.length === 0 ? (
            <div
              style={{
                width: "260px",
                height: "60px",
                border: `1px dashed ${theme.border}`,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: theme.card,
                color: theme.text,
                fontSize: "12px",
                borderRadius: theme.radius
              }}
            >
              No items yet
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "6px",
                width: "360px"
              }}
            >
              {visibleItems.map(({ item, position }) => (
                <div
                  key={`${category}-${item.id}-${position}`}
                  onClick={(e) => {
                    e.stopPropagation();

                    if (position === "center") {
                      addToOutfit(outfitKey, item);
                    }
                  }}
                  style={{
                    border:
                      position === "center"
                        ? `3px solid ${theme.border}`
                        : `1px solid ${theme.border}`,
                    width: position === "center" ? "110px" : "75px",
                    height: position === "center" ? "95px" : "70px",
                    flexShrink: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    background: theme.card,
                    color: theme.text,
                    padding: "4px",
                    opacity: position === "center" ? 1 : 0.4,
                    transform:
                      position === "center" ? "scale(1.08)" : "scale(0.92)",
                    boxSizing: "border-box",
                    cursor: position === "center" ? "pointer" : "default",
                    borderRadius: theme.radius,
                    boxShadow:
                      position === "center" && selectedTheme === "Y2K"
                        ? "0 0 12px #ff00cc"
                        : position === "center" && selectedTheme === "Gothic"
                        ? "0 0 10px #8b0000"
                        : position === "center" && selectedTheme === "Scene"
                        ? "0 0 10px #00ccff"
                        : position === "center" &&
                          selectedTheme === "Tech Futuristic"
                        ? "0 0 12px #22d3ee"
                        : position === "center" &&
                          selectedTheme === "Sustainable Eco"
                        ? "0 0 12px #4ade80"
                        : "none"
                  }}
                >
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{
                        width: position === "center" ? "60px" : "42px",
                        height: position === "center" ? "60px" : "42px",
                        objectFit: "cover",
                        border: `1px solid ${theme.border}`,
                        marginBottom: "3px",
                        borderRadius: theme.radius
                      }}
                    />
                  )}

                  <strong
                    style={{
                      fontSize: position === "center" ? "9px" : "7px",
                      textAlign: "center"
                    }}
                  >
                    {item.name}
                  </strong>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              moveCarousel(category, 1);
            }}
            style={buttonStyle}
          >
            →
          </button>
        </div>
      </div>
    );
  };

  return (
    <div
      onClick={() => setIsOpen(!isOpen)}
      style={{
        width: "90%",
        maxWidth: "1250px",
        margin: "20px auto",
        border: `4px solid ${theme.border}`,
        background: theme.pattern !== "none" ? theme.pattern : theme.background,
        backgroundSize: "40px 40px",
        color: theme.text,
        boxSizing: "border-box",
        position: "relative",
        overflow: "hidden",
        cursor: "pointer",
        borderRadius: theme.radius,
        boxShadow:
          selectedTheme === "Y2K"
            ? "0 0 25px #ff00cc"
            : selectedTheme === "Gothic"
            ? "0 0 22px #8b0000"
            : selectedTheme === "Scene"
            ? "0 0 22px #00ccff"
            : selectedTheme === "Tech Futuristic"
            ? "0 0 25px #22d3ee"
            : selectedTheme === "Sustainable Eco"
            ? "0 0 20px #4ade80"
            : "none"
      }}
    >
      <div
        style={{
          padding: "12px",
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "18px"
        }}
      >
        <div
          style={{
            background: theme.card,
            border: `3px solid ${theme.border}`,
            borderRadius: theme.radius,
            padding: "10px"
          }}
        >
          <h2 style={{ margin: "0 0 8px 0", fontSize: "20px" }}>
            {theme.symbol} Dress-Up Wardrobe {theme.symbol}
          </h2>

          <div style={{ marginBottom: "8px" }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMode("Two-piece");
              }}
              style={{
                ...buttonStyle,
                marginRight: "10px",
                padding: "5px 10px",
                background: mode === "Two-piece" ? theme.accent : theme.card
              }}
            >
              Tops + Bottoms
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setMode("One-piece");
              }}
              style={{
                ...buttonStyle,
                padding: "5px 10px",
                background: mode === "One-piece" ? theme.accent : theme.card
              }}
            >
              Dresses / One-pieces
            </button>
          </div>

          {renderRow("Headwear", "Headwear", "Headwear")}
          {renderRow("Neckwear", "Necklaces / Scarves", "Neckwear")}

          {mode === "Two-piece" && (
            <>
              {renderRow("Tops", "Tops", "Top")}
              {renderRow("Bottoms", "Bottoms", "Bottom")}
            </>
          )}

          {mode === "One-piece" &&
            renderRow("Dresses", "Dresses / One-pieces", "One-piece")}

          {renderRow("Shoes", "Shoes", "Shoes")}
          {renderRow("Accessories", "Extra Accessories", "Accessories")}
          {renderRow("Jackets", "Jackets", "Jacket")}
        </div>

        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            border: `3px solid ${theme.border}`,
            background: theme.card,
            color: theme.text,
            padding: "12px",
            textAlign: "center",
            borderRadius: theme.radius
          }}
        >
          <h2 style={{ marginTop: 0 }}>{theme.symbol} Current Outfit</h2>

          {Object.keys(selectedOutfit).length === 0 ? (
            <p>Click a centre item to add it here.</p>
          ) : (
            Object.entries(selectedOutfit).map(([section, item]) => (
              <div
                key={section}
                draggable
                onDragStart={() => setDraggedItem(section)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => {
                  if (!draggedItem || draggedItem === section) return;

                  setSelectedOutfit((prev) => {
                    const newOutfit = { ...prev };
                    const temp = newOutfit[section];

                    newOutfit[section] = newOutfit[draggedItem];
                    newOutfit[draggedItem] = temp;

                    return newOutfit;
                  });

                  setDraggedItem(null);
                }}
                style={{
                  borderBottom: `1px solid ${theme.border}`,
                  padding: "10px 0",
                  cursor: "grab",
                  background:
                    draggedItem === section ? theme.accent : "transparent",
                  transition: "0.2s"
                }}
              >
                <strong>{section}</strong>

                <br />

                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                      border: `1px solid ${theme.border}`,
                      marginTop: "8px",
                      borderRadius: theme.radius
                    }}
                  />
                )}

                <p style={{ margin: "4px 0" }}>{item.name}</p>
              </div>
            ))
          )}

          <input
            type="text"
            placeholder="Outfit name"
            value={outfitName}
            onChange={(e) => setOutfitName(e.target.value)}
            style={{
              width: "90%",
              padding: "6px",
              marginTop: "10px",
              background: theme.background,
              color: theme.text,
              border: `2px solid ${theme.border}`,
              borderRadius: theme.radius
            }}
          />

          <select
            value={outfitCategory}
            onChange={(e) => setOutfitCategory(e.target.value)}
            style={{
              marginTop: "8px",
              padding: "6px",
              background: theme.background,
              color: theme.text,
              border: `2px solid ${theme.border}`,
              borderRadius: theme.radius
            }}
          >
            <option>Casual</option>
            <option>Formal</option>
            <option>Sport</option>
            <option>Party</option>
            <option>Everyday</option>
            <option>Job Interview</option>
            <option>Casual Dinner</option>
            <option>Fancy Dinner</option>
            <option>Date</option>
            <option>House Party</option>
            <option>Club Night</option>
            <option>City Trip</option>
            <option>Resort Holiday</option>
            <option>Ski</option>
            <option>Beach</option>
            <option>Formal Event</option>
          </select>

          <br />

          <button
            onClick={handleSaveOutfit}
            style={{
              ...buttonStyle,
              marginTop: "10px",
              padding: "6px 12px"
            }}
          >
            Save Outfit
          </button>

          <button
            onClick={clearOutfit}
            style={{
              ...buttonStyle,
              marginTop: "8px",
              marginLeft: "8px",
              padding: "6px 12px"
            }}
          >
            Clear Outfit
          </button>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: isOpen ? "-50%" : "0",
          top: "0",
          width: "50%",
          height: "100%",
          background: getDoorBackground(),
          borderRight: `4px solid ${theme.border}`,
          transition: "0.7s",
          zIndex: 5,
          boxSizing: "border-box"
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            border: `3px solid ${theme.border}`,
            boxSizing: "border-box",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            paddingRight: "30px",
            fontSize: "45px"
          }}
        >
          {selectedTheme === "Gothic" && "🕸"}
          {selectedTheme === "Y2K" && "✦"}
          {selectedTheme === "Scene" && "⚡"}
          {selectedTheme === "Tech Futuristic" && "✧"}
          {selectedTheme === "Sustainable Eco" && "🌿"}
          {![
            "Gothic",
            "Y2K",
            "Scene",
            "Tech Futuristic",
            "Sustainable Eco"
          ].includes(selectedTheme) && theme.symbol}

          <div
            style={{
              width: "6px",
              height: "80px",
              background: theme.border,
              marginLeft: "25px"
            }}
          />
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          right: isOpen ? "-50%" : "0",
          top: "0",
          width: "50%",
          height: "100%",
          background: getDoorBackground(),
          borderLeft: `4px solid ${theme.border}`,
          transition: "0.7s",
          zIndex: 5,
          boxSizing: "border-box"
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            border: `3px solid ${theme.border}`,
            boxSizing: "border-box",
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            paddingLeft: "30px",
            fontSize: "45px"
          }}
        >
          <div
            style={{
              width: "6px",
              height: "80px",
              background: theme.border,
              marginRight: "25px"
            }}
          />

          {selectedTheme === "Gothic" && "🦇"}
          {selectedTheme === "Y2K" && "✦"}
          {selectedTheme === "Scene" && "⚡"}
          {selectedTheme === "Tech Futuristic" && "✧"}
          {selectedTheme === "Sustainable Eco" && "🍃"}
          {![
            "Gothic",
            "Y2K",
            "Scene",
            "Tech Futuristic",
            "Sustainable Eco"
          ].includes(selectedTheme) && theme.symbol}
        </div>
      </div>
    </div>
  );
}

export default Wardrobe;
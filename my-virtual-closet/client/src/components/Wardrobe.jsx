import { useState } from "react";
import { useWardrobe } from "../store/WardrobeStore";

function Wardrobe() {
  const { items } = useWardrobe();

  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState("Two-piece");

  const [indexes, setIndexes] = useState({
    Headwear: 0,
    Neckwear: 0,
    Tops: 0,
    Bottoms: 0,
    Shoes: 0,
    Accessories: 0,
    Jackets: 0
  });

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

      return {
        ...prev,
        [category]: newIndex
      };
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

  const renderRow = (category, label) => {
    const visibleItems = getVisibleItems(category);

    return (
      <div
        style={{
          borderBottom: "2px solid black",
          padding: "5px 0"
        }}
      >
        <strong
          style={{
            display: "block",
            marginBottom: "3px",
            fontSize: "12px"
          }}
        >
          {label}
        </strong>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "10px",
            minHeight: "82px"
          }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              moveCarousel(category, -1);
            }}
          >
            ←
          </button>

          {visibleItems.length === 0 ? (
            <div
              style={{
                width: "280px",
                height: "52px",
                border: "1px dashed black",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "white",
                fontSize: "12px"
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
                gap: "10px",
                width: "430px"
              }}
            >
              {visibleItems.map(({ item, position }) => (
                <div
                  key={`${category}-${item.id}-${position}`}
                  style={{
                    border:
                      position === "center"
                        ? "3px solid black"
                        : "1px solid black",
                    width: position === "center" ? "105px" : "76px",
                    height: position === "center" ? "86px" : "66px",
                    flexShrink: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "white",
                    padding: "4px",
                    opacity: position === "center" ? 1 : 0.45,
                    transform:
                      position === "center" ? "scale(1.05)" : "scale(0.9)",
                    boxSizing: "border-box"
                  }}
                >
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{
                        width: position === "center" ? "48px" : "34px",
                        height: position === "center" ? "48px" : "34px",
                        objectFit: "cover",
                        border: "1px solid black",
                        marginBottom: "2px"
                      }}
                    />
                  )}

                  <strong
                    style={{
                      fontSize: position === "center" ? "9px" : "8px",
                      textAlign: "center"
                    }}
                  >
                    {item.name}
                  </strong>

                  <span style={{ fontSize: "8px" }}>
                    {item.sizeSystem} {item.size}
                  </span>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              moveCarousel(category, 1);
            }}
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
        width: "82%",
        maxWidth: "1150px",
        margin: "20px auto",
        border: "4px solid black",
        background: "#f8f8f8",
        boxSizing: "border-box",
        position: "relative",
        overflow: "hidden",
        cursor: "pointer"
      }}
    >
      <div
        style={{
          padding: "12px"
        }}
      >
        <h2 style={{ margin: "0 0 8px 0", fontSize: "20px" }}>
          Dress-Up Wardrobe
        </h2>

        <div style={{ marginBottom: "8px" }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMode("Two-piece");
            }}
            style={{
              marginRight: "10px",
              padding: "5px 10px",
              background: mode === "Two-piece" ? "#ddd" : "white"
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
              padding: "5px 10px",
              background: mode === "One-piece" ? "#ddd" : "white"
            }}
          >
            Dresses / One-pieces
          </button>
        </div>

        {renderRow("Headwear", "Headwear")}
        {renderRow("Neckwear", "Necklaces / Scarves")}

        {mode === "Two-piece" && (
          <>
            {renderRow("Tops", "Tops")}
            {renderRow("Bottoms", "Bottoms")}
          </>
        )}

        {mode === "One-piece" && renderRow("Tops", "Dresses / One-pieces")}

        {renderRow("Shoes", "Shoes")}
        {renderRow("Accessories", "Extra Accessories")}
        {renderRow("Jackets", "Jackets")}
      </div>

      <div
        style={{
          position: "absolute",
          left: isOpen ? "-50%" : "0",
          top: "0",
          width: "50%",
          height: "100%",
          background: "white",
          borderRight: "3px solid black",
          transition: "0.7s",
          zIndex: 5,
          boxSizing: "border-box"
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            border: "2px solid black",
            boxSizing: "border-box",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            paddingRight: "30px"
          }}
        >
          <div
            style={{
              width: "6px",
              height: "80px",
              background: "black"
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
          background: "white",
          borderLeft: "3px solid black",
          transition: "0.7s",
          zIndex: 5,
          boxSizing: "border-box"
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            border: "2px solid black",
            boxSizing: "border-box",
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            paddingLeft: "30px"
          }}
        >
          <div
            style={{
              width: "6px",
              height: "80px",
              background: "black"
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default Wardrobe;
import { useState } from "react";

function Wardrobe() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      onClick={() => setIsOpen(!isOpen)}
      style={{
        width: "700px",
        height: "280px",
        margin: "40px auto",
        border: "3px solid black",
        position: "relative",
        overflow: "hidden",
        cursor: "pointer"
      }}
    >
      {/* Inside wardrobe layout */}
      {isOpen && (
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            padding: "10px",
            boxSizing: "border-box",
            textAlign: "center"
          }}
        >
          <div style={{ borderBottom: "2px solid black" }}>
            HEADWEAR
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              marginTop: "20px"
            }}
          >
            <div style={{ border: "1px solid black", padding: "10px" }}>
              JACKETS
            </div>

            <div style={{ border: "1px solid black", padding: "10px" }}>
              TOPS/DRESSES
            </div>

            <div style={{ border: "1px solid black", padding: "10px" }}>
              BOTTOMS
            </div>

            <div style={{ border: "1px solid black", padding: "10px" }}>
              ACCESSORIES
            </div>
          </div>

          <div
            style={{
              borderTop: "2px solid black",
              marginTop: "20px"
            }}
          >
            SHOES
          </div>
        </div>
      )}

      {/* Left Door */}
      <div
        style={{
          position: "absolute",
          left: isOpen ? "-50%" : "0",
          top: "0",
          width: "50%",
          height: "100%",
          borderRight: "2px solid black",
          background: "white",
          transition: "0.6s"
        }}
      />

      {/* Right Door */}
      <div
        style={{
          position: "absolute",
          right: isOpen ? "-50%" : "0",
          top: "0",
          width: "50%",
          height: "100%",
          borderLeft: "2px solid black",
          background: "white",
          transition: "0.6s"
        }}
      />
    </div>
  );
}

export default Wardrobe;
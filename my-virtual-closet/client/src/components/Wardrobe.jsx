import { useState } from "react";

function Wardrobe() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      onClick={() => setIsOpen(!isOpen)}
      style={{
        width: "92vw",
        maxWidth: "1500px",
        height: "560px",
        margin: "30px auto",
        border: "4px solid black",
        position: "relative",
        overflow: "hidden",
        cursor: "pointer",
        background: "#f9f9f9"
      }}
    >
      {isOpen && (
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            padding: "25px",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between"
          }}
        >
          <div
            style={{
              borderBottom: "2px solid black",
              paddingBottom: "12px",
              textAlign: "center",
              fontWeight: "bold",
              fontSize: "22px"
            }}
          >
            HEADWEAR
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "25px",
              marginTop: "25px",
              flexGrow: 1
            }}
          >
            {["JACKETS", "TOPS / DRESSES", "BOTTOMS", "ACCESSORIES"].map(
              (item) => (
                <div
                  key={item}
                  style={{
                    width: "25%",
                    border: "2px solid black",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "18px",
                    fontSize: "22px"
                  }}
                >
                  <button>←</button>
                  <div>{item}</div>
                  <button>→</button>
                </div>
              )
            )}
          </div>

          <div
            style={{
              borderTop: "2px solid black",
              paddingTop: "12px",
              textAlign: "center",
              fontWeight: "bold",
              fontSize: "22px"
            }}
          >
            SHOES
          </div>
        </div>
      )}

      <div
        style={{
          position: "absolute",
          left: isOpen ? "-50%" : "0",
          top: "0",
          width: "50%",
          height: "100%",
          borderRight: "3px solid black",
          background: "white",
          transition: "0.6s"
        }}
      />

      <div
        style={{
          position: "absolute",
          right: isOpen ? "-50%" : "0",
          top: "0",
          width: "50%",
          height: "100%",
          borderLeft: "3px solid black",
          background: "white",
          transition: "0.6s"
        }}
      />
    </div>
  );
}

export default Wardrobe;
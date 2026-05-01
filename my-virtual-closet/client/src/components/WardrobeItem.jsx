import { useState } from "react";

function WardrobeItem({ item, onDelete }) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <>
      <div
        onClick={() => setShowDetails(true)}
        style={{
          border: "2px solid black",
          padding: "10px",
          minHeight: "210px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
          background: "white",
          cursor: "pointer"
        }}
      >
        {item.image && (
          <img
            src={item.image}
            alt={item.name}
            style={{
              width: "90px",
              height: "90px",
              objectFit: "cover",
              marginBottom: "8px",
              border: "1px solid black"
            }}
          />
        )}

        <div style={{ fontSize: "14px", textAlign: "center" }}>
          {item.name}
        </div>

        <div style={{ fontSize: "12px", textAlign: "center" }}>
          {item.sizeSystem} {item.size}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(item.id);
          }}
          style={{
            marginTop: "8px",
            padding: "4px 8px",
            fontSize: "12px",
            cursor: "pointer"
          }}
        >
          Move to Bin
        </button>
      </div>

      {showDetails && (
        <div
          onClick={() => setShowDetails(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.4)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "380px",
              background: "white",
              border: "2px solid black",
              padding: "25px",
              textAlign: "center",
              position: "relative"
            }}
          >
            <button
              onClick={() => setShowDetails(false)}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px"
              }}
            >
              X
            </button>

            <h2>{item.name}</h2>

            {item.image && (
              <img
                src={item.image}
                alt={item.name}
                style={{
                  width: "160px",
                  height: "160px",
                  objectFit: "cover",
                  border: "1px solid black",
                  marginBottom: "15px"
                }}
              />
            )}

            <p><strong>Category:</strong> {item.category || "Not set"}</p>
            <p><strong>Gender:</strong> {item.gender || "Not set"}</p>
            <p><strong>Size:</strong> {item.sizeSystem || ""} {item.size || "Not set"}</p>
            <p><strong>Season:</strong> {item.season || "Not set"}</p>
            <p><strong>Occasion:</strong> {item.occasion || "Not set"}</p>

            <button
              onClick={() => {
                onDelete(item.id);
                setShowDetails(false);
              }}
              style={{
                marginTop: "12px",
                padding: "8px 14px"
              }}
            >
              Move to Bin
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default WardrobeItem;
import { useNavigate } from "react-router-dom";

function FeatureIcons() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "18px",
        width: "100%",
        flexWrap: "wrap"
      }}
    >
      <button onClick={() => navigate("/wardrobe-check")}>
        Wardrobe Check
      </button>

      <button onClick={() => navigate("/wardrobe-planning")}>
        Wardrobe Planning
      </button>

      <button onClick={() => navigate("/wishlist")}>
        Wishlist
      </button>

      <button onClick={() => navigate("/sell")}>
        Sell
      </button>

      <button onClick={() => navigate("/recycle")}>
        Recycle
      </button>

      <button onClick={() => navigate("/bin")}>
        Bin
      </button>
    </div>
  );
}

export default FeatureIcons;
import { useState } from "react";
import { generateSustainabilityAdvice } from "../services/aiService";

function AddClothingForm({
  onAddItem,
  items = [],
  wishlistItems = [],
  recycleItems = []
}) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Tops");
  const [image, setImage] = useState("");

  const [gender, setGender] = useState("Unisex");
  const [sizeSystem, setSizeSystem] = useState("UK");
  const [size, setSize] = useState("");
  const [season, setSeason] = useState("All seasons");
  const [occasion, setOccasion] = useState("Everyday");

  const [aiAdvice, setAiAdvice] = useState("");
  const [loadingAdvice, setLoadingAdvice] = useState(false);

  const convertImageToBase64 = (file) => {
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setImage(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const handleGenerateAdvice = async () => {
    if (!name) {
      alert("Please add the item name first");
      return;
    }

    setLoadingAdvice(true);

    const advice = await generateSustainabilityAdvice({
      wardrobeCount: items.length,
      recycleCount: recycleItems.length,
      wishlistCount: wishlistItems.length,
      itemName: name,
      category
    });

    setAiAdvice(advice);
    setLoadingAdvice(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !image) {
      alert("Please add name and image");
      return;
    }

    if (!size) {
      alert("Please add size");
      return;
    }

    const newItem = {
      name,
      category,
      image,
      gender,
      sizeSystem,
      size,
      season,
      occasion
    };

    onAddItem(newItem);

    setName("");
    setCategory("Tops");
    setImage("");
    setGender("Unisex");
    setSizeSystem("UK");
    setSize("");
    setSeason("All seasons");
    setOccasion("Everyday");
    setAiAdvice("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        border: "2px solid black",
        padding: "20px",
        maxWidth: "850px",
        margin: "0 auto 30px"
      }}
    >
      <h2>Add Clothing Item</h2>

      <input
        type="text"
        placeholder="Item name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ padding: "8px", margin: "6px", width: "180px" }}
      />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        style={{ padding: "8px", margin: "6px" }}
      >
        <option>Headwear</option>
        <option>Jackets</option>
        <option>Tops</option>
        <option>Dresses</option>
        <option>Bottoms</option>
        <option>Accessories</option>
        <option>Shoes</option>
      </select>

      <select
        value={gender}
        onChange={(e) => setGender(e.target.value)}
        style={{ padding: "8px", margin: "6px" }}
      >
        <option>Female</option>
        <option>Male</option>
        <option>Unisex</option>
      </select>

      <select
        value={sizeSystem}
        onChange={(e) => setSizeSystem(e.target.value)}
        style={{ padding: "8px", margin: "6px" }}
      >
        <option>UK</option>
        <option>US</option>
        <option>EU</option>
        <option>International</option>
      </select>

      <input
        type="text"
        placeholder="Size e.g. 8, 10, M, 38"
        value={size}
        onChange={(e) => setSize(e.target.value)}
        style={{ padding: "8px", margin: "6px", width: "170px" }}
      />

      <select
        value={season}
        onChange={(e) => setSeason(e.target.value)}
        style={{ padding: "8px", margin: "6px" }}
      >
        <option>All seasons</option>
        <option>Spring</option>
        <option>Summer</option>
        <option>Autumn</option>
        <option>Winter</option>
      </select>

      <select
        value={occasion}
        onChange={(e) => setOccasion(e.target.value)}
        style={{ padding: "8px", margin: "6px" }}
      >
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

      <input
        type="file"
        accept="image/*"
        onChange={(e) => convertImageToBase64(e.target.files[0])}
        style={{ marginTop: "10px", display: "block" }}
      />

      {image && (
        <img
          src={image}
          alt="Preview"
          style={{
            width: "80px",
            height: "80px",
            objectFit: "cover",
            marginTop: "10px",
            border: "1px solid black"
          }}
        />
      )}

      <br />

      <button
        type="button"
        onClick={handleGenerateAdvice}
        style={{
          marginTop: "12px",
          marginRight: "10px",
          padding: "10px 16px",
          borderRadius: "20px",
          border: "none",
          background: "linear-gradient(135deg, #6d5dfc, #2f6f73)",
          color: "white",
          fontWeight: "bold",
          cursor: "pointer"
        }}
      >
        {loadingAdvice ? "Generating..." : "Get AI Sustainability Advice"}
      </button>

      <button
        type="submit"
        style={{
          marginTop: "12px",
          padding: "8px 14px"
        }}
      >
        Add Item
      </button>

      {aiAdvice && (
        <div
          style={{
            marginTop: "20px",
            padding: "18px",
            borderRadius: "18px",
            background: "rgba(255,255,255,0.85)",
            border: "1px solid rgba(31,41,51,0.16)",
            boxShadow: "0 10px 24px rgba(31,41,51,0.08)",
            textAlign: "left"
          }}
        >
          <h3 style={{ marginTop: 0 }}>AI Sustainability Advisor</h3>
          <p style={{ lineHeight: "1.7", marginBottom: 0 }}>{aiAdvice}</p>
        </div>
      )}
    </form>
  );
}

export default AddClothingForm;
import { useState } from "react";

function AddClothingForm({ onAddItem }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Tops");
  const [image, setImage] = useState("");

  const convertImageToBase64 = (file) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      setImage(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !image) {
      alert("Please add name and image");
      return;
    }

    const newItem = {
      id: Date.now(),
      name,
      category,
      image
    };

    onAddItem(newItem);

    setName("");
    setCategory("Tops");
    setImage("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        border: "2px solid black",
        padding: "20px",
        maxWidth: "550px",
        margin: "0 auto 30px"
      }}
    >
      <h2>Add Clothing Item</h2>

      <input
        type="text"
        placeholder="Item name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{
          padding: "8px",
          marginRight: "10px"
        }}
      />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        style={{
          padding: "8px",
          marginRight: "10px"
        }}
      >
        <option>Headwear</option>
        <option>Jackets</option>
        <option>Tops</option>
        <option>Bottoms</option>
        <option>Accessories</option>
        <option>Shoes</option>
      </select>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => convertImageToBase64(e.target.files[0])}
        style={{
          marginTop: "10px",
          display: "block"
        }}
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
        type="submit"
        style={{
          marginTop: "12px",
          padding: "8px 14px"
        }}
      >
        Add Item
      </button>
    </form>
  );
}

export default AddClothingForm;
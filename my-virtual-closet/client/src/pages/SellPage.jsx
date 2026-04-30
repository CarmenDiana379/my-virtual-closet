import { useState } from "react";
import PageLayout from "../components/PageLayout";
import { useWardrobe } from "../store/WardrobeStore";

function SellPage() {
  const { items, sellItems, addSellItem, removeSellItem } = useWardrobe();

  const [mode, setMode] = useState("wardrobe");

  const [selectedItemId, setSelectedItemId] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Tops");
  const [image, setImage] = useState(null);

  const [price, setPrice] = useState("");
  const [condition, setCondition] = useState("Good");
  const [description, setDescription] = useState("");
  const [vintedLink, setVintedLink] = useState("");
  const [depopLink, setDepopLink] = useState("");
  const [ebayLink, setEbayLink] = useState("");

  const resetForm = () => {
    setSelectedItemId("");
    setName("");
    setCategory("Tops");
    setImage(null);
    setPrice("");
    setCondition("Good");
    setDescription("");
    setVintedLink("");
    setDepopLink("");
    setEbayLink("");
  };

  const handleAddSellItem = (e) => {
    e.preventDefault();

    let baseItem = null;

    if (mode === "wardrobe") {
      baseItem = items.find((item) => item.id === Number(selectedItemId));

      if (!baseItem) {
        alert("Please select an item from your wardrobe");
        return;
      }
    }

    if (mode === "manual" && (!name || !image)) {
      alert("Please add item name and image");
      return;
    }

    if (!price || !description) {
      alert("Please add price and description");
      return;
    }

    const newSellItem = {
      id: Date.now(),
      name: mode === "wardrobe" ? baseItem.name : name,
      category: mode === "wardrobe" ? baseItem.category : category,
      image: mode === "wardrobe" ? baseItem.image : URL.createObjectURL(image),
      price,
      condition,
      description,
      vintedLink,
      depopLink,
      ebayLink,
      source: mode
    };

    addSellItem(newSellItem);
    resetForm();
  };

  const copyDescription = (text) => {
    navigator.clipboard.writeText(text);
    alert("Description copied");
  };

  return (
    <PageLayout title="Sell">
      <p>
        Add clothing items you want to sell and create descriptions that can be copied to Vinted, Depop or eBay.
      </p>

      <div style={{ margin: "20px 0" }}>
        <button
          onClick={() => setMode("wardrobe")}
          style={{
            padding: "8px 18px",
            marginRight: "10px",
            background: mode === "wardrobe" ? "#ddd" : "white"
          }}
        >
          Add from Wardrobe
        </button>

        <button
          onClick={() => setMode("manual")}
          style={{
            padding: "8px 18px",
            background: mode === "manual" ? "#ddd" : "white"
          }}
        >
          Add Manually
        </button>
      </div>

      <form
        onSubmit={handleAddSellItem}
        style={{
          border: "2px solid black",
          padding: "20px",
          maxWidth: "800px",
          margin: "25px auto"
        }}
      >
        <h2>Add Selling Item</h2>

        {mode === "wardrobe" && (
          <select
            value={selectedItemId}
            onChange={(e) => setSelectedItemId(e.target.value)}
            style={{ padding: "8px", margin: "6px", width: "260px" }}
          >
            <option value="">Select wardrobe item</option>

            {items.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name} ({item.category})
              </option>
            ))}
          </select>
        )}

        {mode === "manual" && (
          <>
            <input
              type="text"
              placeholder="Item name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ padding: "8px", margin: "6px", width: "220px" }}
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{ padding: "8px", margin: "6px" }}
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
              onChange={(e) => setImage(e.target.files[0])}
              style={{ margin: "10px" }}
            />
          </>
        )}

        <input
          type="number"
          placeholder="Price £"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          style={{ padding: "8px", margin: "6px", width: "120px" }}
        />

        <select
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
          style={{ padding: "8px", margin: "6px" }}
        >
          <option>New</option>
          <option>Like New</option>
          <option>Good</option>
          <option>Used</option>
          <option>Needs Repair</option>
        </select>

        <br />

        <textarea
          placeholder="Selling description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{
            padding: "8px",
            margin: "10px",
            width: "90%",
            height: "90px"
          }}
        />

        <br />

        <input
          type="text"
          placeholder="Vinted account/link"
          value={vintedLink}
          onChange={(e) => setVintedLink(e.target.value)}
          style={{ padding: "8px", margin: "6px", width: "220px" }}
        />

        <input
          type="text"
          placeholder="Depop account/link"
          value={depopLink}
          onChange={(e) => setDepopLink(e.target.value)}
          style={{ padding: "8px", margin: "6px", width: "220px" }}
        />

        <input
          type="text"
          placeholder="eBay account/link"
          value={ebayLink}
          onChange={(e) => setEbayLink(e.target.value)}
          style={{ padding: "8px", margin: "6px", width: "220px" }}
        />

        <br />

        <button
          type="submit"
          style={{
            marginTop: "15px",
            padding: "8px 22px"
          }}
        >
          Add to Sell Page
        </button>
      </form>

      <h2>Items for Sale</h2>

      {sellItems.length === 0 ? (
        <p>No selling items added yet.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: "18px",
            maxWidth: "1100px",
            margin: "30px auto"
          }}
        >
          {sellItems.map((item) => (
            <div
              key={item.id}
              style={{
                border: "2px solid black",
                padding: "14px",
                textAlign: "center",
                background: "white"
              }}
            >
              {item.image && (
                <img
                  src={item.image}
                  alt={item.name}
                  style={{
                    width: "130px",
                    height: "130px",
                    objectFit: "cover",
                    border: "1px solid black"
                  }}
                />
              )}

              <h3>{item.name}</h3>
              <p>{item.category}</p>
              <p>Condition: {item.condition}</p>
              <p>Price: £{item.price}</p>

              <p>{item.description}</p>

              <button
                onClick={() => copyDescription(item.description)}
                style={{ margin: "5px", padding: "6px 10px" }}
              >
                Copy Description
              </button>

              {item.vintedLink && (
                <button
                  onClick={() => window.open(item.vintedLink, "_blank")}
                  style={{ margin: "5px", padding: "6px 10px" }}
                >
                  Vinted
                </button>
              )}

              {item.depopLink && (
                <button
                  onClick={() => window.open(item.depopLink, "_blank")}
                  style={{ margin: "5px", padding: "6px 10px" }}
                >
                  Depop
                </button>
              )}

              {item.ebayLink && (
                <button
                  onClick={() => window.open(item.ebayLink, "_blank")}
                  style={{ margin: "5px", padding: "6px 10px" }}
                >
                  eBay
                </button>
              )}

              <br />

              <button
                onClick={() => removeSellItem(item.id)}
                style={{ marginTop: "8px", padding: "6px 10px" }}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </PageLayout>
  );
}

export default SellPage;
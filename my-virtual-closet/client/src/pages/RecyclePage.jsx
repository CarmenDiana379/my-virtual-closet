import { useState } from "react";
import PageLayout from "../components/PageLayout";
import { useWardrobe } from "../store/WardrobeStore";
import RecycleMap from "../components/RecycleMap";
import { useTheme } from "../store/ThemeStore";

function RecyclePage() {
    const { theme } = useTheme();
  const { recycleItems, addRecycleItem, removeRecycleItem } = useWardrobe();

  const [name, setName] = useState("");
  const [category, setCategory] = useState("Tops");
  const [image, setImage] = useState("");
  const [reason, setReason] = useState("Damaged");
  const [method, setMethod] = useState("Textile recycling bank");
  const [notes, setNotes] = useState("");

  const suggestions = {
    "Textile recycling bank": [
      "Use for damaged clothing that cannot be resold.",
      "Check supermarket or council textile bank points.",
      "Wash and bag items before recycling where possible."
    ],
    Donate: [
      "Best for wearable clothes in good condition.",
      "Consider charity shops, shelters or community groups.",
      "Avoid donating heavily damaged clothing."
    ],
    Repair: [
      "Best for clothes with small tears, missing buttons or sizing issues.",
      "Consider a tailor, repair café or DIY repair.",
      "Repairing extends garment life and reduces waste."
    ],
    Upcycle: [
      "Best for clothes that can become something new.",
      "Try turning old shirts into tote bags or cleaning cloths.",
      "Useful for creative reuse before disposal."
    ],
    "Charity shop": [
      "Best for clean, wearable items.",
      "Check the charity shop accepts clothing donations.",
      "Bag items neatly before donating."
    ]
  };

  const convertImageToBase64 = (file) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      setImage(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const handleAddRecycleItem = async (e) => {
    e.preventDefault();

    if (!name || !image) {
      alert("Please add item name and image");
      return;
    }

    await addRecycleItem({
      name,
      category,
      image,
      reason,
      method,
      notes
    });

    setName("");
    setCategory("Tops");
    setImage("");
    setReason("Damaged");
    setMethod("Textile recycling bank");
    setNotes("");
  };

  return (
    <PageLayout title="Recycle">
      <p>
        Add clothing items that should be recycled, repaired, donated or
        upcycled instead of being thrown away.
      </p>

      <form
        onSubmit={handleAddRecycleItem}
        style={{
          border: "2px solid black",
          padding: "20px",
          maxWidth: "750px",
          margin: "25px auto"
        }}
      >
        <h2>Add Recycle Item</h2>

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

        <select
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          style={{ padding: "8px", margin: "6px" }}
        >
          <option>Damaged</option>
          <option>Too worn</option>
          <option>No longer fits</option>
          <option>No longer used</option>
          <option>Unsuitable for selling</option>
        </select>

        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          style={{ padding: "8px", margin: "6px" }}
        >
          <option>Textile recycling bank</option>
          <option>Donate</option>
          <option>Repair</option>
          <option>Upcycle</option>
          <option>Charity shop</option>
        </select>

        <div
          style={{
            border: "1px solid black",
            padding: "12px",
            maxWidth: "600px",
            margin: "15px auto",
            textAlign: "left"
          }}
        >
          <strong>Smart suggestion:</strong>

          <ul>
            {suggestions[method].map((suggestion, index) => (
              <li key={index}>{suggestion}</li>
            ))}
          </ul>
        </div>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => convertImageToBase64(e.target.files[0])}
          style={{ margin: "10px" }}
        />

        {image && (
          <div>
            <img
              src={image}
              alt="Preview"
              style={{
                width: "90px",
                height: "90px",
                objectFit: "cover",
                border: "1px solid black"
              }}
            />
          </div>
        )}

        <textarea
          placeholder="Notes / recycling plan"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          style={{
            padding: "8px",
            margin: "10px",
            width: "90%",
            height: "80px"
          }}
        />

        <br />

        <button
          type="submit"
          style={{ padding: "8px 20px", marginTop: "10px" }}
        >
          Add to Recycle
        </button>
      </form>

      <h2>Recycle List</h2>

      {recycleItems.length === 0 ? (
        <p>No recycle items added yet.</p>
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
          {recycleItems.map((item) => (
            <div
              key={item.id}
              style={{
                border: "2px solid black",
                padding: "14px",
                background: theme.card,
color: theme.text,
border: `2px solid ${theme.border}`,
                textAlign: "center"
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
      border: "1px solid black",
      display: "block",
      margin: "0 auto 10px"
    }}
  />
)}

              <h3>{item.name}</h3>
              <p>Category: {item.category}</p>
              <p>Reason: {item.reason}</p>
              <p>Method: {item.method}</p>

              {item.notes && <p>Notes: {item.notes}</p>}

              <button
                onClick={() => removeRecycleItem(item.id)}
                style={{ marginTop: "8px", padding: "6px 10px" }}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      <RecycleMap />
    </PageLayout>
  );
}

export default RecyclePage;
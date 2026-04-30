import { useState } from "react";
import PageLayout from "../components/PageLayout";
import WardrobeItem from "../components/WardrobeItem";
import AddClothingForm from "../components/AddClothingForm";
import { useWardrobe } from "../store/WardrobeStore";

function WardrobeCheckPage() {
  const {
    items,
    addItem,
    moveToBin
  } = useWardrobe();

  const categories = [
    "Headwear",
    "Jackets",
    "Tops",
    "Bottoms",
    "Accessories",
    "Shoes"
  ];

  const [selectedCategory, setSelectedCategory] = useState("Tops");

  const handleAddItem = (newItem) => {
    addItem(newItem);
    setSelectedCategory(newItem.category);
  };

  const filteredItems = items.filter(
    (item) => item.category === selectedCategory
  );

  return (
    <PageLayout title="Wardrobe Check">
      <AddClothingForm onAddItem={handleAddItem} />

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "12px",
          flexWrap: "wrap",
          marginBottom: "30px"
        }}
      >
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: "8px 16px",
              border: "2px solid black",
              background: selectedCategory === cat ? "#ddd" : "white"
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
          gap: "16px",
          maxWidth: "900px",
          margin: "0 auto"
        }}
      >
        {filteredItems.map((item) => (
          <WardrobeItem
            key={item.id}
            item={item}
            onDelete={moveToBin}
          />
        ))}
      </div>
    </PageLayout>
  );
}

export default WardrobeCheckPage;
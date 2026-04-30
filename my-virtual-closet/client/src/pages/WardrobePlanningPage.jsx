import { useState } from "react";
import PageLayout from "../components/PageLayout";
import { useWardrobe } from "../store/WardrobeStore";

function WardrobePlanningPage() {
  const {
    items,
    wishlistItems,
    savedOutfits,
    saveOutfit,
    deleteOutfit
  } = useWardrobe();

  const categories = [
    "Headwear",
    "Jackets",
    "Tops",
    "Bottoms",
    "Accessories",
    "Shoes"
  ];

  const outfitCategories = [
    "Spring",
    "Summer",
    "Autumn",
    "Winter",
    "Job Interview",
    "Casual Dinner",
    "Fancy Dinner",
    "Date",
    "House Party",
    "Club Night",
    "City Trip",
    "Resort Holiday",
    "Ski",
    "Beach",
    "Everyday",
    "Formal Event"
  ];

  const allItems = [...items, ...wishlistItems];

  const [carouselIndexes, setCarouselIndexes] = useState({});
  const [selectedItems, setSelectedItems] = useState({});
  const [outfitName, setOutfitName] = useState("");
  const [outfitCategory, setOutfitCategory] = useState("Everyday");

  const presets = {
    Spring: { Tops: "Light", Bottoms: "Jeans", Shoes: "Sneakers" },
    Summer: { Tops: "T-Shirt", Bottoms: "Shorts", Shoes: "Sandals" },
    Autumn: { Jackets: "Jacket", Bottoms: "Jeans", Shoes: "Boots" },
    Winter: { Jackets: "Coat", Accessories: "Scarf", Shoes: "Boots" },
    "Job Interview": {
      Jackets: "Blazer",
      Tops: "Shirt",
      Bottoms: "Trousers",
      Shoes: "Shoes"
    },
    "Casual Dinner": { Tops: "Top", Bottoms: "Jeans", Shoes: "Boots" },
    "Fancy Dinner": { Tops: "Elegant", Bottoms: "Trousers", Shoes: "Heels" },
    Date: { Tops: "Stylish", Bottoms: "Jeans", Accessories: "Bag" },
    "House Party": { Tops: "Party", Bottoms: "Jeans", Accessories: "Jewelry" },
    "Club Night": { Tops: "Going Out", Bottoms: "Skirt", Shoes: "Heels" },
    "City Trip": { Tops: "Casual", Bottoms: "Jeans", Shoes: "Sneakers" },
    "Resort Holiday": { Tops: "Summer", Bottoms: "Shorts", Shoes: "Sandals" },
    Ski: { Jackets: "Ski", Accessories: "Gloves", Shoes: "Boots" },
    Beach: { Tops: "Swim", Bottoms: "Shorts", Accessories: "Sunglasses" },
    Everyday: { Tops: "T-Shirt", Bottoms: "Jeans", Shoes: "Sneakers" },
    "Formal Event": {
      Jackets: "Blazer",
      Tops: "Formal",
      Bottoms: "Trousers",
      Shoes: "Shoes"
    }
  };

  const getCategoryItems = (category) => {
    return allItems.filter((item) => item.category === category);
  };

  const handleArrow = (category, direction) => {
    const categoryItems = getCategoryItems(category);
    if (categoryItems.length === 0) return;

    const currentIndex = carouselIndexes[category] || 0;
    let newIndex = currentIndex + direction;

    if (newIndex < 0) newIndex = categoryItems.length - 1;
    if (newIndex >= categoryItems.length) newIndex = 0;

    setCarouselIndexes((prev) => ({
      ...prev,
      [category]: newIndex
    }));

    setSelectedItems((prev) => ({
      ...prev,
      [category]: categoryItems[newIndex]
    }));
  };

  const applyPreset = (presetName) => {
    const preset = presets[presetName];
    const newSelection = {};

    Object.entries(preset).forEach(([category, keyword]) => {
      const categoryItems = getCategoryItems(category);

      const match =
        categoryItems.find((item) =>
          item.name.toLowerCase().includes(keyword.toLowerCase())
        ) || categoryItems[0];

      if (match) {
        newSelection[category] = match;
      }
    });

    setSelectedItems(newSelection);
    setOutfitCategory(presetName);
  };

  const handleSaveOutfit = () => {
    if (!outfitName) {
      alert("Please enter outfit name");
      return;
    }

    if (Object.keys(selectedItems).length === 0) {
      alert("Please select outfit items first");
      return;
    }

    saveOutfit(outfitName, outfitCategory, Object.values(selectedItems));

    setOutfitName("");
    setSelectedItems({});
  };

  const clearOutfit = () => {
    setSelectedItems({});
    setOutfitName("");
  };

  return (
    <PageLayout title="Wardrobe Planning">
      <p>
        Mix and match your wardrobe and wishlist items, or use pre-made outfit
        ideas by season and occasion.
      </p>

      <h2>Seasonal Outfit Ideas</h2>

      <div style={{ marginBottom: "25px" }}>
        {["Spring", "Summer", "Autumn", "Winter"].map((season) => (
          <button
            key={season}
            onClick={() => applyPreset(season)}
            style={{
              margin: "6px",
              padding: "8px 16px"
            }}
          >
            {season}
          </button>
        ))}
      </div>

      <h2>Occasion Outfit Ideas</h2>

      <div style={{ marginBottom: "35px" }}>
        {[
          "Job Interview",
          "Casual Dinner",
          "Fancy Dinner",
          "Date",
          "House Party",
          "Club Night",
          "City Trip",
          "Resort Holiday",
          "Ski",
          "Beach",
          "Everyday",
          "Formal Event"
        ].map((occasion) => (
          <button
            key={occasion}
            onClick={() => applyPreset(occasion)}
            style={{
              margin: "6px",
              padding: "8px 16px"
            }}
          >
            {occasion}
          </button>
        ))}
      </div>

      <h2>Mix & Match Outfit Builder</h2>

      <div
        style={{
          maxWidth: "420px",
          margin: "30px auto",
          display: "flex",
          flexDirection: "column",
          gap: "18px"
        }}
      >
        {categories.map((category) => {
          const categoryItems = getCategoryItems(category);
          const currentIndex = carouselIndexes[category] || 0;
          const currentItem =
            selectedItems[category] || categoryItems[currentIndex];

          return (
            <div
              key={category}
              style={{
                border: "2px solid black",
                padding: "15px",
                textAlign: "center",
                background: "white"
              }}
            >
              <h3>{category}</h3>

              {currentItem ? (
                <>
                  <button
                    onClick={() => handleArrow(category, -1)}
                    style={{
                      marginBottom: "10px",
                      padding: "6px 16px"
                    }}
                  >
                    ↑
                  </button>

                  <div>
                    {currentItem.image && (
                      <img
                        src={currentItem.image}
                        alt={currentItem.name}
                        style={{
                          width: "120px",
                          height: "120px",
                          objectFit: "cover",
                          border: "1px solid black"
                        }}
                      />
                    )}

                    <p>{currentItem.name}</p>
                  </div>

                  <button
                    onClick={() => handleArrow(category, 1)}
                    style={{
                      marginTop: "10px",
                      padding: "6px 16px"
                    }}
                  >
                    ↓
                  </button>
                </>
              ) : (
                <p>No items</p>
              )}
            </div>
          );
        })}
      </div>

      <h2>Selected Outfit</h2>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "15px",
          flexWrap: "wrap",
          marginBottom: "25px"
        }}
      >
        {Object.values(selectedItems).length === 0 ? (
          <p>No outfit selected yet.</p>
        ) : (
          Object.values(selectedItems).map((item) => (
            <div
              key={`selected-${item.id}`}
              style={{
                border: "2px solid black",
                padding: "10px",
                background: "white"
              }}
            >
              {item.image && (
                <img
                  src={item.image}
                  alt={item.name}
                  style={{
                    width: "80px",
                    height: "80px",
                    objectFit: "cover"
                  }}
                />
              )}

              <p>{item.name}</p>
            </div>
          ))
        )}
      </div>

      <div
        style={{
          border: "2px solid black",
          padding: "20px",
          maxWidth: "600px",
          margin: "25px auto"
        }}
      >
        <h2>Save Outfit</h2>

        <input
          type="text"
          placeholder="Outfit name"
          value={outfitName}
          onChange={(e) => setOutfitName(e.target.value)}
          style={{
            padding: "8px",
            margin: "8px",
            width: "220px"
          }}
        />

        <select
          value={outfitCategory}
          onChange={(e) => setOutfitCategory(e.target.value)}
          style={{
            padding: "8px",
            margin: "8px"
          }}
        >
          {outfitCategories.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>

        <br />

        <button
          onClick={handleSaveOutfit}
          style={{
            padding: "8px 18px",
            margin: "8px"
          }}
        >
          Save Outfit
        </button>

        <button
          onClick={clearOutfit}
          style={{
            padding: "8px 18px",
            margin: "8px"
          }}
        >
          Clear Outfit
        </button>
      </div>

      <h2>Saved Outfits</h2>

      {savedOutfits.length === 0 ? (
        <p>No saved outfits yet.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))",
            gap: "18px",
            maxWidth: "1100px",
            margin: "30px auto"
          }}
        >
          {savedOutfits.map((outfit) => (
            <div
              key={outfit.id}
              style={{
                border: "2px solid black",
                padding: "14px",
                background: "white",
                textAlign: "center"
              }}
            >
              <h3>{outfit.name}</h3>
              <p>Category: {outfit.outfitCategory}</p>

              <div
                style={{
                  display: "flex",
                  gap: "6px",
                  flexWrap: "wrap",
                  justifyContent: "center"
                }}
              >
                {outfit.items.map((item) => (
                  <div key={`${outfit.id}-${item.id}`}>
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                          border: "1px solid black"
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={() => deleteOutfit(outfit.id)}
                style={{
                  marginTop: "10px",
                  padding: "6px 12px"
                }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </PageLayout>
  );
}

export default WardrobePlanningPage;
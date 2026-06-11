import { useState } from "react";
import PageLayout from "../components/PageLayout";
import { useWardrobe } from "../store/WardrobeStore";
import { useTheme } from "../store/ThemeStore";

function WardrobePlanningPage() {
  const { items, wishlistItems, savedOutfits, saveOutfit, deleteOutfit } =
    useWardrobe();

  const { theme } = useTheme();

  const categories = [
    "Headwear",
    "Jackets",
    "Tops",
    "Dresses/One Piece",
    "Bottoms",
    "Accessories",
    "Shoes"
  ];

  const [seasonFilter, setSeasonFilter] = useState("All");
  const [occasionFilter, setOccasionFilter] = useState("All");
  const [genderFilter, setGenderFilter] = useState("All");
  const [savedFilter, setSavedFilter] = useState("All");

  const [carouselIndexes, setCarouselIndexes] = useState({});
  const [selectedItems, setSelectedItems] = useState({});
  const [outfitName, setOutfitName] = useState("");
  const [outfitCategory, setOutfitCategory] = useState("Everyday");
  const [smartMessage, setSmartMessage] = useState("");

  const allItems = [...items, ...wishlistItems];

  const normaliseCategory = (category) => {
    if (category === "Dresses" || category === "Dresses/ One-piece ") {
      return "Dresses/One Piece";
    }

    return category;
  };

  const filteredItems = allItems.filter((item) => {
    const matchesSeason =
      seasonFilter === "All" ||
      item.season === seasonFilter ||
      item.season === "All seasons" ||
      !item.season;

    const matchesOccasion =
      occasionFilter === "All" ||
      item.occasion === occasionFilter ||
      !item.occasion;

    const matchesGender =
      genderFilter === "All" ||
      item.gender === genderFilter ||
      item.gender === "Unisex" ||
      !item.gender;

    return matchesSeason && matchesOccasion && matchesGender;
  });

  const filteredSavedOutfits =
    savedFilter === "All"
      ? savedOutfits
      : savedOutfits.filter((outfit) => outfit.outfitCategory === savedFilter);

  const getCategoryItems = (category) => {
    return filteredItems.filter(
      (item) => normaliseCategory(item.category) === category
    );
  };

  const scoreItem = (item) => {
    let score = 0;

    if (seasonFilter !== "All" && item.season === seasonFilter) score += 3;
    if (item.season === "All seasons") score += 2;

    if (occasionFilter !== "All" && item.occasion === occasionFilter) score += 3;
    if (genderFilter !== "All" && item.gender === genderFilter) score += 2;
    if (item.gender === "Unisex") score += 1;

    if (items.some((wardrobeItem) => wardrobeItem.id === item.id)) {
      score += 2;
    }

    return score;
  };

  const chooseBestItem = (category) => {
    const categoryItems = getCategoryItems(category);

    if (categoryItems.length === 0) return null;

    const sortedItems = [...categoryItems].sort(
      (a, b) => scoreItem(b) - scoreItem(a)
    );

    return sortedItems[0];
  };

  const generateSmartOutfit = () => {
    const smartSelection = {};

    const dress = chooseBestItem("Dresses/One Piece");
    const top = chooseBestItem("Tops");
    const bottom = chooseBestItem("Bottoms");

    const useDress =
      dress &&
      (occasionFilter === "Formal Event" ||
        occasionFilter === "Fancy Dinner" ||
        occasionFilter === "Date");

    if (useDress) {
      smartSelection["Dresses/One Piece"] = dress;
    } else {
      if (top) smartSelection.Tops = top;
      if (bottom) smartSelection.Bottoms = bottom;
    }

    ["Jackets", "Shoes", "Headwear"].forEach((category) => {
      const item = chooseBestItem(category);
      if (item) smartSelection[category] = item;
    });

    const accessoryItems = getCategoryItems("Accessories");

    if (accessoryItems.length > 0) {
      smartSelection.Accessories = accessoryItems.slice(0, 3);
    }

    const newIndexes = {};

    Object.entries(smartSelection).forEach(([category, selectedValue]) => {
      const categoryItems = getCategoryItems(category);
      const firstSelectedItem = Array.isArray(selectedValue)
        ? selectedValue[0]
        : selectedValue;

      newIndexes[category] = categoryItems.findIndex(
        (item) => item.id === firstSelectedItem.id
      );
    });

    setCarouselIndexes(newIndexes);
    setSelectedItems(smartSelection);

    setSmartMessage(
      "Smart outfit generated using season, occasion, gender and wardrobe reuse logic."
    );
  };

  const handleArrow = (category, direction) => {
    const categoryItems = getCategoryItems(category);

    if (!categoryItems || categoryItems.length === 0) return;

    setCarouselIndexes((prev) => {
      const currentIndex = prev[category] ?? 0;

      let newIndex;

      if (direction === 1) {
        newIndex =
          currentIndex >= categoryItems.length - 1 ? 0 : currentIndex + 1;
      } else {
        newIndex =
          currentIndex <= 0 ? categoryItems.length - 1 : currentIndex - 1;
      }

      return {
  ...prev,
  [category]: newIndex
};
    });
  };

  const removeAccessory = (accessoryId) => {
    setSelectedItems((prev) => {
      const accessories = Array.isArray(prev.Accessories)
        ? prev.Accessories
        : [];

      return {
        ...prev,
        Accessories: accessories.filter((item) => item.id !== accessoryId)
      };
    });
  };

  const handleSaveOutfit = async () => {
    if (!outfitName) {
      alert("Please enter outfit name");
      return;
    }

    if (Object.values(selectedItems).flat().length === 0) {
      alert("Please select outfit items first");
      return;
    }

    try {
await saveOutfit(outfitName, outfitCategory, selectedItems);
  alert("Outfit saved successfully!");
} catch (error) {
  console.error("SAVE OUTFIT ERROR:", error);
  alert("Outfit was not saved: " + error.message);
}

    setOutfitName("");
    setSelectedItems({});
    setSmartMessage("");
  };

  const clearOutfit = () => {
    setSelectedItems({});
    setOutfitName("");
    setSmartMessage("");
  };

  const selectedItemsFlat = Object.values(selectedItems).flat();

  const sustainabilityScore = Math.min(
    selectedItemsFlat.length * 12 +
      selectedItemsFlat.filter((item) =>
        items.some((wardrobeItem) => wardrobeItem.id === item.id)
      ).length *
        6,
    100
  );

  const planningBadges = [];

  if (savedOutfits.length >= 1) planningBadges.push("👗 First Outfit Saved");
  if (savedOutfits.length >= 3) planningBadges.push("✨ Outfit Creator");
  if (savedOutfits.length >= 5) planningBadges.push("🏆 Wardrobe Planner");
  if (sustainabilityScore >= 70) planningBadges.push("🌿 Sustainable Stylist");

  return (
    <PageLayout title="Wardrobe Planning">
      <p>
        Build outfits using wardrobe and wishlist items. The smart outfit engine
        uses season, occasion and reuse logic to suggest stronger combinations.
      </p>

      <h2>Smart Outfit Filters</h2>

      <div
        style={{
          border: `3px solid ${theme.border}`,
          background: theme.card,
          color: theme.text,
          padding: "18px",
          maxWidth: "950px",
          margin: "20px auto",
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          flexWrap: "wrap",
          borderRadius: theme.radius
        }}
      >
        <select
          value={seasonFilter}
          onChange={(e) => setSeasonFilter(e.target.value)}
          style={{ padding: "9px" }}
        >
          <option>All</option>
          <option>Spring</option>
          <option>Summer</option>
          <option>Autumn</option>
          <option>Winter</option>
        </select>

        <select
          value={occasionFilter}
          onChange={(e) => setOccasionFilter(e.target.value)}
          style={{ padding: "9px" }}
        >
          <option>All</option>
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

        <select
          value={genderFilter}
          onChange={(e) => setGenderFilter(e.target.value)}
          style={{ padding: "9px" }}
        >
          <option>All</option>
          <option>Female</option>
          <option>Male</option>
          <option>Unisex</option>
        </select>

        <button
          type="button"
          onClick={generateSmartOutfit}
          style={{
            padding: "10px 20px",
            background: "linear-gradient(135deg, #6d5dfc, #2f6f73)",
            color: "white",
            border: "none",
            borderRadius: "22px",
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >
          Generate Smart Outfit
        </button>
      </div>

      {smartMessage && (
        <div
          style={{
            maxWidth: "850px",
            margin: "0 auto 25px",
            padding: "16px",
            border: `2px solid ${theme.border}`,
            borderRadius: theme.radius,
            background: theme.card
          }}
        >
          <strong>✨ Recommendation Result:</strong>
          <p style={{ marginBottom: 0 }}>{smartMessage}</p>
        </div>
      )}

      <h2>Mix & Match Outfit Builder</h2>

      <div
        style={{
          maxWidth: "500px",
          margin: "30px auto",
          display: "flex",
          flexDirection: "column",
          gap: "18px"
        }}
      >
        {categories.map((category) => {
          const categoryItems = getCategoryItems(category);
          const currentIndex = carouselIndexes[category] ?? 0;
          const selectedValue = selectedItems[category];

          const currentItem =
            category === "Accessories"
              ? categoryItems[currentIndex]
              : selectedValue || categoryItems[currentIndex];

          return (
            <div
              key={category}
              style={{
                border: `2px solid ${theme.border}`,
                padding: "15px",
                textAlign: "center",
                background: theme.card,
                color: theme.text,
                borderRadius: theme.radius
              }}
            >
              <h3>{category}</h3>

              {currentItem ? (
                <>
                  <button
                    onClick={() => handleArrow(category, -1)}
                    style={{ padding: "6px 16px", marginBottom: "10px" }}
                  >
                    ↑
                  </button>

                  <div
  onClick={() => {
    if (category === "Accessories") {
      const existingAccessories = Array.isArray(
        selectedItems.Accessories
      )
        ? selectedItems.Accessories
        : [];

      const alreadySelected = existingAccessories.some(
        (item) => item.id === currentItem.id
      );

      if (!alreadySelected) {
        setSelectedItems((prev) => ({
          ...prev,
          Accessories: [...existingAccessories, currentItem]
        }));
      }
    } else {
      setSelectedItems((prev) => ({
        ...prev,
        [category]: currentItem
      }));
    }
  }}
  style={{
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer"
  }}
>
  {currentItem.image && (
    <img
      src={currentItem.image}
      alt={currentItem.name}
      style={{
        width: "130px",
        height: "130px",
        objectFit: "cover",
        border: `1px solid ${theme.border}`,
        borderRadius: theme.radius
      }}
    />
  )}

  <p>{currentItem.name}</p>

  <p>
    {currentItem.sizeSystem} {currentItem.size}
  </p>

  <small>
    {currentItem.season} • {currentItem.occasion}
  </small>

  {category === "Accessories" && (
    <p style={{ fontSize: "12px", marginTop: "8px" }}>
      Use arrows to add more accessories.
    </p>
  )}
</div>

                  <button
  onClick={() => handleArrow(category, 1)}
  style={{ padding: "6px 16px", marginTop: "10px" }}
>
  ↓
</button>

<p
  style={{
    marginTop: "10px",
    fontSize: "12px",
    fontWeight: "bold",
    color: theme.text
  }}
>
  Click item to select
</p>
</>
) : (
  <p>No matching items</p>
)}
</div>
);
})}
      </div>

      <h2>Selected Outfit</h2>
      <button
  onClick={clearOutfit}
  style={{
    padding: "8px 18px",
    marginTop: "15px"
  }}
>
  🗑 Clear Entire Outfit
</button>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "15px",
          flexWrap: "wrap",
          marginBottom: "25px"
        }}
      >
        {selectedItemsFlat.length === 0 ? (
          <p>No outfit selected yet.</p>
        ) : (
          selectedItemsFlat.map((item) => (
            <div
              key={`selected-${item.id}`}
              style={{
                border: `2px solid ${theme.border}`,
                padding: "12px",
                background: theme.card,
                color: theme.text,
                borderRadius: theme.radius
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
                    borderRadius: theme.radius
                  }}
                />
              )}

              <p>{item.name}</p>

              <button
  type="button"
  onClick={() => {
    setSelectedItems((prev) => {
      const updated = { ...prev };

      Object.keys(updated).forEach((category) => {
        if (Array.isArray(updated[category])) {
          updated[category] = updated[category].filter(
            (selectedItem) => selectedItem.id !== item.id
          );

          if (updated[category].length === 0) {
            delete updated[category];
          }
        } else if (updated[category]?.id === item.id) {
          delete updated[category];
        }
      });

      return updated;
    });
  }}
  style={{
    padding: "5px 10px",
    fontSize: "12px",
    marginTop: "5px"
  }}
>
  ❌ Remove
</button>

              {normaliseCategory(item.category) === "Accessories" && (
                <button
                  type="button"
                  onClick={() => removeAccessory(item.id)}
                  style={{
                    padding: "5px 10px",
                    fontSize: "12px",
                    marginTop: "5px"
                  }}
                >
                  Remove
                </button>
              )}
            </div>
          ))
        )}
      </div>

      <div
        style={{
          maxWidth: "700px",
          margin: "0 auto 30px",
          border: "2px solid #22c55e",
          padding: "18px",
          background: "#f0fff4",
          textAlign: "center",
          borderRadius: "20px",
          color: "#14532d"
        }}
      >
        <h2>AI-Inspired Sustainability Score</h2>

        <div
          style={{
            width: "100%",
            height: "24px",
            background: "#d1d5db",
            borderRadius: "20px",
            overflow: "hidden",
            marginBottom: "10px"
          }}
        >
          <div
            style={{
              width: `${sustainabilityScore}%`,
              height: "100%",
              background: "linear-gradient(to right, #22c55e, #14b8a6)"
            }}
          />
        </div>

        <strong>{sustainabilityScore}% Sustainable Match</strong>

        <p style={{ marginTop: "10px" }}>
          The score increases when the outfit reuses existing wardrobe items and
          creates a complete, practical outfit combination.
        </p>
      </div>

      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto 30px",
          border: `2px solid ${theme.border}`,
          padding: "18px",
          background: theme.card,
          color: theme.text,
          borderRadius: theme.radius
        }}
      >
        <h2>Planning Badges</h2>

        {planningBadges.length === 0 ? (
          <p>No planning badges unlocked yet. Save your first outfit to begin.</p>
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "10px",
              flexWrap: "wrap"
            }}
          >
            {planningBadges.map((badge) => (
              <div
                key={badge}
                style={{
                  border: `2px solid ${theme.border}`,
                  padding: "10px 14px",
                  borderRadius: theme.radius,
                  background: theme.background
                }}
              >
                {badge}
              </div>
            ))}
          </div>
        )}
      </div>

      <div
        style={{
          border: `2px solid ${theme.border}`,
          padding: "20px",
          maxWidth: "650px",
          margin: "25px auto",
          background: theme.card,
          color: theme.text,
          borderRadius: theme.radius
        }}
      >
        <h2>Save Outfit</h2>

        <input
          type="text"
          placeholder="Outfit name"
          value={outfitName}
          onChange={(e) => setOutfitName(e.target.value)}
          style={{ padding: "8px", margin: "8px", width: "220px" }}
        />

        <select
          value={outfitCategory}
          onChange={(e) => setOutfitCategory(e.target.value)}
          style={{ padding: "8px", margin: "8px" }}
        >
          <option>Everyday</option>
          <option>Spring</option>
          <option>Summer</option>
          <option>Autumn</option>
          <option>Winter</option>
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

        <br />

        <button
          onClick={handleSaveOutfit}
          style={{ padding: "8px 18px", margin: "8px" }}
        >
          Save Outfit
        </button>

        <button
          onClick={clearOutfit}
          style={{ padding: "8px 18px", margin: "8px" }}
        >
          Clear Outfit
        </button>
      </div>

      <h2>Saved Outfits</h2>

      <select
        value={savedFilter}
        onChange={(e) => setSavedFilter(e.target.value)}
        style={{ padding: "8px", marginBottom: "20px" }}
      >
        <option>All</option>
        <option>Everyday</option>
        <option>Spring</option>
        <option>Summer</option>
        <option>Autumn</option>
        <option>Winter</option>
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

      {filteredSavedOutfits.length === 0 ? (
        <p>No saved outfits match this filter.</p>
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
          {filteredSavedOutfits.map((outfit) => (
            <div
              key={outfit.id}
              style={{
                border: `2px solid ${theme.border}`,
                padding: "14px",
                background: theme.card,
                color: theme.text,
                textAlign: "center",
                borderRadius: theme.radius
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
                {outfit.items?.map((item, index) => {
  const fullItem =
    [...items, ...wishlistItems].find(
      (wardrobeItem) => wardrobeItem.id === item.id
    ) || item;

  return (
    <div
      key={`${outfit.id}-${item.id || index}`}
      style={{
        width: "70px",
        minHeight: "90px",
        border: `1px solid ${theme.border}`,
        borderRadius: theme.radius,
        padding: "6px",
        background: theme.background,
        color: theme.text,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      {fullItem.image ? (
        <img
          src={fullItem.image}
          alt={fullItem.name}
          style={{
            width: "50px",
            height: "50px",
            objectFit: "cover",
            borderRadius: theme.radius,
            border: `1px solid ${theme.border}`
          }}
        />
      ) : (
        <div
          style={{
            width: "50px",
            height: "50px",
            borderRadius: theme.radius,
            border: `1px dashed ${theme.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "20px",
            background: theme.card
          }}
        >
          👕
        </div>
      )}

      <p
        style={{
          fontSize: "10px",
          margin: "5px 0 0",
          textAlign: "center",
          wordBreak: "break-word"
        }}
      >
        {fullItem.name || "Item"}
      </p>
    </div>
  );
})}
      
              </div>

              <button
                onClick={() => deleteOutfit(outfit.id)}
                style={{ marginTop: "10px", padding: "6px 12px" }}
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
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
    "Dresses",
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
    return filteredItems.filter((item) => item.category === category);
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

    const dress = chooseBestItem("Dresses");
    const top = chooseBestItem("Tops");
    const bottom = chooseBestItem("Bottoms");

    const useDress =
      dress &&
      (occasionFilter === "Formal Event" ||
        occasionFilter === "Fancy Dinner" ||
        occasionFilter === "Date");

    if (useDress) {
      smartSelection.Dresses = dress;
    } else {
      if (top) smartSelection.Tops = top;
      if (bottom) smartSelection.Bottoms = bottom;
    }

    ["Jackets", "Shoes", "Accessories", "Headwear"].forEach((category) => {
      const item = chooseBestItem(category);
      if (item) smartSelection[category] = item;
    });

    const newIndexes = {};

    Object.entries(smartSelection).forEach(([category, item]) => {
      const categoryItems = getCategoryItems(category);
      newIndexes[category] = categoryItems.findIndex((i) => i.id === item.id);
    });

    setCarouselIndexes(newIndexes);
    setSelectedItems(smartSelection);

    setSmartMessage(
      "Smart outfit generated using season, occasion, gender and wardrobe reuse logic."
    );
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

  const handleSaveOutfit = async () => {
    if (!outfitName) {
      alert("Please enter outfit name");
      return;
    }

    if (Object.keys(selectedItems).length === 0) {
      alert("Please select outfit items first");
      return;
    }

    await saveOutfit(outfitName, outfitCategory, Object.values(selectedItems));

    setOutfitName("");
    setSelectedItems({});
    setSmartMessage("");
  };

  const clearOutfit = () => {
    setSelectedItems({});
    setOutfitName("");
    setSmartMessage("");
  };

  const sustainabilityScore = Math.min(
    Object.values(selectedItems).length * 12 +
      Object.values(selectedItems).filter((item) =>
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
          const currentIndex = carouselIndexes[category] || 0;
          const currentItem =
            selectedItems[category] || categoryItems[currentIndex];

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

                  <div>
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
                  </div>

                  <button
                    onClick={() => handleArrow(category, 1)}
                    style={{ padding: "6px 16px", marginTop: "10px" }}
                  >
                    ↓
                  </button>
                </>
              ) : (
                <p>No matching items</p>
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
                          border: `1px solid ${theme.border}`,
                          borderRadius: theme.radius
                        }}
                      />
                    )}
                  </div>
                ))}
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
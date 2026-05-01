import { useState } from "react";
import PageLayout from "../components/PageLayout";
import { useWardrobe } from "../store/WardrobeStore";

function WardrobePlanningPage() {
  const { items, wishlistItems, savedOutfits, saveOutfit, deleteOutfit } =
    useWardrobe();

  const categories = [
    "Headwear",
    "Jackets",
    "Tops",
    "Bottoms",
    "Accessories",
    "Shoes"
  ];

  const [seasonFilter, setSeasonFilter] = useState("All");
  const [occasionFilter, setOccasionFilter] = useState("All");
  const [genderFilter, setGenderFilter] = useState("All");

  const [carouselIndexes, setCarouselIndexes] = useState({});
  const [selectedItems, setSelectedItems] = useState({});
  const [outfitName, setOutfitName] = useState("");
  const [outfitCategory, setOutfitCategory] = useState("Everyday");

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

  const getCategoryItems = (category) => {
    return filteredItems.filter((item) => item.category === category);
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
  };

  const clearOutfit = () => {
    setSelectedItems({});
    setOutfitName("");
  };

  return (
    <PageLayout title="Wardrobe Planning">
      <p>
        Build outfits using wardrobe and wishlist items. Filter by season,
        occasion and gender to make outfit planning more accurate.
      </p>

      <h2>Outfit Filters</h2>

      <div
        style={{
          border: "2px solid black",
          padding: "15px",
          maxWidth: "850px",
          margin: "20px auto",
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          flexWrap: "wrap"
        }}
      >
        <select
          value={seasonFilter}
          onChange={(e) => setSeasonFilter(e.target.value)}
          style={{ padding: "8px" }}
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
          style={{ padding: "8px" }}
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
          style={{ padding: "8px" }}
        >
          <option>All</option>
          <option>Female</option>
          <option>Male</option>
          <option>Unisex</option>
        </select>
      </div>

      <h2>Mix & Match Outfit Builder</h2>

      <div
        style={{
          maxWidth: "450px",
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
                          width: "120px",
                          height: "120px",
                          objectFit: "cover",
                          border: "1px solid black"
                        }}
                      />
                    )}

                    <p>{currentItem.name}</p>
                    <p>
                      {currentItem.sizeSystem} {currentItem.size}
                    </p>
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
          maxWidth: "650px",
          margin: "25px auto"
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
import { useState } from "react";
import PageLayout from "../components/PageLayout";
import WardrobeItem from "../components/WardrobeItem";
import AddClothingForm from "../components/AddClothingForm";
import { useWardrobe } from "../store/WardrobeStore";
import { useTheme } from "../store/ThemeStore";

function WardrobeCheckPage() {
  const { items, wishlistItems, recycleItems, addItem, moveToBin } =
    useWardrobe();

  const { theme } = useTheme();

  const defaultCategories = [
    "Headwear",
    "Jackets",
    "Tops",
    "Dresses/One Piece",
    "Bottoms",
    "Accessories",
    "Shoes"
  ];

  const customCategories = [
    ...new Set(
      items
        .map((item) => item.category)
        .filter(
          (cat) =>
            cat &&
            cat !== "Dresses" &&
            cat !== "Dresses/ One-piece " &&
            !defaultCategories.includes(cat)
        )
    )
  ];

  const categories = ["All", ...defaultCategories, ...customCategories];

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [genderFilter, setGenderFilter] = useState("All");
  const [sizeSystemFilter, setSizeSystemFilter] = useState("All");
  const [seasonFilter, setSeasonFilter] = useState("All");
  const [occasionFilter, setOccasionFilter] = useState("All");

  const defaultOccasions = [
    "Everyday",
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
    "Formal Event"
  ];

  const customOccasions = [
    ...new Set(
      items
        .map((item) => item.occasion)
        .filter(
          (occasion) =>
            occasion &&
            !defaultOccasions.includes(occasion)
        )
    )
  ];

  const occasions = ["All", ...defaultOccasions, ...customOccasions];

const handleAddItem = async (newItem) => {
    const updatedItem = {
      ...newItem,
      category:
        newItem.category === "Dresses" ||
        newItem.category === "Dresses/ One-piece "
          ? "Dresses/One Piece"
          : newItem.category
    };

await addItem(updatedItem);
    setSelectedCategory("All");
    setOccasionFilter("All");
  };

  const filteredItems = items.filter((item) => {
    const itemCategory =
      item.category === "Dresses" ||
      item.category === "Dresses/ One-piece "
        ? "Dresses/One Piece"
        : item.category;

    const matchesCategory =
      selectedCategory === "All" || itemCategory === selectedCategory;

    const matchesGender =
      genderFilter === "All" || item.gender === genderFilter;

    const matchesSizeSystem =
      sizeSystemFilter === "All" || item.sizeSystem === sizeSystemFilter;

    const matchesSeason =
      seasonFilter === "All" ||
      item.season === seasonFilter ||
      item.season === "All seasons";

    const matchesOccasion =
      occasionFilter === "All" || item.occasion === occasionFilter;

    return (
      matchesCategory &&
      matchesGender &&
      matchesSizeSystem &&
      matchesSeason &&
      matchesOccasion
    );
  });

  return (
    <PageLayout title="Wardrobe Check">
      <AddClothingForm
        onAddItem={handleAddItem}
        items={items}
        wishlistItems={wishlistItems}
        recycleItems={recycleItems}
        existingOccasions={customOccasions}
      />

      <h2>Category</h2>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "12px",
          flexWrap: "wrap",
          marginBottom: "25px"
        }}
      >
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: "8px 16px",
              border: `2px solid ${theme.border}`,
              background: selectedCategory === cat ? theme.accent : theme.card,
              color: theme.text,
              fontWeight: "bold"
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      <h2>Filters</h2>

      <div
        style={{
          border: `3px solid ${theme.border}`,
          background: theme.card,
          color: theme.text,
          padding: "15px",
          maxWidth: "900px",
          margin: "0 auto 30px",
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: "10px"
        }}
      >
        <select
          value={genderFilter}
          onChange={(e) => setGenderFilter(e.target.value)}
          style={{
            padding: "8px",
            background: theme.accent,
            color: theme.text,
            border: `2px solid ${theme.border}`
          }}
        >
          <option>All</option>
          <option>Female</option>
          <option>Male</option>
          <option>Unisex</option>
        </select>

        <select
          value={sizeSystemFilter}
          onChange={(e) => setSizeSystemFilter(e.target.value)}
          style={{
            padding: "8px",
            background: theme.accent,
            color: theme.text,
            border: `2px solid ${theme.border}`
          }}
        >
          <option>All</option>
          <option>UK</option>
          <option>US</option>
          <option>EU</option>
          <option>International</option>
        </select>

        <select
          value={seasonFilter}
          onChange={(e) => setSeasonFilter(e.target.value)}
          style={{
            padding: "8px",
            background: theme.accent,
            color: theme.text,
            border: `2px solid ${theme.border}`
          }}
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
          style={{
            padding: "8px",
            background: theme.accent,
            color: theme.text,
            border: `2px solid ${theme.border}`
          }}
        >
          {occasions.map((occasion) => (
            <option key={occasion}>{occasion}</option>
          ))}
        </select>
      </div>

      {filteredItems.length === 0 ? (
        <p>No items match these filters.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
            gap: "16px",
            maxWidth: "1000px",
            margin: "0 auto"
          }}
        >
          {filteredItems.map((item) => (
            <WardrobeItem key={item.id} item={item} onDelete={moveToBin} />
          ))}
        </div>
      )}
    </PageLayout>
  );
}

export default WardrobeCheckPage;
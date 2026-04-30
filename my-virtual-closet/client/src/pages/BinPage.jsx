import { useState } from "react";
import PageLayout from "../components/PageLayout";
import WardrobeItem from "../components/WardrobeItem";
import AddClothingForm from "../components/AddClothingForm";
import { useWardrobe } from "../store/WardrobeStore";

function BinPage() {
  const {
    binItems,
    addItemDirectlyToBin,
    restoreFromBin,
    deleteForeverFromBin
  } = useWardrobe();

  const [showAddForm, setShowAddForm] = useState(false);

  return (
    <PageLayout title="Bin">
      <p>
        This page contains clothing items removed from the wardrobe.
      </p>

      <button
        onClick={() => setShowAddForm(!showAddForm)}
        style={{
          padding: "8px 18px",
          marginBottom: "25px"
        }}
      >
        {showAddForm ? "Close Add Form" : "Add Item to Bin"}
      </button>

      {showAddForm && (
        <AddClothingForm onAddItem={addItemDirectlyToBin} />
      )}

      {binItems.length === 0 ? (
        <p>No items in Bin yet.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
            gap: "16px",
            maxWidth: "900px",
            margin: "0 auto"
          }}
        >
          {binItems.map((item) => (
            <div key={item.id}>
              <WardrobeItem
                item={item}
                onDelete={deleteForeverFromBin}
              />

              <button
                onClick={() => restoreFromBin(item.id)}
                style={{
                  marginTop: "8px",
                  padding: "6px 12px"
                }}
              >
                Restore
              </button>
            </div>
          ))}
        </div>
      )}
    </PageLayout>
  );
}

export default BinPage;
import { createContext, useContext, useState } from "react";

const WardrobeContext = createContext();

export function WardrobeProvider({ children }) {
  const [items, setItems] = useState([
    { id: 1, name: "Black Jacket", category: "Jackets" },
    { id: 2, name: "Blue Jeans", category: "Bottoms" },
    { id: 3, name: "White T-Shirt", category: "Tops" }
  ]);

  const [binItems, setBinItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [sellItems, setSellItems] = useState([]);
  const [savedOutfits, setSavedOutfits] = useState([]);

  const addItem = (newItem) => {
    setItems((prev) => [...prev, newItem]);
  };

  const moveToBin = (id) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;

    setItems((prev) => prev.filter((i) => i.id !== id));
    setBinItems((prev) => [...prev, item]);
  };

  const addItemDirectlyToBin = (item) => {
    setBinItems((prev) => [...prev, item]);
  };

  const restoreFromBin = (id) => {
    const item = binItems.find((i) => i.id === id);
    if (!item) return;

    setBinItems((prev) => prev.filter((i) => i.id !== id));
    setItems((prev) => [...prev, item]);
  };

  const deleteForeverFromBin = (id) => {
    setBinItems((prev) => prev.filter((i) => i.id !== id));
  };

  const addWishlistItem = (item) => {
    setWishlistItems((prev) => [...prev, item]);
  };

  const removeWishlistItem = (id) => {
    setWishlistItems((prev) => prev.filter((i) => i.id !== id));
  };

  const addWishlistItemToWardrobe = (id) => {
    const item = wishlistItems.find((i) => i.id === id);
    if (!item) return;

    setItems((prev) => [...prev, { ...item, id: Date.now() }]);
  };

  const addSellItem = (item) => {
    setSellItems((prev) => [...prev, item]);
  };

  const removeSellItem = (id) => {
    setSellItems((prev) => prev.filter((i) => i.id !== id));
  };

  const saveOutfit = (name, outfitCategory, outfitItems) => {
    const newOutfit = {
      id: Date.now(),
      name,
      outfitCategory,
      items: outfitItems
    };

    setSavedOutfits((prev) => [...prev, newOutfit]);
  };

  const deleteOutfit = (id) => {
    setSavedOutfits((prev) => prev.filter((o) => o.id !== id));
  };

  return (
    <WardrobeContext.Provider
      value={{
        items,
        binItems,
        wishlistItems,
        sellItems,
        savedOutfits,
        addItem,
        moveToBin,
        addItemDirectlyToBin,
        restoreFromBin,
        deleteForeverFromBin,
        addWishlistItem,
        removeWishlistItem,
        addWishlistItemToWardrobe,
        addSellItem,
        removeSellItem,
        saveOutfit,
        deleteOutfit
      }}
    >
      {children}
    </WardrobeContext.Provider>
  );
}

export function useWardrobe() {
  return useContext(WardrobeContext);
}
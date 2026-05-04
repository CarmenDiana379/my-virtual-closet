import { createContext, useContext, useEffect, useState } from "react";
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "./AuthStore";

const WardrobeContext = createContext();

export function WardrobeProvider({ children }) {
  const { user } = useAuth();

  const [items, setItems] = useState([]);
  const [binItems, setBinItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [sellItems, setSellItems] = useState([]);
  const [savedOutfits, setSavedOutfits] = useState([]);
  const [recycleItems, setRecycleItems] = useState([]);

  const getUserCollection = (collectionName) => {
    return collection(db, "users", user.uid, collectionName);
  };

  useEffect(() => {
    if (user) {
      loadAllUserData();
    } else {
      setItems([]);
      setBinItems([]);
      setWishlistItems([]);
      setSellItems([]);
      setSavedOutfits([]);
      setRecycleItems([]);
    }
  }, [user]);

  const loadAllUserData = async () => {
    await loadWardrobeItems();
    await loadWishlistItems();
    await loadSavedOutfits();
    await loadSellItems();
    await loadBinItems();
    await loadRecycleItems();
  };

  const loadWardrobeItems = async () => {
    const data = await getDocs(getUserCollection("wardrobeItems"));
    setItems(data.docs.map((document) => ({ ...document.data(), id: document.id })));
  };

  const loadWishlistItems = async () => {
    const data = await getDocs(getUserCollection("wishlistItems"));
    setWishlistItems(data.docs.map((document) => ({ ...document.data(), id: document.id })));
  };

  const loadSavedOutfits = async () => {
    const data = await getDocs(getUserCollection("savedOutfits"));
    setSavedOutfits(data.docs.map((document) => ({ ...document.data(), id: document.id })));
  };

  const loadSellItems = async () => {
    const data = await getDocs(getUserCollection("sellItems"));
    setSellItems(data.docs.map((document) => ({ ...document.data(), id: document.id })));
  };

  const loadBinItems = async () => {
    const data = await getDocs(getUserCollection("binItems"));
    setBinItems(data.docs.map((document) => ({ ...document.data(), id: document.id })));
  };

  const loadRecycleItems = async () => {
    const data = await getDocs(getUserCollection("recycleItems"));
    setRecycleItems(data.docs.map((document) => ({ ...document.data(), id: document.id })));
  };

  const removeDuplicateFromSell = async (itemName) => {
    const duplicate = sellItems.find((item) => item.name === itemName);

    if (duplicate) {
      await deleteDoc(doc(db, "users", user.uid, "sellItems", duplicate.id));
      setSellItems((prev) => prev.filter((item) => item.id !== duplicate.id));
    }
  };

  const removeDuplicateFromBin = async (itemName) => {
    const duplicate = binItems.find((item) => item.name === itemName);

    if (duplicate) {
      await deleteDoc(doc(db, "users", user.uid, "binItems", duplicate.id));
      setBinItems((prev) => prev.filter((item) => item.id !== duplicate.id));
    }
  };

  const removeDuplicateFromWardrobe = async (itemName) => {
    const duplicate = items.find((item) => item.name === itemName);

    if (duplicate) {
      await deleteDoc(doc(db, "users", user.uid, "wardrobeItems", duplicate.id));
      setItems((prev) => prev.filter((item) => item.id !== duplicate.id));
    }
  };

  const addItem = async (newItem) => {
    if (!user) return;

    const itemToSave = {
      name: newItem.name,
      category: newItem.category,
      image: newItem.image || "",
      gender: newItem.gender || "Unisex",
      sizeSystem: newItem.sizeSystem || "UK",
      size: newItem.size || "",
      season: newItem.season || "All seasons",
      occasion: newItem.occasion || "Everyday"
    };

    await removeDuplicateFromBin(itemToSave.name);
    await removeDuplicateFromSell(itemToSave.name);

    const docRef = await addDoc(getUserCollection("wardrobeItems"), itemToSave);
    setItems((prev) => [...prev, { ...itemToSave, id: docRef.id }]);
  };

  const moveToBin = async (id) => {
    if (!user) return;

    const item = items.find((i) => i.id === id);
    if (!item) return;

    await deleteDoc(doc(db, "users", user.uid, "wardrobeItems", id));
    await removeDuplicateFromSell(item.name);

    const itemForBin = {
      name: item.name,
      category: item.category,
      image: item.image || "",
      gender: item.gender || "Unisex",
      sizeSystem: item.sizeSystem || "UK",
      size: item.size || "",
      season: item.season || "All seasons",
      occasion: item.occasion || "Everyday",
      movedFrom: "wardrobe"
    };

    const docRef = await addDoc(getUserCollection("binItems"), itemForBin);

    setItems((prev) => prev.filter((i) => i.id !== id));
    setBinItems((prev) => [...prev, { ...itemForBin, id: docRef.id }]);
  };

  const addItemDirectlyToBin = async (item) => {
    if (!user) return;

    const itemForBin = {
      name: item.name,
      category: item.category,
      image: item.image || "",
      movedFrom: "manual"
    };

    await removeDuplicateFromWardrobe(itemForBin.name);
    await removeDuplicateFromSell(itemForBin.name);

    const docRef = await addDoc(getUserCollection("binItems"), itemForBin);
    setBinItems((prev) => [...prev, { ...itemForBin, id: docRef.id }]);
  };

  const restoreFromBin = async (id) => {
    if (!user) return;

    const item = binItems.find((i) => i.id === id);
    if (!item) return;

    await deleteDoc(doc(db, "users", user.uid, "binItems", id));
    await removeDuplicateFromSell(item.name);

    const wardrobeItem = {
      name: item.name,
      category: item.category,
      image: item.image || "",
      gender: item.gender || "Unisex",
      sizeSystem: item.sizeSystem || "UK",
      size: item.size || "",
      season: item.season || "All seasons",
      occasion: item.occasion || "Everyday"
    };

    const docRef = await addDoc(getUserCollection("wardrobeItems"), wardrobeItem);

    setBinItems((prev) => prev.filter((i) => i.id !== id));
    setItems((prev) => [...prev, { ...wardrobeItem, id: docRef.id }]);
  };

  const deleteForeverFromBin = async (id) => {
    if (!user) return;

    await deleteDoc(doc(db, "users", user.uid, "binItems", id));
    setBinItems((prev) => prev.filter((i) => i.id !== id));
  };

  const addWishlistItem = async (item) => {
    if (!user) return;

    const itemToSave = {
      name: item.name,
      category: item.category,
      image: item.image || "",
      productLink: item.productLink || "",
      shopName: item.shopName || "",
      source: item.source || "",
      gender: item.gender || "Unisex",
      sizeSystem: item.sizeSystem || "UK",
      size: item.size || "",
      season: item.season || "All seasons",
      occasion: item.occasion || "Everyday"
    };

    const docRef = await addDoc(getUserCollection("wishlistItems"), itemToSave);
    setWishlistItems((prev) => [...prev, { ...itemToSave, id: docRef.id }]);
  };

  const removeWishlistItem = async (id) => {
    if (!user) return;

    await deleteDoc(doc(db, "users", user.uid, "wishlistItems", id));
    setWishlistItems((prev) => prev.filter((i) => i.id !== id));
  };

  const addWishlistItemToWardrobe = async (id) => {
    const item = wishlistItems.find((i) => i.id === id);
    if (!item) return;

    await addItem({
      name: item.name,
      category: item.category,
      image: item.image || "",
      gender: item.gender || "Unisex",
      sizeSystem: item.sizeSystem || "UK",
      size: item.size || "",
      season: item.season || "All seasons",
      occasion: item.occasion || "Everyday"
    });
  };

  const moveWardrobeItemToSell = async (id, sellingDetails) => {
    if (!user) return;

    const item = items.find((i) => i.id === id);
    if (!item) return;

    await deleteDoc(doc(db, "users", user.uid, "wardrobeItems", id));
    await removeDuplicateFromBin(item.name);

    const sellItem = {
      name: item.name,
      category: item.category,
      image: item.image || "",
      gender: item.gender || "Unisex",
      sizeSystem: item.sizeSystem || "UK",
      size: item.size || "",
      season: item.season || "All seasons",
      occasion: item.occasion || "Everyday",
      price: sellingDetails.price,
      condition: sellingDetails.condition,
      description: sellingDetails.description,
      vintedLink: sellingDetails.vintedLink,
      depopLink: sellingDetails.depopLink,
      ebayLink: sellingDetails.ebayLink,
      source: "wardrobe"
    };

    const docRef = await addDoc(getUserCollection("sellItems"), sellItem);

    setItems((prev) => prev.filter((i) => i.id !== id));
    setSellItems((prev) => [...prev, { ...sellItem, id: docRef.id }]);
  };

  const addSellItem = async (item) => {
    if (!user) return;

    const sellItem = {
      name: item.name,
      category: item.category,
      image: item.image || "",
      price: item.price,
      condition: item.condition,
      description: item.description,
      vintedLink: item.vintedLink || "",
      depopLink: item.depopLink || "",
      ebayLink: item.ebayLink || "",
      source: "manual"
    };

    await removeDuplicateFromWardrobe(sellItem.name);
    await removeDuplicateFromBin(sellItem.name);

    const docRef = await addDoc(getUserCollection("sellItems"), sellItem);
    setSellItems((prev) => [...prev, { ...sellItem, id: docRef.id }]);
  };

  const removeSellItem = async (id) => {
    if (!user) return;

    await deleteDoc(doc(db, "users", user.uid, "sellItems", id));
    setSellItems((prev) => prev.filter((i) => i.id !== id));
  };

  const restoreSellItemToWardrobe = async (id) => {
    if (!user) return;

    const item = sellItems.find((i) => i.id === id);
    if (!item) return;

    await deleteDoc(doc(db, "users", user.uid, "sellItems", id));
    await removeDuplicateFromBin(item.name);

    const wardrobeItem = {
      name: item.name,
      category: item.category,
      image: item.image || "",
      gender: item.gender || "Unisex",
      sizeSystem: item.sizeSystem || "UK",
      size: item.size || "",
      season: item.season || "All seasons",
      occasion: item.occasion || "Everyday"
    };

    const docRef = await addDoc(getUserCollection("wardrobeItems"), wardrobeItem);

    setSellItems((prev) => prev.filter((i) => i.id !== id));
    setItems((prev) => [...prev, { ...wardrobeItem, id: docRef.id }]);
  };

  const addRecycleItem = async (item) => {
    if (!user) return;

    const recycleItem = {
      name: item.name,
      category: item.category,
      image: item.image || "",
      reason: item.reason,
      method: item.method,
      notes: item.notes || "",
      createdAt: new Date()
    };

    await removeDuplicateFromWardrobe(recycleItem.name);
    await removeDuplicateFromBin(recycleItem.name);
    await removeDuplicateFromSell(recycleItem.name);

    const docRef = await addDoc(getUserCollection("recycleItems"), recycleItem);
    setRecycleItems((prev) => [...prev, { ...recycleItem, id: docRef.id }]);
  };

  const removeRecycleItem = async (id) => {
    if (!user) return;

    await deleteDoc(doc(db, "users", user.uid, "recycleItems", id));
    setRecycleItems((prev) => prev.filter((item) => item.id !== id));
  };

  const saveOutfit = async (name, outfitCategory, outfitItems) => {
    if (!user) return;

    const newOutfit = {
      name,
      outfitCategory,
      items: Array.isArray(outfitItems) ? outfitItems : Object.values(outfitItems)
    };

    const docRef = await addDoc(getUserCollection("savedOutfits"), newOutfit);
    setSavedOutfits((prev) => [...prev, { ...newOutfit, id: docRef.id }]);
  };

  const deleteOutfit = async (id) => {
    if (!user) return;

    await deleteDoc(doc(db, "users", user.uid, "savedOutfits", id));
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
        recycleItems,
        addItem,
        moveToBin,
        addItemDirectlyToBin,
        restoreFromBin,
        deleteForeverFromBin,
        addWishlistItem,
        removeWishlistItem,
        addWishlistItemToWardrobe,
        moveWardrobeItemToSell,
        addSellItem,
        removeSellItem,
        restoreSellItemToWardrobe,
        addRecycleItem,
        removeRecycleItem,
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
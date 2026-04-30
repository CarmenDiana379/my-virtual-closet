import { createContext, useContext, useEffect, useState } from "react";
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

const WardrobeContext = createContext();

export function WardrobeProvider({ children }) {
  const [items, setItems] = useState([]);
  const [binItems, setBinItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [sellItems, setSellItems] = useState([]);
  const [savedOutfits, setSavedOutfits] = useState([]);

  const wardrobeCollectionRef = collection(db, "wardrobeItems");
  const wishlistCollectionRef = collection(db, "wishlistItems");
  const outfitsCollectionRef = collection(db, "savedOutfits");
  const sellCollectionRef = collection(db, "sellItems");
  const binCollectionRef = collection(db, "binItems");

  useEffect(() => {
    loadWardrobeItems();
    loadWishlistItems();
    loadSavedOutfits();
    loadSellItems();
    loadBinItems();
  }, []);

  const loadWardrobeItems = async () => {
    const data = await getDocs(wardrobeCollectionRef);
    setItems(data.docs.map((document) => ({
      ...document.data(),
      id: document.id
    })));
  };

  const loadWishlistItems = async () => {
    const data = await getDocs(wishlistCollectionRef);
    setWishlistItems(data.docs.map((document) => ({
      ...document.data(),
      id: document.id
    })));
  };

  const loadSavedOutfits = async () => {
    const data = await getDocs(outfitsCollectionRef);
    setSavedOutfits(data.docs.map((document) => ({
      ...document.data(),
      id: document.id
    })));
  };

  const loadSellItems = async () => {
    const data = await getDocs(sellCollectionRef);
    setSellItems(data.docs.map((document) => ({
      ...document.data(),
      id: document.id
    })));
  };

  const loadBinItems = async () => {
    const data = await getDocs(binCollectionRef);
    setBinItems(data.docs.map((document) => ({
      ...document.data(),
      id: document.id
    })));
  };

  const removeDuplicateFromSell = async (itemName) => {
    const duplicate = sellItems.find((item) => item.name === itemName);

    if (duplicate) {
      await deleteDoc(doc(db, "sellItems", duplicate.id));
      setSellItems((prev) => prev.filter((item) => item.id !== duplicate.id));
    }
  };

  const removeDuplicateFromBin = async (itemName) => {
    const duplicate = binItems.find((item) => item.name === itemName);

    if (duplicate) {
      await deleteDoc(doc(db, "binItems", duplicate.id));
      setBinItems((prev) => prev.filter((item) => item.id !== duplicate.id));
    }
  };

  const removeDuplicateFromWardrobe = async (itemName) => {
    const duplicate = items.find((item) => item.name === itemName);

    if (duplicate) {
      await deleteDoc(doc(db, "wardrobeItems", duplicate.id));
      setItems((prev) => prev.filter((item) => item.id !== duplicate.id));
    }
  };

  const addItem = async (newItem) => {
    const itemToSave = {
      name: newItem.name,
      category: newItem.category,
      image: newItem.image || ""
    };

    await removeDuplicateFromBin(itemToSave.name);
    await removeDuplicateFromSell(itemToSave.name);

    const docRef = await addDoc(wardrobeCollectionRef, itemToSave);

    setItems((prev) => [...prev, { ...itemToSave, id: docRef.id }]);
  };

  const moveToBin = async (id) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;

    await deleteDoc(doc(db, "wardrobeItems", id));

    await removeDuplicateFromSell(item.name);

    const itemForBin = {
      name: item.name,
      category: item.category,
      image: item.image || "",
      movedFrom: "wardrobe"
    };

    const docRef = await addDoc(binCollectionRef, itemForBin);

    setItems((prev) => prev.filter((i) => i.id !== id));
    setBinItems((prev) => [...prev, { ...itemForBin, id: docRef.id }]);
  };

  const addItemDirectlyToBin = async (item) => {
    const itemForBin = {
      name: item.name,
      category: item.category,
      image: item.image || "",
      movedFrom: "manual"
    };

    await removeDuplicateFromWardrobe(itemForBin.name);
    await removeDuplicateFromSell(itemForBin.name);

    const docRef = await addDoc(binCollectionRef, itemForBin);

    setBinItems((prev) => [...prev, { ...itemForBin, id: docRef.id }]);
  };

  const restoreFromBin = async (id) => {
    const item = binItems.find((i) => i.id === id);
    if (!item) return;

    await deleteDoc(doc(db, "binItems", id));

    await removeDuplicateFromSell(item.name);

    const wardrobeItem = {
      name: item.name,
      category: item.category,
      image: item.image || ""
    };

    const docRef = await addDoc(wardrobeCollectionRef, wardrobeItem);

    setBinItems((prev) => prev.filter((i) => i.id !== id));
    setItems((prev) => [...prev, { ...wardrobeItem, id: docRef.id }]);
  };

  const deleteForeverFromBin = async (id) => {
    await deleteDoc(doc(db, "binItems", id));
    setBinItems((prev) => prev.filter((i) => i.id !== id));
  };

  const addWishlistItem = async (item) => {
    const itemToSave = {
      name: item.name,
      category: item.category,
      image: item.image || "",
      productLink: item.productLink || "",
      shopName: item.shopName || "",
      source: item.source || ""
    };

    const docRef = await addDoc(wishlistCollectionRef, itemToSave);

    setWishlistItems((prev) => [...prev, { ...itemToSave, id: docRef.id }]);
  };

  const removeWishlistItem = async (id) => {
    await deleteDoc(doc(db, "wishlistItems", id));
    setWishlistItems((prev) => prev.filter((i) => i.id !== id));
  };

  const addWishlistItemToWardrobe = async (id) => {
    const item = wishlistItems.find((i) => i.id === id);
    if (!item) return;

    await addItem({
      name: item.name,
      category: item.category,
      image: item.image || ""
    });
  };

  const moveWardrobeItemToSell = async (id, sellingDetails) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;

    await deleteDoc(doc(db, "wardrobeItems", id));

    await removeDuplicateFromBin(item.name);

    const sellItem = {
      name: item.name,
      category: item.category,
      image: item.image || "",
      price: sellingDetails.price,
      condition: sellingDetails.condition,
      description: sellingDetails.description,
      vintedLink: sellingDetails.vintedLink,
      depopLink: sellingDetails.depopLink,
      ebayLink: sellingDetails.ebayLink,
      source: "wardrobe"
    };

    const docRef = await addDoc(sellCollectionRef, sellItem);

    setItems((prev) => prev.filter((i) => i.id !== id));
    setSellItems((prev) => [...prev, { ...sellItem, id: docRef.id }]);
  };

  const addSellItem = async (item) => {
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

    const docRef = await addDoc(sellCollectionRef, sellItem);

    setSellItems((prev) => [...prev, { ...sellItem, id: docRef.id }]);
  };

  const removeSellItem = async (id) => {
    await deleteDoc(doc(db, "sellItems", id));
    setSellItems((prev) => prev.filter((i) => i.id !== id));
  };

  const restoreSellItemToWardrobe = async (id) => {
    const item = sellItems.find((i) => i.id === id);
    if (!item) return;

    await deleteDoc(doc(db, "sellItems", id));

    await removeDuplicateFromBin(item.name);

    const wardrobeItem = {
      name: item.name,
      category: item.category,
      image: item.image || ""
    };

    const docRef = await addDoc(wardrobeCollectionRef, wardrobeItem);

    setSellItems((prev) => prev.filter((i) => i.id !== id));
    setItems((prev) => [...prev, { ...wardrobeItem, id: docRef.id }]);
  };

  const saveOutfit = async (name, outfitCategory, outfitItems) => {
    const newOutfit = {
      name,
      outfitCategory,
      items: outfitItems
    };

    const docRef = await addDoc(outfitsCollectionRef, newOutfit);

    setSavedOutfits((prev) => [...prev, { ...newOutfit, id: docRef.id }]);
  };

  const deleteOutfit = async (id) => {
    await deleteDoc(doc(db, "savedOutfits", id));
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
        moveWardrobeItemToSell,
        addSellItem,
        removeSellItem,
        restoreSellItemToWardrobe,
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
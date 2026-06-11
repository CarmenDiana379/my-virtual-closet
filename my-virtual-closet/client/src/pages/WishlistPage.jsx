import { useState } from "react";
import PageLayout from "../components/PageLayout";
import { useWardrobe } from "../store/WardrobeStore";
import { useTheme } from "../store/ThemeStore";

function WishlistPage() {
    const { theme } = useTheme();
  const {
    wishlistItems,
    addWishlistItem,
    removeWishlistItem,
    addWishlistItemToWardrobe
  } = useWardrobe();

  const [name, setName] = useState("");
  const [category, setCategory] = useState("Tops");
  const [imageUrl, setImageUrl] = useState("");
  const [productLink, setProductLink] = useState("");
  const [shopName, setShopName] = useState("");
  const [uploadedImage, setUploadedImage] = useState("");

  const convertImageToBase64 = (file) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      setUploadedImage(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const handleAddWishlistItem = (e) => {
    e.preventDefault();

    if (!name) {
      alert("Please enter item name");
      return;
    }

    if (!imageUrl && !uploadedImage) {
      alert("Please add an online image URL or upload a photo");
      return;
    }

    const newItem = {
      id: Date.now(),
      name,
      category,
      image: uploadedImage || imageUrl,
      productLink,
      shopName,
      source: uploadedImage ? "store-photo" : "online"
    };

    addWishlistItem(newItem);

    setName("");
    setCategory("Tops");
    setImageUrl("");
    setProductLink("");
    setShopName("");
    setUploadedImage("");
  };

  return (
    <PageLayout title="Wishlist">
      <p>
        Add items you are thinking of buying, then test them with your existing wardrobe before purchasing.
      </p>

      <form
        onSubmit={handleAddWishlistItem}
        style={{
          border: "2px solid black",
          padding: "20px",
          maxWidth: "700px",
          margin: "25px auto"
        }}
      >
        <h2>Add Wishlist Item</h2>

        <input
          type="text"
          placeholder="Item name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            padding: "8px",
            margin: "6px",
            width: "220px"
          }}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{
            padding: "8px",
            margin: "6px"
          }}
        >
          <option>Headwear</option>
<option>Jackets</option>
<option>Tops</option>
<option>Dresses/ One-piece</option>
<option>Bottoms</option>
<option>Accessories</option>
<option>Shoes</option>
        </select>

        <input
          type="text"
          placeholder="Online image URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          style={{
            padding: "8px",
            margin: "6px",
            width: "260px"
          }}
        />

        <input
          type="text"
          placeholder="Product page link"
          value={productLink}
          onChange={(e) => setProductLink(e.target.value)}
          style={{
            padding: "8px",
            margin: "6px",
            width: "260px"
          }}
        />

        <input
          type="text"
          placeholder="Shop name"
          value={shopName}
          onChange={(e) => setShopName(e.target.value)}
          style={{
            padding: "8px",
            margin: "6px",
            width: "220px"
          }}
        />

        <div style={{ marginTop: "10px" }}>
          <label>Upload store photo:</label>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => convertImageToBase64(e.target.files[0])}
            style={{
              marginLeft: "10px"
            }}
          />
        </div>

        {uploadedImage && (
          <img
            src={uploadedImage}
            alt="Preview"
            style={{
              width: "90px",
              height: "90px",
              objectFit: "cover",
              marginTop: "10px",
              border: "1px solid black"
            }}
          />
        )}

        <br />

        <button
          type="submit"
          style={{
            marginTop: "15px",
            padding: "8px 20px"
          }}
        >
          Add to Wishlist
        </button>
      </form>

      {wishlistItems.length === 0 ? (
        <p>No wishlist items yet.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))",
            gap: "18px",
            maxWidth: "1000px",
            margin: "30px auto"
          }}
        >
          {wishlistItems.map((item) => (
            <div
              key={item.id}
              style={{
                border: "2px solid black",
                padding: "12px",
                background: theme.card,
color: theme.text,
border: `2px solid ${theme.border}`,
                textAlign: "center"
              }}
            >
              {item.image && (
  <img
    src={item.image}
    alt={item.name}
    style={{
      width: "120px",
      height: "120px",
      objectFit: "cover",
      border: "1px solid black",
      display: "block",
      margin: "0 auto 10px"
    }}
  />
)}

              <h3>{item.name}</h3>
              <p>{item.category}</p>

              {item.shopName && <p>Shop: {item.shopName}</p>}

              {item.productLink && (
                <button
                  onClick={() => window.open(item.productLink, "_blank")}
                  style={{
                    margin: "5px",
                    padding: "6px 10px"
                  }}
                >
                  Open Link
                </button>
              )}

              <button
                onClick={() => addWishlistItemToWardrobe(item.id)}
                style={{
                  margin: "5px",
                  padding: "6px 10px"
                }}
              >
                Add to Wardrobe
              </button>

              <button
                onClick={() => removeWishlistItem(item.id)}
                style={{
                  margin: "5px",
                  padding: "6px 10px"
                }}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </PageLayout>
  );
}

export default WishlistPage;
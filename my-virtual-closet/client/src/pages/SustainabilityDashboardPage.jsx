import PageLayout from "../components/PageLayout";
import { useWardrobe } from "../store/WardrobeStore";
import { useTheme } from "../store/ThemeStore";

function SustainabilityDashboardPage() {
  const { items, recycleItems, savedOutfits, wishlistItems, sellItems } =
    useWardrobe();

  const { theme } = useTheme();

  const sustainabilityScore = Math.min(
    recycleItems.length * 12 +
      savedOutfits.length * 7 +
      sellItems.length * 5 -
      wishlistItems.length * 2,
    100
  );

  const safeScore = Math.max(sustainabilityScore, 0);

  const getLevel = () => {
    if (safeScore >= 80) return "Eco Champion";
    if (safeScore >= 60) return "Sustainable Stylist";
    if (safeScore >= 40) return "Conscious Shopper";
    return "Getting Started";
  };

  const badges = [];

  if (recycleItems.length >= 1) badges.push("♻️ First Recycle");
  if (recycleItems.length >= 3) badges.push("🌿 Recycling Progress");
  if (savedOutfits.length >= 3) badges.push("👗 Outfit Reuser");
  if (sellItems.length >= 1) badges.push("💸 Resale Starter");
  if (wishlistItems.length <= 5) badges.push("🛍 Mindful Wishlist");

  const estimatedWasteReduced = recycleItems.length * 0.7;
  const reuseActions = savedOutfits.length + sellItems.length + recycleItems.length;

  const statCard = (title, value, description, icon) => (
    <div
      style={{
        border: `2px solid ${theme.border}`,
        background: theme.card,
        color: theme.text,
        borderRadius: theme.radius,
        padding: "20px",
        textAlign: "center"
      }}
    >
      <h2 style={{ margin: 0 }}>{icon}</h2>
      <h3>{value}</h3>
      <strong>{title}</strong>
      <p style={{ fontSize: "13px" }}>{description}</p>
    </div>
  );

  return (
    <PageLayout title="Sustainability Dashboard">
      <p>
        Track how wardrobe reuse, recycling, resale and mindful shopping support
        more sustainable fashion behaviour.
      </p>

      <div
        style={{
          maxWidth: "900px",
          margin: "30px auto",
          border: `3px solid ${theme.border}`,
          background: theme.card,
          color: theme.text,
          borderRadius: theme.radius,
          padding: "30px",
          textAlign: "center"
        }}
      >
        <h2>🌿 Sustainability Score</h2>

        <div
          style={{
            height: "28px",
            background: "#d1d5db",
            borderRadius: "30px",
            overflow: "hidden",
            margin: "20px auto",
            maxWidth: "700px"
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${safeScore}%`,
              background: "linear-gradient(135deg, #10b981, #14b8a6)"
            }}
          />
        </div>

        <h1>{safeScore}/100</h1>
        <h2>{getLevel()}</h2>

        <p>
          This score is calculated using recycling activity, outfit reuse,
          resale actions and wishlist restraint.
        </p>
      </div>

      <div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(6, 1fr)",
    gap: "18px",
    maxWidth: "1250px",
    margin: "30px auto"
  }}
>
        {statCard(
          "Wardrobe Items",
          items.length,
          "Current clothing items stored in your digital wardrobe.",
          "👕"
        )}

        {statCard(
          "Saved Outfits",
          savedOutfits.length,
          "Outfits created from existing wardrobe items.",
          "👗"
        )}

        {statCard(
          "Recycled Items",
          recycleItems.length,
          "Items moved towards recycling, repair or donation.",
          "♻️"
        )}

        {statCard(
          "Selling Items",
          sellItems.length,
          "Items redirected towards resale instead of waste.",
          "💸"
        )}

        {statCard(
          "Wishlist Items",
          wishlistItems.length,
          "Items being considered before purchase.",
          "🛍"
        )}

        {statCard(
          "Reuse Actions",
          reuseActions,
          "Combined actions linked to reuse, resale or recycling.",
          "🌱"
        )}
      </div>

      <div
        style={{
          maxWidth: "1000px",
          margin: "30px auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px"
        }}
      >
        <div
          style={{
            border: `2px solid ${theme.border}`,
            background: theme.card,
            color: theme.text,
            borderRadius: theme.radius,
            padding: "24px"
          }}
        >
          <h2>Estimated Impact</h2>

          <p>
            Approximate textile waste redirected:
            <strong> {estimatedWasteReduced.toFixed(1)} kg</strong>
          </p>

          <p>
            This is an indicative estimate based on recycled wardrobe entries.
            It helps users reflect on how digital wardrobe decisions may support
            more sustainable clothing behaviour.
          </p>
        </div>

        <div
          style={{
            border: `2px solid ${theme.border}`,
            background: theme.card,
            color: theme.text,
            borderRadius: theme.radius,
            padding: "24px"
          }}
        >
          <h2>Personalised Recommendation</h2>

          {wishlistItems.length > items.length / 2 ? (
            <p>
              Your wishlist is growing quickly. Try creating new outfits from
              existing wardrobe items before planning new purchases.
            </p>
          ) : recycleItems.length === 0 ? (
            <p>
              You have not recycled any items yet. Consider reviewing unused
              clothing and deciding whether it could be donated, repaired or
              recycled.
            </p>
          ) : (
            <p>
              You are showing positive sustainable wardrobe behaviour. Continue
              reusing saved outfits and reviewing items before buying more.
            </p>
          )}
        </div>
      </div>

      <div
        style={{
          maxWidth: "1000px",
          margin: "30px auto",
          border: `2px solid ${theme.border}`,
          background: theme.card,
          color: theme.text,
          borderRadius: theme.radius,
          padding: "24px",
          textAlign: "center"
        }}
      >
        <h2>Achievements</h2>

        {badges.length === 0 ? (
          <p>No sustainability badges unlocked yet.</p>
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "12px",
              flexWrap: "wrap",
              marginTop: "20px"
            }}
          >
            {badges.map((badge) => (
              <div
                key={badge}
                style={{
                  border: `2px solid ${theme.border}`,
                  borderRadius: theme.radius,
                  background: theme.background,
                  padding: "12px 18px",
                  fontWeight: "bold"
                }}
              >
                {badge}
              </div>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
}

export default SustainabilityDashboardPage;
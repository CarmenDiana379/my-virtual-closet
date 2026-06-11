export const generateSustainabilityAdvice = async ({
  wardrobeCount,
  recycleCount,
  wishlistCount,
  itemName,
  category
}) => {
  let score = 50;
  const tips = [];

  if (wardrobeCount > 20) {
    score -= 10;
    tips.push(
      "Your wardrobe already has many items, so consider whether this piece fills a real gap before adding more."
    );
  } else {
    score += 10;
    tips.push(
      "Your wardrobe size is still manageable, so this item may be useful if it supports several outfits."
    );
  }

  if (wishlistCount > 8) {
    score -= 10;
    tips.push(
      "Your wishlist is growing, which may suggest planned overconsumption. Try prioritising versatile items first."
    );
  }

  if (recycleCount > 3) {
    score += 15;
    tips.push(
      "You are already recycling items, which is a positive sign of sustainable wardrobe behaviour."
    );
  }

  if (
    category === "Jackets" ||
    category === "Shoes" ||
    category === "Accessories"
  ) {
    tips.push(
      `${category} can be reused across many outfits, so this item may have good long-term value.`
    );
  }

  if (category === "Dresses/ One-piece") {
    tips.push(
      "Dresses/ One-piece can be useful for one-piece outfit planning, especially when styled differently across seasons."
    );
  }

  score = Math.max(0, Math.min(score, 100));

  let level = "Needs Reflection";

  if (score >= 80) {
    level = "Strong Sustainable Choice";
  } else if (score >= 60) {
    level = "Reasonable Choice";
  } else if (score >= 40) {
    level = "Think Before Adding";
  }

  return `Sustainability Score: ${score}/100 — ${level}. ${
    itemName || "This item"
  } has been assessed using your wardrobe, wishlist and recycling behaviour. ${
    tips.slice(0, 2).join(" ")
  }`;
};
import FeatureIcons from "../components/FeatureIcons";
import Wardrobe from "../components/Wardrobe";

function LandingPage() {
  return (
    <div>
      <h1>Welcome to Your Virtual Closet</h1>

      {/* Wardrobe */}
      <Wardrobe />

      {/* Feature buttons */}
      <FeatureIcons />

    </div>
  );
}

export default LandingPage;
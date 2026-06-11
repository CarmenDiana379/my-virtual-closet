import PageLayout from "../components/PageLayout";
import { useTheme } from "../store/ThemeStore";

function FAQPage() {
    const { theme } = useTheme();
  return (
    <PageLayout title="FAQ">
      <div
        style={{
          maxWidth: "850px",
          margin: "0 auto"
        }}
      >
        <h2>Frequently Asked Questions</h2>

        <div
          style={{
            border: "2px solid black",
            padding: "20px",
            marginTop: "20px",
            background: theme.card,
color: theme.text,
border: `2px solid ${theme.border}`,
          }}
        >
          <h3>What is My Virtual Closet?</h3>

          <p>
            My Virtual Closet is a digital wardrobe platform designed to support
            sustainable fashion habits and mindful clothing management.
          </p>

          <h3>How does the sustainability score work?</h3>

          <p>
            The score is based on outfit reuse, recycling behaviour and mindful
            wardrobe organisation.
          </p>

          <h3>Can I save outfits?</h3>

          <p>
            Yes. Users can create, save and filter outfits for different seasons
            and occasions.
          </p>

          <h3>Why does the app warn about overconsumption?</h3>

          <p>
            The platform encourages mindful fashion consumption by helping users
            recognise excessive shopping patterns and duplicate wardrobe items.
          </p>
        </div>
      </div>
    </PageLayout>
  );
}

export default FAQPage;
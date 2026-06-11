import { useState } from "react";
import PageLayout from "../components/PageLayout";
import { addDoc, collection } from "firebase/firestore";
import { db, auth } from "../firebase";
import { useTheme } from "../store/ThemeStore";

function ContactPage() {
    const { theme } = useTheme();
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(5);

  const handleSubmitFeedback = async () => {
    if (!name || !message) {
      alert("Please complete all fields");
      return;
    }

    try {
      await addDoc(collection(db, "feedback"), {
        name,
        message,
        rating,
        userEmail: auth.currentUser?.email || "Unknown",
        createdAt: new Date()
      });

      alert("Feedback submitted successfully!");

      setName("");
      setMessage("");
      setRating(5);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <PageLayout title="Contact Us">
      <div
        style={{
          maxWidth: "750px",
          margin: "0 auto",
          textAlign: "center"
        }}
      >
        <h2>We would love to hear from you</h2>

        <p>
          My Virtual Closet encourages sustainable fashion choices and mindful
          wardrobe management.
        </p>

        <div
          style={{
            border: "2px solid black",
            padding: "25px",
            marginTop: "30px",
            background: theme.card,
color: theme.text,
border: `2px solid ${theme.border}`,
          }}
        >
          <p><strong>Email:</strong> support@myvirtualcloset.com</p>
          <p><strong>Instagram:</strong> @myvirtualcloset</p>
          <p><strong>TikTok:</strong> @myvirtualcloset</p>
        </div>

        <div
          style={{
            border: "2px solid black",
            padding: "25px",
            marginTop: "30px",
            background: theme.card,
color: theme.text,
border: `2px solid ${theme.border}`,
          }}
        >
          <h2>User Feedback</h2>

          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "12px"
            }}
          />

          <textarea
            placeholder="Write your feedback here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={{
              width: "100%",
              height: "120px",
              padding: "10px",
              marginBottom: "20px"
            }}
          />

          <h3>Rate Your Experience</h3>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "10px",
              marginBottom: "20px"
            }}
          >
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                style={{
                  fontSize: "28px",
                  background: "none",
                  border: "none",
                  cursor: "pointer"
                }}
              >
                {star <= rating ? "⭐" : "☆"}
              </button>
            ))}
          </div>

          <button
            onClick={handleSubmitFeedback}
            style={{
              padding: "10px 18px",
              fontWeight: "bold"
            }}
          >
            Submit Feedback
          </button>
        </div>
      </div>
    </PageLayout>
  );
}

export default ContactPage;
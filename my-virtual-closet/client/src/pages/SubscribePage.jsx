import { useState } from "react";
import PageLayout from "../components/PageLayout";

function SubscribePage() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = () => {
    if (!email) {
      alert("Please enter email");
      return;
    }

    setSubscribed(true);
    setEmail("");
  };

  return (
    <PageLayout title="Subscribe">
      <div
        style={{
          maxWidth: "650px",
          margin: "0 auto",
          textAlign: "center"
        }}
      >
        <h2>Join the sustainable fashion community</h2>

        <p>
          Subscribe for wardrobe tips, recycling ideas and mindful shopping
          inspiration.
        </p>

        <div
          style={{
            border: "2px solid black",
            padding: "25px",
            background: "white",
            marginTop: "25px"
          }}
        >
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              padding: "10px",
              width: "250px",
              marginRight: "10px"
            }}
          />

          <button
            onClick={handleSubscribe}
            style={{
              padding: "10px 18px"
            }}
          >
            Subscribe
          </button>

          {subscribed && (
            <p style={{ marginTop: "20px", color: "green" }}>
              Successfully subscribed!
            </p>
          )}
        </div>
      </div>
    </PageLayout>
  );
}

export default SubscribePage;
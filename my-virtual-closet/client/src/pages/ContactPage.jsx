import PageLayout from "../components/PageLayout";

function ContactPage() {
  return (
    <PageLayout title="Contact Us">
      <div
        style={{
          maxWidth: "700px",
          margin: "0 auto",
          textAlign: "center"
        }}
      >
        <h2>We would love to hear from you</h2>

        <p>
          My Virtual Closet encourages sustainable fashion choices and mindful
          wardrobe management. If you have questions, suggestions or partnership
          enquiries, please contact us below.
        </p>

        <div
          style={{
            border: "2px solid black",
            padding: "25px",
            marginTop: "30px",
            background: "white"
          }}
        >
          <p><strong>Email:</strong> support@myvirtualcloset.com</p>
          <p><strong>Instagram:</strong> @myvirtualcloset</p>
          <p><strong>TikTok:</strong> @myvirtualcloset</p>
        </div>
      </div>
    </PageLayout>
  );
}

export default ContactPage;
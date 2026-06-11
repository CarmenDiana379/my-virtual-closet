import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function AdminFeedbackPage() {
  const [feedback, setFeedback] = useState([]);
  const [ratingFilter, setRatingFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("Newest");

  const loadFeedback = async () => {
    const data = await getDocs(collection(db, "feedback"));

    const loadedFeedback = data.docs.map((document) => ({
      id: document.id,
      ...document.data()
    }));

    setFeedback(loadedFeedback);
  };

  useEffect(() => {
    loadFeedback();
  }, []);

  const filteredFeedback = feedback
    .filter((item) => {
      if (ratingFilter === "All") return true;

      return Number(item.rating) === Number(ratingFilter);
    })
    .sort((a, b) => {
      if (sortOrder === "Newest") {
        return (
          new Date((b.createdAt?.seconds || 0) * 1000) -
          new Date((a.createdAt?.seconds || 0) * 1000)
        );
      }

      return (
        new Date((a.createdAt?.seconds || 0) * 1000) -
        new Date((b.createdAt?.seconds || 0) * 1000)
      );
    });

  const ratedFeedback = feedback.filter(
    (item) => Number(item.rating) > 0
  );

  const averageRating =
    ratedFeedback.length === 0
      ? "0.0"
      : (
          ratedFeedback.reduce(
            (acc, item) => acc + Number(item.rating),
            0
          ) / ratedFeedback.length
        ).toFixed(1);

  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text("My Virtual Closet - User Feedback Report", 14, 20);

    autoTable(doc, {
      startY: 35,
      head: [["Name", "Email", "Rating", "Message", "Date"]],
      body: feedback.map((item) => [
        item.name || "Unknown",
        item.userEmail || "No Email",
        `${item.rating || 0} Stars`,
        item.message || "",
        item.createdAt?.seconds
          ? new Date(
              item.createdAt.seconds * 1000
            ).toLocaleString()
          : "No Date"
      ]),
      styles: {
        fontSize: 9
      },
      headStyles: {
        fillColor: [47, 111, 115]
      }
    });

    doc.save("my-virtual-closet-feedback.pdf");
  };

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top left, #f3e8ff 0%, transparent 30%), linear-gradient(135deg, #f8fafc 0%, #e0f2f1 45%, #fdf2f8 100%)",
        padding: "40px"
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto"
        }}
      >
        <div
          style={{
            background: "rgba(255,255,255,0.82)",
            borderRadius: "24px",
            padding: "30px",
            marginBottom: "25px",
            boxShadow: "0 14px 30px rgba(31,41,51,0.08)"
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "20px",
              flexWrap: "wrap"
            }}
          >
            <div>
              <p
                style={{
                  margin: "0 0 8px",
                  fontWeight: "bold",
                  letterSpacing: "2px",
                  color: "#2f6f73"
                }}
              >
                ADMIN EVALUATION PANEL
              </p>

              <h1 style={{ margin: 0 }}>
                Users Feedback
              </h1>

              <p>
                Review user ratings, comments and feedback
                submitted through the contact page.
              </p>
            </div>

            <div
              style={{
                display: "flex",
                gap: "12px",
                flexWrap: "wrap"
              }}
            >
              <button
                onClick={downloadPDF}
                style={{
                  padding: "10px 20px",
                  border: "1px solid #6d5dfc",
                  background: "#6d5dfc",
                  color: "white",
                  borderRadius: "24px",
                  fontWeight: "bold",
                  cursor: "pointer"
                }}
              >
                Download PDF
              </button>

              <button
                onClick={() =>
                  (window.location.href =
                    "/admin-dashboard")
                }
                style={{
                  padding: "10px 20px",
                  border: "1px solid #2f6f73",
                  background: "#2f6f73",
                  color: "white",
                  borderRadius: "24px",
                  fontWeight: "bold",
                  cursor: "pointer"
                }}
              >
                Back to Admin Dashboard
              </button>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: "16px",
              marginTop: "20px",
              flexWrap: "wrap"
            }}
          >
            <div
              style={{
                background: "white",
                padding: "18px",
                borderRadius: "18px",
                minWidth: "180px"
              }}
            >
              <h3>Total Feedback</h3>

              <strong style={{ fontSize: "28px" }}>
                {feedback.length}
              </strong>
            </div>

            <div
              style={{
                background: "white",
                padding: "18px",
                borderRadius: "18px",
                minWidth: "180px"
              }}
            >
              <h3>Average Rating</h3>

              <strong style={{ fontSize: "28px" }}>
                ⭐ {averageRating}
              </strong>
            </div>
          </div>
        </div>

        <div
          style={{
            background: "rgba(255,255,255,0.82)",
            borderRadius: "24px",
            padding: "24px",
            marginBottom: "25px"
          }}
        >
          <h2>Filters</h2>

          <div
            style={{
              display: "flex",
              gap: "14px",
              flexWrap: "wrap"
            }}
          >
            <select
              value={ratingFilter}
              onChange={(e) =>
                setRatingFilter(e.target.value)
              }
              style={{
                padding: "10px"
              }}
            >
              <option value="All">
                All Ratings
              </option>

              <option value="5">
                5 Stars
              </option>

              <option value="4">
                4 Stars
              </option>

              <option value="3">
                3 Stars
              </option>

              <option value="2">
                2 Stars
              </option>

              <option value="1">
                1 Star
              </option>
            </select>

            <select
              value={sortOrder}
              onChange={(e) =>
                setSortOrder(e.target.value)
              }
              style={{
                padding: "10px"
              }}
            >
              <option>
                Newest
              </option>

              <option>
                Oldest
              </option>
            </select>
          </div>
        </div>

        {filteredFeedback.length === 0 ? (
          <p>No feedback found.</p>
        ) : (
          filteredFeedback.map((item) => (
            <div
              key={item.id}
              style={{
                background: "rgba(255,255,255,0.88)",
                borderRadius: "24px",
                padding: "24px",
                marginBottom: "20px",
                boxShadow:
                  "0 14px 30px rgba(31,41,51,0.08)"
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  flexWrap: "wrap",
                  marginBottom: "10px"
                }}
              >
                <div>
                  <h2
                    style={{
                      marginBottom: "5px"
                    }}
                  >
                    {item.name || "Unknown User"}
                  </h2>

                  <p style={{ margin: 0 }}>
                    {item.userEmail ||
                      "No Email"}
                  </p>
                </div>

                <div
                  style={{
                    textAlign: "right"
                  }}
                >
                  <h2>
                    {"⭐".repeat(
                      Number(item.rating) || 0
                    )}
                  </h2>

                  <small>
                    {item.createdAt?.seconds
                      ? new Date(
                          item.createdAt.seconds *
                            1000
                        ).toLocaleString()
                      : "No date"}
                  </small>
                </div>
              </div>

              <p
                style={{
                  marginTop: "18px",
                  lineHeight: "1.7"
                }}
              >
                {item.message}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AdminFeedbackPage;
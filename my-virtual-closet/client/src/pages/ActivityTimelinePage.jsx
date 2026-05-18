import { useEffect, useState } from "react";
import PageLayout from "../components/PageLayout";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../store/AuthStore";
import { useTheme } from "../store/ThemeStore";

function ActivityTimelinePage() {
  const { user } = useAuth();
  const { theme } = useTheme();

  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const loadLogs = async () => {
      if (!user) return;

      const q = query(
        collection(db, "activityLogs"),
        where("userId", "==", user.uid)
      );

      const data = await getDocs(q);

      const loadedLogs = data.docs
        .map((document) => ({
          id: document.id,
          ...document.data()
        }))
        .sort((a, b) => {
          const dateA = a.createdAt?.seconds || 0;
          const dateB = b.createdAt?.seconds || 0;
          return dateB - dateA;
        });

      setLogs(loadedLogs);
    };

    loadLogs();
  }, [user]);

  const formatAction = (action) => {
    const labels = {
      add_item: "Added wardrobe item",
      move_to_bin: "Moved item to bin",
      add_to_bin: "Added item to bin",
      restore_from_bin: "Restored item from bin",
      wishlist_add: "Added wishlist item",
      move_to_sell: "Moved item to sell",
      sell_add: "Added sell item",
      restore_sell_item: "Restored sell item",
      recycle_item: "Recycled item",
      save_outfit: "Saved outfit"
    };

    return labels[action] || action;
  };

  const formatDate = (createdAt) => {
    if (!createdAt?.seconds) return "Date unavailable";

    return new Date(createdAt.seconds * 1000).toLocaleString("en-GB");
  };

  return (
    <PageLayout title="Activity Timeline">
      <p>
        Review your recent wardrobe actions, outfit planning activity and
        sustainability behaviour.
      </p>

      {logs.length === 0 ? (
        <div
          style={{
            maxWidth: "700px",
            margin: "30px auto",
            padding: "25px",
            border: `2px solid ${theme.border}`,
            background: theme.card,
            color: theme.text,
            borderRadius: theme.radius
          }}
        >
          <h2>No activity yet</h2>
          <p>
            Start adding clothing items, saving outfits or recycling items to
            build your personal activity timeline.
          </p>
        </div>
      ) : (
        <div
          style={{
            maxWidth: "850px",
            margin: "35px auto",
            display: "flex",
            flexDirection: "column",
            gap: "16px"
          }}
        >
          {logs.map((log) => (
            <div
              key={log.id}
              style={{
                padding: "18px",
                border: `2px solid ${theme.border}`,
                background: theme.card,
                color: theme.text,
                borderRadius: theme.radius,
                textAlign: "left"
              }}
            >
              <h3 style={{ marginTop: 0 }}>
                {theme.symbol} {formatAction(log.action)}
              </h3>

              {log.itemName && <p>Item: {log.itemName}</p>}
              {log.category && <p>Category: {log.category}</p>}
              {log.outfitCategory && <p>Outfit type: {log.outfitCategory}</p>}

              <small>{formatDate(log.createdAt)}</small>
            </div>
          ))}
        </div>
      )}
    </PageLayout>
  );
}

export default ActivityTimelinePage;
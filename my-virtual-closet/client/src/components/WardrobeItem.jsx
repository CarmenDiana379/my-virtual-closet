function WardrobeItem({ item, onDelete }) {

  return (
    <div
      style={{
        border: "2px solid black",
        padding: "10px",
        height: "190px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        background: "white"
      }}
    >

      {/* IMAGE */}

      {item.image ? (

        <img
          src={item.image}
          alt={item.name}
          style={{
            width: "70px",
            height: "70px",
            objectFit: "cover",
            marginBottom: "8px"
          }}
        />

      ) : (

        <div
          style={{
            width: "70px",
            height: "70px",
            border: "1px solid black",
            marginBottom: "8px"
          }}
        />

      )}

      {/* NAME */}

      <div
        style={{
          fontSize: "14px",
          textAlign: "center"
        }}
      >
        {item.name}
      </div>

      {/* DELETE BUTTON */}

      <button
        onClick={() => onDelete(item.id)}
        style={{
          marginTop: "8px",
          padding: "4px 8px",
          fontSize: "12px",
          cursor: "pointer"
        }}
      >
        Delete
      </button>

    </div>
  );
}

export default WardrobeItem;
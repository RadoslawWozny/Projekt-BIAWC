export default function Spinner() {
  return (
    <div style={styles.wrapper}>
      <div style={styles.spinner}></div>
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "200px",
  },
  spinner: {
    width: "50px",
    height: "50px",
    border: "6px solid #ddd",
    borderTop: "6px solid #4a7cff",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
};

// Animacja musi być globalnie w CSS:

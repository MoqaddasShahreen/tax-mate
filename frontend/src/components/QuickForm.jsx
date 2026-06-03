import { useState } from "react";

function QuickForm({ onBack, onResult }) {
  const [income, setIncome] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCalculate = async () => {
    setError("");
    if (!income || income <= 0) {
      setError("Please enter a valid annual income.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("http://127.0.0.1:5000/calculate-tax", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "quick",
          income: Number(income),
        }),
      });
      const data = await res.json();
      onResult(data);
    } catch {
      setError("Failed to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Quick Tax Estimate</h1>
        <p style={styles.subtitle}>
          Instantly know how much income tax will be deducted.
        </p>

        <label style={styles.label}>Annual Income (₹)</label>
        <input
          type="number"
          value={income}
          onChange={(e) => setIncome(e.target.value)}
          placeholder="500000"
          style={styles.input}
        />

        {error && <p style={styles.error}>{error}</p>}

        <button
          onClick={handleCalculate}
          style={{
            ...styles.button,
            opacity: loading ? 0.7 : 1,
          }}
          disabled={loading}
        >
          {loading ? "Calculating..." : "Calculate Tax"}
        </button>

        <button onClick={onBack} style={styles.back}>
          ← Back
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #4f46e5, #9333ea, #ec4899)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    fontFamily: "Segoe UI, sans-serif",
  },
  card: {
    background: "white",
    borderRadius: "24px",
    padding: "40px",
    width: "100%",
    maxWidth: "420px",
    boxShadow: "0 25px 50px rgba(0,0,0,0.25)",
    animation: "fadeIn 0.6s ease",
  },
  title: {
    fontSize: "28px",
    fontWeight: "700",
    textAlign: "center",
    marginBottom: "10px",
  },
  subtitle: {
    textAlign: "center",
    color: "#555",
    marginBottom: "30px",
  },
  label: {
    fontWeight: "600",
    marginBottom: "6px",
    display: "block",
  },
  input: {
    width: "100%",
    height: "56px",
    fontSize: "18px",
    padding: "0 16px",
    borderRadius: "14px",
    border: "1px solid #ccc",
    marginBottom: "15px",
    outline: "none",
  },
  error: {
    color: "red",
    textAlign: "center",
    marginBottom: "10px",
  },
  button: {
    width: "100%",
    height: "56px",
    borderRadius: "14px",
    background: "linear-gradient(to right, #4f46e5, #9333ea)",
    color: "white",
    fontSize: "18px",
    fontWeight: "700",
    border: "none",
    cursor: "pointer",
    marginTop: "10px",
    transition: "transform 0.1s ease",
  },
  back: {
    marginTop: "20px",
    width: "100%",
    background: "none",
    border: "none",
    color: "#555",
    cursor: "pointer",
  },
};

export default QuickForm;

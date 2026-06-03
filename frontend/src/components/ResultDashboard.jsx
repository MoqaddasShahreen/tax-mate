import { useState } from "react";

function ResultDashboard({ data, onBack }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  if (!data) return null;

  const {
    total_tax,
    total_income,
    taxable_income,
    regime_comparison,
    ai_explanation,
    strategy,
  } = data;

  const askAI = async () => {
    if (!question.trim()) return;

    setLoading(true);
    setAnswer("");

    try {
      const res = await fetch("http://127.0.0.1:5000/ask-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: question,
          tax_result: data,
        }),
      });

      const result = await res.json();
      setAnswer(result.answer || "No response from AI.");
    } catch {
      setAnswer("AI service unavailable.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* HEADER */}
        <div style={styles.header}>
          <h1>TaxMate Dashboard</h1>
          <button onClick={onBack} style={styles.back}>← Back</button>
        </div>

        {/* HERO CARD */}
        <div style={styles.hero}>
          <p style={styles.heroLabel}>Final Income Tax Payable</p>
          <h2 style={styles.heroAmount}>₹{total_tax}</h2>
          <p style={styles.heroSub}>AI-assisted tax computation result</p>
        </div>

        {/* GRID */}
        <div style={styles.grid}>

          <div style={styles.card}>
            <h3>Income Summary</h3>
            <p>Total Income: ₹{total_income}</p>
            <p>Taxable Income: ₹{taxable_income}</p>
          </div>

          <div style={styles.card}>
            <h3>Regime Comparison (AI-assisted)</h3>
            <p>Old Regime: ₹{regime_comparison.old_regime_tax}</p>
            <p>New Regime: ₹{regime_comparison.new_regime_tax}</p>
            <strong>Recommended: {regime_comparison.recommended_regime}</strong>
          </div>

        </div>

        {/* AI SECTION */}
        <div style={styles.aiSection}>
          <h2>AI Insights Engine</h2>

          <div style={styles.card}>
            <h3>AI Explanation</h3>
            <ul>
              {ai_explanation?.map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
          </div>

          <div style={styles.card}>
            <h3>AI Strategy</h3>
            <ul>
              {strategy?.map((s, i) => (
                <li key={i}>{s.action}</li>
              ))}
            </ul>
          </div>

          <div style={styles.card}>
            <h3>Ask AI about your tax</h3>
            <textarea
              style={styles.textarea}
              placeholder="Ask anything about your tax…"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            <button onClick={askAI} style={styles.askBtn}>
              {loading ? "Thinking..." : "Ask AI"}
            </button>
            {answer && <p style={styles.answer}>{answer}</p>}
          </div>
        </div>

      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg,#0f172a,#1e1b4b,#312e81)",
    padding: "40px",
    fontFamily: "Segoe UI, sans-serif",
    color: "white",
  },
  container: { maxWidth: "1100px", margin: "auto" },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
  },
  back: {
    background: "transparent",
    color: "#c7d2fe",
    border: "1px solid #6366f1",
    padding: "8px 16px",
    borderRadius: "10px",
    cursor: "pointer",
  },
  hero: {
    background: "linear-gradient(135deg,#4f46e5,#9333ea)",
    padding: "30px",
    borderRadius: "20px",
    boxShadow: "0 30px 60px rgba(0,0,0,0.4)",
    marginBottom: "30px",
  },
  heroLabel: { opacity: 0.9 },
  heroAmount: { fontSize: "48px", margin: "10px 0" },
  heroSub: { opacity: 0.8 },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
  },
  card: {
    background: "rgba(255,255,255,0.08)",
    padding: "20px",
    borderRadius: "16px",
    backdropFilter: "blur(12px)",
  },
  aiSection: { marginTop: "40px" },
  textarea: {
    width: "100%",
    height: "90px",
    borderRadius: "12px",
    padding: "12px",
    marginBottom: "10px",
    border: "none",
    outline: "none",
  },
  askBtn: {
    padding: "10px 20px",
    borderRadius: "12px",
    background: "#6366f1",
    border: "none",
    color: "white",
    cursor: "pointer",
  },
  answer: { marginTop: "10px", opacity: 0.9 },
};

export default ResultDashboard;
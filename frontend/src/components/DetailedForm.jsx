import { useState } from "react";

function DetailedForm({ onBack, onResult }) {
  const [form, setForm] = useState({
    basic_salary: "",
    hra: "",
    rent_paid: "",
    special_allowance: "",
    bonus: "",
    investment_80c: "",
    investment_80d: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value, // ✅ keep as string
    });
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        mode: "detailed",
        regime: "new",
        basic_salary: Number(form.basic_salary) || 0,
        hra: Number(form.hra) || 0,
        rent_paid: Number(form.rent_paid) || 0,
        special_allowance: Number(form.special_allowance) || 0,
        bonus: Number(form.bonus) || 0,
        investment_80c: Number(form.investment_80c) || 0,
        investment_80d: Number(form.investment_80d) || 0,
      };

      const res = await fetch("http://127.0.0.1:5000/calculate-tax", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      onResult(data);
    } catch {
      alert("Failed to connect to backend");
    }
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Detailed Salary Analysis</h1>

      <div style={styles.card}>
        {[
          ["basic_salary", "Basic Salary"],
          ["hra", "HRA"],
          ["rent_paid", "Rent Paid"],
          ["special_allowance", "Special Allowance"],
          ["bonus", "Bonus"],
          ["investment_80c", "80C Investment"],
          ["investment_80d", "80D Investment"],
        ].map(([key, label]) => (
          <div key={key} style={styles.field}>
            <label>{label}</label>
            <input
              type="number"
              name={key}
              value={form[key]}
              onChange={handleChange}
              placeholder="0"
              style={styles.input}
            />
          </div>
        ))}

        <button style={styles.primaryButton} onClick={handleSubmit}>
          Analyze Tax
        </button>

        <button style={styles.backButton} onClick={onBack}>
          ← Back
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f172a, #312e81)",
    color: "white",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Segoe UI, sans-serif",
    padding: "20px",
  },
  title: {
    fontSize: "36px",
    marginBottom: "20px",
  },
  card: {
    background: "white",
    color: "#111",
    padding: "30px",
    borderRadius: "20px",
    width: "100%",
    maxWidth: "500px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
  },
  field: {
    marginBottom: "12px",
    display: "flex",
    flexDirection: "column",
  },
  input: {
    height: "44px",
    padding: "8px 12px",
    borderRadius: "10px",
    border: "1px solid #ccc",
  },
  primaryButton: {
    marginTop: "20px",
    width: "100%",
    padding: "14px",
    background: "#4f46e5",
    color: "white",
    fontWeight: "700",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
  },
  backButton: {
    marginTop: "12px",
    width: "100%",
    background: "none",
    border: "none",
    cursor: "pointer",
  },
};

export default DetailedForm;

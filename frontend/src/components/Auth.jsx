import { useState } from "react";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "firebase/auth";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={styles.home}>
      <h1 style={styles.title}>TaxMate</h1>
      <p style={styles.subtitle}>
        {isLogin
          ? "Login to access your tax dashboard"
          : "Create an account to manage your taxes securely"}
      </p>

      <div style={styles.card}>
        <form onSubmit={handleSubmit}>
          <input
            style={styles.input}
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            style={styles.input}
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p style={{ color: "red" }}>{error}</p>}

          <button style={styles.button}>
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        <p
          style={styles.toggle}
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin
            ? "Don't have an account? Sign Up"
            : "Already have an account? Login"}
        </p>
      </div>
    </div>
  );
}

const styles = {
  home: {
    minHeight: "100vh",
    background: "linear-gradient(135deg,#0f172a,#1e1b4b,#312e81)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontFamily: "Segoe UI, sans-serif",
  },
  title: {
    fontSize: "48px",
    fontWeight: "800",
    marginBottom: "10px",
  },
  subtitle: {
    opacity: 0.8,
    marginBottom: "40px",
  },
  card: {
    background: "rgba(255,255,255,0.1)",
    padding: "30px",
    borderRadius: "20px",
    width: "300px",
    backdropFilter: "blur(12px)",
    boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "8px",
    border: "none",
  },
  button: {
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#7c3aed",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
  },
  toggle: {
    marginTop: "15px",
    cursor: "pointer",
    opacity: 0.8,
  },
};
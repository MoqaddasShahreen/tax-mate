import { useState, useEffect } from "react";
import { auth, db } from "./firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import Auth from "./components/Auth";
import QuickForm from "./components/QuickForm";
import DetailedForm from "./components/DetailedForm";
import ResultDashboard from "./components/ResultDashboard";

function App() {
  const [view, setView] = useState("home");
  const [result, setResult] = useState(null);
  const [user, setUser] = useState(null);

  // 🔐 Listen for authentication changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      console.log("AUTH STATE:", currentUser);
    });

    return () => unsubscribe();
  }, []);

  // 🚫 If not logged in → show Auth page
  if (!user) {
    return <Auth />;
  }

  return (
    <>
      {/* 🔓 Logout Button */}
      <button
        onClick={() => auth.signOut()}
        style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          padding: "8px 15px",
          background: "#7c3aed",
          border: "none",
          borderRadius: "8px",
          color: "white",
          cursor: "pointer",
          zIndex: 1000,
        }}
      >
        Logout
      </button>

      {/* HOME PAGE */}
      {view === "home" && (
        <div style={styles.home}>
          <h1 style={styles.title}>TaxMate</h1>
          <p style={styles.subtitle}>
            Understand your salary, compare tax regimes, and get AI insights.
          </p>

          <div style={styles.cardRow}>
            <div style={styles.card} onClick={() => setView("quick")}>
              <h2>Quick Estimate</h2>
              <p>Instant tax calculation using AI-assisted logic.</p>
            </div>

            <div style={styles.card} onClick={() => setView("detailed")}>
              <h2>Detailed Analysis</h2>
              <p>Full salary breakdown, AI strategy & regime comparison.</p>
            </div>
          </div>
        </div>
      )}

      {/* QUICK MODE */}
      {view === "quick" && (
        <QuickForm
          onBack={() => setView("home")}
          onResult={async (data) => {
            console.log("RESULT DATA:", data);
            setResult(data);

            try {
              if (auth.currentUser) {
                const docRef = await addDoc(
                  collection(db, "users", auth.currentUser.uid, "taxHistory"),
                  {
                    ...data,
                    createdAt: serverTimestamp(),
                  }
                );

                console.log("DOCUMENT WRITTEN:", docRef.id);
              }
            } catch (err) {
              console.error("FIRESTORE ERROR:", err);
            }

            setView("result");
          }}
        />
      )}

      {/* DETAILED MODE */}
      {view === "detailed" && (
        <DetailedForm
          onBack={() => setView("home")}
          onResult={async (data) => {
            console.log("RESULT DATA:", data);
            setResult(data);

            try {
              if (auth.currentUser) {
                const docRef = await addDoc(
                  collection(db, "users", auth.currentUser.uid, "taxHistory"),
                  {
                    ...data,
                    createdAt: serverTimestamp(),
                  }
                );

                console.log("DOCUMENT WRITTEN:", docRef.id);
              }
            } catch (err) {
              console.error("FIRESTORE ERROR:", err);
            }

            setView("result");
          }}
        />
      )}

      {/* RESULT DASHBOARD */}
      {view === "result" && (
        <ResultDashboard
          data={result}
          onBack={() => setView("home")}
        />
      )}
    </>
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
  cardRow: {
    display: "flex",
    gap: "30px",
  },
  card: {
    background: "rgba(255,255,255,0.1)",
    padding: "30px",
    borderRadius: "20px",
    width: "260px",
    cursor: "pointer",
    backdropFilter: "blur(12px)",
    boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
  },
};

export default App;
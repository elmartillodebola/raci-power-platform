import { useState } from "react";
import RACIMatrixGeneral   from "./RACIGeneral";
import RACIMatrixDetallada from "./RACIDetallada";

const VIEWS = [
  { id: "general",   label: "General" },
  { id: "detallada", label: "Detallada" },
];

export default function App() {
  const [view, setView] = useState("general");

  return (
    <div style={{ fontFamily: "var(--font-sans)", color: "var(--color-text-primary)", padding: "1rem 0" }}>

      {/* Header */}
      <div style={{ marginBottom: "1rem", display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 500, color: "var(--color-text-secondary)", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 4 }}>
            Gobierno de TI · Power Platform
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 500, margin: "0 0 4px" }}>Matriz RACI</h2>
          <p style={{ fontSize: 13, color: "var(--color-text-secondary)", margin: 0 }}>
            Sector financiero · SAFe + DevSecOps · Estrategia low-code / no-code
          </p>
        </div>

        {/* View toggle */}
        <div style={{
          display: "flex", alignItems: "center",
          border: "0.5px solid var(--color-border-secondary)",
          borderRadius: 8, overflow: "hidden", flexShrink: 0,
        }}>
          {VIEWS.map(({ id, label }) => (
            <button key={id} onClick={() => setView(id)} style={{
              padding: "5px 14px", border: "none", cursor: "pointer",
              fontFamily: "var(--font-sans)", fontSize: 12,
              background: view === id ? "var(--color-text-primary)" : "var(--color-background-secondary)",
              color:      view === id ? "var(--color-background-primary)" : "var(--color-text-secondary)",
              fontWeight: view === id ? 500 : 400,
              transition: "background 0.15s, color 0.15s",
            }}>
              Matriz RACI {label}
            </button>
          ))}
        </div>
      </div>

      {/* Views */}
      {view === "general"   && <RACIMatrixGeneral />}
      {view === "detallada" && <RACIMatrixDetallada />}

    </div>
  );
}

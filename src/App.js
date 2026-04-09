import RACIMatrixDetallada from "./RACIDetallada";

export default function App() {
  return (
    <div style={{ fontFamily: "var(--font-sans)", color: "var(--color-text-primary)", padding: "1rem 2rem" }}>

      {/* Header */}
      <div style={{ marginBottom: "1rem" }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: "var(--color-text-secondary)", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 4 }}>
          Gobierno de TI · Power Platform
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 500, margin: "0 0 4px" }}>Matriz RACI</h2>
        <p style={{ fontSize: 13, color: "var(--color-text-secondary)", margin: 0 }}>
          Sector financiero · SAFe + DevSecOps · Estrategia low-code / no-code
        </p>
      </div>

      <RACIMatrixDetallada />

    </div>
  );
}

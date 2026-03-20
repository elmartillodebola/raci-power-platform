import { useState } from "react";
import * as XLSX from "xlsx";
import AREAS from "./data/areas.json";
import RACI_DATA_RAW from "./data/raci-data.json";

// ─── Constants ────────────────────────────────────────────────────────────────

const RACI_COLORS = {
  R: { bg: "#EAF3DE", text: "#3B6D11", border: "#639922" },
  A: { bg: "#FAEEDA", text: "#854F0B", border: "#BA7517" },
  C: { bg: "#E6F1FB", text: "#185FA5", border: "#378ADD" },
  I: { bg: "#F1EFE8", text: "#5F5E5A", border: "#B4B2A9" },
  "": { bg: "transparent", text: "#B4B2A9", border: "transparent" },
  "·": { bg: "transparent", text: "#B4B2A9", border: "var(--color-border-secondary)" },
};

const LEGEND = [
  { code: "R", label: "Responsible – Ejecuta" },
  { code: "A", label: "Accountable – Rinde cuentas" },
  { code: "C", label: "Consulted – Aporta criterio" },
  { code: "I", label: "Informed – Debe ser notificado" },
  { code: "·", label: "No aplica" },
];

const RACI_CYCLE = ["", "R", "A", "C", "I"];
const CATEGORIES = [...new Set(RACI_DATA_RAW.map(r => r.cat))];

// ─── Component ────────────────────────────────────────────────────────────────

export default function RACIMatrixDetallada() {
  const [data, setData] = useState(RACI_DATA_RAW);
  const [filterCat, setFilterCat] = useState("Todas");
  const [filterComp, setFilterComp] = useState("Todas");
  const [highlight, setHighlight] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState(null);
  const [showSaveNotice, setShowSaveNotice] = useState(false);

  const allCats = ["Todas", ...CATEGORIES];

  const activeData = editMode ? editData : data;

  const compsByCategory = activeData
    .filter(r => filterCat === "Todas" || r.cat === filterCat)
    .map(r => r.comp);
  const allComps = ["Todas", ...[...new Set(compsByCategory)]];

  const filteredData = activeData.filter(r =>
    (filterCat === "Todas" || r.cat === filterCat) &&
    (filterComp === "Todas" || r.comp === filterComp)
  );

  const handleCatChange = (val) => {
    setFilterCat(val);
    setFilterComp("Todas");
  };

  // ── Edit mode ──────────────────────────────────────────────────────────────

  const activateEdit = () => {
    setEditData(data.map(r => ({ ...r, raci: { ...r.raci } })));
    setEditMode(true);
  };

  const cancelEdit = () => {
    setEditData(null);
    setEditMode(false);
  };

  const saveEdit = () => {
    setData(editData);
    setEditMode(false);
    setEditData(null);
    downloadJSON(editData);
  };

  const cycleCell = (actividad, areaId) => {
    setEditData(prev => prev.map(r => {
      if (r.actividad !== actividad) return r;
      const current = r.raci[areaId] || "";
      const next = RACI_CYCLE[(RACI_CYCLE.indexOf(current) + 1) % RACI_CYCLE.length];
      return { ...r, raci: { ...r.raci, [areaId]: next } };
    }));
  };

  const downloadJSON = (jsonData) => {
    const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "raci-data.json";
    a.click();
    URL.revokeObjectURL(url);
    setShowSaveNotice(true);
  };

  // ── Excel export ───────────────────────────────────────────────────────────

  const exportToExcel = () => {
    const headers = ["Componente PP", "Sub-área / Módulo", "Actividad", ...AREAS.map(a => a.label)];
    const rows = filteredData.map(r => [
      r.cat, r.comp, r.actividad, ...AREAS.map(a => r.raci[a.id] || "")
    ]);
    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    ws["!cols"] = [{ wch: 28 }, { wch: 32 }, { wch: 60 }, ...AREAS.map(() => ({ wch: 22 }))];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Matriz RACI Detallada");
    const catLabel = filterCat === "Todas" ? "Completa" : filterCat.replace(/[\s/&]+/g, "_");
    XLSX.writeFile(wb, `MatrizRACI_Detallada_${catLabel}.xlsx`);
  };

  // ── Styles ─────────────────────────────────────────────────────────────────

  const selectStyle = { fontSize: 12, padding: "4px 8px", borderRadius: 6, border: "0.5px solid var(--color-border-secondary)", background: "var(--color-background-secondary)", color: "var(--color-text-primary)" };
  const labelStyle = { fontSize: 11, color: "var(--color-text-secondary)", fontWeight: 500 };

  return (
    <>
      {/* Legend */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: "1rem" }}>
        {LEGEND.map(l => (
          <div key={l.code} style={{
            display: "flex", alignItems: "center", gap: 6,
            background: RACI_COLORS[l.code].bg,
            border: `0.5px solid ${RACI_COLORS[l.code].border}`,
            borderRadius: 6, padding: "3px 10px", fontSize: 12,
          }}>
            <span style={{ fontWeight: 500, color: RACI_COLORS[l.code].text }}>{l.code}</span>
            <span style={{ color: "var(--color-text-secondary)" }}>{l.label}</span>
          </div>
        ))}
      </div>

      {/* Save notice */}
      {showSaveNotice && (
        <div style={{
          marginBottom: "0.75rem", padding: "10px 14px", borderRadius: 8,
          background: "#EFF6FF", border: "1px solid #3B82F6",
          fontSize: 12, color: "#1E40AF", lineHeight: 1.6,
        }}>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>✓ JSON descargado en tu carpeta de Descargas</div>
          <div>Para que los cambios sean permanentes debes:</div>
          <ol style={{ margin: "4px 0 4px 16px", padding: 0 }}>
            <li>Reemplazar <code>src/data/raci-data.json</code> con el archivo descargado.</li>
            <li>Hacer <code>git commit</code> y <code>git push</code> para que cualquier persona que clone el repositorio reciba los valores actualizados.</li>
          </ol>
          <div>Mientras no recargues la página, la matriz sigue mostrando los cambios aplicados.</div>
          <button onClick={() => setShowSaveNotice(false)} style={{
            marginTop: 6, fontSize: 11, padding: "2px 10px", borderRadius: 5,
            border: "0.5px solid #93C5FD", background: "transparent",
            color: "#1E40AF", cursor: "pointer",
          }}>
            Entendido
          </button>
        </div>
      )}

      {/* Edit mode banner */}
      {editMode && (
        <div style={{
          marginBottom: "0.75rem", padding: "8px 14px", borderRadius: 8,
          background: "#FFFBEB", border: "1px solid #F59E0B",
          display: "flex", alignItems: "center", gap: 10, fontSize: 12,
          color: "#92400E",
        }}>
          <span style={{ fontWeight: 600 }}>Modo edición activo</span>
          <span style={{ color: "#B45309" }}>· Haz clic en cualquier celda para cambiar su valor (cicla entre R → A → C → I → vacío)</span>
        </div>
      )}

      {/* Filters */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: "1rem", alignItems: "center" }}>
        <div style={{ fontSize: 12, color: "var(--color-text-secondary)", fontWeight: 500, minWidth: 80 }}>
          {filteredData.length} actividades
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={labelStyle}>Componente PP</span>
          <select value={filterCat} onChange={e => handleCatChange(e.target.value)} style={selectStyle}>
            {allCats.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={labelStyle}>Sub-área / Módulo</span>
          <select value={filterComp} onChange={e => setFilterComp(e.target.value)} style={selectStyle}>
            {allComps.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        {!editMode && (
          <div style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>
            · Pasa el cursor sobre un área para destacarla
          </div>
        )}

        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          {!editMode ? (
            <>
              <button onClick={activateEdit} style={{
                fontSize: 12, padding: "4px 12px", borderRadius: 6,
                border: "0.5px solid #F59E0B", background: "#FFFBEB",
                color: "#92400E", cursor: "pointer",
              }}>
                ✎ Editar valores
              </button>
              <button onClick={exportToExcel} style={{
                fontSize: 12, padding: "4px 12px", borderRadius: 6,
                border: "0.5px solid var(--color-border-secondary)",
                background: "var(--color-background-secondary)", color: "var(--color-text-primary)",
                cursor: "pointer",
              }}>
                ↓ Exportar Excel
              </button>
            </>
          ) : (
            <>
              <button onClick={cancelEdit} style={{
                fontSize: 12, padding: "4px 12px", borderRadius: 6,
                border: "0.5px solid var(--color-border-secondary)",
                background: "var(--color-background-secondary)", color: "var(--color-text-secondary)",
                cursor: "pointer",
              }}>
                Cancelar
              </button>
              <button onClick={saveEdit} style={{
                fontSize: 12, padding: "4px 14px", borderRadius: 6,
                border: "1px solid #16A34A", background: "#F0FDF4",
                color: "#15803D", cursor: "pointer", fontWeight: 600,
              }}>
                ✓ Guardar y descargar JSON
              </button>
            </>
          )}
        </div>
      </div>

      {/* Table */}
      <div style={{
        overflowX: "auto", borderRadius: 8,
        border: editMode ? "1.5px solid #F59E0B" : "0.5px solid var(--color-border-tertiary)",
        transition: "border 0.2s",
      }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, tableLayout: "fixed" }}>
          <colgroup>
            <col style={{ width: 90 }} />
            <col style={{ width: 110 }} />
            <col style={{ width: 230 }} />
            {AREAS.map(a => <col key={a.id} style={{ width: 52 }} />)}
          </colgroup>
          <thead>
            <tr style={{ background: "var(--color-background-secondary)", borderBottom: "0.5px solid var(--color-border-secondary)" }}>
              <th style={{ padding: "8px 6px", textAlign: "left", fontWeight: 500, color: "var(--color-text-secondary)", fontSize: 10 }}>Componente PP</th>
              <th style={{ padding: "8px 6px", textAlign: "left", fontWeight: 500, color: "var(--color-text-secondary)", fontSize: 10 }}>Sub-área / Módulo</th>
              <th style={{ padding: "8px 6px", textAlign: "left", fontWeight: 500, color: "var(--color-text-secondary)", fontSize: 10 }}>Actividad</th>
              {AREAS.map(a => (
                <th key={a.id}
                  onMouseEnter={() => !editMode && setHighlight(a.id)}
                  onMouseLeave={() => setHighlight(null)}
                  style={{
                    padding: "6px 2px", textAlign: "center", fontWeight: 500, fontSize: 9,
                    color: highlight === a.id ? "var(--color-text-primary)" : "var(--color-text-secondary)",
                    cursor: "default",
                    background: highlight === a.id ? "var(--color-background-info)" : "transparent",
                    transition: "background 0.15s",
                    whiteSpace: "normal", lineHeight: 1.2,
                    borderLeft: "0.5px solid var(--color-border-tertiary)",
                  }}>
                  {a.short}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CATEGORIES.filter(cat => filterCat === "Todas" || cat === filterCat).map(cat => {
              const rows = filteredData.filter(r => r.cat === cat);
              if (!rows.length) return null;
              return rows.map((r, i) => (
                <tr key={r.actividad} style={{
                  borderBottom: "0.5px solid var(--color-border-tertiary)",
                  background: i % 2 === 0 ? "transparent" : "var(--color-background-secondary)",
                }}>
                  {i === 0 ? (
                    <td rowSpan={rows.length} style={{
                      padding: "6px 6px", fontWeight: 500, fontSize: 10,
                      color: "var(--color-text-secondary)", verticalAlign: "top",
                      borderRight: "0.5px solid var(--color-border-secondary)",
                      background: "var(--color-background-secondary)",
                      lineHeight: 1.3,
                    }}>
                      {cat}
                    </td>
                  ) : null}
                  <td style={{ padding: "6px 6px", fontSize: 10, color: "var(--color-text-secondary)", lineHeight: 1.2 }}>{r.comp}</td>
                  <td style={{ padding: "6px 6px", lineHeight: 1.3, fontSize: 11 }}>{r.actividad}</td>
                  {AREAS.map(a => {
                    const code = r.raci[a.id] || "";
                    const c = RACI_COLORS[code] || RACI_COLORS[""];
                    return (
                      <td key={a.id}
                        onClick={() => editMode && cycleCell(r.actividad, a.id)}
                        style={{
                          textAlign: "center", padding: "4px 2px",
                          borderLeft: "0.5px solid var(--color-border-tertiary)",
                          background: highlight === a.id
                            ? (code ? c.bg : "var(--color-background-info)")
                            : (code ? c.bg : "transparent"),
                          cursor: editMode ? "pointer" : "default",
                          transition: "background 0.15s",
                          outline: editMode ? "none" : undefined,
                        }}
                        title={editMode ? "Clic para cambiar valor" : undefined}
                      >
                        {code && (
                          <span style={{ display: "inline-block", fontWeight: 500, fontSize: 11, color: c.text }}>
                            {code}
                          </span>
                        )}
                        {editMode && !code && (
                          <span style={{ display: "inline-block", fontSize: 10, color: "#D1D5DB" }}>·</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ));
            })}
          </tbody>
        </table>
      </div>

      {/* Footer note */}
      <p style={{ fontSize: 11, color: "var(--color-text-secondary)", marginTop: 12, lineHeight: 1.5 }}>
        Matriz ajustada al contexto organizacional del sector financiero (inversiones, cesantías, pensiones obligatorias y voluntarias) bajo metodología SAFe + DevSecOps.
        · <strong>CIS</strong>: gobierno del desarrollo de software y comunidad PP · <strong>IA</strong>: gobierno de IA, Copilot Studio y AI Builder · <strong>RPA</strong>: automatización robótica y comunidad de automatizadores ciudadanos · <strong>D&amp;A</strong>: gobierno de datos, DataOps, Power BI y Dataverse · <strong>COE-TI Arq</strong>: arquitecturas de referencia e integración · <strong>COE-TI Ops</strong>: DevSecOps, CI/CD y monitoreo · <strong>COE-TI Mesa</strong>: soporte, tiquetes e incidentes · <strong>CiberSec</strong>: seguridad, OWASP, SOX y auditoría · <strong>Procesos</strong>: documentación e impacto de procesos · <strong>Soluc TI</strong>: trenes SAFe, fábrica y células.
        Matriz Detallada v1.1 — sujeta a validación en comité.
      </p>
    </>
  );
}

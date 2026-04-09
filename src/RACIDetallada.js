import { useState, useEffect, useRef } from "react";
import * as XLSX from "xlsx";
import AREAS from "./data/areas.json";
import RACI_DATA_RAW from "./data/raci-data.json";

// ─── Constants ────────────────────────────────────────────────────────────────

const RACI_COLORS = {
  R: { bg: "#EAF3DE", text: "#3B6D11", border: "#639922" },
  A: { bg: "#FAEEDA", text: "#854F0B", border: "#BA7517" },
  C: { bg: "#E6F1FB", text: "#185FA5", border: "#378ADD" },
  I: { bg: "#F1EFE8", text: "#5F5E5A", border: "#B4B2A9" },
  AR: { bg: "#FDE8E8", text: "#B22222", border: "#FF6347" },
  "": { bg: "transparent", text: "#B4B2A9", border: "transparent" },
  "·": { bg: "transparent", text: "#B4B2A9", border: "var(--color-border-secondary)" },
};

const LEGEND = [
  { code: "R", label: "Responsible – Ejecuta", tooltip: "Quien ejecuta la tarea. Realiza el trabajo operativo. Puede haber más de un Responsible por actividad.", align: "right" },
  { code: "A", label: "Accountable – Rinde cuentas", tooltip: "Quien rinde cuentas por el resultado final. Aprueba el entregable y responde ante la organización. Solo debe haber uno por actividad." },
  { code: "C", label: "Consulted – Aporta criterio", tooltip: "Quien aporta criterio o conocimiento antes o durante la ejecución. Comunicación bidireccional: se le consulta y responde." },
  { code: "I", label: "Informed – Debe ser notificado", tooltip: "Quien debe ser notificado del avance o resultado. Comunicación unidireccional: recibe información sin necesidad de responder." },
  { code: "·", label: "No aplica", tooltip: "No aplica asignación RACI para esta área en esta actividad." },
];

const RACI_CYCLE = ["", "R", "A", "C", "I", "AR"];
const CATEGORIES = [...new Set(RACI_DATA_RAW.map(r => r.cat))];

// ─── Component ────────────────────────────────────────────────────────────────

export default function RACIMatrixDetallada() {
  const [data, setData] = useState(RACI_DATA_RAW);
  const [filterCat, setFilterCat] = useState("Todas");
  const [filterComp, setFilterComp] = useState("Todas");
  const [highlight, setHighlight] = useState(null);
  const tableRef = useRef(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState(null);
  const [showSaveNotice, setShowSaveNotice] = useState(false);
  const [sortField, setSortField] = useState(null);
  const [sortDir, setSortDir] = useState("asc");

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

  const handleSort = (field) => {
    if (sortField === field) {
      if (sortDir === "asc") setSortDir("desc");
      else { setSortField(null); setSortDir("asc"); }
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const sortedData = sortField
    ? [...filteredData].sort((a, b) => {
        const valA = (a[sortField] || "").toLowerCase();
        const valB = (b[sortField] || "").toLowerCase();
        const cmp = valA.localeCompare(valB, "es", { sensitivity: "base" });
        return sortDir === "asc" ? cmp : -cmp;
      })
    : filteredData;

  const sortIcon = (field) => {
    if (sortField !== field) return " ⇅";
    return sortDir === "asc" ? " ▲" : " ▼";
  };

  const sortHeaderStyle = (field) => ({
    cursor: "pointer",
    userSelect: "none",
    color: sortField === field ? "var(--color-text-primary)" : "var(--color-text-secondary)",
    background: sortField === field ? "var(--color-background-info)" : "var(--color-background-secondary)",
  });

  const handleCatChange = (val) => {
    setFilterCat(val);
    setFilterComp("Todas");
  };

  // ── Highlight lock (click to pin, Esc or click outside to clear) ────────

  useEffect(() => {
    if (!highlight) return;
    const handleKey = (e) => { if (e.key === "Escape") setHighlight(null); };
    const handleClick = (e) => { if (tableRef.current && !tableRef.current.contains(e.target)) setHighlight(null); };
    document.addEventListener("keydown", handleKey);
    document.addEventListener("mousedown", handleClick);
    return () => { document.removeEventListener("keydown", handleKey); document.removeEventListener("mousedown", handleClick); };
  }, [highlight]);

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
          <div key={l.code} className="raci-legend-item" style={{
            display: "flex", alignItems: "center", gap: 6,
            background: RACI_COLORS[l.code].bg,
            border: `0.5px solid ${RACI_COLORS[l.code].border}`,
            borderRadius: 6, padding: "3px 10px", fontSize: 12,
            cursor: "help",
          }}>
            <span style={{ fontWeight: 500, color: RACI_COLORS[l.code].text }}>{l.code}</span>
            <span style={{ color: "var(--color-text-secondary)" }}>{l.label}</span>
            <span className="raci-tooltip">{l.tooltip}</span>
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
          background: "var(--color-highlight-bg)", border: "1px solid var(--color-highlight)",
          display: "flex", alignItems: "center", gap: 10, fontSize: 12,
          color: "#92400E",
        }}>
          <span style={{ fontWeight: 600 }}>Modo edición activo</span>
          <span style={{ color: "#B45309" }}>· Haz clic en cualquier celda para cambiar su valor (cicla entre R → A → RA → C → I → vacío)</span>
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
            · Haz clic en el encabezado de un área para destacar la columna
          </div>
        )}

        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          {!editMode ? (
            <>
              <button onClick={activateEdit} style={{
                fontSize: 12, padding: "4px 12px", borderRadius: 6,
                border: "0.5px solid var(--color-highlight)", background: "var(--color-highlight-bg)",
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
      <div ref={tableRef} style={{
        border: editMode ? "1.5px solid var(--color-highlight)" : "0.5px solid var(--color-border-tertiary)",
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
            <tr style={{ background: "var(--color-background-secondary)", boxShadow: "0 0.5px var(--color-border-secondary)", position: "sticky", top: 0, zIndex: 2 }}>
              <th onClick={() => handleSort("cat")} style={{ padding: "8px 6px", textAlign: "left", fontWeight: 500, fontSize: 10, ...sortHeaderStyle("cat") }}>
                Componente PP<span style={{ opacity: 0.6 }}>{sortIcon("cat")}</span>
              </th>
              <th onClick={() => handleSort("comp")} style={{ padding: "8px 6px", textAlign: "left", fontWeight: 500, fontSize: 10, ...sortHeaderStyle("comp") }}>
                Sub-área / Módulo<span style={{ opacity: 0.6 }}>{sortIcon("comp")}</span>
              </th>
              <th onClick={() => handleSort("actividad")} style={{ padding: "8px 6px", textAlign: "left", fontWeight: 500, fontSize: 10, ...sortHeaderStyle("actividad") }}>
                Actividad<span style={{ opacity: 0.6 }}>{sortIcon("actividad")}</span>
              </th>
              {AREAS.map(a => (
                <th key={a.id}
                  onClick={() => { if (!editMode) setHighlight(highlight === a.id ? null : a.id); }}
                  style={{
                    padding: "6px 2px", textAlign: "center", fontWeight: 500, fontSize: 9,
                    color: highlight === a.id ? "var(--color-text-primary)" : "var(--color-text-secondary)",
                    cursor: editMode ? "default" : "pointer",
                    background: highlight === a.id ? "var(--color-highlight-bg)" : "transparent",
                    whiteSpace: "normal", lineHeight: 1.2,
                    outline: highlight === a.id ? "2px solid var(--color-highlight)" : "none",
                  }}>
                  {a.short}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(() => {
              // When sorting by cat, recalculate rowSpans based on sorted order.
              // When sorting by comp or actividad, render flat (no rowSpan) to avoid broken merged cells.
              const useRowSpan = sortField !== "comp" && sortField !== "actividad";

              if (useRowSpan) {
                // Build groups preserving sorted order (sortField===null uses original order; sortField==="cat" sorts cats too)
                const seen = [];
                const groups = [];
                sortedData.forEach(r => {
                  if (!seen.includes(r.cat)) { seen.push(r.cat); groups.push({ cat: r.cat, rows: [] }); }
                  groups.find(g => g.cat === r.cat).rows.push(r);
                });
                return groups.map(({ cat, rows }) =>
                  rows.map((r, i) => (
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
                              borderLeft: highlight === a.id ? "2px solid var(--color-highlight)" : "0.5px solid var(--color-border-tertiary)",
                              borderRight: highlight === a.id ? "2px solid var(--color-highlight)" : "none",
                              background: code ? c.bg : "transparent",
                              cursor: editMode ? "pointer" : "default",
                            }}
                            title={editMode ? "Clic para cambiar valor" : undefined}
                          >
                            {code && <span style={{ display: "inline-block", fontWeight: 500, fontSize: 11, color: c.text }}>{code}</span>}
                            {editMode && !code && <span style={{ display: "inline-block", fontSize: 10, color: "#D1D5DB" }}>·</span>}
                          </td>
                        );
                      })}
                    </tr>
                  ))
                );
              }

              // Flat rendering (sort by comp or actividad): show cat value in every row
              return sortedData.map((r, i) => (
                <tr key={r.actividad} style={{
                  borderBottom: "0.5px solid var(--color-border-tertiary)",
                  background: i % 2 === 0 ? "transparent" : "var(--color-background-secondary)",
                }}>
                  <td style={{
                    padding: "6px 6px", fontWeight: 500, fontSize: 10,
                    color: "var(--color-text-secondary)", lineHeight: 1.3,
                    borderRight: "0.5px solid var(--color-border-secondary)",
                    background: "var(--color-background-secondary)",
                  }}>
                    {r.cat}
                  </td>
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
                          borderLeft: highlight === a.id ? "2px solid var(--color-highlight)" : "0.5px solid var(--color-border-tertiary)",
                          borderRight: highlight === a.id ? "2px solid var(--color-highlight)" : "none",
                          background: code ? c.bg : "transparent",
                          cursor: editMode ? "pointer" : "default",
                        }}
                        title={editMode ? "Clic para cambiar valor" : undefined}
                      >
                        {code && <span style={{ display: "inline-block", fontWeight: 500, fontSize: 11, color: c.text }}>{code}</span>}
                        {editMode && !code && <span style={{ display: "inline-block", fontSize: 10, color: "#D1D5DB" }}>·</span>}
                      </td>
                    );
                  })}
                </tr>
              ));
            })()}
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

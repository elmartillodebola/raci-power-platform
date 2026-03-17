import { useState } from "react";
import * as XLSX from "xlsx";

const AREAS = [
  { id: "dev",   label: "Desarrollo de Software",         short: "Dev SW" },
  { id: "ai",    label: "Inteligencia Artificial",        short: "IA" },
  { id: "datos", label: "Datos y Analítica",              short: "D&A" },
  { id: "arq",   label: "CIS – Arquitectura",             short: "Arq" },
  { id: "ops",   label: "CIS – Operaciones TI",           short: "Ops TI" },
  { id: "infra", label: "CIS – Infraestructura",          short: "Infra" },
  { id: "mesa",  label: "CIS – Mesa de Ayuda",            short: "Mesa" },
  { id: "rpa",   label: "Automatización (RPA)",           short: "RPA" },
  { id: "sec",   label: "Ciberseguridad",                 short: "CiberSec" },
  { id: "proc",  label: "Procesos Empresariales",         short: "Procesos" },
  { id: "sol",   label: "Soluciones TI (RTEs/Scrum/PO)", short: "Soluc TI" },
];

// cat = componente PP (mismo eje que la matriz detallada)
// comp = descripción del alcance / módulo involucrado
const RACI_DATA = {

  // ── POWER PLATFORM ADMIN & COE ─────────────────────────────────────────────
  "Definición de modelo de gobierno y políticas globales": {
    cat: "Power Platform Admin & CoE", comp: "Gobierno General",
    dev:"C", ai:"C", datos:"C", arq:"R", ops:"A", infra:"C", mesa:"I", rpa:"C", sec:"C", proc:"C", sol:"C"
  },
  "Definición de estándares de desarrollo (low-code / pro-code)": {
    cat: "Power Platform Admin & CoE", comp: "Gobierno General",
    dev:"R", ai:"C", datos:"C", arq:"A", ops:"I", infra:"I", mesa:"I", rpa:"C", sec:"C", proc:"C", sol:"R"
  },
  "Estrategia de ciudadanos desarrolladores (Citizen Dev)": {
    cat: "Power Platform Admin & CoE", comp: "Gobierno General",
    dev:"C", ai:"C", datos:"C", arq:"A", ops:"C", infra:"I", mesa:"I", rpa:"C", sec:"C", proc:"R", sol:"R"
  },
  "Roadmap de adopción de Power Platform": {
    cat: "Power Platform Admin & CoE", comp: "Gobierno General",
    dev:"C", ai:"C", datos:"C", arq:"R", ops:"C", infra:"C", mesa:"I", rpa:"C", sec:"C", proc:"C", sol:"A"
  },
  "Diseño de arquitectura de referencia (ambientes, entornos)": {
    cat: "Power Platform Admin & CoE", comp: "Admin Center / Entornos",
    dev:"C", ai:"C", datos:"C", arq:"R", ops:"A", infra:"C", mesa:"I", rpa:"C", sec:"C", proc:"I", sol:"C"
  },
  "Definición de políticas de DLP (Data Loss Prevention)": {
    cat: "Power Platform Admin & CoE", comp: "Admin Center / DLP",
    dev:"I", ai:"I", datos:"C", arq:"C", ops:"A", infra:"C", mesa:"I", rpa:"I", sec:"R", proc:"I", sol:"I"
  },
  "Gestión de identidades y accesos (AAD / Entra ID)": {
    cat: "Power Platform Admin & CoE", comp: "Admin Center / Seguridad",
    dev:"I", ai:"I", datos:"I", arq:"C", ops:"R", infra:"A", mesa:"I", rpa:"I", sec:"R", proc:"I", sol:"I"
  },
  "Auditoría y monitoreo de seguridad (SIEM, CoE Toolkit)": {
    cat: "Power Platform Admin & CoE", comp: "CoE / Monitoreo",
    dev:"I", ai:"I", datos:"C", arq:"I", ops:"R", infra:"C", mesa:"I", rpa:"I", sec:"A", proc:"I", sol:"I"
  },
  "Evaluación de riesgos regulatorios (SFC, UIAF, Habeas Data)": {
    cat: "Power Platform Admin & CoE", comp: "Gobierno General",
    dev:"I", ai:"I", datos:"C", arq:"C", ops:"I", infra:"I", mesa:"I", rpa:"I", sec:"A", proc:"R", sol:"I"
  },
  "Aprovisionamiento de entornos (Dev / Test / Prod)": {
    cat: "Power Platform Admin & CoE", comp: "Admin Center / Entornos",
    dev:"I", ai:"I", datos:"I", arq:"C", ops:"A", infra:"R", mesa:"I", rpa:"I", sec:"C", proc:"I", sol:"I"
  },
  "Gestión de conectores certificados y personalizados": {
    cat: "Power Platform Admin & CoE", comp: "Admin Center / Conectores",
    dev:"R", ai:"C", datos:"C", arq:"C", ops:"A", infra:"C", mesa:"I", rpa:"C", sec:"R", proc:"I", sol:"C"
  },
  "Monitoreo de capacidad, licenciamiento y costos": {
    cat: "Power Platform Admin & CoE", comp: "Admin Center / Licenciamiento",
    dev:"I", ai:"I", datos:"C", arq:"C", ops:"R", infra:"A", mesa:"I", rpa:"I", sec:"I", proc:"I", sol:"C"
  },
  "Soporte nivel 1 a usuarios finales y ciudadanos dev": {
    cat: "Power Platform Admin & CoE", comp: "Soporte",
    dev:"I", ai:"I", datos:"I", arq:"I", ops:"C", infra:"I", mesa:"R", rpa:"I", sec:"I", proc:"C", sol:"A"
  },
  "Programa de formación y certificación (ciudadanos dev)": {
    cat: "Power Platform Admin & CoE", comp: "Habilitación",
    dev:"C", ai:"C", datos:"C", arq:"A", ops:"I", infra:"I", mesa:"I", rpa:"C", sec:"I", proc:"R", sol:"C"
  },
  "Gestión de comunidad interna (foros, CoE, champions)": {
    cat: "Power Platform Admin & CoE", comp: "Habilitación",
    dev:"C", ai:"C", datos:"C", arq:"R", ops:"I", infra:"I", mesa:"C", rpa:"C", sec:"I", proc:"C", sol:"A"
  },
  "Acompañamiento a equipos Scrum en adopción de la plataforma": {
    cat: "Power Platform Admin & CoE", comp: "Habilitación",
    dev:"C", ai:"I", datos:"I", arq:"C", ops:"I", infra:"I", mesa:"I", rpa:"C", sec:"I", proc:"C", sol:"A"
  },
  "Definir criterios para uso de Power Platform vs desarrollo tradicional": {
    cat: "Power Platform Admin & CoE", comp: "Gobierno General",
    dev:"C", ai:"C", datos:"C", arq:"R", ops:"A", infra:"I", mesa:"I", rpa:"C", sec:"C", proc:"C", sol:"C"
  },
  "Gestión del cambio y plan de comunicación para adopción": {
    cat: "Power Platform Admin & CoE", comp: "Habilitación",
    dev:"I", ai:"I", datos:"I", arq:"C", ops:"I", infra:"I", mesa:"C", rpa:"I", sec:"I", proc:"R", sol:"A"
  },

  // ── POWER APPS ─────────────────────────────────────────────────────────────
  "Desarrollo de aplicaciones canvas y model-driven (Power Apps)": {
    cat: "Power Apps", comp: "Canvas Apps / Model-Driven",
    dev:"A", ai:"C", datos:"C", arq:"C", ops:"I", infra:"I", mesa:"I", rpa:"C", sec:"C", proc:"C", sol:"R"
  },

  // ── POWER AUTOMATE ─────────────────────────────────────────────────────────
  "Modelo de integración con sistemas core (CBS, CRM, ESB)": {
    cat: "Power Automate", comp: "Cloud Flows / Conectores",
    dev:"R", ai:"C", datos:"C", arq:"A", ops:"C", infra:"C", mesa:"I", rpa:"C", sec:"C", proc:"C", sol:"R"
  },
  "Diseño de flujos y automatizaciones (conectores, triggers)": {
    cat: "Power Automate", comp: "Cloud Flows",
    dev:"R", ai:"C", datos:"C", arq:"C", ops:"I", infra:"I", mesa:"I", rpa:"A", sec:"C", proc:"C", sol:"R"
  },
  "Desarrollo de flujos de automatización empresarial": {
    cat: "Power Automate", comp: "Cloud Flows / Business Process",
    dev:"C", ai:"C", datos:"C", arq:"C", ops:"I", infra:"I", mesa:"I", rpa:"A", sec:"C", proc:"C", sol:"R"
  },

  // ── POWER BI ───────────────────────────────────────────────────────────────
  "Desarrollo de reportes y dashboards analíticos": {
    cat: "Power BI", comp: "Reports / Dashboards",
    dev:"I", ai:"C", datos:"A", arq:"C", ops:"I", infra:"I", mesa:"I", rpa:"I", sec:"C", proc:"C", sol:"R"
  },
  "Integración con Power BI y capa analítica": {
    cat: "Power BI", comp: "Semantic Model / Conectores",
    dev:"C", ai:"C", datos:"A", arq:"C", ops:"I", infra:"I", mesa:"I", rpa:"I", sec:"C", proc:"I", sol:"R"
  },

  // ── POWER PAGES ────────────────────────────────────────────────────────────
  "Desarrollo de portales y experiencias externas": {
    cat: "Power Pages", comp: "Portales / Desarrollo",
    dev:"R", ai:"C", datos:"C", arq:"C", ops:"I", infra:"I", mesa:"I", rpa:"I", sec:"C", proc:"C", sol:"A"
  },

  // ── DATAVERSE ──────────────────────────────────────────────────────────────
  "Diseño del modelo de datos en Dataverse": {
    cat: "Dataverse", comp: "Modelo de datos",
    dev:"R", ai:"C", datos:"A", arq:"C", ops:"I", infra:"I", mesa:"I", rpa:"I", sec:"C", proc:"C", sol:"R"
  },
  "Gestión y gobierno del modelo de datos (Dataverse / Lake)": {
    cat: "Dataverse", comp: "Gobierno de datos",
    dev:"C", ai:"C", datos:"A", arq:"C", ops:"I", infra:"I", mesa:"I", rpa:"I", sec:"C", proc:"I", sol:"R"
  },

  // ── COPILOT STUDIO ─────────────────────────────────────────────────────────
  "Desarrollo de agentes y bots conversacionales": {
    cat: "Copilot Studio", comp: "Agentes / Bots",
    dev:"C", ai:"A", datos:"C", arq:"C", ops:"I", infra:"I", mesa:"C", rpa:"C", sec:"C", proc:"C", sol:"R"
  },

  // ── IA BUILDER & COPILOT ───────────────────────────────────────────────────
  "Integración con IA generativa (Copilot Studio / AI Builder)": {
    cat: "IA Builder & Copilot", comp: "AI Builder / Azure OpenAI",
    dev:"C", ai:"A", datos:"C", arq:"C", ops:"I", infra:"I", mesa:"I", rpa:"C", sec:"C", proc:"I", sol:"R"
  },

  // ── ALM & DEVSECOPS ────────────────────────────────────────────────────────
  "Revisión de código, ALM y pruebas (DevSecOps / SAFe)": {
    cat: "ALM & DevSecOps", comp: "Pipelines / Source Control",
    dev:"R", ai:"I", datos:"I", arq:"C", ops:"C", infra:"I", mesa:"I", rpa:"C", sec:"C", proc:"I", sol:"A"
  },
};

const CATEGORIES = [...new Set(Object.values(RACI_DATA).map(v => v.cat))];

const RACI_COLORS = {
  R: { bg: "#EAF3DE", text: "#3B6D11", border: "#639922" },
  A: { bg: "#FAEEDA", text: "#854F0B", border: "#BA7517" },
  C: { bg: "#E6F1FB", text: "#185FA5", border: "#378ADD" },
  I: { bg: "#F1EFE8", text: "#5F5E5A", border: "#B4B2A9" },
  "": { bg: "transparent", text: "#B4B2A9", border: "transparent" },
};

const LEGEND = [
  { code: "R", label: "Responsible – Ejecuta" },
  { code: "A", label: "Accountable – Rinde cuentas" },
  { code: "C", label: "Consulted – Aporta criterio" },
  { code: "I", label: "Informed – Debe ser notificado" },
];

export default function RACIMatrixGeneral() {
  const [filterCat, setFilterCat] = useState("Todas");
  const [highlight, setHighlight] = useState(null);

  const allCats = ["Todas", ...CATEGORIES];

  const filteredActivities = Object.entries(RACI_DATA).filter(([, v]) =>
    filterCat === "Todas" || v.cat === filterCat
  );

  const exportToExcel = () => {
    const headers = ["Componente PP", "Alcance / Módulo", "Actividad", ...AREAS.map(a => a.label)];
    const rows = filteredActivities.map(([act, v]) => [
      v.cat, v.comp, act, ...AREAS.map(a => v[a.id] || "")
    ]);
    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    ws["!cols"] = [{ wch: 28 }, { wch: 30 }, { wch: 55 }, ...AREAS.map(() => ({ wch: 22 }))];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Matriz RACI General");
    const catLabel = filterCat === "Todas" ? "Completa" : filterCat.replace(/[\s/&]+/g, "_");
    XLSX.writeFile(wb, `MatrizRACI_General_${catLabel}.xlsx`);
  };

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

      {/* Filters */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: "1rem", alignItems: "center" }}>
        <select value={filterCat} onChange={e => setFilterCat(e.target.value)}
          style={{ fontSize: 12, padding: "4px 8px", borderRadius: 6, border: "0.5px solid var(--color-border-secondary)", background: "var(--color-background-secondary)", color: "var(--color-text-primary)" }}>
          {allCats.map(c => <option key={c}>{c}</option>)}
        </select>
        <div style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>
          {filteredActivities.length} actividades · Hover sobre área para destacar
        </div>
        <button onClick={exportToExcel} style={{
          marginLeft: "auto", fontSize: 12, padding: "4px 12px",
          borderRadius: 6, border: "0.5px solid var(--color-border-secondary)",
          background: "var(--color-background-secondary)", color: "var(--color-text-primary)",
          cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
        }}>
          ↓ Exportar Excel
        </button>
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 8 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, tableLayout: "fixed" }}>
          <colgroup>
            <col style={{ width: 90 }} />
            <col style={{ width: 110 }} />
            <col style={{ width: 210 }} />
            {AREAS.map(a => <col key={a.id} style={{ width: 52 }} />)}
          </colgroup>
          <thead>
            <tr style={{ background: "var(--color-background-secondary)", borderBottom: "0.5px solid var(--color-border-secondary)" }}>
              <th style={{ padding: "8px 6px", textAlign: "left", fontWeight: 500, color: "var(--color-text-secondary)", fontSize: 10 }}>Componente PP</th>
              <th style={{ padding: "8px 6px", textAlign: "left", fontWeight: 500, color: "var(--color-text-secondary)", fontSize: 10 }}>Alcance / Módulo</th>
              <th style={{ padding: "8px 6px", textAlign: "left", fontWeight: 500, color: "var(--color-text-secondary)", fontSize: 10 }}>Actividad</th>
              {AREAS.map(a => (
                <th key={a.id}
                  onMouseEnter={() => setHighlight(a.id)}
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
              const rows = filteredActivities.filter(([, v]) => v.cat === cat);
              if (!rows.length) return null;
              return rows.map(([act, v], i) => (
                <tr key={act} style={{
                  borderBottom: "0.5px solid var(--color-border-tertiary)",
                  background: i % 2 === 0 ? "transparent" : "var(--color-background-secondary)",
                }}>
                  {i === 0 ? (
                    <td rowSpan={rows.length} style={{
                      padding: "6px 6px", fontWeight: 500, fontSize: 10,
                      color: "var(--color-text-secondary)", verticalAlign: "top",
                      borderRight: "0.5px solid var(--color-border-secondary)",
                      background: "var(--color-background-secondary)", lineHeight: 1.3,
                    }}>
                      {cat}
                    </td>
                  ) : null}
                  <td style={{ padding: "6px 6px", fontSize: 10, color: "var(--color-text-secondary)", lineHeight: 1.2 }}>{v.comp}</td>
                  <td style={{ padding: "6px 6px", lineHeight: 1.3, fontSize: 11 }}>{act}</td>
                  {AREAS.map(a => {
                    const code = v[a.id] || "";
                    const c = RACI_COLORS[code] || RACI_COLORS[""];
                    return (
                      <td key={a.id} style={{
                        textAlign: "center", padding: "4px 2px",
                        borderLeft: "0.5px solid var(--color-border-tertiary)",
                        background: highlight === a.id
                          ? (code ? c.bg : "var(--color-background-info)")
                          : (code ? c.bg : "transparent"),
                        transition: "background 0.15s",
                      }}>
                        {code && (
                          <span style={{ display: "inline-block", fontWeight: 500, fontSize: 11, color: c.text }}>
                            {code}
                          </span>
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
        CIS = Centro de Innovación de Software · Roles alineados con el marco de adopción oficial de Microsoft Power Platform
        (<em>learn.microsoft.com/power-platform/guidance/adoption/roles</em>): Arquitectura ≈ Enterprise Architect / Product Owner · Dev SW ≈ Professional Makers / DevOps · Procesos ≈ Citizen Makers / Change Mgmt · IA ≈ AI Strategist / Ethics Lead · Seguridad ≈ Information Security &amp; Compliance · Ops TI ≈ PP Administrators · Infra ≈ Azure &amp; M365 Admins · Mesa ≈ IT Operations Support.
        Matriz General v1.0 — sujeta a validación en comité.
      </p>
    </>
  );
}

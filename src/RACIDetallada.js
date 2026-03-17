import { useState } from "react";
import * as XLSX from "xlsx";

// ─── Shared constants (same areas & colors as general) ───────────────────────

const AREAS = [
  { id: "dev",   label: "Desarrollo de Software",          short: "Dev SW" },
  { id: "ai",    label: "Inteligencia Artificial",         short: "IA" },
  { id: "datos", label: "Datos y Analítica",               short: "D&A" },
  { id: "arq",   label: "CIS – Arquitectura",              short: "Arq" },
  { id: "ops",   label: "CIS – Operaciones TI",            short: "Ops TI" },
  { id: "infra", label: "CIS – Infraestructura",           short: "Infra" },
  { id: "mesa",  label: "CIS – Mesa de Ayuda",             short: "Mesa" },
  { id: "rpa",   label: "Automatización (RPA)",            short: "RPA" },
  { id: "sec",   label: "Ciberseguridad",                  short: "CiberSec" },
  { id: "proc",  label: "Procesos Empresariales",          short: "Procesos" },
  { id: "sol",   label: "Soluciones TI (RTEs/Scrum/PO)",  short: "Soluc TI" },
];

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

// ─── Detailed RACI data ────────────────────────────────────────────────────────
// cat = componente Power Platform | comp = sub-área / módulo

const RACI_DATA_DETALLADA = {

  // ── POWER PLATFORM ADMIN & COE ─────────────────────────────────────────────
  "Mantener actualizado el CoE Toolkit": {
    cat: "Power Platform Admin & CoE", comp: "CoE / Admin Center",
    dev:"C", ai:"I", datos:"C", arq:"R", ops:"A", infra:"C", mesa:"I", rpa:"C", sec:"C", proc:"I", sol:"C"
  },
  "Aprobar licencias premium (per user / per app)": {
    cat: "Power Platform Admin & CoE", comp: "Admin Center / Licenciamiento",
    dev:"C", ai:"C", datos:"C", arq:"R", ops:"A", infra:"C", mesa:"I", rpa:"C", sec:"I", proc:"C", sol:"C"
  },
  "Definir qué se implementa en Power Platform y qué no": {
    cat: "Power Platform Admin & CoE", comp: "Gobierno General",
    dev:"C", ai:"C", datos:"C", arq:"R", ops:"A", infra:"I", mesa:"I", rpa:"C", sec:"C", proc:"C", sol:"C"
  },
  "Gestionar ambientes (Dev / Test / Prod)": {
    cat: "Power Platform Admin & CoE", comp: "Admin Center / Entornos",
    dev:"I", ai:"I", datos:"I", arq:"C", ops:"A", infra:"R", mesa:"I", rpa:"I", sec:"C", proc:"I", sol:"I"
  },
  "Definir políticas DLP (Data Loss Prevention)": {
    cat: "Power Platform Admin & CoE", comp: "Admin Center / DLP",
    dev:"I", ai:"I", datos:"C", arq:"C", ops:"A", infra:"C", mesa:"I", rpa:"I", sec:"R", proc:"I", sol:"I"
  },
  "Implementar y monitorear políticas DLP": {
    cat: "Power Platform Admin & CoE", comp: "Admin Center / DLP",
    dev:"I", ai:"I", datos:"I", arq:"C", ops:"R", infra:"C", mesa:"I", rpa:"I", sec:"A", proc:"I", sol:"I"
  },
  "Aprobar conectores premium y conectores externos": {
    cat: "Power Platform Admin & CoE", comp: "Admin Center / Conectores",
    dev:"C", ai:"I", datos:"C", arq:"R", ops:"A", infra:"C", mesa:"I", rpa:"C", sec:"C", proc:"I", sol:"C"
  },
  "Gestionar grupos de seguridad de entornos (AAD / Entra)": {
    cat: "Power Platform Admin & CoE", comp: "Admin Center / Seguridad",
    dev:"I", ai:"I", datos:"I", arq:"C", ops:"R", infra:"A", mesa:"I", rpa:"I", sec:"C", proc:"I", sol:"I"
  },
  "Auditar actividad y uso de plataforma (CoE Kit / SIEM)": {
    cat: "Power Platform Admin & CoE", comp: "CoE / Monitoreo",
    dev:"I", ai:"I", datos:"C", arq:"C", ops:"R", infra:"C", mesa:"I", rpa:"I", sec:"A", proc:"I", sol:"I"
  },
  "Gestionar solicitudes de nuevos entornos": {
    cat: "Power Platform Admin & CoE", comp: "Admin Center / Entornos",
    dev:"I", ai:"I", datos:"I", arq:"C", ops:"A", infra:"R", mesa:"C", rpa:"I", sec:"C", proc:"I", sol:"C"
  },
  "Configurar alertas y monitoreo proactivo de plataforma": {
    cat: "Power Platform Admin & CoE", comp: "CoE / Monitoreo",
    dev:"I", ai:"I", datos:"I", arq:"C", ops:"R", infra:"A", mesa:"I", rpa:"I", sec:"C", proc:"I", sol:"I"
  },
  "Gestionar política de uso de Copilot a nivel tenant": {
    cat: "Power Platform Admin & CoE", comp: "Admin Center / Copilot",
    dev:"I", ai:"C", datos:"I", arq:"R", ops:"A", infra:"I", mesa:"I", rpa:"I", sec:"C", proc:"I", sol:"I"
  },
  "Definir criterios para uso de Power Platform vs desarrollo tradicional": {
    cat: "Power Platform Admin & CoE", comp: "Gobierno General",
    dev:"C", ai:"C", datos:"C", arq:"R", ops:"A", infra:"I", mesa:"I", rpa:"C", sec:"C", proc:"C", sol:"C"
  },
  "Gestión del cambio y plan de comunicación para adopción": {
    cat: "Power Platform Admin & CoE", comp: "Habilitación",
    dev:"I", ai:"I", datos:"I", arq:"C", ops:"I", infra:"I", mesa:"C", rpa:"I", sec:"I", proc:"R", sol:"A"
  },
  "Proceso de onboarding de nuevos makers y equipos a la plataforma": {
    cat: "Power Platform Admin & CoE", comp: "Habilitación",
    dev:"C", ai:"I", datos:"I", arq:"C", ops:"I", infra:"I", mesa:"C", rpa:"I", sec:"I", proc:"R", sol:"A"
  },
  "Configurar servicios Azure de soporte (App Insights, Storage, Key Vault)": {
    cat: "Power Platform Admin & CoE", comp: "Azure Services",
    dev:"I", ai:"I", datos:"I", arq:"C", ops:"A", infra:"R", mesa:"I", rpa:"I", sec:"C", proc:"I", sol:"I"
  },
  "Gestionar asignación de licencias y usuarios en Microsoft 365": {
    cat: "Power Platform Admin & CoE", comp: "M365 Admin",
    dev:"I", ai:"I", datos:"I", arq:"C", ops:"R", infra:"A", mesa:"I", rpa:"I", sec:"I", proc:"I", sol:"I"
  },

  // ── POWER APPS ─────────────────────────────────────────────────────────────
  "Definir estándares UI/UX para apps canvas": {
    cat: "Power Apps", comp: "Canvas Apps",
    dev:"A", ai:"I", datos:"I", arq:"R", ops:"I", infra:"I", mesa:"I", rpa:"I", sec:"I", proc:"C", sol:"C"
  },
  "Definir estándares UI/UX para apps model-driven": {
    cat: "Power Apps", comp: "Model-Driven Apps",
    dev:"A", ai:"I", datos:"C", arq:"R", ops:"I", infra:"I", mesa:"I", rpa:"I", sec:"I", proc:"C", sol:"C"
  },
  "Desarrollar apps canvas (citizen developers)": {
    cat: "Power Apps", comp: "Canvas Apps",
    dev:"C", ai:"I", datos:"I", arq:"C", ops:"I", infra:"I", mesa:"I", rpa:"I", sec:"C", proc:"R", sol:"A"
  },
  "Desarrollar apps canvas (desarrolladores profesionales)": {
    cat: "Power Apps", comp: "Canvas Apps",
    dev:"R", ai:"I", datos:"C", arq:"C", ops:"I", infra:"I", mesa:"I", rpa:"I", sec:"C", proc:"C", sol:"A"
  },
  "Desarrollar apps model-driven": {
    cat: "Power Apps", comp: "Model-Driven Apps",
    dev:"R", ai:"I", datos:"C", arq:"C", ops:"I", infra:"I", mesa:"I", rpa:"I", sec:"C", proc:"C", sol:"A"
  },
  "Revisar código y componentes de apps (Pull Request / ALM)": {
    cat: "Power Apps", comp: "Canvas Apps / Model-Driven",
    dev:"R", ai:"I", datos:"I", arq:"A", ops:"C", infra:"I", mesa:"I", rpa:"I", sec:"C", proc:"I", sol:"C"
  },
  "Gestionar ciclo de vida de apps (pipelines ALM)": {
    cat: "Power Apps", comp: "ALM / Pipelines",
    dev:"R", ai:"I", datos:"I", arq:"C", ops:"A", infra:"C", mesa:"I", rpa:"I", sec:"I", proc:"I", sol:"C"
  },
  "Aprobar publicación de apps a producción": {
    cat: "Power Apps", comp: "ALM / Pipelines",
    dev:"C", ai:"I", datos:"I", arq:"C", ops:"A", infra:"I", mesa:"I", rpa:"I", sec:"C", proc:"C", sol:"R"
  },
  "Soporte L1 / L2 a usuarios de apps": {
    cat: "Power Apps", comp: "Soporte",
    dev:"C", ai:"I", datos:"I", arq:"I", ops:"C", infra:"I", mesa:"R", rpa:"I", sec:"I", proc:"C", sol:"A"
  },
  "Capacitar ciudadanos dev en Power Apps": {
    cat: "Power Apps", comp: "Habilitación",
    dev:"C", ai:"I", datos:"I", arq:"C", ops:"I", infra:"I", mesa:"C", rpa:"I", sec:"I", proc:"R", sol:"A"
  },
  "Integrar apps con sistemas core (CBS, CRM, ESB)": {
    cat: "Power Apps", comp: "Canvas Apps / Model-Driven",
    dev:"R", ai:"I", datos:"C", arq:"A", ops:"C", infra:"C", mesa:"I", rpa:"I", sec:"C", proc:"C", sol:"C"
  },

  // ── POWER AUTOMATE ─────────────────────────────────────────────────────────
  "Definir estándares para flujos cloud vs flujos desktop (RPA)": {
    cat: "Power Automate", comp: "Cloud Flows / Desktop Flows",
    dev:"A", ai:"I", datos:"I", arq:"R", ops:"C", infra:"I", mesa:"I", rpa:"C", sec:"I", proc:"C", sol:"C"
  },
  "Aprobar flujos con conectores premium o externos": {
    cat: "Power Automate", comp: "Cloud Flows / Conectores",
    dev:"C", ai:"I", datos:"C", arq:"R", ops:"A", infra:"I", mesa:"I", rpa:"C", sec:"C", proc:"I", sol:"C"
  },
  "Desarrollar flujos de automatización de negocio (citizen dev)": {
    cat: "Power Automate", comp: "Cloud Flows",
    dev:"C", ai:"I", datos:"I", arq:"C", ops:"I", infra:"I", mesa:"I", rpa:"C", sec:"C", proc:"R", sol:"A"
  },
  "Desarrollar flujos de automatización empresarial complejos": {
    cat: "Power Automate", comp: "Cloud Flows / Business Process Flows",
    dev:"R", ai:"C", datos:"C", arq:"C", ops:"I", infra:"I", mesa:"I", rpa:"A", sec:"C", proc:"C", sol:"R"
  },
  "Desarrollar flujos de automatización robótica (Desktop / RPA)": {
    cat: "Power Automate", comp: "Desktop Flows / RPA",
    dev:"C", ai:"I", datos:"I", arq:"C", ops:"I", infra:"I", mesa:"I", rpa:"R", sec:"C", proc:"A", sol:"C"
  },
  "Gestionar ciclo de vida de flujos (ALM / Soluciones)": {
    cat: "Power Automate", comp: "ALM / Soluciones",
    dev:"R", ai:"I", datos:"I", arq:"C", ops:"A", infra:"C", mesa:"I", rpa:"C", sec:"I", proc:"I", sol:"C"
  },
  "Monitorear ejecución y errores de flujos en producción": {
    cat: "Power Automate", comp: "CoE / Monitoreo",
    dev:"C", ai:"I", datos:"I", arq:"I", ops:"R", infra:"C", mesa:"C", rpa:"A", sec:"I", proc:"I", sol:"C"
  },
  "Gestionar credenciales y conexiones compartidas de flujos": {
    cat: "Power Automate", comp: "Cloud Flows / Seguridad",
    dev:"C", ai:"I", datos:"I", arq:"C", ops:"R", infra:"C", mesa:"I", rpa:"C", sec:"A", proc:"I", sol:"I"
  },
  "Integrar flujos con sistemas externos (SAP, CBS, APIs REST)": {
    cat: "Power Automate", comp: "Cloud Flows / Conectores",
    dev:"R", ai:"I", datos:"C", arq:"A", ops:"C", infra:"C", mesa:"I", rpa:"C", sec:"C", proc:"C", sol:"R"
  },

  // ── POWER BI ───────────────────────────────────────────────────────────────
  "Definir modelo de datos y métricas corporativas (KPIs)": {
    cat: "Power BI", comp: "Semantic Model / KPIs",
    dev:"I", ai:"C", datos:"R", arq:"A", ops:"I", infra:"I", mesa:"I", rpa:"I", sec:"I", proc:"C", sol:"C"
  },
  "Desarrollar modelos semánticos (datasets / semantic models)": {
    cat: "Power BI", comp: "Semantic Model",
    dev:"C", ai:"C", datos:"R", arq:"C", ops:"I", infra:"I", mesa:"I", rpa:"I", sec:"I", proc:"C", sol:"A"
  },
  "Desarrollar reportes y dashboards de negocio": {
    cat: "Power BI", comp: "Reports / Dashboards",
    dev:"I", ai:"C", datos:"R", arq:"C", ops:"I", infra:"I", mesa:"I", rpa:"I", sec:"I", proc:"C", sol:"A"
  },
  "Aprobar publicación de reportes al workspace corporativo": {
    cat: "Power BI", comp: "Power BI Service / Workspaces",
    dev:"I", ai:"I", datos:"A", arq:"C", ops:"R", infra:"I", mesa:"I", rpa:"I", sec:"I", proc:"C", sol:"C"
  },
  "Gestionar workspaces y permisos en Power BI Service": {
    cat: "Power BI", comp: "Power BI Service / Workspaces",
    dev:"I", ai:"I", datos:"A", arq:"C", ops:"R", infra:"C", mesa:"I", rpa:"I", sec:"C", proc:"I", sol:"I"
  },
  "Integrar Power BI con Dataverse / Azure Data Lake": {
    cat: "Power BI", comp: "Semantic Model / Conectores",
    dev:"C", ai:"C", datos:"R", arq:"A", ops:"I", infra:"C", mesa:"I", rpa:"I", sec:"C", proc:"I", sol:"C"
  },
  "Configurar Row Level Security (RLS) en modelos": {
    cat: "Power BI", comp: "Semantic Model / Seguridad",
    dev:"I", ai:"I", datos:"R", arq:"C", ops:"C", infra:"I", mesa:"I", rpa:"I", sec:"A", proc:"I", sol:"I"
  },
  "Monitorear capacidad Power BI Premium / Fabric": {
    cat: "Power BI", comp: "Power BI Service / Capacidad",
    dev:"I", ai:"I", datos:"C", arq:"C", ops:"R", infra:"A", mesa:"I", rpa:"I", sec:"I", proc:"I", sol:"I"
  },
  "Capacitar a usuarios en consumo de reportes Power BI": {
    cat: "Power BI", comp: "Habilitación",
    dev:"I", ai:"I", datos:"R", arq:"I", ops:"I", infra:"I", mesa:"C", rpa:"I", sec:"I", proc:"A", sol:"C"
  },

  // ── POWER PAGES ────────────────────────────────────────────────────────────
  "Definir arquitectura de portales externos": {
    cat: "Power Pages", comp: "Portales / Arquitectura",
    dev:"A", ai:"I", datos:"C", arq:"R", ops:"C", infra:"C", mesa:"I", rpa:"I", sec:"C", proc:"C", sol:"C"
  },
  "Desarrollar portales y experiencias web externas": {
    cat: "Power Pages", comp: "Portales / Desarrollo",
    dev:"R", ai:"I", datos:"C", arq:"C", ops:"I", infra:"I", mesa:"I", rpa:"I", sec:"C", proc:"C", sol:"A"
  },
  "Aprobar publicación de portales a producción": {
    cat: "Power Pages", comp: "ALM / Despliegue",
    dev:"C", ai:"I", datos:"I", arq:"C", ops:"A", infra:"I", mesa:"I", rpa:"I", sec:"C", proc:"C", sol:"R"
  },
  "Gestionar autenticación de usuarios externos (B2C / Entra ID)": {
    cat: "Power Pages", comp: "Portales / Seguridad",
    dev:"C", ai:"I", datos:"I", arq:"C", ops:"R", infra:"A", mesa:"I", rpa:"I", sec:"R", proc:"I", sol:"I"
  },
  "Definir políticas de seguridad web (OWASP, WAF, CSP)": {
    cat: "Power Pages", comp: "Portales / Seguridad",
    dev:"C", ai:"I", datos:"I", arq:"A", ops:"C", infra:"C", mesa:"I", rpa:"I", sec:"R", proc:"I", sol:"I"
  },
  "Monitorear disponibilidad y rendimiento del portal": {
    cat: "Power Pages", comp: "Portales / Operaciones",
    dev:"C", ai:"I", datos:"I", arq:"C", ops:"R", infra:"A", mesa:"C", rpa:"I", sec:"C", proc:"I", sol:"I"
  },

  // ── DATAVERSE ──────────────────────────────────────────────────────────────
  "Diseñar modelo de datos corporativo en Dataverse": {
    cat: "Dataverse", comp: "Modelo de datos",
    dev:"C", ai:"C", datos:"R", arq:"A", ops:"I", infra:"I", mesa:"I", rpa:"I", sec:"C", proc:"C", sol:"C"
  },
  "Aprobar cambios al esquema de datos en producción": {
    cat: "Dataverse", comp: "Modelo de datos / ALM",
    dev:"C", ai:"I", datos:"A", arq:"R", ops:"C", infra:"I", mesa:"I", rpa:"I", sec:"C", proc:"C", sol:"C"
  },
  "Gestionar tablas, columnas y relaciones en Dataverse": {
    cat: "Dataverse", comp: "Modelo de datos",
    dev:"R", ai:"I", datos:"A", arq:"C", ops:"I", infra:"I", mesa:"I", rpa:"I", sec:"I", proc:"C", sol:"C"
  },
  "Configurar roles de seguridad y permisos en Dataverse": {
    cat: "Dataverse", comp: "Seguridad",
    dev:"C", ai:"I", datos:"C", arq:"C", ops:"R", infra:"I", mesa:"I", rpa:"I", sec:"A", proc:"I", sol:"I"
  },
  "Gestionar retención y ciclo de vida de datos": {
    cat: "Dataverse", comp: "Gobierno de datos",
    dev:"I", ai:"I", datos:"R", arq:"C", ops:"C", infra:"C", mesa:"I", rpa:"I", sec:"A", proc:"C", sol:"I"
  },
  "Integrar Dataverse con sistemas core (CBS, CRM, ESB)": {
    cat: "Dataverse", comp: "Integración",
    dev:"R", ai:"I", datos:"C", arq:"A", ops:"C", infra:"C", mesa:"I", rpa:"I", sec:"C", proc:"I", sol:"R"
  },
  "Monitorear rendimiento y almacenamiento de Dataverse": {
    cat: "Dataverse", comp: "Operaciones",
    dev:"I", ai:"I", datos:"C", arq:"C", ops:"R", infra:"A", mesa:"I", rpa:"I", sec:"I", proc:"I", sol:"I"
  },
  "Gestionar soluciones y publishers en Dataverse (ALM)": {
    cat: "Dataverse", comp: "ALM / Soluciones",
    dev:"R", ai:"I", datos:"C", arq:"C", ops:"A", infra:"C", mesa:"I", rpa:"I", sec:"I", proc:"I", sol:"C"
  },

  // ── COPILOT STUDIO ─────────────────────────────────────────────────────────
  "Definir estrategia de agentes y bots conversacionales": {
    cat: "Copilot Studio", comp: "Estrategia / Gobierno",
    dev:"C", ai:"R", datos:"C", arq:"A", ops:"I", infra:"I", mesa:"C", rpa:"I", sec:"C", proc:"C", sol:"C"
  },
  "Autorizar uso de Copilot Studio (licencias y acceso)": {
    cat: "Copilot Studio", comp: "Gobierno / Licenciamiento",
    dev:"I", ai:"C", datos:"I", arq:"R", ops:"A", infra:"I", mesa:"I", rpa:"I", sec:"C", proc:"I", sol:"C"
  },
  "Diseñar flujos conversacionales y tópicos": {
    cat: "Copilot Studio", comp: "Diseño de agentes",
    dev:"C", ai:"R", datos:"I", arq:"C", ops:"I", infra:"I", mesa:"C", rpa:"I", sec:"I", proc:"C", sol:"A"
  },
  "Desarrollar agentes y bots con Copilot Studio": {
    cat: "Copilot Studio", comp: "Desarrollo de agentes",
    dev:"C", ai:"R", datos:"C", arq:"C", ops:"I", infra:"I", mesa:"C", rpa:"C", sec:"C", proc:"C", sol:"A"
  },
  "Integrar bots con canales (Teams, web, WhatsApp)": {
    cat: "Copilot Studio", comp: "Canales / Integración",
    dev:"R", ai:"A", datos:"I", arq:"C", ops:"C", infra:"C", mesa:"C", rpa:"I", sec:"C", proc:"I", sol:"C"
  },
  "Integrar agentes con sistemas de backend (APIs, Dataverse)": {
    cat: "Copilot Studio", comp: "Integración backend",
    dev:"R", ai:"A", datos:"C", arq:"C", ops:"I", infra:"I", mesa:"I", rpa:"I", sec:"C", proc:"I", sol:"C"
  },
  "Conectar agentes con modelos IA generativa (Azure OpenAI)": {
    cat: "Copilot Studio", comp: "IA Generativa / Azure OpenAI",
    dev:"C", ai:"R", datos:"C", arq:"A", ops:"I", infra:"C", mesa:"I", rpa:"I", sec:"C", proc:"I", sol:"C"
  },
  "Gestionar knowledge bases para agentes (RAG / grounding)": {
    cat: "Copilot Studio", comp: "IA Generativa / Knowledge",
    dev:"C", ai:"R", datos:"A", arq:"C", ops:"I", infra:"I", mesa:"I", rpa:"I", sec:"C", proc:"C", sol:"C"
  },
  "Monitorear métricas de conversaciones y escaladas": {
    cat: "Copilot Studio", comp: "Monitoreo / Analytics",
    dev:"I", ai:"R", datos:"C", arq:"I", ops:"A", infra:"I", mesa:"C", rpa:"I", sec:"I", proc:"C", sol:"C"
  },

  // ── IA BUILDER & COPILOT EN POWER PLATFORM ────────────────────────────────
  "Definir estrategia de IA generativa en Power Platform": {
    cat: "IA Builder & Copilot", comp: "Estrategia IA",
    dev:"C", ai:"R", datos:"C", arq:"A", ops:"I", infra:"I", mesa:"I", rpa:"I", sec:"C", proc:"I", sol:"C"
  },
  "Aprobar uso de AI Builder y modelos personalizados": {
    cat: "IA Builder & Copilot", comp: "AI Builder / Gobierno",
    dev:"I", ai:"R", datos:"C", arq:"A", ops:"C", infra:"I", mesa:"I", rpa:"I", sec:"C", proc:"I", sol:"I"
  },
  "Desarrollar modelos personalizados con AI Builder": {
    cat: "IA Builder & Copilot", comp: "AI Builder / Modelos",
    dev:"C", ai:"R", datos:"A", arq:"C", ops:"I", infra:"I", mesa:"I", rpa:"I", sec:"C", proc:"I", sol:"C"
  },
  "Integrar Copilot nativo en Power Apps (control Copilot)": {
    cat: "IA Builder & Copilot", comp: "Copilot en Power Apps",
    dev:"R", ai:"A", datos:"C", arq:"C", ops:"I", infra:"I", mesa:"I", rpa:"I", sec:"C", proc:"I", sol:"C"
  },
  "Revisar sesgos y calidad de modelos de IA": {
    cat: "IA Builder & Copilot", comp: "Gobierno IA / Calidad",
    dev:"I", ai:"R", datos:"A", arq:"C", ops:"I", infra:"I", mesa:"I", rpa:"I", sec:"C", proc:"C", sol:"I"
  },
  "Monitorear consumo de créditos AI Builder": {
    cat: "IA Builder & Copilot", comp: "AI Builder / Capacidad",
    dev:"I", ai:"A", datos:"I", arq:"C", ops:"R", infra:"I", mesa:"I", rpa:"I", sec:"I", proc:"I", sol:"I"
  },
  "Definir estándares de IA responsable (sesgo, transparencia, privacidad)": {
    cat: "IA Builder & Copilot", comp: "Responsible AI / Gobierno",
    dev:"I", ai:"R", datos:"A", arq:"C", ops:"I", infra:"I", mesa:"I", rpa:"I", sec:"C", proc:"C", sol:"I"
  },
  "Evaluación ética y de riesgos de IA antes de producción": {
    cat: "IA Builder & Copilot", comp: "Responsible AI / Gobierno",
    dev:"I", ai:"R", datos:"C", arq:"C", ops:"I", infra:"I", mesa:"I", rpa:"I", sec:"A", proc:"C", sol:"I"
  },

  // ── ALM & DEVSECOPS (TRANSVERSAL) ─────────────────────────────────────────
  "Gestionar repositorios de soluciones (Azure DevOps / GitHub)": {
    cat: "ALM & DevSecOps", comp: "Source Control",
    dev:"R", ai:"I", datos:"I", arq:"C", ops:"A", infra:"C", mesa:"I", rpa:"C", sec:"C", proc:"I", sol:"C"
  },
  "Configurar pipelines CI/CD para Power Platform": {
    cat: "ALM & DevSecOps", comp: "CI/CD Pipelines",
    dev:"R", ai:"I", datos:"I", arq:"C", ops:"A", infra:"C", mesa:"I", rpa:"C", sec:"C", proc:"I", sol:"C"
  },
  "Ejecutar análisis de seguridad en código (SAST / DAST)": {
    cat: "ALM & DevSecOps", comp: "DevSecOps / Seguridad",
    dev:"A", ai:"I", datos:"I", arq:"C", ops:"C", infra:"I", mesa:"I", rpa:"I", sec:"R", proc:"I", sol:"I"
  },
  "Gestionar versionado y control de cambios de soluciones": {
    cat: "ALM & DevSecOps", comp: "Source Control / ALM",
    dev:"R", ai:"I", datos:"I", arq:"C", ops:"A", infra:"I", mesa:"I", rpa:"C", sec:"I", proc:"I", sol:"C"
  },
  "Ejecutar pruebas automatizadas (unit / integración / UAT)": {
    cat: "ALM & DevSecOps", comp: "Testing",
    dev:"R", ai:"I", datos:"I", arq:"C", ops:"C", infra:"I", mesa:"I", rpa:"C", sec:"C", proc:"C", sol:"A"
  },
  "Gestionar aprobaciones de despliegue a producción (CAB)": {
    cat: "ALM & DevSecOps", comp: "Change Management / CAB",
    dev:"C", ai:"I", datos:"I", arq:"C", ops:"A", infra:"C", mesa:"I", rpa:"C", sec:"C", proc:"I", sol:"R"
  },
};

const CATEGORIES_DET = [...new Set(Object.values(RACI_DATA_DETALLADA).map(v => v.cat))];

// ─── Component ────────────────────────────────────────────────────────────────

export default function RACIMatrixDetallada() {
  const [filterCat, setFilterCat] = useState("Todas");
  const [highlight, setHighlight] = useState(null);

  const allCats = ["Todas", ...CATEGORIES_DET];

  const filteredActivities = Object.entries(RACI_DATA_DETALLADA).filter(([, v]) =>
    filterCat === "Todas" || v.cat === filterCat
  );

  const exportToExcel = () => {
    const headers = ["Componente PP", "Sub-área / Módulo", "Actividad", ...AREAS.map(a => a.label)];
    const rows = filteredActivities.map(([act, v]) => [
      v.cat, v.comp, act, ...AREAS.map(a => v[a.id] || "")
    ]);

    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    ws["!cols"] = [
      { wch: 28 }, { wch: 32 }, { wch: 60 },
      ...AREAS.map(() => ({ wch: 22 }))
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Matriz RACI Detallada");

    const catLabel = filterCat === "Todas" ? "Completa" : filterCat.replace(/[\s/&]+/g, "_");
    XLSX.writeFile(wb, `MatrizRACI_Detallada_${catLabel}.xlsx`);
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
            {CATEGORIES_DET.filter(cat => filterCat === "Todas" || cat === filterCat).map(cat => {
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
                      background: "var(--color-background-secondary)",
                      lineHeight: 1.3,
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
        Matriz Detallada v1.0 — sujeta a validación en comité.
      </p>
    </>
  );
}

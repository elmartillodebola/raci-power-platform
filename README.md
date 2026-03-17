# Matriz RACI — Gobierno de TI · Power Platform

Visualizador interactivo de la Matriz RACI para la adopción de **Microsoft Power Platform** en el marco de gobierno de TI.
Cubre las áreas de la Gerencia de TI, los componentes de la plataforma y las actividades clave bajo las metodologías **SAFe + DevSecOps**.

---

## Requisitos previos

Asegúrate de tener instalado en tu máquina:

- [Node.js](https://nodejs.org/) versión 18 o superior
- npm (viene incluido con Node.js)

Para verificar:

```bash
node -v
npm -v
```

---

## Cómo correr el proyecto

Abre la carpeta `raci-power-platform` en la terminal de VSCode (**Terminal → New Terminal**) y ejecuta:

```bash
# 1. Instalar dependencias (solo la primera vez)
npm install

# 2. Iniciar la aplicación
npm start
```

La app se abrirá automáticamente en tu navegador en [http://localhost:3000](http://localhost:3000).

---

## Vistas disponibles

El switch en la esquina superior derecha permite alternar entre dos matrices:

| Vista | Descripción | Actividades |
|---|---|---|
| **Matriz RACI General** | Actividades clave por componente PP, visión ejecutiva | ~31 |
| **Matriz RACI Detallada** | Actividades específicas por componente PP, visión operativa | ~83 |

Ambas vistas comparten el mismo eje de categorías — los **componentes de Power Platform** — lo que permite navegar de lo general a lo detallado con coherencia:

`Power Platform Admin & CoE` · `Power Apps` · `Power Automate` · `Power BI` · `Power Pages` · `Dataverse` · `Copilot Studio` · `IA Builder & Copilot` · `ALM & DevSecOps`

---

## Funcionalidades

| Función | Descripción |
|---|---|
| **Switch de vista** | Alterna entre Matriz General y Matriz Detallada |
| **Filtro por componente PP** | Filtra actividades por componente (disponible en ambas vistas) |
| **Exportar a Excel** | Descarga la vista activa como `.xlsx`; respeta el filtro aplicado |
| **Highlight de área** | Pasa el cursor sobre una columna de área para resaltarla en toda la tabla |

---

## Estructura del proyecto

```
src/
├── App.js              # Shell: header, switch de vista e imports
├── RACIGeneral.js      # Matriz General: datos + tabla + exportar
└── RACIDetallada.js    # Matriz Detallada: datos + tabla + exportar
```

---

## Alineamiento con la documentación oficial de Microsoft

Las actividades y la asignación de roles RACI están alineadas con el marco de adopción oficial de Power Platform publicado por Microsoft:

**Roles y responsabilidades de Power Platform**
https://learn.microsoft.com/es-es/power-platform/guidance/adoption/roles

| Área en la matriz | Rol equivalente según Microsoft |
|---|---|
| CIS – Arquitectura | Enterprise Architect · Power Platform Product Owner |
| Desarrollo de Software | Professional Makers · DevOps Engineer |
| Procesos Empresariales | Citizen Makers · Business Analysts · Change Management |
| Inteligencia Artificial | AI Strategist · Ethics Lead (Responsible AI) |
| Ciberseguridad | Information Security & Compliance Team |
| CIS – Operaciones TI | Power Platform Administrators |
| CIS – Infraestructura | Azure Services Administrator · M365 Administrator |
| CIS – Mesa de Ayuda | IT Operations (Support) |
| Soluciones TI (RTEs/Scrum/PO) | Solution Architects · PMO |

Actividades incorporadas a partir de esta referencia: criterios PP vs desarrollo tradicional, gestión del cambio, onboarding de makers, administración de servicios Azure y M365, y evaluación ética de IA (Responsible AI).

**Otras ULRS de referencia**
https://asana.com/es/resources/raci-chart
https://www.inesdi.com/blog/matriz-raci-como-definir-roles-en-la-gestion-de-proyectos-digitales-cp/


---
> Versión v1.0 — sujeta a validación en comité.



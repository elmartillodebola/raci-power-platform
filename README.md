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

## Vista

La aplicación muestra siempre la **Matriz RACI Detallada**: actividades específicas por componente de Power Platform, con visión operativa (~83 actividades).

Los componentes disponibles son:

`Power Platform Admin & CoE` · `Power Apps` · `Power Automate` · `Power BI` · `Power Pages` · `Dataverse` · `Copilot Studio` · `IA Builder & Copilot` · `ALM & DevSecOps`

---

## Funcionalidades

| Función | Descripción |
|---|---|
| **Filtro por Componente PP** | Filtra actividades por componente de Power Platform |
| **Filtro por Sub-área / Módulo** | Filtra por módulo dentro del componente seleccionado; se actualiza automáticamente al cambiar el componente |
| **Contador de actividades** | Muestra en tiempo real cuántas actividades corresponden a los filtros activos |
| **Exportar a Excel** | Descarga la vista actual como `.xlsx`; respeta los filtros aplicados |
| **Destacar columna** | Pasa el cursor sobre el encabezado de un área para resaltarla en toda la tabla |
| **Modo edición** | Permite modificar los valores RACI directamente en la tabla haciendo clic en cada celda |

---

## Modo edición

El botón **✎ Editar valores** activa el modo edición. En este modo:

- Cada celda RACI es clicable y cicla entre los valores: `vacío → R → A → C → I → vacío`
- La tabla se enmarca en ámbar como indicador visual de que hay cambios pendientes
- El botón **Cancelar** descarta todos los cambios sin modificar nada
- El botón **✓ Guardar y descargar JSON** aplica los cambios en pantalla y descarga el archivo `raci-data.json` actualizado

> ⚠️ **El archivo descargado llega a la carpeta de Descargas del navegador**, no se escribe automáticamente en el proyecto. Para que los cambios sean permanentes debes seguir los pasos descritos a continuación.

### Cómo persistir los cambios en el proyecto y en GitHub

1. Descarga el `raci-data.json` desde el modo edición de la app.
2. Reemplaza el archivo `src/data/raci-data.json` del proyecto con el archivo descargado.
3. Verifica que la app refleja los cambios al guardar (el servidor de desarrollo recarga automáticamente).
4. Haz commit y push al repositorio remoto:

```bash
git add src/data/raci-data.json
git commit -m "Actualizar valores de la Matriz RACI"
git push
```

Cualquier persona que clone o actualice el repositorio recibirá los valores actualizados.

---

## Estructura del proyecto

```
src/
├── App.js                  # Shell principal: header e importación de la vista
├── RACIDetallada.js        # Matriz Detallada: tabla, filtros, edición y exportación
└── data/
    ├── areas.json          # Definición de las áreas (columnas): id, label, short
    └── raci-data.json      # Actividades RACI: cat, comp, actividad y valores por área
```

### Modificar el contenido directamente en los JSON

Los datos de la matriz están desacoplados del código. Puedes editar los archivos JSON directamente en cualquier editor de texto:

- **`areas.json`** — agrega, elimina o renombra áreas (columnas de la tabla). Cada entrada requiere `id`, `label` y `short`.
- **`raci-data.json`** — agrega, elimina o modifica actividades. Cada entrada requiere `actividad`, `cat`, `comp` y `raci` (objeto con el valor R/A/C/I por cada `id` de área).

Después de cualquier cambio manual en estos archivos, el servidor de desarrollo recarga la app automáticamente. Recuerda hacer commit y push para sincronizar con el repositorio remoto.

### Comportamiento dinámico de filtros y áreas

**Filtros (Componente PP y Sub-área / Módulo):**
Los valores de ambos filtros se calculan automáticamente desde los datos del JSON. Si agregas una actividad con un `cat` o `comp` nuevo, aparecerá automáticamente en los desplegables sin modificar el código. El contador de actividades también se recalcula en tiempo real según los filtros activos.

**Agregar o eliminar un área:**
Las columnas de la tabla se generan desde `areas.json`, por lo que agregar o quitar un área actualiza la tabla automáticamente. Sin embargo, es una operación de dos pasos:
1. Modificar `areas.json` con la nueva área (o eliminar la existente).
2. Actualizar cada actividad en `raci-data.json` agregando o quitando la clave correspondiente en el objeto `raci`.

Si agregas un área en `areas.json` pero no actualizas las actividades, las celdas aparecerán vacías sin causar error — puedes asignar los valores directamente desde el modo edición de la app. Si eliminas un área, las claves huérfanas en `raci-data.json` se ignoran sin afectar el funcionamiento.

---

## Alcance de las Áreas

### CIS — Centro de Ingeniería de Software
Responsable del gobierno de TI para el proceso de desarrollo de software. Trabaja de forma cercana con COE-TI Ops en la estrategia DevSecOps. Lidera la democratización del conocimiento de desarrollo de software y Power Platform a través de la comunidad de desarrollo. Integra al proceso a proveedores externos y desarrolladores internos bajo un gobierno integral. Hace parte del comité inicial que evalúa si una solución se desarrolla en Power Platform o sigue el flujo tradicional, valoración que realiza en conjunto con COE-TI Arq y Soluciones TI.

### IA — Inteligencia Artificial
Gobierna la estrategia de IA de la compañía. Gestiona la comunidad de IA para la democratización del conocimiento. Define qué herramientas de IA se adoptan (incluyendo cuándo usar AI Builder o Copilot Studio), lidera evaluaciones y pilotos con estos componentes, y define los lineamientos de uso. El desarrollo formal de soluciones de IA dentro de la Gerencia de TI es responsabilidad de este equipo. Hace parte del mismo equipo que RPA, aunque son focos temáticos independientes.

### RPA — Automatización y Robótica
Gestiona la comunidad de automatización y robótica para ciudadanos automatizadores. Opera herramientas propias como UiPath, Bizagi y Knime. Delegó los temas de Power Platform al CIS, con acuerdos de evaluación conjunta para definir cuándo una automatización va a Power Automate versus sus herramientas propias. Se estima que en el futuro gobernará también sobre Power Automate, pero por el momento esa responsabilidad recae en CIS. Hace parte del mismo equipo que IA.

### COE de Excelencia de TI — COE-TI Arq · COE-TI Ops · COE-TI Mesa
Los tres equipos hacen parte de un solo COE cuya misión es coordinar y llevar a cabo las actividades y subprocesos requeridos para la entrega, gestión y mejora de las soluciones y servicios de TI para usuarios y clientes de negocio, bajo los acuerdos de niveles de servicio establecidos. Sus actividades principales son: recibir la solución o servicio y definir el plan de operación, operar y analizar el desempeño, brindar soporte, gestionar incidentes, gestionar cambios y identificar oportunidades de mejora.

**COE-TI Arq**: acompaña a las diferentes células en la adopción y buen uso de la arquitectura existente, facilita la integración de nuevos componentes y construye arquitecturas de referencia que sirven como base para nuevos desarrollos. Se contempla la construcción de un conjunto de elementos base para desarrollos empresariales de Power Platform que mantengan esa dinámica.

**COE-TI Ops**: responsable de DevSecOps y del soporte de plataformas. Automatiza el proceso de CI/CD, gestiona cobertura de pruebas, indicadores de desempeño, monitoreo de soluciones en producción, pases a producción y pipelines. Promueve buenas prácticas y el shift-left del desarrollo.

**COE-TI Mesa**: opera la herramienta de tiquetes y el portafolio de servicios de TI. Gestiona el soporte a usuario final, la resolución de incidentes, la medición del servicio y el escalamiento de casos a solucionadores. Define los flujos de atención para solicitudes de permisos en entornos, creación de grupos y demás categorías de tiquetes que genere Power Platform.

### CiberSec — Ciberseguridad
Responsable de la seguridad de la información con alcance estándar para el sector. Como elemento diferenciador, vela por el proceso de cumplimiento de la compañía: promueve estándares como OWASP y apoya de forma directa el cumplimiento de SOX y los procesos de auditoría interna y externa.

### Procesos — Procesos Empresariales
Responsable de la documentación y medición de impactos de todo lo desarrollado. Hoy tiene visibilidad principalmente sobre el flujo formal de desarrollo con capacidades internas de las áreas, pero no necesariamente sobre lo que ocurre en comunidades o con desarrolladores ciudadanos. Es el área que potencialmente se verá más impactada por la adopción de Power Platform: el prototipado e innovación se acelerarán, y todo lo que se construya — sea por capacidades internas o ciudadanos — soporta procesos que deberían quedar documentados y con sus impactos medidos. El área deberá ampliar su alcance para cubrir también ese espacio, incluyendo soluciones generadas en comunidades, aplicaciones ciudadanas y optimizaciones de proceso derivadas de automatizaciones.

### D&A — Datos y Analítica
Responsable del gobierno de datos con enfoque DataOps, cuenta con comunidad de datos y analítica y capacidad interna para desarrollo formal de soluciones. En proceso de extender su gobierno hacia Dataverse (definiendo qué va o no por este componente) y hacia SharePoint, hoy huérfano de gobierno de datos a pesar de ser ampliamente usado en Power Platform. Autoriza conexiones, réplicas y fuentes de datos de la organización (GCP, bases de datos gobernadas y otras). Es el equipo dueño del gobierno y licenciamiento de Power BI.

### Soluc TI — Soluciones TI (RTEs / Scrum / PO)
Agrupa varias áreas internas asociadas a los trenes de SAFe: gestión del desarrollo de nuevas soluciones, mantenimiento, soporte, aplicación de Scrum y gestión de la fábrica y las células. Alberga Scrum Masters, RTEs y analistas de soluciones, con conexión directa a los Product Owners y visibilidad sobre la calidad de estrategias e iniciativas activas. Hace parte del comité que decide si una solución va a Power Platform o sigue el flujo tradicional de desarrollo. Junto con CIS y COE-TI Arq, evita que desarrollos no priorizados sean desviados a Power Platform para saltarse la fábrica. Es el equipo integrador de todos los demás dentro de las células.

## Principales criterios aplicados para la Matriz (puede cambiar con el tiempo):

CIS lidera todo desarrollo PP y gobierno de ciudadanos; COE-TI Ops es su par en DevSecOps
COE-TI Ops es R en pipelines, CI/CD, monitoreo y gestión de plataforma
COE-TI Mesa es R en soporte, tiquetes e incidentes; C en flujos de solicitud de entornos/grupos
D&A es R en todo lo de Power BI y datos; A en Dataverse (gobierno en proceso)
IA es R en Copilot Studio, AI Builder y estrategia de IA generativa
RPA es A en acuerdos de Power Automate; R en flujos robóticos desktop
Soluc TI es A en entregas de la fábrica; R en aprobaciones de producción y CAB
CiberSec es R en seguridad/SAST/DAST; A en compliance SOX en datos, identidad y auditoría
Procesos es R en desarrollos ciudadanos (canvas/flujos) y gestión del cambio

---

## Áreas de TI

| Área | Abreviación | Descripción |
|---|---|---|
| CIS | CIS | Centro de Innovación de Software — desarrollo profesional |
| Inteligencia Artificial | IA | Estrategia y desarrollo de soluciones de IA |
| Automatización (RPA) | RPA | Automatización robótica de procesos |
| Datos y Analítica | D&A | Gobierno y analítica de datos |
| COE TI - Arquitectura | COE-TI Arq | Arquitectura empresarial y estándares técnicos |
| COE TI - Operaciones | COE-TI Ops | Operaciones y administración de la plataforma |
| COE TI - Mesa de Ayuda | COE-TI Mesa | Soporte L1/L2 a usuarios |
| Ciberseguridad | CiberSec | Seguridad, cumplimiento y DLP |
| Procesos Empresariales | Procesos | Citizen developers y gestión del cambio |
| Soluciones TI (RTEs/Scrum/PO) | Soluc TI | Gestión de soluciones, RTEs y Product Owners |

---

## Alineamiento con la documentación oficial de Microsoft

Las actividades y la asignación de roles RACI están alineadas con el marco de adopción oficial de Power Platform publicado por Microsoft:

**Roles y responsabilidades de Power Platform**
https://learn.microsoft.com/es-es/power-platform/guidance/adoption/roles

| Área en la matriz | Rol equivalente según Microsoft |
|---|---|
| COE TI - Arquitectura | Enterprise Architect · Power Platform Product Owner |
| CIS | Professional Makers · DevOps Engineer |
| Procesos Empresariales | Citizen Makers · Business Analysts · Change Management |
| Inteligencia Artificial | AI Strategist · Ethics Lead (Responsible AI) |
| Ciberseguridad | Information Security & Compliance Team |
| COE TI - Operaciones | Power Platform Administrators |
| COE TI - Mesa de Ayuda | IT Operations (Support) |
| Soluciones TI (RTEs/Scrum/PO) | Solution Architects · PMO |

**Otras URLs de referencia**
https://asana.com/es/resources/raci-chart
https://www.inesdi.com/blog/matriz-raci-como-definir-roles-en-la-gestion-de-proyectos-digitales-cp/

---

> Versión v1.0 — sujeta a validación en comité.

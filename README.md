<p align="center">
  <img src="public/logo.png" alt="CONACI Logo" width="80" />
</p>

<h1 align="center">CONACI - Sistema de Acreditacion Academica</h1>

<p align="center">
  <strong>Plataforma integral para la gestion de procesos de acreditacion academica</strong>
</p>

<p align="center">
  <a href="#tech-stack"><img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" alt="Next.js" /></a>
  <a href="#tech-stack"><img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" alt="TypeScript" /></a>
  <a href="#tech-stack"><img src="https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white" alt="PostgreSQL" /></a>
  <a href="#tech-stack"><img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind" /></a>
  <a href="#tech-stack"><img src="https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma&logoColor=white" alt="Prisma" /></a>
  <a href="#i18n"><img src="https://img.shields.io/badge/i18n-ES%20%7C%20EN-0EA5E9" alt="i18n" /></a>
</p>

---

## About

CONACI (Consejo para la Acreditacion del Comercio Internacional) is a comprehensive web platform that manages the complete lifecycle of academic program accreditation. The system supports multi-role workflows spanning self-assessment by institutions, external evaluation, committee review, and final accreditation rulings.

Built for CONACI to evaluate and accredit academic programs in international trade across Mexico and Latin America.

---

## Features

### Role-Based Access Control

The platform supports 4 user roles, each with dedicated pages and permissions:

| Role | Description | Access |
|------|-------------|--------|
| **Institucion** | Academic institutions undergoing accreditation | Self-assessment, evidence upload, solicitude responses |
| **Evaluador** | External evaluators assigned by CONACI | Criteria evaluation, information requests, site visits |
| **CONACI - Comite** | Accreditation committee members | Final rulings (dictamen) per criterion |
| **CONACI - Admin** | System administrators | Global oversight, user/process/evaluator management |

### Accreditation Workflow

```
Autoevaluacion  -->  Evaluacion  -->  Solicitud de Info  -->  Visita In Situ  -->  Dictamen  -->  Resultado Final
 (Institucion)     (Evaluador)       (Evaluador)           (Evaluador)         (Comite)       (Todos)
```

### Core Modules

- **Executive Dashboard** - KPI cards with accreditation results, compliance percentage, and scores by actor
- **Self-Assessment (Autoevaluacion)** - Institutions rate their own criteria (1-5 scale)
- **External Evaluation** - Evaluators independently assess each criterion
- **Information Requests (Solicitudes)** - Evaluators request additional evidence from institutions
- **Site Visit (Visita In Situ)** - On-site verification with observations and recommendations
- **Committee Ruling (Dictamen)** - Final accreditation decision per criterion
- **Automatic Scoring** - Real-time calculation of scores, totals, and accreditation result

### Institutional & Academic Data

- **Instituciones** - Institution profiles (campus, location, contact)
- **Programas Academicos** - Academic programs (type, coordinator)
- **Planta Docente** - Faculty statistics by contract type and degree
- **Mapeo Docente** - Individual faculty profiles with competency assessment
- **Matricula** - Enrollment data by generation and gender
- **Rendimiento** - Academic performance indicators (dropout rate, graduation efficiency, degree completion rate)

### Administration

- **Process Management** - Create, edit, and monitor accreditation processes
- **User Management** - Create users, assign roles and sub-roles
- **Evaluator Assignment** - Assign evaluators to categories within processes
- **Global Dashboard** - Overview of all processes, institutions, and users

### Internationalization (i18n)

Full bilingual support with flag-based language toggle:
- Spanish (default)
- English

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com/) |
| **UI Components** | [shadcn/ui](https://ui.shadcn.com/) |
| **Database** | [PostgreSQL](https://www.postgresql.org/) |
| **ORM** | [Prisma 6](https://www.prisma.io/) |
| **Authentication** | [NextAuth.js](https://next-auth.js.org/) (Credentials + JWT) |
| **Data Fetching** | [TanStack React Query](https://tanstack.com/query) |
| **Internationalization** | [next-intl](https://next-intl.dev/) |
| **Validation** | [Zod](https://zod.dev/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Charts** | [Recharts](https://recharts.org/) |

---

## Database Schema

26 models across 3 domains with 13 enums for type safety:

### Catalog Tables (5)
Reference data defining the accreditation instruments.

```
Instrumento  --->  Categoria  --->  Criterio  --->  Elemento
                                       |
                                       +--->  Nivel (1-5 rubric)
```

### Operational Tables (11)
Transactional data generated during the accreditation process.

```
Proceso  --->  ProcesoUsuario
   |
   +--->  AsignacionEvaluador
   +--->  Fundamentacion
   +--->  Evaluacion
   +--->  Solicitud  --->  Respuesta
   +--->  EstadoCriterio
   +--->  ResultadoCriterio
   +--->  ResumenProceso
   +--->  Auditoria
```

### Institutional & Academic Tables (6)

```
Institucion  --->  ProgramaAcademico
                        |
Proceso  ---------------+
   |
   +--->  PlantaDocente
   +--->  MapeoDocente
   +--->  Matricula
   +--->  Rendimiento
```

---

## Pages

### Public Pages
| Route | Description |
|-------|-------------|
| `/` | Landing page with features, stats, and CTAs |
| `/login` | User authentication |
| `/register` | New user registration |

### Dashboard Pages (24)

| Route | Role | Description |
|-------|------|-------------|
| `/dashboard` | All | Role-based dashboard with quick access cards |
| `/dashboard/resumen-ejecutivo` | All | Executive KPI dashboard |
| `/dashboard/mi-institucion` | All | Institution profile |
| `/dashboard/mi-programa` | All | Academic program details |
| `/dashboard/mi-proceso` | Institucion | Current accreditation process |
| `/dashboard/autoevaluacion` | Institucion | Self-assessment scoring |
| `/dashboard/mis-solicitudes` | Institucion | Information requests & responses |
| `/dashboard/mis-criterios` | Evaluador | Assigned criteria overview |
| `/dashboard/evaluar-criterio` | Evaluador | Criterion evaluation |
| `/dashboard/solicitar-informacion` | Evaluador | Create information requests |
| `/dashboard/visita-in-situ` | Evaluador | Site visit records |
| `/dashboard/dictamen` | CONACI | Committee rulings |
| `/dashboard/resumen-final` | CONACI | Final results summary |
| `/dashboard/admin` | CONACI | Admin overview dashboard |
| `/dashboard/admin/procesos` | CONACI | Process management (CRUD) |
| `/dashboard/admin/usuarios` | CONACI | User management (CRUD) |
| `/dashboard/admin/evaluadores` | CONACI | Evaluator assignments |
| `/dashboard/planta-docente` | All | Faculty statistics |
| `/dashboard/mapeo-docente` | All | Faculty profiles |
| `/dashboard/matricula` | All | Enrollment data |
| `/dashboard/rendimiento` | All | Academic performance indicators |

### API Routes (19)
| Route | Methods | Auth |
|-------|---------|------|
| `/api/auth/[...nextauth]` | GET, POST | Public |
| `/api/auth/register` | POST | Public |
| `/api/procesos` | GET, POST | Protected |
| `/api/procesos/[id]` | PATCH, DELETE | CONACI |
| `/api/resultado-criterio` | GET, PATCH | Protected |
| `/api/resumen-proceso` | GET | Protected |
| `/api/usuarios` | GET, POST | CONACI |
| `/api/usuarios/[id]` | PATCH | CONACI |
| `/api/instituciones` | GET, POST | Protected |
| `/api/programas` | GET | Protected |
| `/api/instrumentos` | GET | Protected |
| `/api/categorias` | GET | Protected |
| `/api/asignaciones` | GET, POST | Protected |
| `/api/solicitudes` | GET, POST | Protected |
| `/api/evaluaciones` | GET, POST, PATCH | Protected |
| `/api/planta-docente` | GET, POST | Protected |
| `/api/mapeo-docente` | GET, POST | Protected |
| `/api/matricula` | GET, POST | Protected |
| `/api/rendimiento` | GET | Protected |

---

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd conaci-platform

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database URL and auth secret
```

### Environment Variables

```env
DATABASE_URL="postgresql://user:password@host:port/conaci_db?sslmode=require"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

### Database Setup

```bash
# Run migrations
npx prisma migrate dev

# Seed the database with test data
npx prisma db seed
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

---

## Test Accounts

After seeding, the following accounts are available:

| Role | Email | Password |
|------|-------|----------|
| CONACI (Admin) | `admin@conaci.mx` | `Conaci2026!!` |
| CONACI (Comite) | `comite@conaci.mx` | `Conaci2026!!` |
| Evaluador 1 | `evaluador1@conaci.mx` | `Conaci2026!!` |
| Evaluador 2 | `evaluador2@conaci.mx` | `Conaci2026!!` |
| Institucion (Coord.) | `coordinador@universidad.mx` | `Conaci2026!!` |
| Institucion (Resp.) | `responsable@universidad.mx` | `Conaci2026!!` |
| Institucion (Test) | `devgroup.job@gmail.com` | `Conaci2026!!` |

---

## Project Structure

```
conaci-platform/
├── prisma/
│   ├── schema.prisma          # Database schema (26 models, 13 enums)
│   ├── seed.ts                # Test data seeder
│   └── migrations/            # Database migrations
├── public/
│   ├── logo.png               # CONACI logo
│   ├── spain.jpg              # Spanish flag
│   └── us.jpg                 # US flag
├── src/
│   ├── app/
│   │   ├── page.tsx           # Landing page
│   │   ├── (auth)/            # Login & Register
│   │   ├── (dashboard)/       # All dashboard pages
│   │   └── api/               # 19 API route handlers
│   ├── components/
│   │   ├── ui/                # shadcn/ui components
│   │   ├── layout/            # Navbar, Sidebar, Shell, UserMenu
│   │   └── shared/            # Reusable DataTable
│   ├── hooks/                 # Custom React hooks
│   ├── i18n/                  # ES/EN translations
│   ├── lib/                   # Prisma client, auth config, utilities
│   └── types/                 # TypeScript type augmentations
├── .env                       # Environment variables
├── next.config.ts
├── tailwind.config.ts
└── package.json
```

---

## Scoring System

The platform implements CONACI's accreditation scoring model:

### Nacional Instrument
- 10 categories, 4 criteria each = 40 criteria
- Each criterion scored 1-5, max value 5 points
- Total possible: 200 points

### Accreditation Result

| Score Range | Result |
|-------------|--------|
| >= 180 | Acreditacion Consolidada |
| >= 160 | Acreditacion en Desarrollo |
| >= 140 | Acreditacion Condicionada |
| < 140 | No Acreditado |

### Score Calculation

```
Factor = Valor_Maximo_Criterio / 5
Puntaje = Nivel * Factor
Total = Sum of all Puntaje values
Porcentaje = Total / Valor_Maximo_Instrumento * 100
```

---

## Design System

| Element | Value |
|---------|-------|
| Primary Color | `#0EA5E9` (Sky 500) |
| Background Accent | `#F0F9FF` (Sky 50) |
| Text | `#000000` (Black) |
| Background | `#FFFFFF` (White) |
| Font | System (Geist Sans) |

---

## License

This project is proprietary software developed for CONACI.

---

<p align="center">
  Built with Next.js, Tailwind CSS, and PostgreSQL<br/>
  <strong>CONACI</strong> - Consejo para la Acreditacion del Comercio Internacional
</p>

# Pari and Co — UPVC ERP & Manufacturing Suite

A comprehensive, production-ready enterprise resource planning (ERP) platform designed specifically for UPVC window and door manufacturing, estimation, cutting schedules, and GST billing.

---

## 🌟 Overview

The **Pari and Co ERP** platform streamlines the entire manufacturing lifecycle — from customer lead capture and dynamic window/door configuration to automated material cutting schedules, proforma quotations, and GST-compliant tax invoicing.

---

## 🛠️ Key Capabilities & Modules

### 1. Dynamic Quotation & Cost Estimation
- **Multi-Category Product Configurations**:
  - Casement Windows & Doors
  - Sliding Windows & Doors (2-track, 3-track, multi-panel)
  - Top Hung, Ventilators & Louvers
  - Fixed Windows & Custom Architectural Combinations
- **Real-Time Cost Calculations**: Automatic material pricing based on square footage, profile weight, hardware specifications, and glass options.

### 2. Automated Cutting Schedule Engine
- **Precision Dimensional Calculations**: Instant computation of exact fabrication cuts for outer frames, sash profiles, glazing beads, reinforcements, fly mesh, mullions, and interlocks.
- **Waste Minimization**: Algorithmic layout to optimize profile usage and minimize scrap cut-offs.

### 3. GST Invoicing & PDF Generation
- **Branded Documents**: Export professionally formatted PDF quotations, proforma estimates, and tax invoices with customized **Pari and Co** headers, bank details, and terms.
- **Compliance Ready**: Automatic calculation of CGST, SGST, IGST, discounts, and itemized hardware breakdowns.

### 4. Client & Project Relationship Management
- Centralized registry for architects, structural engineers, builders, and direct clients.
- Site-specific project histories, order tracking, and archived quote retrieval.

### 5. Production Analytics & Cost Controls
- Dynamic administrative dashboard with real-time revenue and quoting KPIs.
- Customizable pricing matrices for raw profiles, glass variants, and hardware packages.
- Itemized consumption, hardware usage, and monthly delivery reports.

---

## 🏗️ Architecture & Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend Framework** | React 18, React Router v6 |
| **UI Components & Themes** | PrimeReact, Tabler Icons, Feather Icons, Bootstrap Grid |
| **Document Generation** | jsPDF, html2pdf.js, html2canvas, @react-pdf/renderer |
| **Rich Text & Reports** | CKEditor 5 Classic, XLSX |
| **Deployment & Hosting** | Vercel (SPA-optimized with zero-config edge routing) |

---

## 📂 Project Structure

```
pari-and-co-app/
├── public/
│   ├── assets/              # UI stylesheets, fonts, icons, vendor scripts
│   ├── favicon.ico
│   └── index.html           # Application HTML shell
├── src/
│   ├── images/              # Window, door, and hardware interface assets
│   ├── pages/               # Views & manufacturing modules
│   │   ├── index.js         # Authentication & demo portal
│   │   ├── dashboard.js     # Production & sales analytics dashboard
│   │   ├── cuttingSchedule/ # Cutting calculation engines
│   │   ├── casementWindow.js
│   │   ├── slidingWindow.js
│   │   ├── casementDoor.js
│   │   ├── slidingDoor.js
│   │   ├── download.js      # Branded PDF generator
│   │   └── ...
│   ├── App.js               # Application router & navigation
│   ├── index.css            # Base application styles
│   └── index.js             # React entrypoint
├── vercel.json              # Vercel deployment & routing configuration
├── .npmrc                   # Package resolution settings
├── .env                     # Production build environment flags
└── package.json             # NPM dependencies & scripts
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16.x, v18.x, or v20.x)
- npm (v8.x or newer)

### 1. Installation
Clone the repository and install required dependencies:
```bash
git clone https://github.com/ParthaV30/PariPvc.git
cd PariPvc
npm install --legacy-peer-deps
```

### 2. Local Development Server
Start the local development server:
```bash
npm start
```
The app will be accessible at `http://localhost:3000`.

### 3. Production Build
Create an optimized production bundle:
```bash
npm run build
```

---

## ☁️ Deployment

This project is pre-configured for automated deployment on **Vercel**:
- Single-page application route rewrites are set up in `vercel.json`.
- Dependency compatibility rules are declared in `.npmrc`.
- Continuous integration safety flags are defined in `.env`.

Simply import the GitHub repository into your Vercel dashboard and deploy.

---

## 📄 License & Ownership

© **Pari and Co**. All rights reserved.

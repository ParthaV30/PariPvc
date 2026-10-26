# Pari and Co - UPVC Window & Door Manufacturing Management App

A complete, production-grade UPVC ERP web application reverse-engineered from [https://saalaram.app/](https://saalaram.app/) and customized for **Pari and Co**.

---

## 🛠️ Features Included

1. **Quotation Management**:
   - Casement Windows & Doors
   - Sliding Windows & Doors
   - Top Hung & Ventilators
   - Fixed Windows
   - Custom Profiles, Hardware & Glass Specifications
2. **Cutting Schedule Engine**:
   - Automated dimension calculations (frame, sash, glazing bead, reinforcement, mesh, mullion, interlock)
   - Real-time profile and glass cutting optimization
3. **Invoicing & Billing**:
   - Automated GST calculation, proforma invoices, and final tax invoices
   - Branded PDF generation with **Pari and Co** headers and terms
4. **Client & Vendor Management**:
   - Client records, architects/engineers directory, site locations, and purchase history
5. **Reports & Analytics**:
   - Monthly revenue reports, hardware utilization reports, itemized cost breakdowns, and cutting schedules
6. **Customizable Costs & Default Profiles**:
   - Configurable per-sqft or per-kg rates for UPVC profiles, hardware kits, and glass thicknesses

---

## 📂 Project Structure

```
Test-REA/
├── public/
│   ├── assets/              # Vendor plugins, fonts, tabler icons, bootstrap, pcoded theme
│   ├── favicon.ico
│   └── index.html           # Pari and Co HTML shell
├── src/
│   ├── images/              # Window/door UI media (handles, mesh textures, fan graphics, etc.)
│   ├── pages/               # 46 React view components & cutting schedule modules
│   │   ├── index.js         # Pari and Co Authentication & Demo access
│   │   ├── dashboard.js     # Admin & User KPI Dashboard
│   │   ├── cuttingSchedule/ # Cutting calculation engines
│   │   ├── casementWindow.js
│   │   ├── slidingWindow.js
│   │   ├── casementDoor.js
│   │   ├── slidingDoor.js
│   │   ├── download.js      # Quotation/Invoice PDF generation (Branded for Pari and Co)
│   │   └── ...
│   ├── App.js               # React Router configuration
│   ├── App.css
│   ├── index.js
│   ├── index.css
│   └── reportWebVitals.js
└── package.json             # NPM dependencies & build scripts
```

---

## 🚀 Running the App Locally

### 1. Install Dependencies
```bash
npm install --legacy-peer-deps
```

### 2. Start Development Server
```bash
npm start
```
The application will launch at `http://localhost:3000`.

### 3. Demo Access
- Click the **Demo** button on the login screen to automatically log in.
- The default store/company name is initialized to **Pari and Co**.

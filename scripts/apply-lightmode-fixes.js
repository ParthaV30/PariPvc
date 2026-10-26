const fs = require('fs');
const path = require('path');

// 1. Update dashboard.js hero banner with proper class and branding
const dashPath = path.join(__dirname, '..', 'src', 'pages', 'dashboard.js');
let dashCode = fs.readFileSync(dashPath, 'utf8');

const oldBannerRegex = /<div class="col-12">\s*<div class="card welcome-banner bg-blue-800">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/;

const newBanner = `<div class="col-12 mb-4">
          <div class="card welcome-banner pari-hero-banner bg-blue-800">
            <div class="card-body p-4 p-md-5">
              <div class="row align-items-center">
                <div class="col-md-7">
                  {businessBadge && (
                    <div class="pari-hero-badge mb-2">
                      <i class="ti ti-shield-check"></i> {businessBadge}
                    </div>
                  )}
                  <h2 class="text-white pari-hero-title mb-2">{businessName}</h2>
                  <h5 class="text-white-50 mb-3">{businessSub} &bull; {businessTagline}</h5>
                  <p class="text-white pari-hero-desc mb-4">{businessDesc}</p>
                  <div class="d-flex flex-wrap gap-2">
                    <a href="/create-quotation" class="btn btn-hero-primary">
                      <i class="ti ti-plus"></i> Create New Quote
                    </a>
                    <a href="/account" class="btn btn-hero-ghost">
                      <i class="ti ti-settings"></i> Business Profile
                    </a>
                  </div>
                </div>
                <div class="col-md-5 text-center mt-3 mt-md-0">
                  <div class="p-3 d-inline-block rounded-circle bg-white shadow-lg" style={{ width: '130px', height: '130px' }}>
                    <img
                      src={brandDatas && brandDatas[0]?.companyLogo ? "https://upvcapi.sninfoserv.com/user/images/" + brandDatas[0].companyLogo : "/assets/images/pari-logo.png"}
                      onError={(e) => { e.target.src = "/assets/images/pari-logo.png"; }}
                      alt={businessName}
                      class="img-fluid"
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>`;

if (oldBannerRegex.test(dashCode)) {
  dashCode = dashCode.replace(oldBannerRegex, newBanner);
  fs.writeFileSync(dashPath, dashCode, 'utf8');
  console.log('Successfully updated dashboard.js hero banner');
} else {
  console.log('Could not match old banner regex in dashboard.js');
}

// 2. Append comprehensive light mode + dark mode contrast CSS to src/index.css
const cssPath = path.join(__dirname, '..', 'src', 'index.css');
let cssCode = fs.readFileSync(cssPath, 'utf8');

const lightModeFixes = `

/* ==========================================================================
   11. COMPREHENSIVE LIGHT MODE & CONTRAST FIXES
   ========================================================================== */

/* Welcome / Hero Banner in both Light and Dark mode */
.welcome-banner,
.welcome-banner.bg-blue-800,
.card.welcome-banner,
.pari-hero-banner {
  background: linear-gradient(135deg, #0A1128 0%, #1E3A8A 50%, #2563EB 100%) !important;
  border-radius: 20px !important;
  color: #ffffff !important;
  position: relative !important;
  overflow: hidden !important;
  box-shadow: 0 20px 32px -10px rgba(30, 58, 138, 0.4) !important;
  border: 1px solid rgba(255, 255, 255, 0.15) !important;
}

.welcome-banner h2,
.welcome-banner h3,
.welcome-banner h4,
.welcome-banner h5,
.welcome-banner p,
.welcome-banner span,
.pari-hero-banner h2,
.pari-hero-banner h3,
.pari-hero-banner h4,
.pari-hero-banner h5,
.pari-hero-banner p,
.pari-hero-banner span {
  color: #ffffff !important;
}

.welcome-banner .text-white-50,
.pari-hero-banner .text-white-50 {
  color: rgba(255, 255, 255, 0.8) !important;
}

.welcome-banner .btn-outline-light,
.welcome-banner a.btn-outline-light {
  background: #ffffff !important;
  color: #1E3A8A !important;
  border: none !important;
  font-weight: 700 !important;
  padding: 10px 22px !important;
  border-radius: 10px !important;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.2) !important;
}

.welcome-banner .btn-outline-light:hover,
.welcome-banner a.btn-outline-light:hover {
  background: #F8FAFC !important;
  color: #1D4ED8 !important;
  transform: translateY(-2px);
}

/* Light Mode Global Text & Cards */
body[data-pc-theme="light"],
body:not([data-pc-theme="dark"]) {
  color: #0F172A !important;
  background-color: #F8FAFC !important;
}

body[data-pc-theme="light"] .card,
body:not([data-pc-theme="dark"]) .card {
  background-color: #FFFFFF !important;
  border-color: #E2E8F0 !important;
  color: #0F172A !important;
}

body[data-pc-theme="light"] .card h1,
body[data-pc-theme="light"] .card h2,
body[data-pc-theme="light"] .card h3,
body[data-pc-theme="light"] .card h4,
body[data-pc-theme="light"] .card h5,
body[data-pc-theme="light"] .card h6,
body[data-pc-theme="light"] .card-header h5,
body[data-pc-theme="light"] .card-title,
body:not([data-pc-theme="dark"]) .card h1,
body:not([data-pc-theme="dark"]) .card h2,
body:not([data-pc-theme="dark"]) .card h3,
body:not([data-pc-theme="dark"]) .card h4,
body:not([data-pc-theme="dark"]) .card h5,
body:not([data-pc-theme="dark"]) .card h6,
body:not([data-pc-theme="dark"]) .card-header h5,
body:not([data-pc-theme="dark"]) .card-title {
  color: #0F172A !important;
  font-weight: 700 !important;
}

/* Calculator left control labels & paragraph text */
body[data-pc-theme="light"] .card p,
body[data-pc-theme="light"] .col-6 p,
body[data-pc-theme="light"] .col-12 p,
body:not([data-pc-theme="dark"]) .card p,
body:not([data-pc-theme="dark"]) .col-6 p,
body:not([data-pc-theme="dark"]) .col-12 p {
  color: #1E293B !important;
  font-size: 13px !important;
  font-weight: 600 !important;
  margin-bottom: 5px !important;
}

body[data-pc-theme="dark"] .card p,
body[data-pc-theme="dark"] .col-6 p,
body[data-pc-theme="dark"] .col-12 p {
  color: #E2E8F0 !important;
  font-size: 13px !important;
  font-weight: 600 !important;
  margin-bottom: 5px !important;
}

/* Stat Card inner boxes (.bg-body) */
body[data-pc-theme="light"] .bg-body,
body:not([data-pc-theme="dark"]) .bg-body {
  background-color: #F1F5F9 !important;
  color: #0F172A !important;
  border: 1px solid #E2E8F0 !important;
}

body[data-pc-theme="light"] .bg-body h6,
body[data-pc-theme="light"] .bg-body h5,
body[data-pc-theme="light"] .bg-body p,
body[data-pc-theme="light"] .bg-body span,
body:not([data-pc-theme="dark"]) .bg-body h6,
body:not([data-pc-theme="dark"]) .bg-body h5,
body:not([data-pc-theme="dark"]) .bg-body p,
body:not([data-pc-theme="dark"]) .bg-body span {
  color: #0F172A !important;
  font-weight: 700 !important;
}

/* Form inputs & selects in Light Mode */
body[data-pc-theme="light"] .form-control,
body[data-pc-theme="light"] input,
body[data-pc-theme="light"] select,
body[data-pc-theme="light"] textarea,
body:not([data-pc-theme="dark"]) .form-control,
body:not([data-pc-theme="dark"]) input,
body:not([data-pc-theme="dark"]) select,
body:not([data-pc-theme="dark"]) textarea {
  color: #0F172A !important;
  background-color: #FFFFFF !important;
  border-color: #CBD5E1 !important;
}

body[data-pc-theme="light"] .form-control::placeholder,
body[data-pc-theme="light"] input::placeholder,
body:not([data-pc-theme="dark"]) .form-control::placeholder,
body:not([data-pc-theme="dark"]) input::placeholder {
  color: #64748B !important;
  opacity: 1 !important;
}

body[data-pc-theme="light"] .form-control:focus,
body:not([data-pc-theme="dark"]) .form-control:focus {
  border-color: #2563EB !important;
  color: #0F172A !important;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15) !important;
}

/* Tables in Light Mode */
body[data-pc-theme="light"] table,
body:not([data-pc-theme="dark"]) table {
  color: #0F172A !important;
}

body[data-pc-theme="light"] table th,
body:not([data-pc-theme="dark"]) table th {
  color: #334155 !important;
  background-color: #F8FAFC !important;
  border-bottom: 1px solid #E2E8F0 !important;
  font-weight: 700 !important;
}

body[data-pc-theme="light"] table td,
body:not([data-pc-theme="dark"]) table td {
  color: #0F172A !important;
  background-color: #FFFFFF !important;
  border-bottom: 1px solid #E2E8F0 !important;
}

/* Light mode badges */
body[data-pc-theme="light"] .badge.bg-light,
body:not([data-pc-theme="dark"]) .badge.bg-light {
  background-color: #F1F5F9 !important;
  color: #1E293B !important;
  border: 1px solid #CBD5E1 !important;
}

/* Offcanvas & Modal text in Light Mode */
body[data-pc-theme="light"] .offcanvas,
body:not([data-pc-theme="dark"]) .offcanvas,
body[data-pc-theme="light"] .modal-content,
body:not([data-pc-theme="dark"]) .modal-content {
  background-color: #FFFFFF !important;
  color: #0F172A !important;
  border-color: #E2E8F0 !important;
}

body[data-pc-theme="light"] .offcanvas-title,
body:not([data-pc-theme="dark"]) .offcanvas-title,
body[data-pc-theme="light"] .modal-title,
body:not([data-pc-theme="dark"]) .modal-title {
  color: #0F172A !important;
  font-weight: 700 !important;
}

/* Window Canvas Dimension Lines & Labels */
.expanding-arrow-line p,
.expanding-arrow-line div,
.line,
.diagonal-line {
  color: #0F172A !important;
}

.text-muted {
  color: #64748B !important;
}

body[data-pc-theme="dark"] .text-muted {
  color: #94A3B8 !important;
}
`;

if (!cssCode.includes('11. COMPREHENSIVE LIGHT MODE & CONTRAST FIXES')) {
  cssCode += lightModeFixes;
  fs.writeFileSync(cssPath, cssCode, 'utf8');
  console.log('Successfully appended light mode fixes to index.css');
} else {
  console.log('Light mode fixes already present in index.css');
}

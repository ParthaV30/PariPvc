const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '..', 'src', 'index.css');
let cssCode = fs.readFileSync(cssPath, 'utf8');

const heroWhiteOverride = `

/* ==========================================================================
   12. ABSOLUTE HIGH-CONTRAST WHITE TEXT OVERRIDES FOR HERO BANNER
   ========================================================================== */
.pari-hero-banner,
.welcome-banner,
.card.welcome-banner,
.pari-hero-banner h1,
.pari-hero-banner h2,
.pari-hero-banner h3,
.pari-hero-banner h4,
.pari-hero-banner h5,
.pari-hero-banner h6,
.pari-hero-banner p,
.pari-hero-banner span,
.pari-hero-title,
.pari-hero-desc,
.welcome-banner h1,
.welcome-banner h2,
.welcome-banner h3,
.welcome-banner h4,
.welcome-banner h5,
.welcome-banner h6,
.welcome-banner p,
.welcome-banner span,
.welcome-banner .text-white,
.pari-hero-banner .text-white,
body[data-pc-theme="light"] .pari-hero-banner h2,
body[data-pc-theme="light"] .pari-hero-banner h5,
body[data-pc-theme="light"] .pari-hero-banner p,
body[data-pc-theme="light"] .welcome-banner h2,
body[data-pc-theme="light"] .welcome-banner h5,
body[data-pc-theme="light"] .welcome-banner p,
body[data-pc-theme="light"] .pari-hero-title,
body[data-pc-theme="light"] .pari-hero-desc,
body[data-pc-theme="light"] .card.welcome-banner h2,
body[data-pc-theme="light"] .card.welcome-banner h5,
body[data-pc-theme="light"] .card.welcome-banner p,
body:not([data-pc-theme="dark"]) .pari-hero-banner h2,
body:not([data-pc-theme="dark"]) .pari-hero-banner h5,
body:not([data-pc-theme="dark"]) .pari-hero-banner p,
body:not([data-pc-theme="dark"]) .welcome-banner h2,
body:not([data-pc-theme="dark"]) .welcome-banner h5,
body:not([data-pc-theme="dark"]) .welcome-banner p,
body:not([data-pc-theme="dark"]) .pari-hero-title,
body:not([data-pc-theme="dark"]) .pari-hero-desc,
body:not([data-pc-theme="dark"]) .card.welcome-banner h2,
body:not([data-pc-theme="dark"]) .card.welcome-banner h5,
body:not([data-pc-theme="dark"]) .card.welcome-banner p {
  color: #FFFFFF !important;
}

.pari-hero-banner .text-white-50,
.welcome-banner .text-white-50,
body[data-pc-theme="light"] .pari-hero-banner .text-white-50,
body[data-pc-theme="light"] .welcome-banner .text-white-50,
body:not([data-pc-theme="dark"]) .pari-hero-banner .text-white-50,
body:not([data-pc-theme="dark"]) .welcome-banner .text-white-50 {
  color: rgba(255, 255, 255, 0.85) !important;
}

.pari-hero-badge,
body[data-pc-theme="light"] .pari-hero-badge,
body:not([data-pc-theme="dark"]) .pari-hero-badge {
  color: #93C5FD !important;
  background: rgba(255, 255, 255, 0.15) !important;
  border: 1px solid rgba(255, 255, 255, 0.25) !important;
}
`;

cssCode += heroWhiteOverride;
fs.writeFileSync(cssPath, cssCode, 'utf8');
console.log('Appended heroWhiteOverride to index.css');

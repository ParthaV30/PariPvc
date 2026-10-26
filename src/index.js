import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ReactSession } from 'react-client-session';

// Initialize session
ReactSession.setStoreType("localStorage");

// Clear test data from localStorage
const testKeys = [
  "upvcuserQuotes",
  "upvcuserEngineers",
  "upvcuserClients",
  "upvcuserProfiles",
  "upvclimit"
];
testKeys.forEach(key => {
  const val = ReactSession.get(key);
  if (val === "1000" || val === "500" || val === "100" || val === "50" || val === "1,000") {
    ReactSession.set(key, "0");
  }
});

const defaultSession = {
  upvcuserId: "1",
  upvcuserName: "Pari and Co",
  companyname: "Pari and Co",
  upvcuserType: "2", // Admin
  upvcAddress: "",
  upvcNumber: "",
  upvcImage: "default.png",
  upvcemail: "",
  upvcregid: "",
  upvclimit: "0",
  upvcsubUsers: "0",
  upvcuserQuotes: "0",
  upvcuserEngineers: "0",
  upvcuserClients: "0",
  upvcuserProfiles: "0",
  upvcreport: false,
  sidebar: "pc-sidebar",
  theme: "light"
};

// Ensure session keys are initialized without setting test values
for (const [key, val] of Object.entries(defaultSession)) {
  const existing = ReactSession.get(key);
  if (existing === undefined || existing === null) {
    ReactSession.set(key, val);
  }
}

// Apply initial theme immediately to prevent flashing
const initialTheme = ReactSession.get("theme") || "light";
document.body.setAttribute('data-pc-theme', initialTheme);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();

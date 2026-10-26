import React, { useState, useEffect } from "react";
import Navbar from "./navbar";
import Header from "./header";
import {
  getAllProfiles,
  getCustomProfiles,
  addCustomProfile,
  deleteCustomProfile,
  saveCustomProfiles
} from "../services/profileManager";
import standardProfiles from "../data/standard-profiles.json";

const UploadProfile = () => {
  const [activeTab, setActiveTab] = useState("all"); // "all" | "add" | "json"
  const [profiles, setProfiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [notification, setNotification] = useState({ show: false, message: "", type: "success" });

  // Add form states
  const [profileName, setProfileName] = useState("");
  const [seriesName, setSeriesName] = useState("50 Series");
  const [productType, setProductType] = useState("SlidingWindow");
  const [frameId, setFrameId] = useState("");
  const [shutterId, setShutterId] = useState("");
  const [mullionId, setMullionId] = useState("");
  const [beadingId, setBeadingId] = useState("");
  const [interlockId, setInterlockId] = useState("");
  const [meshId, setMeshId] = useState("");
  const [pricePerMeter, setPricePerMeter] = useState("180");

  // JSON upload state
  const [jsonFile, setJsonFile] = useState(null);

  const refreshList = () => {
    const all = getAllProfiles();
    setProfiles(all);
  };

  useEffect(() => {
    refreshList();
  }, []);

  const showToast = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "success" });
    }, 4000);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!profileName.trim()) {
      showToast("Please enter a Profile Brand Name (e.g., Aluplast, Deceuninck, Rehau)", "danger");
      return;
    }

    try {
      addCustomProfile({
        profileName: profileName.trim(),
        series: seriesName.trim() || "50 Series",
        type: productType,
        frame: frameId.trim(),
        shutter: shutterId.trim(),
        mullion: mullionId.trim(),
        beading: beadingId.trim(),
        interlock: interlockId.trim(),
        mesh: meshId.trim(),
        price: pricePerMeter.trim() || "180"
      });

      showToast(`Profile "${profileName}" added successfully and activated for all calculators!`, "success");
      // Reset form
      setProfileName("");
      setFrameId("");
      setShutterId("");
      setMullionId("");
      setBeadingId("");
      setInterlockId("");
      setMeshId("");
      refreshList();
      setActiveTab("all");
    } catch (err) {
      console.error(err);
      showToast("Failed to save profile: " + err.message, "danger");
    }
  };

  const handleDelete = (name) => {
    if (window.confirm(`Are you sure you want to delete custom profile "${name}"?`)) {
      deleteCustomProfile(name);
      showToast(`Custom profile "${name}" removed.`, "info");
      refreshList();
    }
  };

  const handleJsonUpload = () => {
    if (!jsonFile) {
      showToast("Please select a JSON file to upload.", "danger");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        const listToImport = Array.isArray(parsed) ? parsed : [parsed];
        const currentCustom = getCustomProfiles();

        let importedCount = 0;
        listToImport.forEach((item) => {
          if (item && (item.profileName || item.profileId)) {
            const name = item.profileName || item.profileId;
            addCustomProfile({
              profileName: name,
              series: item.series || (item.profileData && item.profileData[0]?.series) || "50 Series",
              profileData: item.profileData,
              items: item.items
            });
            importedCount++;
          }
        });

        showToast(`Successfully imported ${importedCount} profile(s) from JSON file!`, "success");
        setJsonFile(null);
        refreshList();
        setActiveTab("all");
      } catch (err) {
        showToast("Invalid JSON file format: " + err.message, "danger");
      }
    };
    reader.readAsText(jsonFile);
  };

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(profiles, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `upvc_profiles_backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast("Profile catalog exported to JSON successfully!", "success");
  };

  const filteredProfiles = profiles.filter((p) => {
    const q = searchTerm.toLowerCase();
    const nameMatch = p.profileName && p.profileName.toLowerCase().includes(q);
    const seriesMatch = Array.isArray(p.profileData) && p.profileData.some(s => s.series && s.series.toLowerCase().includes(q));
    return nameMatch || seriesMatch;
  });

  return (
    <>
      <Navbar />
      <Header />

      <div className="pc-container" style={{ minHeight: "100vh", backgroundColor: "#f4f7fa" }}>
        <div className="pc-content">
          {notification.show && (
            <div
              className={`alert alert-${notification.type} alert-dismissible fade show shadow-sm`}
              role="alert"
              style={{
                position: "fixed",
                top: "80px",
                right: "30px",
                zIndex: 9999,
                minWidth: "320px",
                borderRadius: "10px"
              }}
            >
              <strong>{notification.type === "danger" ? "Attention: " : "Success: "}</strong>
              {notification.message}
            </div>
          )}

          <div className="row">
            <div className="col-12">
              <div className="card shadow-sm border-0 mb-4" style={{ borderRadius: "12px" }}>
                <div className="card-body p-4">
                  <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
                    <div>
                      <h3 className="text-dark font-weight-bold mb-1">
                        UPVC Profile Catalog & Admin Manager
                      </h3>
                      <p className="text-muted mb-0" style={{ fontSize: "14px" }}>
                        All 17 standard industry profiles from <strong>saalaram.app</strong> are pre-loaded.
                        You can also create custom extra profiles or upload JSON catalogs for your shop.
                      </p>
                    </div>

                    <div className="d-flex gap-2 mt-2 mt-md-0">
                      <button
                        className={`btn ${activeTab === "all" ? "btn-primary" : "btn-outline-primary"} px-3`}
                        onClick={() => setActiveTab("all")}
                        style={{ borderRadius: "8px" }}
                      >
                        All Profiles ({profiles.length})
                      </button>
                      <button
                        className={`btn ${activeTab === "add" ? "btn-success" : "btn-outline-success"} px-3`}
                        onClick={() => setActiveTab("add")}
                        style={{ borderRadius: "8px" }}
                      >
                        + Add Extra Profile
                      </button>
                      <button
                        className={`btn ${activeTab === "json" ? "btn-secondary" : "btn-outline-secondary"} px-3`}
                        onClick={() => setActiveTab("json")}
                        style={{ borderRadius: "8px" }}
                      >
                        Import / Export JSON
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* TAB 1: ALL PROFILES */}
          {activeTab === "all" && (
            <div className="row">
              <div className="col-12">
                <div className="card shadow-sm border-0" style={{ borderRadius: "12px" }}>
                  <div className="card-body p-4">
                    <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
                      <div className="d-flex align-items-center" style={{ minWidth: "300px" }}>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Search profile brand or series..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          style={{ borderRadius: "8px" }}
                        />
                      </div>
                      <div className="text-muted small mt-2 mt-sm-0">
                        Showing <strong>{filteredProfiles.length}</strong> of {profiles.length} profiles
                      </div>
                    </div>

                    <div className="table-responsive">
                      <table className="table table-hover align-middle">
                        <thead className="thead-light" style={{ backgroundColor: "#f8f9fa" }}>
                          <tr>
                            <th style={{ width: "60px" }}>#</th>
                            <th>Brand / Profile Name</th>
                            <th>Series Available</th>
                            <th>Status / Source</th>
                            <th>Total Parts</th>
                            <th className="text-end">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredProfiles.length === 0 ? (
                            <tr>
                              <td colSpan="6" className="text-center py-4 text-muted">
                                No profiles match "{searchTerm}". Try another search term or click "+ Add Extra Profile".
                              </td>
                            </tr>
                          ) : (
                            filteredProfiles.map((p, idx) => {
                              const isCustom = Boolean(p.isCustom);
                              const seriesCount = Array.isArray(p.profileData) ? p.profileData.length : 1;
                              const itemsCount = Array.isArray(p.profileData)
                                ? p.profileData.reduce((acc, curr) => acc + (curr.items ? curr.items.length : 0), 0)
                                : 0;

                              return (
                                <tr key={idx}>
                                  <td><strong>{idx + 1}</strong></td>
                                  <td>
                                    <div className="font-weight-bold text-dark" style={{ fontSize: "15px" }}>
                                      {p.profileName}
                                    </div>
                                    <small className="text-muted">ID: {p.profileId || p.profileName}</small>
                                  </td>
                                  <td>
                                    <div className="d-flex flex-wrap gap-1" style={{ maxWidth: "450px" }}>
                                      {Array.isArray(p.profileData) && p.profileData.slice(0, 4).map((s, sIdx) => (
                                        <span
                                          key={sIdx}
                                          className="badge bg-light text-dark border mr-1 mb-1"
                                          style={{ fontSize: "11px", fontWeight: 500, padding: "5px 8px" }}
                                        >
                                          {s.series}
                                        </span>
                                      ))}
                                      {Array.isArray(p.profileData) && p.profileData.length > 4 && (
                                        <span
                                          className="badge bg-secondary text-white mr-1 mb-1"
                                          style={{ fontSize: "11px", padding: "5px 8px" }}
                                        >
                                          +{p.profileData.length - 4} more
                                        </span>
                                      )}
                                    </div>
                                  </td>
                                  <td>
                                    {isCustom ? (
                                      <span className="badge bg-success" style={{ padding: "6px 10px", fontSize: "11px" }}>
                                        Custom Admin Profile
                                      </span>
                                    ) : (
                                      <span className="badge bg-info text-white" style={{ padding: "6px 10px", fontSize: "11px" }}>
                                        Saalaram Standard (17)
                                      </span>
                                    )}
                                  </td>
                                  <td>
                                    <span className="text-muted small">
                                      {itemsCount > 0 ? `${itemsCount} components` : `${seriesCount} series`}
                                    </span>
                                  </td>
                                  <td className="text-end">
                                    {isCustom ? (
                                      <button
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={() => handleDelete(p.profileName)}
                                        style={{ borderRadius: "6px" }}
                                      >
                                        Delete
                                      </button>
                                    ) : (
                                      <span className="badge bg-light text-muted border" style={{ fontSize: "11px" }}>
                                        System Protected
                                      </span>
                                    )}
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ADD EXTRA PROFILE FORM */}
          {activeTab === "add" && (
            <div className="row justify-content-center">
              <div className="col-lg-10">
                <div className="card shadow-sm border-0" style={{ borderRadius: "12px" }}>
                  <div className="card-header bg-white border-0 pt-4 px-4 pb-0">
                    <h4 className="font-weight-bold text-dark mb-1">Add Extra Profile Brand</h4>
                    <p className="text-muted small">
                      Fill out this form to add a new profile brand. It will instantly appear across all UPVC window/door calculators and cutting schedules.
                    </p>
                  </div>
                  <div className="card-body p-4">
                    <form onSubmit={handleAddSubmit}>
                      <div className="row g-3">
                        <div className="col-md-6 mb-3">
                          <label className="form-label font-weight-bold">
                            Profile Brand Name <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="e.g. Aluplast, Deceuninck, Rehau, Dimex"
                            value={profileName}
                            onChange={(e) => setProfileName(e.target.value)}
                            required
                            style={{ borderRadius: "8px" }}
                          />
                          <small className="text-muted">Display name in calculator profile dropdowns.</small>
                        </div>

                        <div className="col-md-6 mb-3">
                          <label className="form-label font-weight-bold">Series Name</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="e.g. 50 Series, 60 Series, 80 Series"
                            value={seriesName}
                            onChange={(e) => setSeriesName(e.target.value)}
                            style={{ borderRadius: "8px" }}
                          />
                          <small className="text-muted">Default series for this profile.</small>
                        </div>

                        <div className="col-md-6 mb-3">
                          <label className="form-label font-weight-bold">Product Category</label>
                          <select
                            className="form-control"
                            value={productType}
                            onChange={(e) => setProductType(e.target.value)}
                            style={{ borderRadius: "8px" }}
                          >
                            <option value="SlidingWindow">Sliding Window</option>
                            <option value="CasementWindow">Casement Window</option>
                            <option value="SlidingDoor">Sliding Door</option>
                            <option value="CasementDoor">Casement Door</option>
                            <option value="TopHung">Top Hung</option>
                            <option value="Fixed">Fixed Window</option>
                            <option value="Ventilators">Ventilators</option>
                          </select>
                        </div>

                        <div className="col-md-6 mb-3">
                          <label className="form-label font-weight-bold">Base Price per Meter (₹)</label>
                          <input
                            type="number"
                            className="form-control"
                            placeholder="180"
                            value={pricePerMeter}
                            onChange={(e) => setPricePerMeter(e.target.value)}
                            style={{ borderRadius: "8px" }}
                          />
                        </div>

                        <div className="col-12">
                          <hr className="my-2" />
                          <h6 className="font-weight-bold text-primary mb-3">
                            Default Component IDs (Optional - Auto-generated if left blank)
                          </h6>
                        </div>

                        <div className="col-md-4 mb-3">
                          <label className="form-label">Outer Frame ID</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Auto: e.g. ALU-FR-01"
                            value={frameId}
                            onChange={(e) => setFrameId(e.target.value)}
                            style={{ borderRadius: "8px" }}
                          />
                        </div>

                        <div className="col-md-4 mb-3">
                          <label className="form-label">Shutter / Sash ID</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Auto: e.g. ALU-SH-01"
                            value={shutterId}
                            onChange={(e) => setShutterId(e.target.value)}
                            style={{ borderRadius: "8px" }}
                          />
                        </div>

                        <div className="col-md-4 mb-3">
                          <label className="form-label">Mullion ID</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Auto: e.g. ALU-MUL-01"
                            value={mullionId}
                            onChange={(e) => setMullionId(e.target.value)}
                            style={{ borderRadius: "8px" }}
                          />
                        </div>

                        <div className="col-md-4 mb-3">
                          <label className="form-label">Glazing Beading ID</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Auto: e.g. ALU-BD-01"
                            value={beadingId}
                            onChange={(e) => setBeadingId(e.target.value)}
                            style={{ borderRadius: "8px" }}
                          />
                        </div>

                        <div className="col-md-4 mb-3">
                          <label className="form-label">Interlock ID</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Auto: e.g. ALU-INT-01"
                            value={interlockId}
                            onChange={(e) => setInterlockId(e.target.value)}
                            style={{ borderRadius: "8px" }}
                          />
                        </div>

                        <div className="col-md-4 mb-3">
                          <label className="form-label">Mesh ID (Optional)</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Optional: e.g. ALU-MSH-01"
                            value={meshId}
                            onChange={(e) => setMeshId(e.target.value)}
                            style={{ borderRadius: "8px" }}
                          />
                        </div>

                        <div className="col-12 mt-4 text-end">
                          <button
                            type="button"
                            className="btn btn-light mr-2"
                            onClick={() => setActiveTab("all")}
                            style={{ borderRadius: "8px" }}
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="btn btn-success px-4"
                            style={{ borderRadius: "8px" }}
                          >
                            Save & Activate Profile
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: JSON IMPORT / EXPORT */}
          {activeTab === "json" && (
            <div className="row justify-content-center">
              <div className="col-lg-8">
                <div className="card shadow-sm border-0 mb-4" style={{ borderRadius: "12px" }}>
                  <div className="card-header bg-white border-0 pt-4 px-4 pb-0">
                    <h4 className="font-weight-bold text-dark mb-1">Export Profile Database</h4>
                    <p className="text-muted small">
                      Download your complete UPVC profile catalog as a JSON backup file.
                    </p>
                  </div>
                  <div className="card-body p-4">
                    <button
                      className="btn btn-outline-primary px-4 py-2"
                      onClick={handleExportJson}
                      style={{ borderRadius: "8px" }}
                    >
                      Download Catalog JSON Backup ({profiles.length} Profiles)
                    </button>
                  </div>
                </div>

                <div className="card shadow-sm border-0" style={{ borderRadius: "12px" }}>
                  <div className="card-header bg-white border-0 pt-4 px-4 pb-0">
                    <h4 className="font-weight-bold text-dark mb-1">Import Profiles via JSON</h4>
                    <p className="text-muted small">
                      Upload a JSON file containing profile specifications to merge them into your catalog.
                    </p>
                  </div>
                  <div className="card-body p-4">
                    <div className="mb-3">
                      <label className="form-label font-weight-bold">Select JSON File</label>
                      <input
                        type="file"
                        accept=".json"
                        className="form-control p-2"
                        onChange={(e) => setJsonFile(e.target.files[0])}
                        style={{ borderRadius: "8px" }}
                      />
                    </div>
                    <button
                      className="btn btn-success px-4 py-2 mt-2"
                      onClick={handleJsonUpload}
                      disabled={!jsonFile}
                      style={{ borderRadius: "8px" }}
                    >
                      Upload & Merge Profiles
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UploadProfile;

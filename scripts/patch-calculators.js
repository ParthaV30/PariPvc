const fs = require('fs');
const path = require('path');

const files = [
  'slidingWindow.js',
  'casementWindow.js',
  'slidingDoor.js',
  'casementDoor.js',
  'topHung.js',
  'ventilators.js',
  'fixed.js'
];

files.forEach(file => {
  const filePath = path.join(__dirname, '..', 'src', 'pages', file);
  if (!fs.existsSync(filePath)) {
    console.log('File not found:', filePath);
    return;
  }
  let code = fs.readFileSync(filePath, 'utf8');

  // 1. Ensure findLocalDefaultProfile is imported
  if (!code.includes('findLocalDefaultProfile')) {
    code = code.replace(
      /import\s*\{\s*getMergedProfileDetails\s*\}\s*from\s*['"](\.\.\/services\/profileManager)['"];?/,
      'import { getMergedProfileDetails, findLocalDefaultProfile } from "$1";'
    );
  }

  // 2. Enhance handleContinueCalc with local fallback
  const oldCalcRegex = /const handleContinueCalc = async \(\) => {[\s\S]*?closeModal\(\);\s*};/;
  const newCalc = `const handleContinueCalc = async () => {
    try {
      let data = null;
      try {
        const response = await axios.post('https://upvcapi.sninfoserv.com/find-default/', profileDatas);
        if (response.data && response.data.status === 'success' && Array.isArray(response.data.data) && response.data.data.length > 0) {
          data = response.data.data[0];
        }
      } catch (apiErr) {
        // API offline or unauthenticated fallback
      }

      if (!data) {
        const local = findLocalDefaultProfile(profileDatas);
        if (local && local.data && local.data.length > 0) {
          data = local.data[0];
        }
      }

      if (data) {
        if (data.beeding) {
          setSelectedBeedingSeries(data.beedingSeries || series);
          setSelectedBeedingId(data.beeding);
        }
        if (data.frame) {
          setSelectedFrameSeries(data.frameSeries || series);
          setSelectedFrameId(data.frame);
        }
        if (data.mesh) {
          setSelectedMeshSeries(data.meshSeries || series);
          setSelectedMeshId(data.mesh);
        }
        if (data.mullion) {
          setSelectedMullionSeries(data.mullionSeries || series);
          setSelectedMullionId(data.mullion);
        }
        if (data.shutter) {
          setSelectedShutterSeries(data.shutterSeries || series);
          setSelectedShutterId(data.shutter);
        }
        if (data.cupler) {
          setSelectedCuplerSeries(data.cuplerSeries || series);
          setSelectedCuplerId(data.cupler);
        }
        if (data.interLock || data.interlock) {
          if (typeof setSelectedInterLockSeries === 'function') {
            setSelectedInterLockSeries(data.interSeries || series);
            setSelectedInterLockId(data.interlock || data.interLock);
          }
        }
      }
    } catch (error) {
      console.error('Error in handleContinueCalc:', error);
    }
    closeModal();
  };`;

  if (oldCalcRegex.test(code)) {
    code = code.replace(oldCalcRegex, newCalc);
  }

  // 3. Dynamic series options
  const oldSeriesRegex = /<select className="form-control" value={series} onChange={handleSeriesChange}>[\s\S]*?<\/select>/;
  const newSeries = `<select className="form-control" value={series} onChange={handleSeriesChange}>
                            <option value="" hidden>Select Series</option>
                            {profileDetails && profileDetails.data && profileDetails.data[customProfile] && Array.isArray(profileDetails.data[customProfile].profileData) && profileDetails.data[customProfile].profileData.length > 0 ? (
                              profileDetails.data[customProfile].profileData.map((pd, pIdx) => (
                                <option key={pIdx} className="form-control" value={pd.series}>{pd.series}</option>
                              ))
                            ) : (
                              <>
                                <option className="form-control" value="50 Series">50 Series</option>
                                <option className="form-control" value="60 Series">60 Series</option>
                              </>
                            )}
                          </select>`;

  if (oldSeriesRegex.test(code)) {
    code = code.replace(oldSeriesRegex, newSeries);
  }

  // 4. Update handleProfileChange to auto-select series if available
  const oldHandleProfile = /const handleProfileChange = \(event\) => {[\s\S]*?setCustomProfile\(event\.target\.value\);/;
  if (oldHandleProfile.test(code)) {
    code = code.replace(
      oldHandleProfile,
      `const handleProfileChange = (event) => {
    const pIdx = event.target.value;
    setCustomProfile(pIdx);
    if (profileDetails && profileDetails.data && profileDetails.data[pIdx] && Array.isArray(profileDetails.data[pIdx].profileData) && profileDetails.data[pIdx].profileData.length > 0) {
      setSeries(profileDetails.data[pIdx].profileData[0].series);
    }`
    );
  }

  fs.writeFileSync(filePath, code, 'utf8');
  console.log('Successfully patched', file);
});

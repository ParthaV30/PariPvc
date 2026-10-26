import standardProfiles from '../data/standard-profiles.json';
import defaultProfilesAll from '../data/default-profiles-all.json';

const CUSTOM_PROFILES_KEY = 'custom_upvc_profiles';

/**
 * Get all custom profiles stored in localStorage
 */
export function getCustomProfiles() {
  try {
    const raw = localStorage.getItem(CUSTOM_PROFILES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Error reading custom profiles from localStorage:', e);
    return [];
  }
}

/**
 * Save custom profiles to localStorage
 */
export function saveCustomProfiles(profiles) {
  try {
    localStorage.setItem(CUSTOM_PROFILES_KEY, JSON.stringify(profiles));
    return true;
  } catch (e) {
    console.error('Error saving custom profiles to localStorage:', e);
    return false;
  }
}

/**
 * Get all available profiles (Standard 17 profiles + any custom added in admin panel)
 */
export function getAllProfiles() {
  const custom = getCustomProfiles();
  const map = new Map();

  // 1. Add standard profiles from saalaram.app
  if (Array.isArray(standardProfiles)) {
    standardProfiles.forEach((p) => {
      if (p && p.profileName) {
        map.set(p.profileName.toLowerCase(), p);
      }
    });
  }

  // 2. Merge in or overwrite with custom user profiles
  custom.forEach((p) => {
    if (p && p.profileName) {
      map.set(p.profileName.toLowerCase(), p);
    }
  });

  return Array.from(map.values());
}

/**
 * Merge API response with local standard & custom profiles.
 * Guarantees that the profile dropdown is NEVER empty!
 */
export function getMergedProfileDetails(apiResponse) {
  const allAvailable = getAllProfiles();

  if (apiResponse && Array.isArray(apiResponse.data) && apiResponse.data.length > 0) {
    const custom = getCustomProfiles();
    const map = new Map();

    apiResponse.data.forEach((p) => {
      if (p && p.profileName) {
        map.set(p.profileName.toLowerCase(), p);
      }
    });

    // Ensure all standard profiles are present as well
    allAvailable.forEach((p) => {
      if (p && p.profileName && !map.has(p.profileName.toLowerCase())) {
        map.set(p.profileName.toLowerCase(), p);
      }
    });

    custom.forEach((p) => {
      if (p && p.profileName && !map.has(p.profileName.toLowerCase())) {
        map.set(p.profileName.toLowerCase(), p);
      }
    });

    return {
      status: 'success',
      data: Array.from(map.values())
    };
  }

  // Fallback to all standard profiles + custom profiles
  return {
    status: 'success',
    data: allAvailable
  };
}

const CUSTOM_DEFAULTS_KEY = 'custom_default_profiles';

export function getCustomDefaultProfiles() {
  try {
    const raw = localStorage.getItem(CUSTOM_DEFAULTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function saveCustomDefaultProfiles(defaults) {
  try {
    localStorage.setItem(CUSTOM_DEFAULTS_KEY, JSON.stringify(defaults));
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Find default frame/sash/mullion parts for a profile and series
 */
export function findLocalDefaultProfile(profileDatas) {
  if (!profileDatas) return null;
  const { type, profileId, series } = profileDatas;

  // 1. Check custom defaults saved in localStorage first
  const customDefaults = getCustomDefaultProfiles();
  const foundCustom = customDefaults.find((p) => {
    const matchProfile = p.profileId?.toLowerCase() === profileId?.toLowerCase();
    const matchType = !type || !p.type || p.type?.toLowerCase() === type?.toLowerCase();
    const matchSeries = !series || !p.series ||
      p.series?.toLowerCase() === series?.toLowerCase() ||
      p.series?.replace(/\s+/g, '')?.toLowerCase() === series?.replace(/\s+/g, '')?.toLowerCase();
    return matchProfile && matchType && matchSeries;
  });

  if (foundCustom) {
    return {
      status: 'success',
      data: [
        {
          beeding: foundCustom.beading || foundCustom.beeding || '',
          beedingSeries: foundCustom.series || series,
          frame: foundCustom.frame || '',
          frameSeries: foundCustom.series || series,
          mesh: foundCustom.mesh || '',
          meshSeries: foundCustom.series || series,
          mullion: foundCustom.mullion || '',
          mullionSeries: foundCustom.series || series,
          panel: foundCustom.panel || '',
          shutter: foundCustom.shutter || '',
          shutterSeries: foundCustom.series || series,
          cupler: foundCustom.cupler || '',
          cuplerSeries: '',
          interlock: foundCustom.interlock || foundCustom.interLock || '',
          interSeries: foundCustom.series || series
        }
      ]
    };
  }

  // 2. Check standard defaults from saalaram.app (181 default configs)
  const found = defaultProfilesAll.find((p) => {
    const matchType = p.type?.toLowerCase() === type?.toLowerCase();
    const matchProfile = p.profileId?.toLowerCase() === profileId?.toLowerCase();
    const matchSeries = p.series?.toLowerCase() === series?.toLowerCase() ||
                        p.series?.replace(/\s+/g, '')?.toLowerCase() === series?.replace(/\s+/g, '')?.toLowerCase();
    return matchType && matchProfile && matchSeries;
  });

  if (found) {
    return {
      status: 'success',
      data: [
        {
          beeding: found.beading || '',
          beedingSeries: found.series || series,
          frame: found.frame || '',
          frameSeries: found.series || series,
          mesh: found.mesh || '',
          meshSeries: found.series || series,
          mullion: found.mullion || '',
          mullionSeries: found.series || series,
          panel: found.panel || '',
          shutter: found.shutter || '',
          shutterSeries: found.series || series,
          cupler: '',
          cuplerSeries: '',
          interlock: found.interlock || '',
          interSeries: found.series || series
        }
      ]
    };
  }

  // 3. Fallback generic parts if specific combination isn't found
  const baseCode = (profileId || 'PRF').slice(0, 4).toUpperCase();
  return {
    status: 'success',
    data: [
      {
        beeding: `${baseCode}-BEED-01`,
        beedingSeries: series || '50 Series',
        frame: `${baseCode}-FRAME-01`,
        frameSeries: series || '50 Series',
        mesh: '',
        meshSeries: '',
        mullion: `${baseCode}-MULL-01`,
        mullionSeries: series || '50 Series',
        panel: '',
        shutter: `${baseCode}-SASH-01`,
        shutterSeries: series || '50 Series',
        cupler: '',
        cuplerSeries: '',
        interlock: `${baseCode}-INT-01`,
        interSeries: series || '50 Series'
      }
    ]
  };
}

/**
 * Add a new custom profile from the admin panel
 */
export function addCustomProfile(profile) {
  const current = getCustomProfiles();
  const seriesName = profile.series ? profile.series.trim() : "50 Series";
  const profileName = profile.profileName.trim();
  const profilePrefix = (profile.code || profileName.slice(0, 3)).toUpperCase();
  const price = profile.price || "180";

  const newProfile = {
    profileId: profile.profileId || profileName,
    profileName: profileName,
    isCustom: true,
    profileData: profile.profileData || [
      {
        series: seriesName,
        items: profile.items || [
          {
            id: profile.frame || `${profilePrefix}-FR-01`,
            name: `${profileName} Outer Frame`,
            length: "5.9",
            weight: "5.5",
            price: price
          },
          {
            id: profile.shutter || `${profilePrefix}-SH-01`,
            name: `${profileName} Shutter / Sash`,
            length: "5.9",
            weight: "6.0",
            price: String(Number(price) + 15)
          },
          {
            id: profile.mullion || `${profilePrefix}-MUL-01`,
            name: `${profileName} Mullion`,
            length: "5.9",
            weight: "5.8",
            price: String(Number(price) + 10)
          },
          {
            id: profile.beading || `${profilePrefix}-BD-01`,
            name: `${profileName} Glazing Beading`,
            length: "5.9",
            weight: "1.5",
            price: "50"
          },
          {
            id: profile.interlock || `${profilePrefix}-INT-01`,
            name: `${profileName} Interlock Profile`,
            length: "5.9",
            weight: "2.0",
            price: "75"
          }
        ]
      }
    ]
  };

  const updated = [
    ...current.filter((p) => p.profileName.toLowerCase() !== newProfile.profileName.toLowerCase()),
    newProfile
  ];
  saveCustomProfiles(updated);

  // Also save default part mappings for calculations
  const currentDefaults = getCustomDefaultProfiles();
  const newDefaultEntry = {
    profileId: profileName,
    series: seriesName,
    type: profile.type || "SlidingWindow",
    frame: profile.frame || `${profilePrefix}-FR-01`,
    shutter: profile.shutter || `${profilePrefix}-SH-01`,
    mullion: profile.mullion || `${profilePrefix}-MUL-01`,
    beading: profile.beading || `${profilePrefix}-BD-01`,
    interlock: profile.interlock || `${profilePrefix}-INT-01`,
    mesh: profile.mesh || ""
  };

  const updatedDefaults = [
    ...currentDefaults.filter((d) => !(d.profileId.toLowerCase() === profileName.toLowerCase() && d.series.toLowerCase() === seriesName.toLowerCase())),
    newDefaultEntry
  ];
  saveCustomDefaultProfiles(updatedDefaults);

  return newProfile;
}

/**
 * Delete a custom profile
 */
export function deleteCustomProfile(profileName) {
  const current = getCustomProfiles();
  const updated = current.filter((p) => p.profileName.toLowerCase() !== profileName.toLowerCase());
  saveCustomProfiles(updated);
  return true;
}

/**
 * Reset custom profiles
 */
export function resetCustomProfiles() {
  localStorage.removeItem(CUSTOM_PROFILES_KEY);
  return true;
}

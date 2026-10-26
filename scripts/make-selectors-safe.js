const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, '..', 'src', 'pages');
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.js'));

files.forEach(file => {
  const filePath = path.join(pagesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // 1. Safe profileData & selectedProfile access:
  // profileDetails && profileDetails.data && profileDetails.data[customProfile].profileData
  content = content.replace(
    /const\s+profileData\s*=\s*profileDetails\s*&&\s*profileDetails\.data\s*&&\s*profileDetails\.data\[customProfile\]\.profileData;?/g,
    'const profileData = profileDetails?.data?.[customProfile]?.profileData || [];'
  );
  content = content.replace(
    /const\s+selectedProfile\s*=\s*profileDetails\s*&&\s*profileDetails\.data\s*&&\s*profileDetails\.data\[customProfile\]\.profileName;?/g,
    "const selectedProfile = profileDetails?.data?.[customProfile]?.profileName || '';"
  );

  // 2. Safe .price lookups:
  // (seriesData\w+)\.items\.find\((.*?)\)\.price
  content = content.replace(
    /(\bseriesData\w*)\.items\.find\((.*?)\)\.price/g,
    "$1?.items?.find($2)?.price || '0'"
  );

  // 3. Safe .length lookups:
  content = content.replace(
    /(\bseriesData\w*)\.items\.find\((.*?)\)\.length/g,
    "$1?.items?.find($2)?.length || '0'"
  );

  // 4. Safe .weight lookups:
  content = content.replace(
    /(\bseriesData\w*)\.items\.find\((.*?)\)\.weight/g,
    "$1?.items?.find($2)?.weight || '0'"
  );

  // 5. Safe .name lookups:
  content = content.replace(
    /(\bseriesData\w*)\.items\.find\((.*?)\)\.name/g,
    "$1?.items?.find($2)?.name || 'Loading'"
  );

  // 6. Safe .items.map in JSX:
  // (selected\w+Series\s*&&\s*)(seriesData\w+)\.items\.map
  content = content.replace(
    /(selected\w+Series\s*&&\s*)(\bseriesData\w+)\.items\.map/g,
    "$1$2?.items && $2.items.map"
  );

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated safe selectors in: ${file}`);
  }
});

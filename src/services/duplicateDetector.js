// Duplicate Report Detection Service
// Checks for proximity (<300m) and textual similarity within the same category

function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) return null;
  const R = 6371e3; // Earth radius in meters
  const toRad = (x) => (x * Math.PI) / 180;
  const phi1 = toRad(lat1);
  const phi2 = toRad(lat2);
  const deltaPhi = toRad(lat2 - lat1);
  const deltaLambda = toRad(lon2 - lon1);

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c); // Distance in meters
}

function computeWordOverlap(textA, textB) {
  const getTokens = (str) =>
    (str || '')
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(/\s+/)
      .filter((w) => w.length > 3);

  const setA = new Set(getTokens(textA));
  const setB = new Set(getTokens(textB));
  if (setA.size === 0 || setB.size === 0) return 0;

  let common = 0;
  for (const token of setA) {
    if (setB.has(token)) common++;
  }
  return common / Math.max(setA.size, setB.size);
}

export function detectDuplicateReports({
  newReport,
  existingReports = [],
  distanceThresholdMeters = 350
}) {
  const potentialMatches = [];

  for (const existing of existingReports) {
    // Skip resolved reports
    if (existing.status === 'Resolved') continue;

    const isSameCategory = existing.category === newReport.category;
    let distance = null;

    if (newReport.latitude && newReport.longitude && existing.latitude && existing.longitude) {
      distance = calculateHaversineDistance(
        newReport.latitude,
        newReport.longitude,
        existing.latitude,
        existing.longitude
      );
    }

    const titleSim = computeWordOverlap(newReport.title, existing.title);
    const descSim = computeWordOverlap(newReport.description, existing.description);
    const textSim = Math.max(titleSim, descSim);

    let matchReason = '';
    let isMatch = false;

    if (isSameCategory && distance !== null && distance <= distanceThresholdMeters) {
      isMatch = true;
      matchReason = `Similar issue reported ${distance}m away in the same category`;
    } else if (isSameCategory && textSim > 0.4) {
      isMatch = true;
      matchReason = 'High title & description similarity in the same category';
    } else if (distance !== null && distance <= 150 && textSim > 0.25) {
      isMatch = true;
      matchReason = `Located only ${distance}m away with matching keywords`;
    }

    if (isMatch) {
      potentialMatches.push({
        report: existing,
        distanceMeters: distance,
        similarityScore: Math.round(textSim * 100),
        reason: matchReason
      });
    }
  }

  // Sort by closest distance or highest similarity
  potentialMatches.sort((a, b) => {
    if (a.distanceMeters != null && b.distanceMeters != null) {
      return a.distanceMeters - b.distanceMeters;
    }
    return b.similarityScore - a.similarityScore;
  });

  return {
    hasDuplicates: potentialMatches.length > 0,
    matches: potentialMatches
  };
}

// Automated Verification Script for CivicFix Core Services
import { calculatePriorityScore } from '../src/services/priorityScorer.js';
import { detectDuplicateReports } from '../src/services/duplicateDetector.js';
import { INITIAL_REPORTS } from '../src/data/sampleReports.js';
import { db } from '../src/services/db.js';

console.log('--- RUNNING CIVICFIX CORE LOGIC VERIFICATION ---');

// 1. Test Priority Scorer
console.log('\n[1] Testing Priority Scorer:');
const lowScore = calculatePriorityScore({ urgency: 'Low', title: 'Faint graffiti on wall', description: 'Minor marks', locationName: 'Park Ave' });
console.log(`- Low urgency score: ${lowScore.score} (Level: ${lowScore.priorityLevel})`);
if (lowScore.score < 1 || lowScore.score > 3) throw new Error('Low urgency score out of expected range');

const highScore = calculatePriorityScore({
  urgency: 'High',
  title: 'Hazardous water pipe burst causing road collapse near hospital',
  description: 'Major danger to cyclists and hospital ambulance lane',
  locationName: 'Hospital Gate 3',
  upvotes: 4
});
console.log(`- High urgency + Hazard context score: ${highScore.score} (Level: ${highScore.priorityLevel})`);
console.log(`  Reasons:`, highScore.reasons);
if (highScore.score < 7) throw new Error('High hazard score was expected to be >= 7');

// 2. Test Duplicate Detector
console.log('\n[2] Testing Duplicate Detector:');
const newPothole = {
  category: 'roads',
  title: 'Huge deep pothole on Market Street',
  description: 'Deep hole in street causing tire punctures',
  latitude: 37.7834, // ~15 meters from rep-001 (Market & 4th: 37.7833, -122.4089)
  longitude: -122.4088
};

const dupResult = detectDuplicateReports({
  newReport: newPothole,
  existingReports: INITIAL_REPORTS,
  distanceThresholdMeters: 350
});

console.log(`- Duplicate detected? ${dupResult.hasDuplicates}`);
if (!dupResult.hasDuplicates) throw new Error('Expected duplicate detection to flag nearby pothole on Market St');
console.log(`  Top match: ${dupResult.matches[0].report.complaint_id} (${dupResult.matches[0].reason})`);

// 3. Test Distant / Different Issue (No false positive)
const differentIssue = {
  category: 'lighting',
  title: 'Dark streetlight on far north boulevard',
  description: 'Bulb burned out',
  latitude: 37.9500,
  longitude: -122.5500
};
const noDupResult = detectDuplicateReports({
  newReport: differentIssue,
  existingReports: INITIAL_REPORTS,
  distanceThresholdMeters: 350
});
console.log(`- Distant issue detected as duplicate? ${noDupResult.hasDuplicates}`);
if (noDupResult.hasDuplicates) throw new Error('Did not expect distant issue to trigger duplicate');

// 4. Test CSV Export
console.log('\n[3] Testing CSV Export:');
const csv = db.exportReportsCSV(INITIAL_REPORTS);
console.log(`- CSV generated (${csv.split('\n').length} lines)`);
if (!csv.includes('CF-2026-1042') || !csv.includes('Market Street')) {
  throw new Error('CSV missing sample complaint data');
}

console.log('\n All Core Verification Checks Passed Successfully!');

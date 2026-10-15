// Smart Priority Scoring Model
// Generates a transparent, explainable score (1-10) with human-readable rationale

export function calculatePriorityScore({
  urgency = 'Medium',
  title = '',
  description = '',
  locationName = '',
  upvotes = 0,
  createdAt = new Date().toISOString()
}) {
  let score = 0;
  const reasons = [];

  // 1. Base Urgency
  if (urgency === 'High') {
    score += 3;
    reasons.push('High Urgency base (+3)');
  } else if (urgency === 'Medium') {
    score += 2;
    reasons.push('Medium Urgency base (+2)');
  } else {
    score += 1;
    reasons.push('Low Urgency base (+1)');
  }

  // 2. High Hazard Keywords
  const fullText = `${title} ${description} ${locationName}`.toLowerCase();
  const criticalKeywords = ['hazard', 'danger', 'injur', 'accident', 'burst', 'flood', 'electric', 'wire', 'manhole', 'hospital', 'school'];
  const matchedKeywords = criticalKeywords.filter(k => fullText.includes(k));

  if (matchedKeywords.length >= 2) {
    score += 3;
    reasons.push(`Multiple critical safety keywords (${matchedKeywords.slice(0, 2).join(', ')}) (+3)`);
  } else if (matchedKeywords.length === 1) {
    score += 2;
    reasons.push(`Critical safety context (${matchedKeywords[0]}) (+2)`);
  }

  // 3. Community Confirmation / Upvotes
  const communityReports = Math.min(upvotes, 3);
  if (communityReports > 0) {
    score += communityReports;
    reasons.push(`${communityReports} citizen confirmation${communityReports > 1 ? 's' : ''} (+${communityReports})`);
  }

  // 4. Pending Latency (> 48h)
  const reportTime = new Date(createdAt).getTime();
  const ageInHours = (Date.now() - reportTime) / (1000 * 60 * 60);
  if (ageInHours > 48) {
    score += 1;
    reasons.push('Unresolved for > 48 hours (+1)');
  }

  // Clamp score between 1 and 10
  score = Math.max(1, Math.min(10, score));

  let priorityLevel = 'Low';
  if (score >= 8) priorityLevel = 'Critical';
  else if (score >= 6) priorityLevel = 'High';
  else if (score >= 4) priorityLevel = 'Medium';

  return {
    score,
    reasons,
    priorityLevel
  };
}

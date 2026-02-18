// Utility functions for Skill Gap and ATS analysis

export function extractSkills(text) {
  if (!text) return [];
  // Normalize and split on common delimiters, filter stopwords and short words
  const stopwords = new Set(['and','or','the','with','a','an','to','for','of','in','on','at','by','from','is','are']);
  const tokens = text
    .replace(/[\n\r]/g, ' ')
    .split(/[,;/|().\-\n\r]+|\s+/)
    .map(t => t.trim().toLowerCase())
    .filter(t => t.length > 1 && !stopwords.has(t) && !/^\d+$/.test(t));
  // return unique
  return Array.from(new Set(tokens));
}

export function calculateMatch(resumeSkills, jobSkills) {
  const resumeSet = new Set((resumeSkills || []).map(s => s.toLowerCase()));
  const jobSet = Array.from(new Set((jobSkills || []).map(s => s.toLowerCase())));
  const matched = jobSet.filter(s => resumeSet.has(s));
  const missing = jobSet.filter(s => !resumeSet.has(s));
  const totalJobSkills = jobSet.length || 1;
  const matchPercentage = Math.round((matched.length / totalJobSkills) * 100);
  let eligibility = 'Skill Gap Detected';
  if (matchPercentage >= 80) eligibility = 'Highly Eligible';
  else if (matchPercentage >= 60) eligibility = 'Moderately Eligible';

  return { matchPercentage, matched, missing, eligibility };
}

export function detectAgeRequirement(text) {
  if (!text) return { ageRequirementDetected: false };
  const t = text.toLowerCase();
  // Patterns
  const patterns = [
    /age\s*(?:below|under)\s*(\d{1,2})/i,
    /(?:under|below)\s*(\d{1,2})\b/i,
    /maximum age\s*(\d{1,2})/i,
    /age limit\s*(\d{1,2})(?:\s*-\s*(\d{1,2}))?/i,
    /between\s*(\d{1,2})\s*(?:to|and|-)\s*(\d{1,2})\s*years?/i,
    /(\d{1,2})\s*[-–]\s*(\d{1,2})\s*years?/i,
    /(\d{1,2})\s*(?:to|and)\s*(\d{1,2})\s*years?/i
  ];

  for (const re of patterns) {
    const m = t.match(re);
    if (m) {
      // m may have one or two numeric captures
      const nums = m.slice(1).filter(Boolean).map(n => parseInt(n, 10));
      if (nums.length === 1) {
        return { ageRequirementDetected: true, extractedAgeRange: { max: nums[0] }, raw: m[0] };
      } else if (nums.length >= 2) {
        const min = Math.min(nums[0], nums[1]);
        const max = Math.max(nums[0], nums[1]);
        return { ageRequirementDetected: true, extractedAgeRange: { min, max }, raw: m[0] };
      }
    }
  }
  return { ageRequirementDetected: false };
}

export function checkAgeEligibility(userAge, extracted) {
  if (!extracted || !extracted.ageRequirementDetected) {
    return { ageEligibilityStatus: 'No age restriction mentioned' };
  }
  const range = extracted.extractedAgeRange;
  if (!range) return { ageEligibilityStatus: 'No age restriction mentioned' };
  if (range.min !== undefined && range.max !== undefined) {
    const eligible = userAge >= range.min && userAge <= range.max;
    return { ageEligibilityStatus: eligible ? 'Eligible based on age' : 'Not eligible based on age' };
  }
  if (range.max !== undefined) {
    const eligible = userAge <= range.max;
    return { ageEligibilityStatus: eligible ? 'Eligible based on age' : 'Not eligible based on age' };
  }
  return { ageEligibilityStatus: 'No age restriction mentioned' };
}

export function calculateATSScore(resumeText, optionalKeywords = []) {
  const issues = [];
  const text = (resumeText || '').toLowerCase();
  const wordCount = text.split(/\s+/).filter(Boolean).length;

  // Keyword relevance (40%) - compare against optionalKeywords or basic sample keywords
  const baseKeywords = ['team','managed','lead','develop','design','javascript','react','python','sql','aws','cloud','sales','marketing','analysis'];
  const keywords = optionalKeywords.length ? optionalKeywords : baseKeywords;
  const foundKeywords = keywords.filter(k => text.includes(k.toLowerCase()));
  const keywordScore = Math.min(1, foundKeywords.length / keywords.length);

  // Quantifiable results (20%) - presence of numbers or %
  const quantMatches = (text.match(/\d+%?|\b\d{1,4}\b/g) || []).length;
  const quantScore = Math.min(1, quantMatches / 3);

  // Structure (20%) - detect section headings
  const sections = ['summary','skills','experience','education'];
  const foundSections = sections.filter(s => text.includes(s));
  const structureScore = foundSections.length / sections.length;

  // Length optimization (20%) - ideal 300-700 words
  let lengthScore = 0;
  if (wordCount >= 300 && wordCount <= 700) lengthScore = 1;
  else if (wordCount > 700) lengthScore = Math.max(0, 1 - (wordCount - 700) / 1000);
  else lengthScore = Math.max(0, wordCount / 300);

  const totalScore = Math.round((keywordScore * 40) + (quantScore * 20) + (structureScore * 20) + (lengthScore * 20));

  if (foundKeywords.length === 0) issues.push('No job-relevant keywords detected');
  if (quantMatches === 0) issues.push('No quantifiable achievements detected');
  if (foundSections.length < sections.length) issues.push('Missing some common sections: ' + sections.filter(s=>!foundSections.includes(s)).join(', '));
  if (wordCount < 150) issues.push('Resume appears very short (<150 words)');

  const suggestions = [];
  if (foundKeywords.length < Math.ceil(keywords.length / 3)) suggestions.push('Include more job-relevant keywords');
  if (quantMatches === 0) suggestions.push('Add quantifiable achievements with numbers and %');
  if (foundSections.length < sections.length) suggestions.push('Add missing sections like Summary, Skills, Experience, Education');
  if (wordCount < 300) suggestions.push('Expand resume content to better showcase experience');

  return { score: totalScore, issues, suggestions, details: { foundKeywords, quantMatches, foundSections, wordCount } };
}

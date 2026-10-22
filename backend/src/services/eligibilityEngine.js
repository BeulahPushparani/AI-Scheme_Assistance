/**
 * Deterministic eligibility engine.
 *
 * Inputs:  userProfile (from Profile collection), scheme (from Scheme collection)
 * Output:  { status, score, matched[], unmatched[], missing[], summary }
 *
 * Rules are evaluated in order. Any rule can be:
 *   - matched       → profile satisfies rule
 *   - unmatched     → profile violates rule
 *   - missing       → profile lacks data needed to check
 *   - not_applicable→ rule doesn't apply to this profile (e.g. farmer rule for student)
 */

// ---------- Age helper ----------
function calculateAge(dateOfBirth) {
  if (!dateOfBirth) return null;
  const dob = new Date(dateOfBirth);
  if (isNaN(dob.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
  return age;
}

// ---------- Formatting helpers ----------
const inr = (n) => `₹${Number(n).toLocaleString("en-IN")}`;
const titleCase = (s = "") =>
  String(s).replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

// ---------- Individual rule evaluators ----------
// Each returns: { status: 'matched'|'unmatched'|'missing'|'not_applicable', label }

function evalCategory(cfg, profile) {
  if (!profile.category) return { status: "missing", label: "Category not provided" };
  const ok = cfg.allowed?.includes(profile.category);
  return ok
    ? { status: "matched", label: `You are a ${titleCase(profile.category)}` }
    : { status: "unmatched", label: `This scheme is for ${cfg.allowed?.map(titleCase).join(", ")}` };
}

function evalState(cfg, profile) {
  if (!profile.state) return { status: "missing", label: "State not provided" };
  const ok = cfg.allowed?.includes(profile.state);
  return ok
    ? { status: "matched", label: `You are from ${profile.state}` }
    : { status: "unmatched", label: `Only for residents of ${cfg.allowed?.join(", ")}` };
}

function evalGender(cfg, profile) {
  if (!profile.gender) return { status: "missing", label: "Gender not provided" };
  const ok = cfg.allowed?.includes(profile.gender);
  return ok
    ? { status: "matched", label: `Gender matches (${titleCase(profile.gender)})` }
    : { status: "unmatched", label: `Only for ${cfg.allowed?.map(titleCase).join(", ")}` };
}

function evalAge(cfg, profile) {
  const age = calculateAge(profile.dateOfBirth);
  if (age === null) return { status: "missing", label: "Date of birth not provided" };

  const min = cfg.min ?? 0;
  const max = cfg.max ?? 200;
  const ok = age >= min && age <= max;

  return ok
    ? { status: "matched", label: `Your age (${age}) is within ${min}–${max}` }
    : { status: "unmatched", label: `Age must be between ${min} and ${max} (you are ${age})` };
}

function evalIncome(cfg, profile) {
  if (profile.annualFamilyIncome === null || profile.annualFamilyIncome === undefined) {
    return { status: "missing", label: "Annual income not provided" };
  }
  const ok = Number(profile.annualFamilyIncome) <= Number(cfg.maxAnnual);
  return ok
    ? {
        status: "matched",
        label: `Income ${inr(profile.annualFamilyIncome)} is within ${inr(cfg.maxAnnual)} limit`,
      }
    : {
        status: "unmatched",
        label: `Income must not exceed ${inr(cfg.maxAnnual)}`,
      };
}

function evalEducation(cfg, profile) {
  const level =
    profile.student?.educationLevel ||
    profile.jobSeeker?.highestEducation ||
    null;
  if (!level) return { status: "missing", label: "Education level not provided" };
  const ok = cfg.allowed?.includes(level);
  return ok
    ? { status: "matched", label: `Your education level matches` }
    : { status: "unmatched", label: `Requires education level: ${cfg.allowed?.map(titleCase).join(", ")}` };
}

function evalCommunity(cfg, profile) {
  if (!profile.community) return { status: "missing", label: "Community not provided" };
  const ok = cfg.allowed?.includes(profile.community);
  return ok
    ? { status: "matched", label: `Your community (${profile.community.toUpperCase()}) is eligible` }
    : { status: "unmatched", label: `Reserved for ${cfg.allowed?.map((c) => c.toUpperCase()).join(", ")}` };
}

function evalFarmer(cfg, profile) {
  if (profile.category !== "farmer") return { status: "not_applicable" };
  if (!profile.farmer?.farmerType)
    return { status: "missing", label: "Farmer type not provided" };
  const ok = cfg.farmerTypes?.includes(profile.farmer.farmerType);
  return ok
    ? { status: "matched", label: `Your farmer type (${titleCase(profile.farmer.farmerType)}) is eligible` }
    : { status: "unmatched", label: `Requires farmer type: ${cfg.farmerTypes?.map(titleCase).join(", ")}` };
}

function evalWoman(cfg, profile) {
  // Check the specific field asked by the rule
  const checks = [];
  if (cfg.maritalStatus) {
    if (!profile.woman?.maritalStatus)
      checks.push({ ok: false, missing: true, label: "Marital status not provided" });
    else
      checks.push({
        ok: profile.woman.maritalStatus === cfg.maritalStatus,
        label: `Marital status must be ${titleCase(cfg.maritalStatus)}`,
      });
  }
  if (cfg.employmentStatus) {
    if (!profile.woman?.employmentStatus)
      checks.push({ ok: false, missing: true, label: "Employment status not provided" });
    else
      checks.push({
        ok: profile.woman.employmentStatus === cfg.employmentStatus,
        label: `Employment status must be ${titleCase(cfg.employmentStatus)}`,
      });
  }
  if (cfg.isHeadOfHousehold === true) {
    if (profile.woman?.isHeadOfHousehold === null || profile.woman?.isHeadOfHousehold === undefined)
      checks.push({ ok: false, missing: true, label: "Head-of-household not confirmed" });
    else
      checks.push({
        ok: profile.woman.isHeadOfHousehold === true,
        label: "Must be head of household",
      });
  }

  if (checks.length === 0) return { status: "not_applicable" };

  if (checks.some((c) => c.missing)) {
    return { status: "missing", label: checks.find((c) => c.missing).label };
  }
  if (checks.every((c) => c.ok)) {
    return { status: "matched", label: "Your details match this scheme" };
  }
  return { status: "unmatched", label: checks.find((c) => !c.ok).label };
}

function evalJobSeeker(cfg, profile) {
  if (!cfg.employmentStatus) return { status: "not_applicable" };
  if (!profile.jobSeeker?.employmentStatus)
    return { status: "missing", label: "Employment status not provided" };
  const ok = profile.jobSeeker.employmentStatus === cfg.employmentStatus;
  return ok
    ? { status: "matched", label: `Your employment status (${titleCase(profile.jobSeeker.employmentStatus)}) matches` }
    : { status: "unmatched", label: `Requires employment status: ${titleCase(cfg.employmentStatus)}` };
}

function evalEntrepreneur(cfg, profile) {
  if (!cfg.businessStage) return { status: "not_applicable" };
  if (!profile.entrepreneur?.businessStage)
    return { status: "missing", label: "Business stage not provided" };
  const ok = profile.entrepreneur.businessStage === cfg.businessStage;
  return ok
    ? { status: "matched", label: `Your business stage (${titleCase(profile.entrepreneur.businessStage)}) matches` }
    : { status: "unmatched", label: `Requires business stage: ${titleCase(cfg.businessStage)}` };
}

function evalSenior(cfg, profile) {
  if (!cfg.pensionStatus) return { status: "not_applicable" };
  if (!profile.senior?.pensionStatus)
    return { status: "missing", label: "Pension status not provided" };
  const ok = profile.senior.pensionStatus === cfg.pensionStatus;
  return ok
    ? { status: "matched", label: "Pension status matches" }
    : { status: "unmatched", label: `Requires pension status: ${titleCase(cfg.pensionStatus)}` };
}

// ---------- Dispatch table ----------
const EVALUATORS = {
  category: evalCategory,
  state: evalState,
  gender: evalGender,
  age: evalAge,
  income: evalIncome,
  education: evalEducation,
  community: evalCommunity,
  farmer: evalFarmer,
  woman: evalWoman,
  jobSeeker: evalJobSeeker,
  entrepreneur: evalEntrepreneur,
  senior: evalSenior,
};

// ---------- Main engine ----------
export function evaluateScheme(profile, scheme) {
  const rules = scheme.eligibilityRules || {};
  const matched = [];
  const unmatched = [];
  const missing = [];

  let totalWeight = 0;
  let matchedWeight = 0;
  let mandatoryFailed = false;
  let mandatoryMissing = false;

  for (const [ruleKey, cfg] of Object.entries(rules)) {
    if (!cfg || typeof cfg !== "object") continue;
    const evaluator = EVALUATORS[ruleKey];
    if (!evaluator) continue; // unknown rule → skip silently

    const weight = Number(cfg.weight) || 10;
    const result = evaluator(cfg, profile);

    if (result.status === "not_applicable") continue;

    totalWeight += weight;

    const entry = {
      rule: ruleKey,
      label: result.label,
      weight,
      mandatory: Boolean(cfg.mandatory),
    };

    if (result.status === "matched") {
      matchedWeight += weight;
      matched.push(entry);
    } else if (result.status === "unmatched") {
      unmatched.push(entry);
      if (cfg.mandatory) mandatoryFailed = true;
    } else if (result.status === "missing") {
      missing.push(entry);
      if (cfg.mandatory) mandatoryMissing = true;
    }
  }

  // ---- Score ----
  let score = totalWeight > 0 ? Math.round((matchedWeight / totalWeight) * 100) : 0;

  // ---- Status ----
  let status;
  if (mandatoryFailed) {
    status = "not_eligible";
    score = Math.min(score, 45); // cap low if mandatory fails
  } else if (mandatoryMissing) {
    status = "possibly_eligible";
  } else if (unmatched.length === 0 && missing.length === 0) {
    status = "eligible";
  } else {
    status = "possibly_eligible";
  }

  // ---- Summary ----
  const summary =
    status === "eligible"
      ? `You appear to match all ${matched.length} criteria for this scheme.`
      : status === "possibly_eligible"
      ? `You match ${matched.length} of ${matched.length + unmatched.length + missing.length} criteria. Some details need verification.`
      : `This scheme requires criteria you currently don't meet.`;

  return { status, score, matched, unmatched, missing, summary };
}

/**
 * Analyze a profile against many schemes.
 * Returns array of enriched scheme objects, sorted by score (desc).
 */
export function analyzeAllSchemes(profile, schemes) {
  const results = schemes.map((scheme) => {
    const evaluation = evaluateScheme(profile, scheme);
    return { scheme, ...evaluation };
  });

  // Sort: eligible first, then possibly_eligible, then not_eligible; within group by score desc
  const order = { eligible: 0, possibly_eligible: 1, not_eligible: 2 };
  results.sort((a, b) => {
    if (order[a.status] !== order[b.status]) return order[a.status] - order[b.status];
    return b.score - a.score;
  });

  return results;
}
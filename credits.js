// =====================================================================
// credits.js — the pricing "brain" of the Credit Calculator.
//
// Everything about prices lives in this one file. The web page (index.html)
// uses it to show results, and the tests (credits.test.js) check it.
// If you change a number here, GitHub re-runs the tests automatically.
// =====================================================================

const Credits = (() => {
  // ---- Plans (example prices; change them here) ----------------------
  const PLANS = {
    free:    { name: "Free",    price: 0,  credits: 100 },
    creator: { name: "Creator", price: 19, credits: 600 },
    pro:     { name: "Pro",     price: 49, credits: 2000 },
  };

  // ---- What each action costs ----------------------------------------
  // credits = what the user pays in credits, per unit
  // cost    = what WE pay the AI companies, in dollars, per unit
  const ACTIONS = {
    transcribe:  { name: "Transcribe",                unit: "minute",      credits: 1,  cost: 0.0045 },
    clip:        { name: "Find clips",                unit: "minute",      credits: 2,  cost: 0.012 },
    style:       { name: "Style import",              unit: "run",         credits: 40, cost: 0.35 },
    reference:   { name: "Famous-reference analysis", unit: "run",         credits: 50, cost: 0.45 },
    transitions: { name: "Smart transitions",         unit: "run",         credits: 5,  cost: 0.03 },
    morph:       { name: "AI morph transition",       unit: "transition",  credits: 30, cost: 0.25 },
    thumbnail:   { name: "Thumbnail set",             unit: "set",         credits: 90, cost: 0.85 },
    ideas:       { name: "Ideas & titles",            unit: "request",     credits: 5,  cost: 0.05 },
    upscale:     { name: "Upscale to 1080p",          unit: "minute",      credits: 60, cost: 4.80 },
  };

  // We want each action to bring in at least 3x what it costs us.
  const HEALTHY_MARGIN = 3;

  // A typical month for one creator, used as the page's starting example.
  const EXAMPLE_MONTH = {
    transcribe: 60, clip: 60, style: 1, reference: 1, transitions: 2,
    morph: 2, thumbnail: 2, ideas: 6, upscale: 0,
  };

  // ---- Helpers --------------------------------------------------------
  const cents = (n) => Math.round(n * 100) / 100;

  function getPlan(planId) {
    const plan = PLANS[planId];
    if (!plan) throw new Error(`Unknown plan: ${planId}`);
    return plan;
  }

  function getAction(actionId) {
    const action = ACTIONS[actionId];
    if (!action) throw new Error(`Unknown action: ${actionId}`);
    return action;
  }

  // Anything that isn't a positive number (blank, negative, text) counts as 0.
  function cleanQuantity(qty) {
    const n = Number(qty);
    return Number.isFinite(n) && n > 0 ? n : 0;
  }

  // Credits for one line, always rounded UP to a whole credit.
  function lineCredits(actionId, qty) {
    return Math.ceil(cleanQuantity(qty) * getAction(actionId).credits);
  }

  // What one credit is worth in dollars on a plan.
  function creditValue(planId) {
    const plan = getPlan(planId);
    return plan.price / plan.credits;
  }

  // Does this action make money on this plan?
  function margin(planId, actionId) {
    const action = getAction(actionId);
    const value = creditValue(planId);
    if (value === 0) return { ratio: null, status: "free" };
    const ratio = (action.credits * value) / action.cost;
    const status = ratio >= HEALTHY_MARGIN ? "healthy" : ratio >= 1 ? "thin" : "loses";
    return { ratio: Math.round(ratio * 10) / 10, status };
  }

  // The full picture for one month of usage on one plan.
  function summarize(planId, usage = {}) {
    const plan = getPlan(planId);
    let used = 0;
    let costExact = 0;
    const lines = Object.keys(ACTIONS).map((id) => {
      const qty = cleanQuantity(usage[id]);
      const credits = lineCredits(id, qty);
      const cost = qty * ACTIONS[id].cost;
      used += credits;
      costExact += cost;
      return { id, qty, credits, cost: cents(cost) };
    });
    return {
      plan,
      lines,
      creditsUsed: used,
      creditsIncluded: plan.credits,
      creditsLeft: Math.max(0, plan.credits - used),
      overBy: Math.max(0, used - plan.credits),
      percentUsed: Math.round((used / plan.credits) * 100),
      ourCost: cents(costExact),
      revenue: plan.price,
      profit: cents(plan.price - costExact),
    };
  }

  return {
    PLANS, ACTIONS, HEALTHY_MARGIN, EXAMPLE_MONTH,
    cleanQuantity, lineCredits, creditValue, margin, summarize,
  };
})();

// Lets the tests load this file. (The web page ignores this line.)
if (typeof module !== "undefined") module.exports = Credits;

// =====================================================================
// credits.test.js — automatic checks for credits.js.
//
// GitHub runs these every time anything changes. Each "test" below is one
// promise the code must keep. If a change breaks a promise, GitHub shows a
// red X and names the test that failed.
// =====================================================================

const test = require("node:test");
const assert = require("node:assert");
const Credits = require("./credits.js");

test("transcribing 10 minutes costs 10 credits", () => {
  assert.strictEqual(Credits.lineCredits("transcribe", 10), 10);
});

test("finding clips in a 30-minute video costs 60 credits", () => {
  assert.strictEqual(Credits.lineCredits("clip", 30), 60);
});

test("partial units are rounded up to a whole credit", () => {
  assert.strictEqual(Credits.lineCredits("transcribe", 2.5), 3);
});

test("blank, negative or text quantities count as zero", () => {
  assert.strictEqual(Credits.lineCredits("transcribe", ""), 0);
  assert.strictEqual(Credits.lineCredits("transcribe", -5), 0);
  assert.strictEqual(Credits.lineCredits("transcribe", "abc"), 0);
});

test("the example month adds up correctly on the Creator plan", () => {
  const s = Credits.summarize("creator", Credits.EXAMPLE_MONTH);
  assert.strictEqual(s.creditsUsed, 550);
  assert.strictEqual(s.creditsLeft, 50);
  assert.strictEqual(s.overBy, 0);
  assert.strictEqual(s.percentUsed, 92);
  assert.strictEqual(s.ourCost, 4.35);
  assert.strictEqual(s.profit, 14.65);
});

test("going over the plan shows how many credits are missing", () => {
  const s = Credits.summarize("free", { transcribe: 130 });
  assert.strictEqual(s.creditsUsed, 130);
  assert.strictEqual(s.creditsLeft, 0);
  assert.strictEqual(s.overBy, 30);
});

test("an empty month uses nothing and costs nothing", () => {
  const s = Credits.summarize("pro");
  assert.strictEqual(s.creditsUsed, 0);
  assert.strictEqual(s.ourCost, 0);
  assert.strictEqual(s.profit, 49);
});

test("an unknown plan gives a clear error", () => {
  assert.throws(() => Credits.summarize("platinum", {}), /Unknown plan/);
});

test("thumbnails are healthy on Creator but upscaling loses money", () => {
  assert.strictEqual(Credits.margin("creator", "thumbnail").status, "healthy");
  assert.strictEqual(Credits.margin("creator", "upscale").status, "loses");
});

test("the Free plan has no margin to check", () => {
  assert.deepStrictEqual(Credits.margin("free", "clip"), { ratio: null, status: "free" });
});

test("every plan and action has sensible numbers (catches typos)", () => {
  for (const [id, p] of Object.entries(Credits.PLANS)) {
    assert.ok(p.credits > 0, `${id} must include some credits`);
    assert.ok(p.price >= 0, `${id} price can't be negative`);
  }
  for (const [id, a] of Object.entries(Credits.ACTIONS)) {
    assert.ok(a.credits > 0, `${id} must cost at least 1 credit`);
    assert.ok(a.cost > 0, `${id} must have a real cost to us`);
  }
});

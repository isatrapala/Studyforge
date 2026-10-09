// src/lib/pricingData.js
//
// Static data for Week 3: the product feature map, the 3 pricing tiers, the
// 2 customer segments, the scenario presets, and the assumptions table.
// All prices are in MXN. These are the student's OWN assumptions for a
// simulation, not real market data.

export const CURRENCY = "MXN";

export const TIERS = [
  {
    id: "free",
    name: "Free",
    priceMonthly: 0,
    tagline: "Try the core idea",
    highlights: ["Core extraction", "Save up to 3 outputs"],
  },
  {
    id: "plus",
    name: "Plus",
    priceMonthly: 79,
    tagline: "For regular students",
    highlights: ["Unlimited saved outputs", "Study order export", "Research log"],
  },
  {
    id: "pro",
    name: "Pro",
    priceMonthly: 149,
    tagline: "For power users",
    highlights: ["Everything in Plus", "Priority features", "Future real-AI mode"],
  },
];

export const SEGMENTS = [
  {
    id: "individual",
    name: "Individual students",
    description: "University students who pay for themselves, month to month.",
    model: "Pay per user per month (Free / Plus / Pro).",
  },
  {
    id: "b2b",
    name: "Universities and schools (B2B)",
    description: "An institution that buys seats for its students.",
    model: "Pay per seat per month.",
  },
];

// Feature map: which tier includes which feature.
// true = included, false = not included.
export const FEATURES = [
  { name: "Core extraction (topic, key concepts, study order)", free: true, plus: true, pro: true },
  { name: "Save outputs to the cloud", free: "Up to 3", plus: "Unlimited", pro: "Unlimited" },
  { name: "Research log", free: false, plus: true, pro: true },
  { name: "Study order export", free: false, plus: true, pro: true },
  { name: "Priority features", free: false, plus: false, pro: true },
  { name: "Real-AI mode (future)", free: false, plus: false, pro: true },
  { name: "Seats for a whole school (B2B)", free: false, plus: false, pro: false, b2b: true },
];

export const B2B_DEFAULT_PRICE_PER_SEAT = 99;

// Scenario presets. Each one fills the calculator with a full set of inputs.
export const SCENARIOS = {
  conservative: {
    label: "Conservative",
    inputs: {
      users: 500,
      freePct: 85,
      plusPct: 10,
      proPct: 5,
      schools: 1,
      seatsPerSchool: 150,
      pricePerSeat: B2B_DEFAULT_PRICE_PER_SEAT,
    },
  },
  expected: {
    label: "Expected",
    inputs: {
      users: 1000,
      freePct: 70,
      plusPct: 20,
      proPct: 10,
      schools: 2,
      seatsPerSchool: 300,
      pricePerSeat: B2B_DEFAULT_PRICE_PER_SEAT,
    },
  },
  optimistic: {
    label: "Optimistic",
    inputs: {
      users: 2500,
      freePct: 60,
      plusPct: 25,
      proPct: 15,
      schools: 4,
      seatsPerSchool: 500,
      pricePerSeat: B2B_DEFAULT_PRICE_PER_SEAT,
    },
  },
};

export const SCENARIO_ORDER = ["conservative", "expected", "optimistic"];

// Assumptions table shown on /pricing. These are guesses, labeled as such.
export const ASSUMPTIONS = [
  { name: "Plus price", value: "MXN 79 per month", why: "Close to what a student can spend on one study app." },
  { name: "Pro price", value: "MXN 149 per month", why: "About double Plus, for users who want more." },
  { name: "B2B price", value: "MXN 99 per seat per month", why: "A school pays a little more per seat but gets support." },
  { name: "Share of paying users", value: "15% to 40% depending on scenario", why: "Own guess. Not measured yet." },
  { name: "Annual revenue", value: "Monthly revenue x 12", why: "Simple rule. No churn, no growth, no discounts." },
  { name: "Left out on purpose", value: "Payments, taxes, churn, discounts", why: "Out of scope for this week." },
];

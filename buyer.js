// buyer.js — single source of truth for the buyer's identity across the prototype.
// Captured on Sign-up, read on Confirmation/Define/Measure, falls back to a default.

(function () {
  const DEFAULT_BUYER = {
    fullName: "Priya Ramesh",
    email: "priya@northbeam.com",
    company: "Northbeam",
    role: "Head of L&D",
    intent: "",
  };

  let saved = null;
  try {
    const raw = localStorage.getItem("cs-buyer");
    if (raw) saved = JSON.parse(raw);
  } catch (e) { /* ignore */ }

  const buyer = Object.assign({}, DEFAULT_BUYER, saved || {});

  // Derived
  const initialsOf = (s) => (s || "")
    .split(/\s+/)
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  buyer.initials = initialsOf(buyer.fullName) || "GU";
  buyer.companyInitials = initialsOf(buyer.company) || "WS";
  buyer.firstName = (buyer.fullName || "").split(/\s+/)[0] || "there";

  window.BUYER = buyer;

  // Helper used by Sign-up form
  window.saveBuyer = function (updates) {
    const raw = ["fullName", "email", "company", "role", "intent"].reduce((acc, k) => {
      if (updates[k] != null) acc[k] = updates[k];
      return acc;
    }, {});
    const next = Object.assign({}, buyer, raw);
    delete next.initials;
    delete next.companyInitials;
    delete next.firstName;
    try { localStorage.setItem("cs-buyer", JSON.stringify(next)); } catch (e) {}
  };

  // Helper to clear (for demo reset)
  window.resetBuyer = function () {
    try { localStorage.removeItem("cs-buyer"); } catch (e) {}
  };
})();

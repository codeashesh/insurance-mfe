const POLICIES_KEY = "insurance_policies";
const PAYMENTS_KEY = "insurance_payments";

const defaultPolicies = [
  {
    id: "POL-001",
    holderName: "John Doe",
    type: "Health",
    coverageAmount: 500000,
    premiumAmount: 1200,
    status: "Active",
    nextDueDate: "2026-04-01",
  },
  {
    id: "POL-002",
    holderName: "John Doe",
    type: "Life",
    coverageAmount: 1000000,
    premiumAmount: 2500,
    status: "Active",
    nextDueDate: "2026-05-15",
  },
  {
    id: "POL-003",
    holderName: "John Doe",
    type: "Auto",
    coverageAmount: 200000,
    premiumAmount: 800,
    status: "Active",
    nextDueDate: "2026-03-20",
  },
  {
    id: "POL-004",
    holderName: "John Doe",
    type: "Home",
    coverageAmount: 750000,
    premiumAmount: 1500,
    status: "Lapsed",
    nextDueDate: "2026-02-01",
  },
  {
    id: "POL-005",
    holderName: "John Doe",
    type: "Travel",
    coverageAmount: 100000,
    premiumAmount: 450,
    status: "Active",
    nextDueDate: "2026-06-10",
  },
];

const defaultPayments = [
  {
    id: "PAY-001",
    policyId: "POL-001",
    amount: 1200,
    date: "2026-01-15",
    receiptNo: "REC-20260115-001",
  },
  {
    id: "PAY-002",
    policyId: "POL-002",
    amount: 2500,
    date: "2026-02-10",
    receiptNo: "REC-20260210-002",
  },
];

export function seedData() {
  if (!localStorage.getItem(POLICIES_KEY)) {
    localStorage.setItem(POLICIES_KEY, JSON.stringify(defaultPolicies));
  }
  if (!localStorage.getItem(PAYMENTS_KEY)) {
    localStorage.setItem(PAYMENTS_KEY, JSON.stringify(defaultPayments));
  }
}

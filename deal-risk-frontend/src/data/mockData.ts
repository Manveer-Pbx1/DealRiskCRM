import { Deal } from "../types";

export const mockDeals: Deal[] = [
  {
    id: "1",
    name: "TechNova Renewal",
    company: "TechNova Ltd.",
    owner: "Sarah Johnson",
    lastContact: "2025-09-28",
    engagementScore: 25,
    riskLevel: "High",
    reason: "No contact in 12 days; engagement dropped 40%",
    riskScore: 84,
    actions: [
      "Call the main buyer within 24 hours.",
      "Send a follow-up email with pricing options.",
      "Flag legal to expedite contract review.",
    ],
  },
  {
    id: "2",
    name: "GreenEdge Expansion",
    company: "GreenEdge Inc.",
    owner: "Aman Gupta",
    lastContact: "2025-10-08",
    engagementScore: 70,
    riskLevel: "Medium",
    reason: "Pending legal review; moderate buyer engagement.",
    riskScore: 58,
    actions: [
      "Share updated contract with buyer.",
      "Check-in with legal for status update.",
      "Schedule product demo refresh call.",
    ],
  },
  {
    id: "3",
    name: "Cloudify Integration",
    company: "Cloudify Systems",
    owner: "Nina Patel",
    lastContact: "2025-10-09",
    engagementScore: 90,
    riskLevel: "Low",
    reason: "Consistent contact and positive buyer sentiment.",
    riskScore: 22,
    actions: [
      "Send thank-you follow-up.",
      "Prepare renewal documentation early.",
      "Add case study for cross-sell opportunities.",
    ],
  },
];

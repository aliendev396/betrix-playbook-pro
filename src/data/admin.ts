export interface AdminUser {
  id: string;
  name: string;
  username: string;
  email: string;
  role: "USER" | "ADMIN" | "PARTNER";
  status: "ACTIVE" | "SUSPENDED";
  points: number;
  slips: number;
  joined: string;
}

export interface PartnerRecord {
  id: string;
  name: string;
  code: string;
  signups: number;
  activeUsers: number;
  slipsDriven: number;
  rewardPoints: number;
  tier: "Bronze" | "Silver" | "Gold";
}

export const adminUsers: AdminUser[] = [
  { id: "u1", name: "Kwame Mensah", username: "kwame", email: "kwame@betrix.app", role: "USER", status: "ACTIVE", points: 12450, slips: 34, joined: "2026-01-12" },
  { id: "u2", name: "Ama Owusu", username: "ama", email: "ama@betrix.app", role: "PARTNER", status: "ACTIVE", points: 28800, slips: 91, joined: "2025-11-04" },
  { id: "u3", name: "Daniel Adjei", username: "dadjei", email: "daniel@betrix.app", role: "USER", status: "ACTIVE", points: 5120, slips: 12, joined: "2026-02-18" },
  { id: "u4", name: "Nadia Farouk", username: "nadia", email: "nadia@betrix.app", role: "ADMIN", status: "ACTIVE", points: 40000, slips: 8, joined: "2025-08-22" },
  { id: "u5", name: "Tomás Silva", username: "tsilva", email: "tomas@betrix.app", role: "USER", status: "SUSPENDED", points: 300, slips: 57, joined: "2025-12-30" },
  { id: "u6", name: "Grace Boateng", username: "graceb", email: "grace@betrix.app", role: "USER", status: "ACTIVE", points: 19240, slips: 46, joined: "2026-03-09" },
  { id: "u7", name: "Ibrahim Sow", username: "isow", email: "ibrahim@betrix.app", role: "PARTNER", status: "ACTIVE", points: 15600, slips: 23, joined: "2026-01-27" },
  { id: "u8", name: "Lena Fischer", username: "lenaf", email: "lena@betrix.app", role: "USER", status: "ACTIVE", points: 8975, slips: 19, joined: "2026-04-02" },
];

export const partners: PartnerRecord[] = [
  { id: "p1", name: "Ama Owusu", code: "BTX-AMA", signups: 412, activeUsers: 268, slipsDriven: 3140, rewardPoints: 62000, tier: "Gold" },
  { id: "p2", name: "Ibrahim Sow", code: "BTX-SOW", signups: 187, activeUsers: 96, slipsDriven: 1120, rewardPoints: 24500, tier: "Silver" },
  { id: "p3", name: "PitchTalk Media", code: "BTX-PITCH", signups: 96, activeUsers: 51, slipsDriven: 640, rewardPoints: 11800, tier: "Bronze" },
  { id: "p4", name: "Terrace Podcast", code: "BTX-TERRACE", signups: 58, activeUsers: 30, slipsDriven: 402, rewardPoints: 7300, tier: "Bronze" },
];

export const growthSeries = [
  { label: "Mon", users: 120, slips: 340 },
  { label: "Tue", users: 168, slips: 402 },
  { label: "Wed", users: 145, slips: 388 },
  { label: "Thu", users: 210, slips: 520 },
  { label: "Fri", users: 288, slips: 690 },
  { label: "Sat", users: 402, slips: 980 },
  { label: "Sun", users: 356, slips: 870 },
];

export const auditLog = [
  { id: "a1", actor: "nadia", action: "Settled slips for Matchday 12", at: "Today 08:14" },
  { id: "a2", actor: "system", action: "Auto-voided 2 selections (match postponed)", at: "Today 07:02" },
  { id: "a3", actor: "nadia", action: "Suspended account tsilva (abuse review)", at: "Yesterday 19:41" },
  { id: "a4", actor: "system", action: "Granted 500 daily bonus points to 1,204 users", at: "Yesterday 00:00" },
  { id: "a5", actor: "nadia", action: "Published market: Both Teams To Score", at: "Mon 15:22" },
];

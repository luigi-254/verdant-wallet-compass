export function formatKES(value: number | string | null | undefined) {
  const n = Number(value ?? 0);
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 2,
  }).format(Number.isFinite(n) ? n : 0);
}

export function formatDate(value: string | null | undefined) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-KE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(value: string | null | undefined) {
  if (!value) return "—";
  return new Date(value).toLocaleString("en-KE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function shortRef(value: string | null | undefined) {
  if (!value) return "—";
  return value.length > 14 ? `${value.slice(0, 12)}…` : value;
}

const CATEGORY_LABELS: Record<string, string> = {
  surveys: "Surveys",
  social_media: "Social Media",
  data_entry: "Data Entry",
  research: "Research",
  content: "Content Tasks",
  simple: "Simple Tasks",
};

export function categoryLabel(value: string) {
  return CATEGORY_LABELS[value] ?? value;
}

export const TASK_CATEGORIES = Object.keys(CATEGORY_LABELS);

const TYPE_LABELS: Record<string, string> = {
  task_reward: "Task Reward",
  withdrawal: "Withdrawal",
  deposit: "Deposit",
  referral_bonus: "Referral Bonus",
};

export function typeLabel(value: string) {
  return TYPE_LABELS[value] ?? value;
}

export function titleCase(value: string) {
  return value
    .split("_")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
}

/** Normalises Kenyan phone input to 2547XXXXXXXX where possible. */
export function normalizePhone(input: string) {
  const digits = input.replace(/\D/g, "");
  if (digits.startsWith("254")) return digits;
  if (digits.startsWith("0")) return `254${digits.slice(1)}`;
  if (digits.length === 9) return `254${digits}`;
  return digits;
}

export function isValidKenyanPhone(input: string) {
  const n = normalizePhone(input);
  return /^254[17]\d{8}$/.test(n);
}

export const WITHDRAWAL_FEE_RATE = 0.02;
export const WITHDRAWAL_MIN_FEE = 10;
export const MIN_WITHDRAWAL = 100;

export function withdrawalFee(amount: number) {
  if (!Number.isFinite(amount) || amount <= 0) return 0;
  return Math.round(Math.max(amount * WITHDRAWAL_FEE_RATE, WITHDRAWAL_MIN_FEE) * 100) / 100;
}

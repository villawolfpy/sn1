export const stripTags = (html: string) =>
  html.replace(/<script[^>]*>.*?<\/script>/gis, "")
      .replace(/<style[^>]*>.*?<\/style>/gis, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();

export const truncate = (s: string, n = 360) =>
  s.length > n ? s.slice(0, n - 1).trimEnd() + "…" : s;

export const timeAgo = (d: string | number | Date) => {
  const ts = new Date(d).getTime();
  if (isNaN(ts)) return "";
  let diff = Math.max(0, (Date.now() - ts) / 1000);
  if (diff < 30) return "ahora mismo";
  const units: [number, string][] = [
    [60, "s"], [60, "m"], [24, "h"], [7, "d"], [4.345, "sem"], [12, "mes"], [1000, "a"]
  ];
  const labels = ["s","m","h","d","sem","mes","a"];
  let i = 0;
  for (; i < units.length && diff >= units[i][0]; i++) diff /= units[i][0];
  return `hace ${Math.floor(diff)}${labels[i] ?? "a"}`;
};

export const getDomain = (u: string) => {
  try { return new URL(u).hostname.replace(/^www\./,""); } catch { return ""; }
};
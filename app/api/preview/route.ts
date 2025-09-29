export const runtime = "edge";
export const revalidate = 60;

const UA = "Mozilla/5.0 (compatible; SNReader/1.0; +https://sn1-psi.vercel.app)";

const pick = (html: string) => {
  const get = (re: RegExp) => (html.match(re)?.[1] || "").trim();
  const og = get(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i);
  const tw = get(/<meta[^>]+name=["']twitter:description["'][^>]+content=["']([^"']+)["']/i);
  const md = get(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i);
  if (og) return og;
  if (tw) return tw;
  if (md) return md;
  const p = html.match(/<p[^>]*>([\s\S]*?)<\/p>/i)?.[1] || "";
  return p ? p.replace(/<[^>]+>/g," ").replace(/\s+/g," ").trim() : "";
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url") || "";
  try {
    const u = new URL(url);
    if (!/^https?:$/.test(u.protocol)) throw new Error("bad protocol");
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7000);
    const r = await fetch(u.toString(), {
      headers: { "User-Agent": UA },
      signal: controller.signal,
      cache: "no-store"
    });
    clearTimeout(timeoutId);
    const ct = r.headers.get("content-type") || "";
    if (!ct.includes("text/html")) throw new Error("not html");
    const cl = r.headers.get("content-length");
    if (cl && parseInt(cl) > 1.5 * 1024 * 1024) throw new Error("too large");
    const html = await r.text();
    const description = pick(html);
    return new Response(JSON.stringify({
      ok: true,
      url: u.toString(),
      domain: u.hostname.replace(/^www\./,""),
      title: "",
      description
    }), {
      headers: {
        "content-type":"application/json",
        "cache-control":"s-maxage=60, stale-while-revalidate=300"
      }
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ ok:false, reason: e?.message || "fetch_error" }),
      { status: 200, headers: { "content-type":"application/json" }});
  }
}
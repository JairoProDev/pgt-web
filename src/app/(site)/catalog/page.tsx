import type { Metadata } from "next";
import Link from "next/link";
import { readFileSync } from "fs";
import path from "path";

export const metadata: Metadata = {
  title: "Internal catalog — Peru Grand Travel",
  robots: { index: false, follow: false },
};

type CatalogRow = {
  slug_web: string;
  titulo: string;
  precio_usd_web: string;
  quote_only: string;
  categoria_wp: string;
  gsc_clics_16m: string;
  url_web: string;
  estado_sheet?: string;
  en_web_json?: string;
};

function loadCatalog(): CatalogRow[] {
  const jsonPath = path.join(process.cwd(), "data/catalogo-tours.json");
  try {
    return JSON.parse(readFileSync(jsonPath, "utf-8")) as CatalogRow[];
  } catch {
    return [];
  }
}

export default function CatalogPage() {
  const rows = loadCatalog().filter((r) => r.slug_web && r.url_web);
  const withPrice = rows.filter((r) => r.quote_only !== "yes" && Number(r.precio_usd_web) > 0);
  const quoteOnly = rows.filter((r) => r.quote_only === "yes" || !Number(r.precio_usd_web));
  const drafts = rows.filter((r) => r.estado_sheet === "draft");

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <p className="text-xs font-bold uppercase tracking-wider text-amber-700">Internal — not indexed</p>
      <h1 className="mt-2 text-3xl font-bold text-stone-900">Product catalog (master)</h1>
      <p className="mt-2 max-w-3xl text-stone-600">
        Merged view: SEO Sheet fichas + live web JSON. Source of truth for <strong>prices</strong> is still
        Drive OTAS / Ventas — export CSV and run <code className="rounded bg-stone-100 px-1">merge-precios-otas</code>{" "}
        then <code className="rounded bg-stone-100 px-1">npm run precios:apply</code>.
      </p>
      <p className="mt-2 text-sm text-stone-500">
        {rows.length} fichas · {withPrice.length} with web price · {quoteOnly.length} quote-only
        {drafts.length > 0 ? ` · ${drafts.length} sheet drafts` : ""}
      </p>

      <div className="mt-8 overflow-x-auto rounded-xl border border-stone-200">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-stone-50 text-xs uppercase tracking-wide text-stone-500">
            <tr>
              <th className="px-4 py-3">Tour</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Web price</th>
              <th className="px-4 py-3">GSC clicks</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Link</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {rows
              .sort((a, b) => Number(b.gsc_clics_16m || 0) - Number(a.gsc_clics_16m || 0))
              .map((r) => (
                <tr key={r.slug_web} className="hover:bg-stone-50/80">
                  <td className="px-4 py-2 font-medium text-stone-900">{r.titulo.slice(0, 72)}</td>
                  <td className="px-4 py-2 text-stone-600">{r.categoria_wp || "—"}</td>
                  <td className="px-4 py-2">
                    {r.quote_only === "yes" || !Number(r.precio_usd_web) ? (
                      <span className="text-amber-700">Quote</span>
                    ) : (
                      <span className="font-semibold text-pgt-blue">US$ {r.precio_usd_web}</span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-stone-500">{r.gsc_clics_16m || "—"}</td>
                  <td className="px-4 py-2 text-xs text-stone-500">
                    {r.estado_sheet === "draft" ? "Draft" : r.en_web_json === "yes" ? "Live" : "Sheet only"}
                  </td>
                  <td className="px-4 py-2">
                    {r.en_web_json === "yes" ? (
                      <Link href={r.url_web} className="text-pgt-blue hover:underline">
                        View
                      </Link>
                    ) : (
                      <span className="text-stone-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <p className="mt-6 text-xs text-stone-400">
        Regenerate: <code>npm run catalog:build</code> · Prices from Drive: see{" "}
        <code>pgt/04-producto/datos/precios-otas/INSTRUCCIONES-EXPORT-DRIVE.md</code>
      </p>
    </div>
  );
}

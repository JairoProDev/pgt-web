import { getPayload } from "payload";
import config from "@payload-config";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/** Free keep-alive for Neon (no paid compute). Hit from GitHub Actions every 10 minutes. */
export async function GET() {
  const started = Date.now();
  try {
    const payload = await getPayload({ config });
    const tours = await payload.count({ collection: "tours", overrideAccess: true });
    return Response.json({
      ok: true,
      tours: tours.totalDocs,
      ms: Date.now() - started,
    });
  } catch (error) {
    return Response.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "unavailable",
        ms: Date.now() - started,
      },
      { status: 503 },
    );
  }
}

/**
 * Ensure the four SEO editors exist. Jairo's existing cms@ account stays admin.
 * Prints passwords once — they are not written to git.
 */
import { applyCmsEnv } from "./load-cms-env";

applyCmsEnv();

import { randomBytes } from "crypto";
import { getPayload } from "payload";

const TEAM = [
  { email: "cms@perugrandtravel.com", name: "Jairo", role: "admin" as const, owner: "jairo" },
  { email: "areli@perugrandtravel.com", name: "Areli", role: "editor" as const, owner: "areli" },
  { email: "lizet@perugrandtravel.com", name: "Lizet", role: "editor" as const, owner: "lizet" },
  { email: "ricardo@perugrandtravel.com", name: "Ricardo", role: "editor" as const, owner: "ricardo" },
];

async function main() {
  const { default: config } = await import("../payload.config");
  const payload = await getPayload({ config });
  const shared = process.env.CMS_TEAM_PASSWORD || randomBytes(12).toString("hex");

  for (const member of TEAM) {
    const existing = await payload.find({
      collection: "users",
      where: { email: { equals: member.email } },
      limit: 1,
      overrideAccess: true,
    });
    if (existing.docs[0]) {
      console.log(`exists ${member.email} (${member.role})`);
      continue;
    }
    await payload.create({
      collection: "users",
      data: {
        email: member.email,
        name: member.name,
        role: member.role,
        password: shared,
      },
      overrideAccess: true,
    });
    console.log(`created ${member.email} password=${shared}`);
  }
  console.log("Editors can edit all fields. Delete stays admin-only.");
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

"use client";

import { useEffect } from "react";
import { whatsAppUrl } from "@/lib/site";

type ToolInput = Record<string, unknown>;

type ModelContext = {
  registerTool: (tool: {
    name: string;
    description: string;
    inputSchema?: object;
    execute: (input: ToolInput) => Promise<unknown> | unknown;
  }) => void;
};

function getModelContext(): ModelContext | null {
  if (typeof document === "undefined") return null;
  const fromDocument = (document as unknown as { modelContext?: ModelContext }).modelContext;
  if (fromDocument?.registerTool) return fromDocument;
  const fromNavigator = (navigator as unknown as { modelContext?: ModelContext }).modelContext;
  if (fromNavigator?.registerTool) return fromNavigator;
  return null;
}

/**
 * Registers in-page tools for browser agents (WebMCP origin trial).
 * Feature-detected: no-op when the API is missing. Tiny client bundle.
 */
export function WebMcpTools() {
  useEffect(() => {
    const ctx = getModelContext();
    if (!ctx) return;

    try {
      ctx.registerTool({
        name: "request_peru_quote",
        description:
          "Open WhatsApp to request a custom Peru or Machu Picchu package quote from Peru Grand Travel. Use when the traveler has dates, group size, or interests.",
        inputSchema: {
          type: "object",
          properties: {
            dates: { type: "string", description: "Travel dates or 'flexible'" },
            travelers: { type: "number", description: "Number of travelers" },
            interests: {
              type: "string",
              description: "e.g. Machu Picchu, Inca Trail, Sacred Valley",
            },
          },
        },
        execute: async (input) => {
          const dates = typeof input.dates === "string" ? input.dates : "flexible";
          const travelers =
            typeof input.travelers === "number" ? String(input.travelers) : "not specified";
          const interests =
            typeof input.interests === "string" ? input.interests : "Machu Picchu";
          const message = `Hi! I'm planning a trip to Peru. Dates: ${dates}. Travelers: ${travelers}. Interests: ${interests}. Can you send 2–3 package options?`;
          const url = whatsAppUrl(message, { utmContent: "webmcp_quote" });
          window.open(url, "_blank", "noopener,noreferrer");
          return { ok: true, channel: "whatsapp", url };
        },
      });

      ctx.registerTool({
        name: "open_packages",
        description: "Open the Peru packages catalog on this site.",
        execute: async () => {
          window.location.assign("/packages/");
          return { ok: true, path: "/packages/" };
        },
      });

      ctx.registerTool({
        name: "open_contact",
        description: "Open the contact page for Peru Grand Travel.",
        execute: async () => {
          window.location.assign("/contact-us/");
          return { ok: true, path: "/contact-us/" };
        },
      });
    } catch {
      // Origin trial / draft API may throw if a tool name is already registered.
    }
  }, []);

  return null;
}

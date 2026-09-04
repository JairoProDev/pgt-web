"use client";

import { useField } from "@payloadcms/ui";

/** Shows the URL currently in heroImage so editors see the photo without a Media library. */
export default function ImageUrlPreview({ path = "heroImage" }: { path?: string }) {
  const { value } = useField<string>({ path });
  const src = typeof value === "string" ? value.trim() : "";
  if (!src) return null;

  return (
    <div style={{ marginTop: "0.5rem" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        style={{
          display: "block",
          maxHeight: 160,
          maxWidth: "100%",
          objectFit: "cover",
          borderRadius: 8,
          border: "1px solid #e7e5e4",
        }}
      />
    </div>
  );
}

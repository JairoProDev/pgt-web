"use client";

import type { ChangeEvent } from "react";
import { FieldLabel, TextInput, useField } from "@payloadcms/ui";
import type { TextFieldClientComponent } from "payload";

function tone(len: number, min: number, max: number): { color: string; hint: string } {
  if (len === 0) return { color: "#6b7280", hint: `Vacío · apunta a ${min}–${max}` };
  if (len < min) return { color: "#b45309", hint: `Corto · suma ${min - len} caracteres` };
  if (len > max) return { color: "#b91c1c", hint: `Largo · recorta ${len - max}` };
  return { color: "#15803d", hint: "Rango de Google: bien" };
}

const SeoCharField: TextFieldClientComponent = ({ field, path }) => {
  const { value, setValue } = useField<string>({ path });
  const max = field.maxLength ?? 60;
  const min = max <= 60 ? 50 : 120;
  const text = value ?? "";
  const { color, hint } = tone(text.length, min, max);

  return (
    <div className="field-type text">
      <FieldLabel label={field.label} path={path} required={field.required} />
      <TextInput
        path={path}
        value={text}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
      />
      <div
        style={{
          marginTop: "0.35rem",
          fontSize: "0.75rem",
          fontWeight: 600,
          color,
        }}
      >
        {text.length}/{max} · {hint}
      </div>
    </div>
  );
};

export default SeoCharField;

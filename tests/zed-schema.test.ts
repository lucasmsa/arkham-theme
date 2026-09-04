import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import Ajv from "ajv";
import { describe, expect, it } from "vitest";
import { loadPalette, ROOT } from "../src/palette";
import { zed, ZED_SCHEMA_URL } from "../src/ports/zed";

const schema = JSON.parse(readFileSync(resolve(ROOT, "schemas/zed-theme-v0.2.0.json"), "utf8"));
const theme = JSON.parse(zed.render(loadPalette(), { version: "0.0.0" }));

describe("zed theme", () => {
  it("validates against the vendored v0.2.0 schema", () => {
    const ajv = new Ajv({ strict: false });
    const validate = ajv.compile(schema);
    const valid = validate(theme);
    expect(validate.errors ?? []).toEqual([]);
    expect(valid).toBe(true);
  });

  it("points at the same schema URL that was vendored", () => {
    expect(theme.$schema).toBe(ZED_SCHEMA_URL);
    expect(schema.$schema).toBeDefined();
  });

  it("uses only style keys the schema declares", () => {
    const declared = new Set(Object.keys(schema.definitions.ThemeStyleContent.properties));
    for (const key of Object.keys(theme.themes[0].style)) expect(declared.has(key)).toBe(true);
  });
});

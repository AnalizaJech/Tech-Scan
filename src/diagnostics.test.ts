import { test } from "node:test";
import assert from "node:assert/strict";
import { analyze, reportText, symptoms, type Report } from "./diagnostics";
test("electrical danger takes precedence over every other finding", () => {
  const r = analyze(
    symptoms.map((s) => s.id),
    "",
    "Windows 11",
  );
  assert.equal(r.findings[0].id, "electrical");
  assert.equal(r.findings[0].level, "Urgente");
  assert.ok(r.findings.length > 5);
});
test("electrical danger prevents conflicting troubleshooting instructions", () => {
  const r = analyze(
    ["electric", "update", "heat", "restart"],
    "",
    "Windows 11",
  );
  assert.ok(
    r.findings
      .filter((f) => f.id !== "electrical")
      .every(
        (f) =>
          f.steps.length === 1 && f.steps[0].startsWith("No realices pruebas"),
      ),
  );
});
test("every supported symptom produces a finding", () => {
  for (const s of symptoms)
    assert.ok(analyze([s.id], "", "Windows 11").findings.length, s.id);
});
test("corrupted files and heat are mapped to different causes", () => {
  assert.ok(
    analyze(["corrupt"], "", "Windows 11").findings.some(
      (f) => f.id === "storage",
    ),
  );
  assert.ok(
    !analyze(["heat"], "", "Windows 11").findings.some(
      (f) => f.id === "storage",
    ),
  );
  assert.equal(analyze(["heat"], "", "Windows 11").findings[0].id, "thermal");
});
test("recognizes codes without falsely diagnosing an arbitrary text", () => {
  assert.ok(
    analyze([], "MEMORY_MANAGEMENT", "Windows 11").evidence.includes("bsod"),
  );
  const r = analyze([], "an unexpected undocumented error", "Linux");
  assert.equal(r.findings.length, 0);
  assert.equal(r.unknownLog, true);
});
test("OS-specific instructions and codes cannot leak to another platform", () => {
  const r = analyze(["update", "bsod"], "0x800f081f", "macOS");
  assert.ok(!r.evidence.includes("bsod"));
  assert.equal(r.matches.length, 0);
  assert.ok(r.findings.every((f) => f.steps.every((s) => !s.includes("DISM"))));
});
test("independent symptoms retain multiple findings and duplicate evidence is removed", () => {
  const r = analyze(["dns", "dns", "heat"], "ERR_NAME_NOT_RESOLVED", "Linux");
  assert.equal(r.evidence.filter((s) => s === "dns").length, 1);
  assert.ok(r.findings.some((f) => f.id === "network"));
  assert.ok(r.findings.some((f) => f.id === "thermal"));
});
test("unknown and empty selections do not imply a healthy computer", () => {
  assert.equal(analyze(["invalid"], "", "Windows 11").findings.length, 0);
  const r: Report = {
    id: "test",
    date: "2026-10-02T12:00:00Z",
    os: "Linux",
    device: "Portátil",
    selected: [],
    log: "",
    result: analyze([], "", "Linux"),
  };
  assert.match(reportText(r), /no confirma que el equipo esté sano/);
});
test("exports evidence, sources and platform-specific actions", () => {
  const r: Report = {
    id: "test",
    date: "2026-10-02T12:00:00Z",
    os: "Windows 11",
    device: "Portátil",
    selected: ["update"],
    log: "0x800f081f",
    result: analyze(["update"], "0x800f081f", "Windows 11"),
  };
  const text = reportText(r);
  assert.match(text, /DISM/);
  assert.match(text, /support.microsoft.com/);
  assert.match(text, /0x800f081f/);
});

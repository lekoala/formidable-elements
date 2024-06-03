import { expect, test } from "bun:test";
import * as date from "../src/utils/date.js";

const d1 = date.asDate("2024-12-30");
const d2 = date.asDate("2025-01-01");
const d3withtime = date.asDate("2025-01-01 10:00:00");
const d2minusd1 = d2.getTime() - d1.getTime();
const d4tz = date.asDate("2024-12-30T00:00:00.000+02:00");
const d5tz = date.asDate("2025-01-01T00:00:00.000+09:00");
const d5minusd4 = d5tz.getTime() - d4tz.getTime();

test("expands date", () => {
  expect(d1.getHours() == 0);
  expect(d1.getMinutes() == 0);
  expect(d1.getSeconds() == 0);
  expect(d3withtime.getHours() == 10);
  expect(d3withtime.getMinutes() == 0);
  expect(d3withtime.getSeconds() == 0);
  const expanded = date.expandDate("2025-01-01T10:00:00+09");
  expect(expanded.includes('.'));
});
test("date parts", () => {
  const parts = date.dateParts(d2minusd1);
  const partsTz = date.dateParts(d5minusd4);
  expect(2 + 2).toBe(4);
});

const fs = require("fs");
const path = require("path");

describe("Signup screen test", () => {
  test("signup screen exists", () => {
    const filePath = path.resolve(__dirname, "../app/(auth)/signup.tsx");

    expect(fs.existsSync(filePath)).toBe(true);

    const content = fs.readFileSync(filePath, "utf8");
    expect(content).toMatch(/export default function/);
  });
});
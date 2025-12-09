const fs = require("fs");
const path = require("path");

describe("Items API usage in marketplace", () => {
  test("marketplace screen fetches items from backend", () => {
    const filePath = path.resolve(__dirname, "../app/(tabs)/marketplace.tsx");

    expect(fs.existsSync(filePath)).toBe(true);

    const content = fs.readFileSync(filePath, "utf8");

    expect(content).toMatch(/fetch\(/);
    expect(content).toMatch(/\/api\/items/);
  });
});
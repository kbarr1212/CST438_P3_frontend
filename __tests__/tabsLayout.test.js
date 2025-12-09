const fs = require("fs");
const path = require("path");

describe("Tabs layout test", () => {
  test("tabs layout exists", () => {
    const filePath = path.resolve(__dirname, "../app/(tabs)/_layout.tsx");

    expect(fs.existsSync(filePath)).toBe(true);
  });
});
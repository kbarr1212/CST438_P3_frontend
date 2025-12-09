const fs = require("fs");
const path = require("path");

describe("Root layout test", () => {
  test("root _layout exists", () => {
    const filePath = path.resolve(__dirname, "../app/_layout.tsx");

    expect(fs.existsSync(filePath)).toBe(true);
  });
});
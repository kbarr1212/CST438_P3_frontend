const fs = require("fs");
const path = require("path");

describe("UI Style test", () => {
  test("style file exists", () => {
    const filePath = path.resolve(
      __dirname,
      "../components/ui/style.ts"
    );

    expect(fs.existsSync(filePath)).toBe(true);

    const content = fs.readFileSync(filePath, "utf8");
    expect(content.length).toBeGreaterThan(10);
  });
});
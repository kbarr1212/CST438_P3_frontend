const fs = require("fs");
const path = require("path");

describe("Item Detail screen test", () => {
  test("item detail file exists", () => {
    const filePath = path.resolve(__dirname, "../app/item/[id].tsx");

    expect(fs.existsSync(filePath)).toBe(true);

    const content = fs.readFileSync(filePath, "utf8");
    expect(content).toMatch(/export default function/);
  });
});
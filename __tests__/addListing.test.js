const fs = require("fs");
const path = require("path");

describe("Add Listing screen test", () => {
  test("addListing file exists", () => {
    const filePath = path.resolve(__dirname, "../app/addListing.tsx");

    expect(fs.existsSync(filePath)).toBe(true);

    const content = fs.readFileSync(filePath, "utf8");
    expect(content).toMatch(/export default function/);
  });
});
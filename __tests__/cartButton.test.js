const fs = require("fs");
const path = require("path");

describe("Item detail cart integration", () => {
  test("item detail uses useCart and has Add to Cart button", () => {
    const filePath = path.resolve(__dirname, "../app/item/[id].tsx");
    expect(fs.existsSync(filePath)).toBe(true);

    const content = fs.readFileSync(filePath, "utf8");

    expect(content).toMatch(/useCart/);
    expect(content).toMatch(/from ['"]@\/context\/CartContext['"]/);

    expect(content).toMatch(/Add to Cart/);
  });
});
const fs = require("fs");
const path = require("path");

describe("CartContext file check", () => {
  test("CartContext exists and exports provider and hook", () => {
    const filePath = path.resolve(__dirname, "../context/CartContext.tsx");

    expect(fs.existsSync(filePath)).toBe(true);

    const content = fs.readFileSync(filePath, "utf8");

    expect(content).toMatch(/export function CartProvider/);
    expect(content).toMatch(/export function useCart/);
  });
});
const fs = require("fs");
const path = require("path");

describe("FavoritesContext file check", () => {
  test("FavoritesContext exists and exports provider and hook", () => {
    const filePath = path.resolve(__dirname, "../context/FavoritesContext.tsx");

    expect(fs.existsSync(filePath)).toBe(true);

    const content = fs.readFileSync(filePath, "utf8");

    expect(content).toMatch(/export function FavoritesProvider/);
    expect(content).toMatch(/export function useFavorites/);
  });
});
const fs = require("fs");
const path = require("path");

describe("API config in login screen", () => {
  test("login screen defines API_BASE_URL", () => {
    const filePath = path.resolve(__dirname, "../app/(auth)/login.tsx");

    expect(fs.existsSync(filePath)).toBe(true);

    const content = fs.readFileSync(filePath, "utf8");

    expect(content).toMatch(/API_BASE_URL/);
    expect(content).toMatch(/http:\/\/localhost:8080|https?:\/\/.+herokuapp\.com/);
  });
});
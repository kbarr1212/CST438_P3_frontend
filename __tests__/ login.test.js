const fs = require("fs");
const path = require("path");

describe("Login screen test", () => {
  test("login screen exists", () => {
    const filePath = path.resolve(__dirname, "../app/(auth)/login.tsx");

    expect(fs.existsSync(filePath)).toBe(true);
  });
});
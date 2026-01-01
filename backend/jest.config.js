const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} */
module.exports = {
  testEnvironment: "node",
  transform: {
    ...tsJestTransformCfg,
  },
  roots: ["<rootDir>/src/modules"], // Para que Jest busque tests en todos los módulos
  testMatch: ["**/__tests__/**/*.spec.ts"], // Para que solo corra archivos *.spec.ts
};

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */

import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  verbose: true,
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "\\.[jt]sx?$": "babel-jest",
  },
  modulePaths: ["<rootDir>/src"],
};

export default config;

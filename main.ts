import { Command } from "commander";
import * as fs from "fs";
import { getStreetName } from "./addressParser";

async function main() {
  const program = new Command();

  program
    .requiredOption("-a, --address-file <PATH>", "path to addresses file")
    .requiredOption("-d, --driver-file <PATH>", "path to drivers file");

  program.parse(process.argv);
  const options = program.opts();

  const fullAddresses = fs
    .readFileSync(options.addressFile, "utf-8")
    .split("\n")
    .filter((line) => line.trim() != "");

  const streetNames = fullAddresses.map(getStreetName);

  const drivers = fs
    .readFileSync(options.driverFile, "utf-8")
    .split("\n")
    .filter((line) => line.trim() != "");

  console.log("drivers: ", drivers);
  console.log("streetNames: ", streetNames);
  console.log("fullAddresses: ", fullAddresses);

  const scores = drivers.map((driver) =>
    streetNames.map((streetName) => calculateSS(driver, streetName))
  );

  const metadata = drivers.map((_, driverIndex) =>
    fullAddresses.map((_, addressIndex) => ({
      driver: drivers[driverIndex],
      address: fullAddresses[addressIndex],
    }))
  );

  console.log("scores: ", scores);
  console.log("metadata: ", metadata);
}

function countVowels(str: string): number {
  const matches = str.match(/[aeiou]/gi);
  return matches ? matches.length : 0;
}

function countConsonants(str: string): number {
  const matches = str.match(/[bcdfghjklmnpqrstvwxyz]/gi);
  return matches ? matches.length : 0;
}

function getCommonFactor(a: number, b: number): number {
  return b === 0 ? a : getCommonFactor(b, a % b);
}

function calculateSS(d: string, s: string): number {
  let base: number = 0;

  base = s.length % 2 == 0 ? countVowels(d) * 1.5 : countConsonants(d);
  return getCommonFactor(s.length, d.length) > 1 ? base * 1.5 : base;
}

main().catch((error) => {
  console.log(error);
  process.exit(1);
});

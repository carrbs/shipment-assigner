import { Command } from "commander";
import * as fs from "fs";
import * as figlet from "figlet";
const munkres = require("munkres-js");
const gradient = require("gradient-string");

import { getStreetName } from "./addressParser";
import { calculateSS } from "./suitabilityScore";

async function main() {
  const program = new Command();

  program
    .requiredOption("-a, --address-file <PATH>", "path to addresses file")
    .requiredOption("-d, --driver-file <PATH>", "path to drivers file");

  program.parse(process.argv);
  const options = program.opts();

  const addresses = readLinesFromFile(options.addressFile);
  const drivers = readLinesFromFile(options.driverFile);
  const streetNames = addresses.map(getStreetName);

  const scores = drivers.map((driver) =>
    streetNames.map((streetName) => calculateSS(driver, streetName))
  );

  const indices = munkres(scores);

  let totalSS: number = 0;
  const assignments = indices.map(([driverIndex, addressIndex]) => {
    const score = scores[driverIndex][addressIndex];
    totalSS += score;
    return {
      Driver: drivers[driverIndex],
      Address: addresses[addressIndex],
      Score: score,
    };
  });

  await figlet.text("ShipmentAssigner", (err: Error | null, data: string) => {
    if (err) {
      console.log("Something went wrong...");
      console.dir(err);
      return;
    }
    console.log(gradient.retro(data));
  });

  console.table(assignments);
  console.log("Total Suitability Score (SS): ", totalSS);
}

function readLinesFromFile(path: string): string[] {
  return fs
    .readFileSync(path, "utf-8")
    .split("\n")
    .filter((line) => line.trim() != "");
}

main().catch((error) => {
  console.log(error);
  process.exit(1);
});

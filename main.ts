import { Command } from "commander";
import * as fs from "fs";
import * as figlet from "figlet";
const munkres = require("munkres-js");
const gradient = require("gradient-string");

import { getStreetName } from "./addressParser";
import { calculateSS } from "./suitabilityScore";

interface Options {
  addressFile: string;
  driverFile: string;
}

interface Assignment {
  Driver: string;
  Address: string;
  Score: number;
}

async function main() {
  await displayBanner();
  const options = getOptions();

  const addresses = readLinesFromFile(options.addressFile);
  const drivers = readLinesFromFile(options.driverFile);

  const assignments = calculateAssignments(drivers, addresses);

  console.table(assignments);
  console.log("Total Suitability Score (SS): ", getTotalScore(assignments));
}

function getOptions(): Options {
  const program = new Command();
  program.showHelpAfterError();

  program
    .requiredOption("-a, --address-file <PATH>", "path to addresses file")
    .requiredOption("-d, --driver-file <PATH>", "path to drivers file");

  program.parse(process.argv);
  const options = program.opts() as Options;
  return options;
}

function calculateAssignments(
  drivers: string[],
  addresses: string[]
): Assignment[] {
  const streetNames = addresses.map(getStreetName);

  const scores = drivers.map((driver) =>
    streetNames.map((streetName) => calculateSS(driver, streetName))
  );

  const indices = munkres(scores);

  let totalSS: number = 0;
  return indices.map(([driverIndex, addressIndex]) => {
    const score = scores[driverIndex][addressIndex];
    totalSS += score;
    return {
      Driver: drivers[driverIndex],
      Address: addresses[addressIndex],
      Score: score,
    };
  });
}

async function displayBanner(): Promise<void> {
  await figlet.text("ShipmentAssigner", (err: Error | null, data: string) => {
    if (err) {
      console.log("Something went wrong...");
      console.dir(err);
      return;
    }
    console.log(gradient.retro(data));
  });
}

function getTotalScore(assignments: Assignment[]): number {
  return assignments.reduce((total, assignment) => total + assignment.Score, 0);
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

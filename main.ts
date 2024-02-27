import { Command } from "commander";
import * as fs from "fs";
import * as figlet from "figlet";
const gradient = require("gradient-string");

import { calculateAssignments, Assignment } from "./suitabilityScore";

interface Options {
  addressFile: string;
  driverFile: string;
}

async function main() {
  try {
    await displayBanner();
    const options = getOptions();

    const addresses = readLinesFromFile(options.addressFile);
    const drivers = readLinesFromFile(options.driverFile);

    const assignments = calculateAssignments(drivers, addresses);

    console.table(assignments);
    console.log("Total Suitability Score (SS): ", getTotalScore(assignments));
  } catch (error) {
    console.log("an error occurred: ", error);
  }
}

function getOptions(): Options {
  const program = new Command();
  program.showHelpAfterError();

  program
    .requiredOption(
      "-a, --address-file <PATH>",
      "path to addresses file",
      (path) => {
        if (!fs.existsSync(path)) {
          console.error(`Invalid path! no file found at ${path}`);
          program.help();
        }
        return path;
      }
    )
    .requiredOption(
      "-d, --driver-file <PATH>",
      "path to drivers file",
      (path) => {
        if (!fs.existsSync(path)) {
          console.error(`Invalid path! no file found at ${path}`);
          program.help();
        }
        return path;
      }
    );

  program.parse(process.argv);
  const options = program.opts() as Options;
  return options;
}

async function displayBanner(): Promise<void> {
  await figlet.text("ShipmentAssigner", (err: Error | null, data: string) => {
    if (err) {
      console.log("Something went wrong...");
      console.dir(err);
      return;
    }
    console.log(data);
    // console.log(gradient.retro(data));
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

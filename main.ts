import { Command } from "commander";
import * as fs from "fs";
import * as figlet from "figlet";
const gradient = require("gradient-string");

import { calculateAssignments, Assignment } from "./suitabilityScore";
import { generateInputFiles } from "./inputGenerator";

interface Options {
  addressFile: string;
  driverFile: string;
}

async function main() {
  try {
    await displayBanner();
    invokeCLI();
  } catch (error) {
    console.log("an error occurred: ", error);
  }
}

function invokeCLI(): void {
  const program = new Command();
  program.showHelpAfterError();

  program
    .command("assign")
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
    )
    .action(assignHandler);

  program
    .command("generate")
    .description("Generate input files")
    .option(
      "-a --addresses [number]",
      "Number of fake addresses to generate (default: 100)"
    )
    .option(
      "-d --drivers [number]",
      "Number of fake driver names to generate. (default: 100)"
    )
    .action((options) => {
      generateInputFiles(options.addresses, options.drivers);
    });

  program.parse(process.argv);
}

function assignHandler(options: Options): void {
  const addresses = readLinesFromFile(options.addressFile);
  const drivers = readLinesFromFile(options.driverFile);

  const assignments = calculateAssignments(drivers, addresses);

  console.table(assignments);
  console.log("Total Suitability Score (SS): ", getTotalScore(assignments));
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

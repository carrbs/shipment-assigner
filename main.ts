import { Command } from "commander";
import * as fs from "fs";
import { getStreetName } from "./addressParser";
import { calculateSS } from "./suitabilityScore";
const munkres = require("munkres-js");

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

  indices.forEach(([driverIndex, addressIndex]) => {
    const score = scores[driverIndex][addressIndex];
    console.log(
      `Driver ${drivers[driverIndex]} is assigned to address ${addresses[addressIndex]} with score ${score}`
    );
  });
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

import { Command } from "commander";
import * as fs from "fs";
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

  console.log("drivers: ", drivers);
  console.log("streetNames: ", streetNames);
  console.log("fullAddresses: ", addresses);

  const scores = drivers.map((driver) =>
    streetNames.map((streetName) => calculateSS(driver, streetName))
  );

  const metadata = drivers.map((_, driverIndex) =>
    addresses.map((_, addressIndex) => ({
      driver: drivers[driverIndex],
      address: addresses[addressIndex],
    }))
  );

  console.log("scores: ", scores);
  console.log("metadata: ", metadata);
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

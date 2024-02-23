import { Command } from "commander";
import * as fs from "fs";
import * as readline from "readline";
import { getStreetName } from "./addressParser";

const program = new Command();

program
  .requiredOption("-a, --address-file <PATH>", "path to addresses file")
  .requiredOption("-d, --driver-file <PATH>", "path to drivers file");

program.parse(process.argv);
const options = program.opts();
console.log("opts", options);

if (options.addressFile) {
  const readInterface = readline.createInterface({
    input: fs.createReadStream(options.addressFile),
    output: process.stdout,
  });

  readInterface.on("line", (line) => {
    const streetName = getStreetName(line);
    console.log(streetName, "length: ", streetName.length);
  });
}

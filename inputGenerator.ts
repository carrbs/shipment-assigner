import * as fs from "fs";
import { faker } from "@faker-js/faker";

export function generateInputFiles(
  numAddresses: number = 100,
  numDrivers: number = 100
): void {
  let addresses = "";

  for (let i = 0; i < numAddresses; i++) {
    addresses +=
      faker.location.streetAddress() +
      ", " +
      faker.location.city() +
      ", " +
      faker.location.state() +
      ", " +
      faker.location.zipCode() +
      "\n";
  }

  let drivers = "";
  for (let i = 0; i < numDrivers; i++) {
    drivers += faker.person.fullName() + "\n";
  }

  const now = Math.floor(Date.now() / 1000);
  const addrsFileName = `${numAddresses}-addresses-${now}.txt`;
  const driversFileName = `${numDrivers}-drivers-${now}.txt`;
  fs.writeFileSync(addrsFileName, addresses);
  fs.writeFileSync(driversFileName, drivers);
  console.log(
    `Input files successfully generated:\n=> ${addrsFileName}\n=> ${driversFileName}`
  );
}

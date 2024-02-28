import * as fs from "fs";
import { faker } from "@faker-js/faker";

const numAddresses = 1000;
const numNames = 1000;

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
for (let i = 0; i < numNames; i++) {
  drivers += faker.person.fullName() + "\n";
}

const now = Math.floor(Date.now() / 1000);
fs.writeFileSync(`addresses_${now}.txt`, addresses);
fs.writeFileSync(`drivers_${now}.txt`, drivers);

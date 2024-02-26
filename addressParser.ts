import * as parseAddress from "parse-address";

export function getStreetName(address: string): string {
  return parseAddress.parseLocation(address).street;
}

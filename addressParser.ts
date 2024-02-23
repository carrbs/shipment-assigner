import * as parseAddress from "parse-address";

export function getStreetName(address: string): string {
  const parsed = parseAddress.parseLocation(address);
  return parsed.street;
}

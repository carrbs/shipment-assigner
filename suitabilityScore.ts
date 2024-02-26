const munkres = require("munkres-js");

import { getStreetName } from "./addressParser";

export interface Assignment {
  Driver: string;
  Address: string;
  Score: number;
}

interface AssignmentsResult {
  assignments: Assignment[];
  allDriverIndices: Set<number>;
  allAddressIndices: Set<number>;
}

function countVowels(str: string): number {
  const matches = str.match(/[aeiou]/gi);
  return matches ? matches.length : 0;
}

function countConsonants(str: string): number {
  const matches = str.match(/[bcdfghjklmnpqrstvwxyz]/gi);
  return matches ? matches.length : 0;
}

function getCommonFactor(a: number, b: number): number {
  return b === 0 ? a : getCommonFactor(b, a % b);
}

function calculateSS(d: string, s: string): number {
  let base: number = 0;

  base = s.length % 2 == 0 ? countVowels(d) * 1.5 : countConsonants(d);
  return getCommonFactor(s.length, d.length) > 1 ? base * 1.5 : base;
}

function getScores(
  drivers: string[],
  streetNames: string[]
): [number[][], number] {
  let scores = drivers.map((driver) =>
    streetNames.map((streetName) => calculateSS(driver, streetName))
  );

  const maxScore = Math.max(...scores.flat());
  scores = scores.map((driverScores) =>
    driverScores.map((score) => maxScore - score)
  );

  return [scores, maxScore];
}

function createAssignments(
  drivers: string[],
  addresses: string[],
  optimalAssignments: number[][],
  scores: number[][],
  maxScore: number
): AssignmentsResult {
  const assignments: Assignment[] = [];
  const allDriverIndices = new Set<number>(drivers.map((_, index) => index));
  const allAddressIndices = new Set<number>(addresses.map((_, index) => index));

  for (const [driverIndex, addressIndex] of optimalAssignments) {
    const score = maxScore - scores[driverIndex][addressIndex];
    assignments.push({
      Driver: drivers[driverIndex],
      Address: addresses[addressIndex],
      Score: score,
    });
    allDriverIndices.delete(driverIndex);
    allAddressIndices.delete(addressIndex);
  }

  return { assignments, allDriverIndices, allAddressIndices };
}

function setUnassigned(
  drivers: string[],
  addresses: string[],
  assignments: Assignment[],
  allDriverIndices: Set<number>,
  allAddressIndices: Set<number>
): Assignment[] {
  for (const unassignedDriverIndex of allDriverIndices) {
    assignments.push({
      Driver: drivers[unassignedDriverIndex],
      Address: "Unassigned",
      Score: 0,
    });
  }

  for (const unassignedAddressIndex of allAddressIndices) {
    assignments.push({
      Driver: "Unassigned",
      Address: addresses[unassignedAddressIndex],
      Score: 0,
    });
  }

  return assignments;
}

export function calculateAssignments(
  drivers: string[],
  addresses: string[]
): Assignment[] {
  const streetNames = addresses.map(getStreetName);
  const [scores, maxScore] = getScores(drivers, streetNames);

  const optimalAssignments = munkres(scores);

  const { assignments, allDriverIndices, allAddressIndices } =
    createAssignments(drivers, addresses, optimalAssignments, scores, maxScore);

  return setUnassigned(
    drivers,
    addresses,
    assignments,
    allDriverIndices,
    allAddressIndices
  );
}

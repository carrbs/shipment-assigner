import {
  calculateAssignments,
  calculateSS,
  getScores,
} from "./suitabilityScore";
import { getStreetName } from "./addressParser";

describe("calculateAssignments", () => {
  test("when there are equal numbers of drivers and addresses", () => {
    const drivers = ["Daniel Davidson", "John Jacob Jingleheimer Schmidt"];
    const addresses = [
      "44 Fake Dr., San Diego, CA 92122",
      "2732 NE Fremont St, Portland, OR 97212",
    ];
    const scores = [9, 19];
    const assignments = calculateAssignments(drivers, addresses);

    expect(assignments.length).toBe(drivers.length);
    assignments.forEach((assignment, i) => {
      expect(assignment.Driver).toBe(drivers[i]);
      expect(assignment.Address).toBe(addresses[i]);
      expect(assignment.Score).toBe(scores[i]);
    });
  });

  test("when there are more drivers than addresses", () => {
    const drivers = [
      "Daniel Davidson",
      "John Jacob Jingleheimer Schmidt",
      "Jane Dough",
    ];
    const addresses = [
      "44 Fake Dr., San Diego, CA 92122",
      "2732 NE Fremont St, Portland, OR 97212",
    ];
    const assignments = calculateAssignments(drivers, addresses);

    expect(assignments.length).toBe(drivers.length);
    const unassignedDrivers = assignments.filter(
      (assignment) => assignment.Address === "Unassigned"
    );
    expect(unassignedDrivers.length).toBe(1);
  });

  test("when there are more addresses than drivers", () => {
    const drivers = ["Daniel Davidson", "Jane Dough"];
    const addresses = [
      "44 Fake Dr., San Diego, CA 92122",
      "2732 NE Fremont St, Portland, OR 97212",
      "24140 Windsor Close, Fort Tania, Massachusetts, 35354-3297",
    ];

    const expectedAssignments = [
      {
        Driver: "Daniel Davidson",
        Address: "2732 NE Fremont St, Portland, OR 97212",
        Score: 8,
      },
      {
        Driver: "Jane Dough",
        Address: "44 Fake Dr., San Diego, CA 92122",
        Score: 9,
      },
      {
        Driver: "Unassigned",
        Address: "24140 Windsor Close, Fort Tania, Massachusetts, 35354-3297",
        Score: 0,
      },
    ];

    const assignments = calculateAssignments(drivers, addresses);

    expect(assignments.length).toBe(addresses.length);
    const unassignedAddresses = assignments.filter(
      (assignment) => assignment.Driver === "Unassigned"
    );
    expect(unassignedAddresses.length).toBe(1);

    // Check that the assignments are correct
    assignments.forEach((assignment, index) => {
      expect(assignment).toEqual(expectedAssignments[index]);
    });
  });
});

describe("calculateSS", () => {
  describe("When street name length is odd", () => {
    test("calculates correct score with common factor", () => {
      const driver = "Daniel Davidson"; // length == 15
      const streetName = "Five5"; // length == 5
      const consonantCount = 8;

      const score = calculateSS(driver, streetName);
      expect(score).toBe(consonantCount * 1.5);
    });

    test("calculates correct score without common factor", () => {
      const driver = "Daniel Davidson";
      const streetName = "OddName";
      const consonantCount = 8;

      const score = calculateSS(driver, streetName);
      expect(score).toBe(consonantCount);
    });
  });

  describe("When street name length is even", () => {
    test("calculates correct score with common factor", () => {
      const driver = "Daniel Davidson"; // length == 15
      const streetName = "EvenNameEven"; // length == 12
      const vowelCount = 6;

      const score = calculateSS(driver, streetName);
      expect(score).toBe(vowelCount * 1.5 * 1.5);
    });

    test("calculates correct score without common factor", () => {
      const driver = "Daniel Davidson";
      const streetName = "EvenName";
      const vowelCount = 6;

      const score = calculateSS(driver, streetName);
      expect(score).toBe(vowelCount * 1.5);
    });
  });
});
test("getScores converts scores to cost matrix", () => {
  const drivers = ["Daniel Davidson", "John Doe"];
  const streetNames = ["Fremont", "Burnside"];

  const [scores, maxScore] = getScores(drivers, streetNames);
  const suitabilityScores = drivers.map((driver) =>
    streetNames.map((streetName) => calculateSS(driver, streetName))
  );
  const expectedMax = Math.max(
    Math.max(suitabilityScores[0][0], suitabilityScores[0][1]),
    Math.max(suitabilityScores[1][0], suitabilityScores[1][1])
  );

  const expectedScores = [
    [1, 0],
    [5, 2.25],
  ];
  expect(scores).toEqual(expectedScores);
  expect(maxScore).toBe(expectedMax);
});

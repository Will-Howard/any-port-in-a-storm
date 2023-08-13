import {
  ConstrainedFunctionSet,
  IndenticalFunctionSet,
} from "../src/constraints";

describe("ConstrainedFunctionSet", () => {
  const reference = (x: number) => x ** 2;
  const identicalFunction = (x: number) => x * x;
  const greaterFunction = (x: number) => x ** 2 + 1;

  it("should assert correctly for valid constraints", () => {
    const set = new ConstrainedFunctionSet(reference, [
      {
        function: identicalFunction,
        assertConstraint: (referenceOutput: number, output: number) => {
          expect(referenceOutput).toBe(output);
        },
      },
    ]);

    expect(() => set.assertConstraints(2)).not.toThrow();

    const set2 = new ConstrainedFunctionSet(reference, [
      {
        function: greaterFunction,
        assertConstraint: (referenceOutput: number, output: number) => {
          return expect(referenceOutput).toBeLessThan(output);
        },
      },
    ]);

    expect(() => set2.assertConstraints(2)).not.toThrow();
  });

  it("should throw error for invalid constraints", () => {
    const set = new ConstrainedFunctionSet(reference, [
      {
        function: greaterFunction,
        assertConstraint: (referenceOutput: number, output: number) => {
          expect(referenceOutput).toBeGreaterThan(output);
        },
      },
    ]);

    expect(() => set.assertConstraints(2)).toThrow();
  });
});

describe("IndenticalFunctionSet", () => {
  const reference = (x: number) => x ** 2;
  const identicalFunction = (x: number) => x * x;
  const differentFunction = (x: number) => x * 3;

  it("should assert correctly for identical functions", () => {
    const set = new IndenticalFunctionSet(reference, [identicalFunction]);
    expect(() => set.assertConstraints(2)).not.toThrow();
  });

  it("should throw error for non-identical functions", () => {
    const set = new IndenticalFunctionSet(reference, [differentFunction]);
    expect(() => set.assertConstraints(2)).toThrow();
  });
});

describe("Calling ConstrainedFunctionSet", () => {
  const reference = (x: number) => x ** 2;
  const identicalFunction = (x: number) => x * x;

  it("should return the reference output if the constraints are satisfied", () => {
    const set = new ConstrainedFunctionSet(reference, [
      {
        function: identicalFunction,
        assertConstraint: (referenceOutput: number, output: number) => {
          expect(referenceOutput).toBe(output);
        },
      },
    ]);

    expect(set.call(2)).toBe(4);
  });

  it("should throw error if the constraints are not satisfied", () => {
    const set = new ConstrainedFunctionSet(reference, [
      {
        function: identicalFunction,
        assertConstraint: (referenceOutput: number, output: number) => {
          expect(referenceOutput).toBeGreaterThan(output);
        },
      },
    ]);

    expect(() => set.call(2)).toThrow();
  });
});

describe("Calling IdenticalFunctionSet", () => {
  const reference = (x: number) => x ** 2;
  const identicalFunction = (x: number) => x * x;

  it("should return the reference output if the constraints are satisfied", () => {
    const set = new IndenticalFunctionSet(reference, [identicalFunction]);

    expect(set.call(2)).toBe(4);
  });

  it("should throw error if the constraints are not satisfied", () => {
    const set = new IndenticalFunctionSet(reference, [(x: number) => x * 3]);

    expect(() => set.call(2)).toThrow();
  });
});

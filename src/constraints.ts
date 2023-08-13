export type FunctionType<T extends any[], V> = (...args: T) => V;

export type ConstrainedFunction<
  F extends FunctionType<T, V>,
  T extends any[],
  V
> = {
  function: F;
  assertConstraint: (referenceOutput: V, output: V, args?: T) => void;
};

export class ConstrainedFunctionSet<
  F extends FunctionType<T, V>,
  T extends any[],
  V
> {
  protected reference: F;
  protected functions: ConstrainedFunction<F, T, V>[];

  constructor(reference: F, functions: ConstrainedFunction<F, T, V>[]) {
    this.reference = reference;
    this.functions = functions;
  }

  private _assertConstraints(referenceOutput: V, ...args: T): void {
    for (const constrainedFunction of this.functions) {
      const { function: func, assertConstraint } = constrainedFunction;

      const output = func(...args);
      // TODO catch the error and add info on which function failed
      assertConstraint(referenceOutput, output, args);
    }
  }

  public assertConstraints(...args: T): void {
    const referenceOutput = this.reference(...args);
    this._assertConstraints(referenceOutput, ...args);
  }

  public call(...args: T): V {
    const referenceOutput = this.reference(...args);
    this._assertConstraints(referenceOutput, ...args);
    return referenceOutput;
  }
}

export class IndenticalFunctionSet<
  F extends FunctionType<T, V>,
  T extends any[],
  V
> extends ConstrainedFunctionSet<F, T, V> {
  constructor(reference: F, functions: F[]) {
    const constrainedFunctions = functions.map((func) => ({
      function: func,
      assertConstraint: (referenceOutput: V, output: V) =>
        expect(output).toBe(referenceOutput),
    }));

    super(reference, constrainedFunctions);
  }
}

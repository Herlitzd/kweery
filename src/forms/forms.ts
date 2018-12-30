export type Env = { [key: string]: any };//Map<String, any>;
export type Comparable = Number | String;

export interface Base {
  apply(env: Env): any;
}
export class Prop implements Base {
  constructor(public rootSymbol: string, public next?: string | Prop) {
    if (next === undefined) {
      this.next = null;
    }
  }
  apply(env: Env) {
    // This feels wrong, revisit
    if (this.next == null) {
      return env[this.rootSymbol];
    } else if (this.next instanceof Prop) {
      return this.next.apply(env[this.rootSymbol] || {});
    } else {
      return env[this.rootSymbol][this.next] || null;
    }
  }
}
export class Const implements Base {
  constructor(public value: Comparable) {
  }
  apply(_env: Env) {
    return this.value;
  }
}

export abstract class UnaryOperator implements Base {
  constructor(public param: Base) {
  }
  abstract apply(env: Env): Boolean;
}

export abstract class BinaryOperator implements Base {
  constructor(public left: Base, public right: Base) {
  }
  abstract apply(env: Env): Boolean;
}

export abstract class SetWiseOperator extends BinaryOperator {
  abstract get rawOperator(): (l: Boolean, r: Boolean) => Boolean;
  apply(env: Env): Boolean {
    return this.rawOperator(this.left.apply(env), this.right.apply(env));
  }
}

export abstract class ComparatorOperator extends BinaryOperator {
  abstract get rawOperator(): (l: Comparable, r: Comparable) => Boolean;
  apply(env: Env): Boolean {
    return this.rawOperator(this.left.apply(env), this.right.apply(env));
  }
}


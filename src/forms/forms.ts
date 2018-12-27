export type Env = Map<String, any>;
export type Comparable = Number | String;

export interface Base {
  apply(env: Env): any;
}
export class Prop implements Base {
  constructor(public rootSymbol: string, public next: string | Prop) {
  }
  apply(env: Env) {
    if (this.next instanceof Prop) {
      return this.next.apply(env.get(this.rootSymbol));
    } else {
      return env.get(this.rootSymbol).get(this.next);
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


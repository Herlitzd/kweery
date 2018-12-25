

export type Env = Map<String, any>;
export type Comparable = Number | String;

export abstract class Base {
  abstract apply(env: Env): any;
}
export class Prop extends Base {
  constructor(public rootSymbol: string, public next: string | Prop) {
    super();
  }
  apply(env: Env) {
    if (this.next instanceof Prop) {
      return this.next.apply(env.get(this.rootSymbol));
    } else {
      return env.get(this.rootSymbol).get(this.next);
    }
  }
}
export class Const extends Base {
  constructor(public value: Comparable) {
    super();
  }
  apply(_env: Env) {
    return this.value;
  }
}

export abstract class Operator extends Base {
  constructor(public left: Base, public right: Base) {
    super();
  }
}

export abstract class SetWiseOperator extends Operator {
  abstract get rawOperator(): (l: Boolean, r: Boolean) => Boolean;
  apply(env: Env): Boolean {
    return this.rawOperator(this.left.apply(env), this.right.apply(env));
  }
}

export abstract class ComparatorOperator extends Operator {
  abstract get rawOperator(): (l: Comparable, r: Comparable) => Boolean;
  apply(env: Env): Boolean {
    return this.rawOperator(this.left.apply(env), this.right.apply(env));
  }
}


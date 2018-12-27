import { SetWiseOperator, UnaryOperator } from "./forms";

export class OrOperator extends SetWiseOperator {
  get rawOperator(): (l: Boolean, r: Boolean) => Boolean {
    return (l: Boolean, r: Boolean) => l || r;
  }
}
export class AndOperator extends SetWiseOperator {
  get rawOperator(): (l: Boolean, r: Boolean) => Boolean {
    return (l: Boolean, r: Boolean) => l && r;
  }
}
export class NotOperator extends UnaryOperator {
  apply(env: Map<String, any>): Boolean {
    return !this.param.apply(env);
  }
}
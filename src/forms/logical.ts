import { SetWiseOperator, UnaryOperator } from "./forms";
import { odata } from "../plugins/plugin_attribute";

@odata("or")
export class OrOperator extends SetWiseOperator {
  get rawOperator(): (l: Boolean, r: Boolean) => Boolean {
    return (l: Boolean, r: Boolean) => l || r;
  }
}
@odata("and")
export class AndOperator extends SetWiseOperator {
  get rawOperator(): (l: Boolean, r: Boolean) => Boolean {
    return (l: Boolean, r: Boolean) => l && r;
  }
}
@odata("not")
export class NotOperator extends UnaryOperator {
  apply(env: Map<String, any>): Boolean {
    return !this.param.apply(env);
  }
}
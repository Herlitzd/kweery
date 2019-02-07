import { ComparatorOperator, Comparable } from "./forms";
import { odata } from "../plugins/plugin_attribute";

@odata("eq")
export class EqualOperator extends ComparatorOperator {
  get rawOperator(): (l: Comparable, r: Comparable) => Boolean {
    return (l: Comparable, r: Comparable) => l === r;
  }
}
@odata("ne")
export class NotEqualOperator extends ComparatorOperator {
  get rawOperator(): (l: Comparable, r: Comparable) => Boolean {
    return (l: Comparable, r: Comparable) => l !== r;
  }
}
@odata("le")
export class LessThanOrEqualOperator extends ComparatorOperator {
  get rawOperator(): (l: Comparable, r: Comparable) => Boolean {
    return (l: Comparable, r: Comparable) => l <= r;
  }
}
@odata("lt")
export class LessThanOperator extends ComparatorOperator {
  get rawOperator(): (l: Comparable, r: Comparable) => Boolean {
    return (l: Comparable, r: Comparable) => l < r;
  }
}
@odata("ge")
export class GreaterThanOrEqualOperator extends ComparatorOperator {
  get rawOperator(): (l: Comparable, r: Comparable) => Boolean {
    return (l: Comparable, r: Comparable) => l >= r;
  }
}
@odata("gt")
export class GreaterThanOperator extends ComparatorOperator {
  get rawOperator(): (l: Comparable, r: Comparable) => Boolean {
    return (l: Comparable, r: Comparable) => l > r;
  }
}
@odata("has")
export class ContainsOperator extends ComparatorOperator {
  get rawOperator(): (l: Comparable, r: Comparable) => Boolean {
    return (l: Comparable, r: Comparable) => {
      if (typeof r != 'string' || typeof l != 'string') return false;
      return l.toLowerCase().includes(r.toLowerCase());
    }
  }
}

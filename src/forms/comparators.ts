import { ComparatorOperator, Comparable } from "./forms";

export class EqualOperator extends ComparatorOperator {
  get rawOperator(): (l: Comparable, r: Comparable) => Boolean {
    return (l: Comparable, r: Comparable) => l === r;
  }
}
export class NotEqualOperator extends ComparatorOperator {
  get rawOperator(): (l: Comparable, r: Comparable) => Boolean {
    return (l: Comparable, r: Comparable) => l !== r;
  }
}
export class LessThanOrEqualThanOperator extends ComparatorOperator {
  get rawOperator(): (l: Comparable, r: Comparable) => Boolean {
    return (l: Comparable, r: Comparable) => l <= r;
  }
}
export class LessThanThanOperator extends ComparatorOperator {
  get rawOperator(): (l: Comparable, r: Comparable) => Boolean {
    return (l: Comparable, r: Comparable) => l < r;
  }
}
export class GreaterThanOrEqualThanOperator extends ComparatorOperator {
  get rawOperator(): (l: Comparable, r: Comparable) => Boolean {
    return (l: Comparable, r: Comparable) => l >= r;
  }
}
export class GreaterThanThanOperator extends ComparatorOperator {
  get rawOperator(): (l: Comparable, r: Comparable) => Boolean {
    return (l: Comparable, r: Comparable) => l > r;
  }
}
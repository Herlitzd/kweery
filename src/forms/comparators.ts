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
export class LessThanOrEqualOperator extends ComparatorOperator {
  get rawOperator(): (l: Comparable, r: Comparable) => Boolean {
    return (l: Comparable, r: Comparable) => l <= r;
  }
}
export class LessThanOperator extends ComparatorOperator {
  get rawOperator(): (l: Comparable, r: Comparable) => Boolean {
    return (l: Comparable, r: Comparable) => l < r;
  }
}
export class GreaterThanOrEqualOperator extends ComparatorOperator {
  get rawOperator(): (l: Comparable, r: Comparable) => Boolean {
    return (l: Comparable, r: Comparable) => l >= r;
  }
}
export class GreaterThanOperator extends ComparatorOperator {
  get rawOperator(): (l: Comparable, r: Comparable) => Boolean {
    return (l: Comparable, r: Comparable) => l > r;
  }
}
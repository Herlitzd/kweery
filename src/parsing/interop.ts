import { CstNode, CstElement, IToken } from "chevrotain";
import { Base, Const, Prop } from "../forms/forms";
import { LessThanOperator, EqualOperator, GreaterThanOperator, NotEqualOperator, LessThanOrEqualOperator, GreaterThanOrEqualOperator } from "../forms/comparators";
import { AndOperator, OrOperator } from "../forms/logical";


function isCstNode(cst: CstElement): cst is CstNode {
  return !!cst['name'];
}
function isIToken(cst: CstElement): cst is IToken {
  return !!cst['image'];
}

export function translateToAst(tree: CstElement | CstElement[]): Base {
  // chevrotain likes to return arrays with single elements
  if (Array.isArray(tree)) return translateToAst(tree[0]);
  // At the moment all IToken elements are handled directly, so we can
  // help the compiler and discriminate the type here.
  if (!isCstNode(tree)) throw "Unexpected top level Token";
  switch (tree.name) {
    // return translateToAst(tree.children.genericStatement || tree.children.parenStatement);
    case 'parenStatement':
      return translateToAst(tree.children.statement);
    case 'genericStatement':
      return translateToAst(tree.children.expression);
    case 'statement':
      if (tree.children.booleanOperator) {
        // Handle greedy parser case with Boolean Op
        return getBooleanOperator(tree.children.booleanOperator[0],
          translateToAst(tree.children.genericStatement || tree.children.parenStatement),
          translateToAst(tree.children.statement));
      } else {
        return translateToAst(tree.children.genericStatement || tree.children.parenStatement);
      }
    case 'expression':
      return getComparator(tree.children.binaryOperator[0],
        translateToAst(tree.children.lhs),
        translateToAst(tree.children.rhs));
    case 'accessorExpression':
      return getProp(tree.children.Identifier)
    case 'constExpression':
      if (tree.children.Number) {
        return new Const(parseFloat((<IToken>tree.children.Number[0]).image));
      } else {
        // Remove the single quotes
        return new Const((<IToken>tree.children.QuotedIdentifier[0]).image.replace(/\'/g, ''));
      }
    default:
      console.error(tree);
      throw `Unexpected CST Node. ${tree.name}`;
  }
}
function getComparator(comparator: CstElement, left: Base, right: Base): Base {
  if (!isCstNode(comparator)) throw "Illegal Comparator form";
  if (comparator.children.GreaterThan) {
    return new GreaterThanOperator(left, right);
  } else if (comparator.children.LessThan) {
    return new LessThanOperator(left, right);
  } else if (comparator.children.Equals) {
    return new EqualOperator(left, right);
  } else if (comparator.children.NotEqual) {
    return new NotEqualOperator(left, right);
  } else if (comparator.children.LessThanOrEqual) {
    return new LessThanOrEqualOperator(left, right);
  } else if (comparator.children.GreaterThanOrEqual) {
    return new GreaterThanOrEqualOperator(left, right);
  }
}
function getProp(fields: CstElement[]) {
  let top = fields.shift();
  if (!isIToken(top)) throw "Illegal Property form";
  if (fields.length == 0) {
    return new Prop(top.image, null);
  }
  return new Prop(top.image, getProp(fields));
}
function getBooleanOperator(operator: CstElement, left: Base, right: Base): Base {
  if (!isCstNode(operator)) throw "Illegal Operator Boolean form";
  if (operator.children.AND) {
    return new AndOperator(left, right);
  } else {
    return new OrOperator(left, right);
  }
}
import { CstNode, CstElement, IToken } from "chevrotain";
import { Base, Const, Prop } from "./forms/forms";
import { LessThanThanOperator, EqualOperator, GreaterThanThanOperator } from "./forms/comparators";
import { AndOperator, OrOperator } from "./forms/logical";




export function translateToAst(tree: CstNode): Base {
  switch (tree.name) {
    case 'statement':
      if (tree.children.booleanOperator) {
        return getBooleanOperator(<CstNode>tree.children.booleanOperator[0],
          translateToAst(<CstNode>tree.children.expression[0]),
          translateToAst(<CstNode>tree.children.statement[0]));
      } else {
        return translateToAst(<CstNode>tree.children.expression[0]);
      }
    case 'expression':
      return getComparator(<CstNode>tree.children.binaryOperator[0],
        translateToAst(<CstNode>tree.children.lhs[0]),
        translateToAst(<CstNode>tree.children.rhs[0]));
    case 'accessorExpression':
      return getProp(tree.children.Identifier)
    case 'constExpression':
      if (tree.children.Number) {
        return new Const(parseFloat((<IToken>tree.children.Number[0]).image));
      } else {
        return new Const((<IToken>tree.children.QuotedIdentifier[0]).image.replace(/\'/g, ''));
      }
    default:
      console.error(tree);
      throw `Unexpected CST Node. ${tree.name}`;
  }
}
function getComparator(operator: CstNode, left: Base, right: Base): Base {
  if (operator.children.GreaterThan) {
    return new GreaterThanThanOperator(left, right);
  } else if (operator.children.LessThan) {
    return new LessThanThanOperator(left, right);
  } else if (operator.children.Equals) {
    return new EqualOperator(left, right);
  }
}
function getProp(fields: CstElement[]) {
  if (fields.length == 1) {
    return (<IToken>fields.shift()).image;
  }
  return new Prop((<IToken>fields.shift()).image, getProp(fields));
}
function getBooleanOperator(operator: CstNode, left: Base, right: Base): Base {
  if (operator.children.AND) {
    return new AndOperator(left, right);
  } else {
    return new OrOperator(left, right);
  }
}
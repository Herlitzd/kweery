import { Base, Const, Prop } from "./forms/forms";
import { KweeryLexer, KweeryParser } from "./kweery_lexer";
import { CstNode, IToken, CstElement } from "chevrotain";
import { AndOperator, OrOperator } from "./forms/logical";
import { GreaterThanThanOperator, LessThanThanOperator, EqualOperator } from "./forms/comparators";


export class Kweery {
  private lexer = new KweeryLexer();
  private parser = new KweeryParser(this.lexer);



  private translateToAst(tree: CstNode): Base {
    switch (tree.name) {
      case 'statement':
        if (tree.children.booleanOperator) {
          return this.getBooleanOperator(<CstNode>tree.children.booleanOperator[0],
            this.translateToAst(<CstNode>tree.children.expression[0]),
            this.translateToAst(<CstNode>tree.children.statement[0]));
        } else {
          return this.translateToAst(<CstNode>tree.children.expression[0]);
        }
      case 'expression':
        return this.getComparator(<CstNode>tree.children.binaryOperator[0],
          this.translateToAst(<CstNode>tree.children.lhs[0]),
          this.translateToAst(<CstNode>tree.children.rhs[0]));
      case 'accessorExpression':
        return this.getProp(tree.children.Identifier)
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
  private getComparator(operator: CstNode, left: Base, right: Base): Base {
    if (operator.children.GreaterThan) {
      return new GreaterThanThanOperator(left, right);
    } else if (operator.children.LessThan) {
      return new LessThanThanOperator(left, right);
    } else if (operator.children.Equals) {
      return new EqualOperator(left, right);
    }
  }
  private getProp(fields: CstElement[]) {
    if (fields.length == 1) {
      return (<IToken>fields.shift()).image;
    }
    return new Prop((<IToken>fields.shift()).image, this.getProp(fields));
  }
  private getBooleanOperator(operator: CstNode, left: Base, right: Base): Base {
    if (operator.children.AND) {
      return new AndOperator(left, right);
    } else {
      return new OrOperator(left, right);
    }
  }
  public parse(query: string) {
    let tokenized = this.lexer.tokenize(query);
    let parsed = this.parser.parse(tokenized.tokens);

    let ast = this.translateToAst(parsed);

    return ast;
  }
}

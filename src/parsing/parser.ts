import {
  createToken,
  Lexer,
  Parser,
  IToken,
  CstNode
} from "chevrotain"
import { KweeryLexer } from "./lexer";

export class KweeryParser extends Parser {
  constructor(lexer: KweeryLexer) {
    super(lexer.tokens);
    const $: any = this;
    const tokens = lexer.tokens;

    $.RULE("statement", () => {
      $.SUBRULE($.expression);
      this.MANY(() => {
        $.SUBRULE($.booleanOperator);
        $.SUBRULE1($.statement);
      })
    });

    $.RULE("expression", () => {
      $.SUBRULE($.accessorExpression, { LABEL: "lhs" })
      $.SUBRULE($.binaryOperator)
      $.SUBRULE2($.constExpression, { LABEL: "rhs" })
    })
    $.RULE("booleanOperator", () => {
      $.OR([
        { ALT: () => $.CONSUME(tokens.And) },
        { ALT: () => $.CONSUME(tokens.Or) },
      ])
    })

    $.RULE("binaryOperator", () => {
      $.OR([
        { ALT: () => $.CONSUME(tokens.GreaterThan) },
        { ALT: () => $.CONSUME(tokens.Equals) },
        { ALT: () => $.CONSUME(tokens.LessThan) }
      ])
    })
    $.RULE("accessorExpression", () => {
      this.MANY_SEP({
        SEP: tokens.Period, DEF: () => {
          this.CONSUME(tokens.Identifier)
        }
      });
    })

    $.RULE("constExpression", () => {
      $.OR([
        { ALT: () => $.CONSUME(tokens.Number) },
        { ALT: () => $.CONSUME(tokens.QuotedIdentifier) }
      ])
    })
    this.performSelfAnalysis();
  }
  parse(tokens: IToken[]): CstNode {
    this.input = tokens;
    return this['statement']();
  }
}
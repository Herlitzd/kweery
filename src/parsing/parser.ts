import {
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

    $.RULE("genericStatement", () => {
      $.SUBRULE($.expression);
    });
    $.RULE('statement', () => {
      $.OR([
        { ALT: () => $.SUBRULE($.genericStatement) },
        { ALT: () => $.SUBRULE($.parenStatement) }
      ]);
      this.MANY(() => {
        $.SUBRULE($.booleanOperator);
        $.SUBRULE1($.statement);
      });
    });

    $.RULE("parenStatement", () => {
      $.CONSUME(tokens.LParen);
      $.SUBRULE($.statement);
      $.CONSUME(tokens.RParen);
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
        { ALT: () => $.CONSUME(tokens.GreaterThanOrEqual) },
        { ALT: () => $.CONSUME(tokens.Equals) },
        { ALT: () => $.CONSUME(tokens.NotEqual) },
        { ALT: () => $.CONSUME(tokens.LessThan) },
        { ALT: () => $.CONSUME(tokens.LessThanOrEqual) },
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
  parse(tokens: IToken[]): Promise<CstNode> {
    return new Promise((resolve, reject) => {
      this.input = tokens;
      let result = this['statement']();
      if (this.errors.length) {
        reject(this.errors);
      } else {
        resolve(result);
      }
    });
  }
}
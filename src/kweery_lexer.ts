import {
  createToken,
  Lexer,
  Parser,
  IToken,
  CstNode
} from "chevrotain"


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

export class KweeryLexer {
  private identifier = createToken({ name: "Identifier", pattern: /[a-zA-Z]\w*/ });
  private identifiers = {
    WhiteSpace: createToken({
      name: "WhiteSpace",
      pattern: /\s+/,
      group: Lexer.SKIPPED
    }),
    QuotedIdentifier: createToken({ name: "QuotedIdentifier", pattern: /\'[a-zA-Z]\w*\'/ }),
    And: createToken({
      name: "AND",
      pattern: /AND/i,
      longer_alt: this.identifier
    }),
    Or: createToken({
      name: "OR",
      pattern: /OR/i,
      longer_alt: this.identifier
    }),
    Period: createToken({ name: "Period", pattern: /\./ }),
    Number: createToken({ name: "Number", pattern: /\d+(\.\d*)?/ }),
    GreaterThan: createToken({ name: "GreaterThan", pattern: />/ }),
    Equals: createToken({ name: "Equals", pattern: /=/ }),
    LessThan: createToken({ name: "LessThan", pattern: /</ }),
    Identifier: this.identifier
  };

  public get tokens() {
    return this.identifiers;
  }

  lexer: Lexer = new Lexer(Object.values(this.tokens));

  public tokenize(input: string) {
    return this.lexer.tokenize(input);
  }
}

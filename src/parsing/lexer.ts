import {
  createToken,
  Lexer,
  Parser,
  IToken,
  CstNode
} from "chevrotain"

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

    LParen: createToken({ name: "LParen", pattern: /\(/ }),
    RParen: createToken({ name: "RParen", pattern: /\)/ }),

    Period: createToken({ name: "Period", pattern: /\./ }),
    Number: createToken({ name: "Number", pattern: /\d+(\.\d*)?/ }),
    Contains: createToken({ name: "Contains", pattern: /~/ }),
    GreaterThanOrEqual: createToken({ name: "GreaterThanOrEqual", pattern: />=/ }),
    GreaterThan: createToken({ name: "GreaterThan", pattern: />/ }),
    Equals: createToken({ name: "Equals", pattern: /=/ }),
    NotEqual: createToken({ name: "NotEqual", pattern: /!=/ }),
    LessThanOrEqual: createToken({ name: "LessThanOrEqual", pattern: /<=/ }),
    LessThan: createToken({ name: "LessThan", pattern: /</ }),
    Identifier: this.identifier
  };

  public get tokens() {
    return this.identifiers;
  }

  lexer: Lexer = new Lexer(Object.values(this.tokens));

  public tokenize(input: string): Promise<IToken[]> {
    return new Promise((resolve, reject) => {
      let result = this.lexer.tokenize(input);
      if (result.errors.length) {
        reject(result.errors);
      } else {
        resolve(result.tokens);
      }
    });
  }
}

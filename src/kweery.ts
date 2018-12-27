import { KweeryLexer } from "./parsing/lexer";
import { translateToAst } from "./interop";
import { KweeryParser } from "./parsing/parser";


export class Kweery {
  private lexer = new KweeryLexer();
  private parser = new KweeryParser(this.lexer);


  public parse(query: string) {
    let tokenized = this.lexer.tokenize(query);
    let parsed = this.parser.parse(tokenized.tokens);
    let ast = translateToAst(parsed);
    return ast;
  }

  public exec<T>(query: string, values: T[]) {
    let evaluator = this.parse(query);
    return values.filter(row => evaluator.apply(row));
  }
}

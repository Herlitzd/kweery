import { KweeryLexer } from "./parsing/lexer";
import { translateToAst } from "./interop";
import { KweeryParser } from "./parsing/parser";
import { Env } from "./forms/forms";


export class Kweery {
  // TODO: This lexer should be static
  private lexer = new KweeryLexer();
  private parser = new KweeryParser(this.lexer);

  /**
   * Get the AST for your query string. More than likely this is not what you want.
   * @param query string query
   */
  public parse(query: string) {
    let tokenized = this.lexer.tokenize(query);
    let parsed = this.parser.parse(tokenized.tokens);
    let ast = translateToAst(parsed);
    return ast;
  }

  /**
   * getPredicateFor some query string
   * @param query string query
   */
  public getPredicateFor(query: string): (env: Env) => Boolean {
    return this.parse(query).apply
  }

  /**
   * execute a query over a collection of elements
   * @param query string query
   * @param valuesToFilter array of values to operate over
   */
  public exec<T>(query: string, valuesToFilter: T[]) {
    let evaluator = this.parse(query);
    return valuesToFilter.filter(row => evaluator.apply(row));
  }
}

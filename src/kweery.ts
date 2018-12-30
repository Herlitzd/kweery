import { KweeryLexer } from "./parsing/lexer";
import { translateToAst } from "./parsing/interop";
import { KweeryParser } from "./parsing/parser";
import { Env, Base } from "./forms/forms";


export class Kweery {
  private static lexer = new KweeryLexer();
  private static parser = new KweeryParser(Kweery.lexer);

  /**
   * Get the AST for your query string. More than likely this is not what you want.
   * @param query string query
   */
  public static async parse(query: string): Promise<Base> {
    let tokens = await this.lexer.tokenize(query);
    let parsed = await this.parser.parse(tokens);
    let ast = translateToAst(parsed);
    return ast;
  }

  /**
   * getPredicateFor some query string
   * @param query string query
   */
  public static async getPredicateFor(query: string): Promise<(env: Env) => Boolean> {
    let ast = await this.parse(query)
    return ast.apply
  }

  /**
   * execute a query over a collection of elements
   * @param query string query
   * @param valuesToFilter array of values to operate over
   */
  public static async exec<T>(query: string, valuesToFilter: T[]) {
    let ast = await this.parse(query);
    return valuesToFilter.filter(row => ast.apply(row));
  }
}

import { IPlugin } from "./iplugin";
import { Base, BinaryOperator, UnaryOperator, Const, Prop } from "../forms/forms";
import { Kweery } from "../kweery";




export default class ODataProxy implements IPlugin {
  async GetFilter(query: string): Promise<string> {
    let ast = await Kweery.parse(query);
    return this.convertToODataFilter(ast);
  }

  private convertToODataFilter(ast: Base): string {
    return this.compileToOdata(ast);
  }
  private merge(...args: string[]) {
    return args.join(" ");
  }

  private compileToOdata(ast: Base) {
    if (this.isBinaryOperator(ast)) {
      return this.merge(this.compileToOdata(ast.left), this.toLiteral(ast), this.compileToOdata(ast.right));
    } else {
      return this.toLiteral(ast);
    }
  }
  //   case Const:
  //     return ast.apply({});
  //   case Prop:
  //     if (this.isProp(ast)) {
  //       return this.propToString(ast);
  //     }
  // }


  private toLiteral(ast: Base) {
    switch (true) {
      case ast instanceof BinaryOperator:
      case ast instanceof UnaryOperator:
        return ast.odata;
      case ast instanceof Const:
        if (this.isConst(ast)) {
          if (typeof (ast.value) === "string") {
            return `'${ast.value}'`
          } else {
            return ast.value.toString();
          }
        }
        return ast.apply({});
      case ast instanceof Prop:
        if (this.isProp(ast)) {
          return this.propToString(ast);
        }
    }
  }

  propToString(prop: Prop) {
    if (prop.next == null) {
      return prop.rootSymbol;
    } else if (prop.next instanceof Prop) {
      return prop.rootSymbol + "." + this.propToString(prop.next);
    } else {
      return prop.rootSymbol;
    }
  }
  // This shouldn't have to exist
  isProp(ast: Base): ast is Prop {
    return ast.constructor == Prop;
  }
  isConst(ast: Base): ast is Const {
    return ast.constructor == Const;
  }

  isBinaryOperator(ast: Base): ast is BinaryOperator {
    return ast instanceof BinaryOperator;
  }
}

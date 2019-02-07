import { Base } from "src/forms/forms";

export interface IPlugin {
  GetFilter(query: string): Promise<string>;
  // GetFilter(ast: Base): string;
}
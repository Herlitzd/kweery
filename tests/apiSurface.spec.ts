import { Kweery as k } from "../src/kweery";
import { Base } from "../src/forms/forms";


let input = [{ age: 54 }, { age: 56 }];

test("predicate", async () => {
  let pred = await k.getPredicateFor("age < 55");
  expect(typeof pred).toBe("function");
  expect(pred(input[0])).toBeTruthy();
  expect(pred(input[1])).toBeFalsy();
});

test("exec", async () => {
  let result = await k.exec("age < 55", input);
  expect(Array.isArray(result)).toBeTruthy();
  expect(result.length).toBe(1);
  expect(result[0]).toMatchObject({ age: 54 });
});

test("parse", async () => {
  let ast = await k.parse("age < 55");
  expect(ast.apply(input[0])).toBeTruthy();
  expect(ast.apply(input[1])).toBeFalsy();
});

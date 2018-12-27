import { AndOperator, OrOperator } from "../src/forms/logical";
import { EqualOperator, GreaterThanThanOperator, NotEqualOperator } from "../src/forms/comparators";
import { Prop, Const } from "../src/forms/forms";

let ast = new AndOperator(
  new EqualOperator(new Prop("t", "name"), new Const("Sam")),
  new OrOperator(
    new GreaterThanThanOperator(new Prop("t", "age"), new Const(19)),
    new NotEqualOperator(new Prop("t", "id"), new Const(null))));

test('no-match: name mismatch', () => {
  let env = { t: { name: "Harry" } };
  expect(ast.apply(env)).toBeFalsy();
});
test('match: name matches, and age above threshold', () => {
  let env = { t: { age: 20, name: "Sam" } };
  expect(ast.apply(env)).toBeTruthy();
});
test('no-match: name matches, but age below threshold and id is null', () => {
  let env = { t: { id: null, name: "Sam" } };
  expect(ast.apply(env)).toBeFalsy();
});
test('match: name matches, and id is not null,', () => {
  let env = { t: { id: 1, name: "Sam" } };
  expect(ast.apply(env)).toBeTruthy();
});
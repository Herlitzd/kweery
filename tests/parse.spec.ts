import { Kweery } from "../src/kweery";

test("parse", () => {
  let k = new Kweery();
  let out = k.parse("t.name = 'Sam' and t.age > 19.50001");
  // let out = k.parse("t.name = 'Sam'")
  console.log(out);
  let env = { t: { name: "Sam", age: 20 } };
  expect(out.apply(env)).toBeTruthy();
  env = { t: { name: "Harry", age: 20 } };
  expect(out.apply(env)).toBeFalsy();
  env = { t: { name: "Sam", age: 19 } };
  expect(out.apply(env)).toBeFalsy();
});
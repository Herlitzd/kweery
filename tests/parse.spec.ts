import { Kweery } from "../src/kweery";

test("parse", () => {
  let k = new Kweery();
  let out = k.parse("t.name = 'Sam' and t.age > 19.50001");
  // let out = k.parse("t.name = 'Sam'")
  console.log(out);
  let env = new Map(Object.entries({ t: new Map(Object.entries({ name: "Sam", age: 20 })) }));
  expect(out.apply(env)).toBeTruthy();
  env = new Map(Object.entries({ t: new Map(Object.entries({ name: "Harry", age: 20 })) }));
  expect(out.apply(env)).toBeFalsy();
  env = new Map(Object.entries({ t: new Map(Object.entries({ name: "Sam", age: 19 })) }));
  expect(out.apply(env)).toBeFalsy();
});
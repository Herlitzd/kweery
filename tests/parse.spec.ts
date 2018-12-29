import { Kweery } from "../src/kweery";

test("successful parse", async () => {
  let k = new Kweery();
  let out = await k.parse("t.name = 'Sam' and t.age > 19.50001");
  let env = { t: { name: "Sam", age: 20 } };
  expect(out.apply(env)).toBeTruthy();
  env = { t: { name: "Harry", age: 20 } };
  expect(out.apply(env)).toBeFalsy();
  env = { t: { name: "Sam", age: 19 } };
  expect(out.apply(env)).toBeFalsy();
});

test("failed parse", async () => {
  expect.assertions(1);
  let k = new Kweery();
  await k.parse("t.name = 'Sam' t.age > 19")
    .catch(e => {
      console.log(e);
      expect(e.length).toBeTruthy();
    });
});
import { Kweery as k } from "../src/kweery";
import { Base } from "../src/forms/forms";

function expectErr(prom: Promise<Base>) {
  prom.catch(e => {
    expect(e.length).toBeTruthy();
  });
}

test("successful parse", async () => {
  let out = await k.parse("t.name = 'Sam' and t.age > 19.50001");
  let env = { t: { name: "Sam", age: 20 } };
  expect(out.apply(env)).toBeTruthy();
  env = { t: { name: "Harry", age: 20 } };
  expect(out.apply(env)).toBeFalsy();
  env = { t: { name: "Sam", age: 19 } };
  expect(out.apply(env)).toBeFalsy();
});

test("failed parse: missing operator", async () => {
  expect.assertions(1);
  expectErr(k.parse("t.name = 'Sam' t.age > 19"));
});

test("failed parse: missing accessor part", async () => {
  expect.assertions(1);
  expectErr(k.parse("t. = 'Sam'"));
});

test("failed parse: missing expression rhs", async () => {
  expect.assertions(1);
  expectErr(k.parse("t.name ="));
});

test("failed parse: missing expression rhs with valid following expression", async () => {
  expect.assertions(1);
  expectErr(k.parse("t.name = and t.age < 19"));
});

test("failed parse: single tokens", async () => {
  let tokens = ["and", "or", "=", "<", ">", "<=", ">=", "t.apple", "t", "t.", ".t"];
  expect.assertions(tokens.length);
  tokens.forEach(token => {
    expectErr(k.parse(token));
  });
});

test("failed parse: double quotes instead of single", async () => {
  expect.assertions(1);
  expectErr(k.parse("t.name = \"Sam\" and t.age < 19"));
});

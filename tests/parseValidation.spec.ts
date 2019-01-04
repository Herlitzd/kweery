import { Kweery as k } from "../src/kweery";
import { Base } from "../src/forms/forms";

function expectErr(prom: Promise<Base>) {
  return prom.catch(e => {
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

test("success with parens", async () => {
  let env = { t: { name: "Sam", age: 2, id: 5 } };
  let out1 = await k.parse("t.id = 5 or (t.name = 'Sam' and t.age = 1)");
  expect(out1.apply(env)).toBeTruthy();
  let out2 = await k.parse("(t.id = 5 or t.name = 'Sam') and t.age = 1");
  expect(out2.apply(env)).toBeFalsy();
});

test("arbitrary parens", async () => {
  let env = { t: { name: "Sam", age: 2, id: 5 } };
  let out1 = await k.parse("((t.name = 'Sam' and t.age = 2))");
  expect(out1.apply(env)).toBeTruthy();
  out1 = await k.parse("((t.id = 5) or (t.name = 'Sam' and t.age = 1))");
  expect(out1.apply(env)).toBeTruthy();
  out1 = await k.parse("((t.id = 5) or ((((t.name = 'Sam' and t.age = 1)))))");
  expect(out1.apply(env)).toBeTruthy();
});

test("failed parse: bad parens", async () => {
  expect.assertions(9);
  await expectErr(k.parse("(t.name = 'Sam' and t.age > 19"));
  await expectErr(k.parse("t.name = 'Sam' and t.age > 19)"));
  await expectErr(k.parse("((t.name = 'Sam' and t.age > 19)"));
  await expectErr(k.parse("(t.name = 'Sam' and t.age > 19))"));
  await expectErr(k.parse("t.name = 'Sam'() and t.age > 19"));
  await expectErr(k.parse("t.name = 'Sam') and t.age > 19"));
  await expectErr(k.parse("t.name = 'Sam' (and t.age > 19"));
  await expectErr(k.parse("t.name = 'Sam' and t.age (> 19)"));
  await expectErr(k.parse("t.name = 'Sam' (and t.age > 19)"));
});

test("failed parse: missing operator", async () => {
  expect.assertions(1);
  await expectErr(k.parse("t.name = 'Sam' t.age > 19"));
});

test("failed parse: missing accessor part", async () => {
  expect.assertions(1);
  await expectErr(k.parse("t. = 'Sam'"));
});

test("failed parse: missing expression rhs", async () => {
  expect.assertions(1);
  await expectErr(k.parse("t.name ="));
});

test("failed parse: missing expression rhs with valid following expression", async () => {
  expect.assertions(1);
  await expectErr(k.parse("t.name = and t.age < 19"));
});

test("failed parse: invalid float", async () => {
  expect.assertions(1);
  await expectErr(k.parse("t.name = and t.age < 19f"));
});

test("failed parse: single tokens", async () => {
  let tokens = ["", " ", "and", "or", "=", "<", ">", "<=", ">=", "t.apple", "t", "t.", ".t"];
  expect.assertions(tokens.length);
  await Promise.all(
    tokens.map(token => {
      expectErr(k.parse(token));
    }));
});

test("failed parse: double quotes instead of single", async () => {
  expect.assertions(1);
  await expectErr(k.parse("t.name = \"Sam\" and t.age < 19"));
});
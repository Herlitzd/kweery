import { Kweery as k } from "../src/kweery";
import { Base } from "../src/forms/forms";

function expectErr(prom: Promise<Base>) {
  return prom.catch(e => {
    expect(e.length).toBeTruthy();
  });
}

test("successful parse", async () => {
  let out = await k.parse('t.name = "Sam" and t.age > 19.50001');
  let env = { t: { name: "Sam", age: 20 } };
  expect(out.apply(env)).toBeTruthy();
  env = { t: { name: "Harry", age: 20 } };
  expect(out.apply(env)).toBeFalsy();
  env = { t: { name: "Sam", age: 19 } };
  expect(out.apply(env)).toBeFalsy();
});

test("success with parens", async () => {
  let env = { t: { name: "Sam", age: 2, id: 5 } };
  let out1 = await k.parse('t.id = 5 or (t.name = "Sam" and t.age = 1)');
  expect(out1.apply(env)).toBeTruthy();
  let out2 = await k.parse('(t.id = 5 or t.name = "Sam") and t.age = 1');
  expect(out2.apply(env)).toBeFalsy();
});

test("arbitrary parens", async () => {
  let env = { t: { name: "Sam", age: 2, id: 5 } };
  let out1 = await k.parse('((t.name = "Sam" and t.age = 2))');
  expect(out1.apply(env)).toBeTruthy();
  out1 = await k.parse('((t.id = 5) or (t.name = "Sam" and t.age = 1))');
  expect(out1.apply(env)).toBeTruthy();
  out1 = await k.parse('((t.id = 5) or ((((t.name = "Sam" and t.age = 1)))))');
  expect(out1.apply(env)).toBeTruthy();
});

test("failed parse: bad parens", async () => {
  expect.assertions(9);
  await expectErr(k.parse('(t.name = "Sam" and t.age > 19"'));
  await expectErr(k.parse('t.name = "Sam" and t.age > 19)"'));
  await expectErr(k.parse('((t.name = "Sam" and t.age > 19)"'));
  await expectErr(k.parse('(t.name = "Sam" and t.age > 19))"'));
  await expectErr(k.parse('t.name = "Sam"() and t.age > 19"'));
  await expectErr(k.parse('t.name = "Sam") and t.age > 19"'));
  await expectErr(k.parse('t.name = "Sam" (and t.age > 19"'));
  await expectErr(k.parse('t.name = "Sam" and t.age (> 19)"'));
  await expectErr(k.parse('t.name = "Sam" (and t.age > 19)"'));
});

test("failed parse: missing operator", async () => {
  expect.assertions(1);
  await expectErr(k.parse('t.name = "Sam" t.age > 19"'));
});

test("failed parse: missing accessor part", async () => {
  expect.assertions(1);
  await expectErr(k.parse('t. = "Sam""'));
});

test("failed parse: missing expression rhs", async () => {
  expect.assertions(1);
  await expectErr(k.parse('t.name ="'));
});

test("failed parse: missing expression rhs with valid following expression", async () => {
  expect.assertions(1);
  await expectErr(k.parse('t.name = and t.age < 19"'));
});

test("failed parse: invalid float", async () => {
  expect.assertions(1);
  await expectErr(k.parse('t.name = and t.age < 19f"'));
});

test("failed parse: single tokens", async () => {
  let tokens = ["", " ", "and", "or", "=", "<", ">", "<=", ">=", "t.apple", "t", "t.", ".t"];
  expect.assertions(tokens.length);
  await Promise.all(
    tokens.map(token => {
      expectErr(k.parse(token));
    }));
});

test("failed parse: single quotes instead of double", async () => {
  expect.assertions(1);
  await expectErr(k.parse('t.name = \'Sam\' and t.age < 19'));
});

test("like operator for contains", async () => {
  let env = { t: { name: "Sam", age: 2, id: 5 } };
  let out = await k.parse('t.name ~ "Sam"');
  expect(out.apply(env)).toBeTruthy();
  out = await k.parse('t.name ~ "a"');
  expect(out.apply(env)).toBeTruthy();
  out = await k.parse('t.name ~ "sa"');
  expect(out.apply(env)).toBeTruthy();
  out = await k.parse('t.name ~ "am"');
});

test("like operator returns false", async () => {
  let env = { t: { name: "Sam", age: 2, id: 5 } };
  let out = await k.parse('t.name ~ 1');
  // At the moment this is the expected behaviour, whether that is
  // 'Correct' or not, is up for debate.
  expect(out.apply(env)).toBeFalsy();
});

test("quoted identifiers should now allow spaces", async () => {
  let env = { t: { name: "Sam is friendly" } };
  let out = await k.parse('t.name = "Sam is friendly"');
  expect(out.apply(env)).toBeTruthy();
});
test("quoted identifiers should now allow apostrophes", async () => {
  let env = { t: { name: "Don't look over there" } };
  let out = await k.parse("t.name = \"Don't look over there\"");
  expect(out.apply(env)).toBeTruthy();
});
test("quoted identifiers should now support escaping", async () => {
  let env = { t: { name: "Hi there, don't do 'that'" } };
  let out = await k.parse('t.name = "Hi there, don\'t do \'that\'"');
  expect(out.apply(env)).toBeTruthy();
});

import { Kweery as k } from "../src/kweery";
import { LessThanOperator, NotEqualOperator, EqualOperator } from "../src/forms/comparators";
import { Prop, Const } from "../src/forms/forms";
import { AndOperator, OrOperator } from "../src/forms/logical";



const ageLess23Ast = new LessThanOperator(new Prop("age"), new Const(23));
const ageLess23AndPieNotAbc = new AndOperator(ageLess23Ast,
  new NotEqualOperator(new Prop("pie"), new Const("abc")))

const ageLess23AndPieNotAbcOrNameSam = new AndOperator(ageLess23Ast,
  new OrOperator(new NotEqualOperator(new Prop("pie"), new Const("abc")),
    new EqualOperator(new Prop("name"), new Const("Sam"))));

const ageLess23AndPieNotAbcOrNameSamAndColorIsRed =
  new AndOperator(ageLess23Ast, new OrOperator(new NotEqualOperator(new Prop("pie"),
    new Const("abc")), new AndOperator(new EqualOperator(new Prop("name"), new Const("Sam")),
      new EqualOperator(new Prop("color"), new Const("red")))));

test("verify one condition ast", async () => {
  let ast = await k.parse("age < 23");
  expect(ast).toMatchObject(ageLess23Ast);
});

test("verify two condition ast", async () => {
  let ast = await k.parse("age < 23 and pie != 'abc'");
  expect(ast).toMatchObject(ageLess23AndPieNotAbc);
});

test("verify three condition ast", async () => {
  let ast = await k.parse("age < 23 and pie != 'abc' or name = 'Sam'");
  expect(ast).toMatchObject(ageLess23AndPieNotAbcOrNameSam);
});

test("verify four condition ast", async () => {
  let ast = await k.parse("age < 23 and pie != 'abc' or name = 'Sam' and color = 'red'");
  expect(ast).toMatchObject(ageLess23AndPieNotAbcOrNameSamAndColorIsRed);
});

const normalPrecedence = new OrOperator(
  new EqualOperator(new Prop('id'), new Const(1)),
  new AndOperator(
    new EqualOperator(new Prop('name'), new Const('Sam')),
    new EqualOperator(new Prop('age'), new Const(2))));

const parenPrecedence = new AndOperator(
  new OrOperator(
    new EqualOperator(new Prop('id'), new Const(1)),
    new EqualOperator(new Prop('name'), new Const('Sam'))),
  new EqualOperator(new Prop('age'), new Const(2)))

test("verify parens work for precedence", async () => {
  let ast = await k.parse("id = 1 or name = 'Sam' and age = 2");
  expect(ast).toMatchObject(normalPrecedence);
  ast = await k.parse("id = 1 or (name = 'Sam' and age = 2)");
  expect(ast).toMatchObject(normalPrecedence);
  ast = await k.parse("(id = 1 or name = 'Sam') and age = 2");
  expect(ast).toMatchObject(parenPrecedence);
});


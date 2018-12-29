import { name, random, seed } from "faker";
import { Kweery } from "../src/kweery";


let data;
beforeAll(() => {
  seed(12);
  data = Array.from({ length: 100_000 }, generateRow);
});

function generateRow() {
  return { first: name.firstName(), age: random.number(100), id: random.number(1000) };
}

test("perf: 2 AND",async () => {
  let time = Date.now();
  let k = new Kweery();
  let out = await k.exec("age < 21 and age > 9 and id > 0", data);
  console.log("AND", Date.now() - time);
  expect(out.length).toBeTruthy();
});
test("perf: 1 AND 1 OR", async () => {
  let time = Date.now();
  let k = new Kweery();
  let out = await k.exec("age < 21 and age > 9 or id < 60", data);
  console.log("OR", Date.now() - time);
  expect(out.length).toBeTruthy();
});
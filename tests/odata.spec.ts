import { Kweery as k } from "../src/kweery";
import { Base } from "../src/forms/forms";
import ODataProxy from "../src/plugins/odata_proxy";


test("odata_basic", async () => {
  let query = 't.name = "Sam"';
  let odata = new ODataProxy();
  let odata_query = await odata.GetFilter(query);
  expect(odata_query).toBe("t.name eq 'Sam'")
});

test("odata with AND", async () => {
  let query = 't.name = "Sam" and t.age > 19';
  let odata = new ODataProxy();
  let odata_query = await odata.GetFilter(query);
  expect(odata_query).toBe("t.name eq 'Sam' and t.age gt 19")
});
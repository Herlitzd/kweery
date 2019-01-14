[![Build Status](https://travis-ci.com/Herlitzd/kweery.svg?branch=master)](https://travis-ci.com/Herlitzd/kweery)

# Kweery
A framework agnostic query language for the web.

# Demo
[Live Demo](https://kweery.devonherlitz.solutions)

[Repo](https://github.com/Herlitzd/kweery-vue-poc)


## Examples and Notes
The language follows the basic form of what you would expect in a SQL where clause:

```sql
firstName = "Sam" or age >= 15
```

It should be noted that nested identifiers can be used as well. Such as:
```sql
t.firstName = "Sam" or t.age >= 15.5 and t.preferences.favoriteColor = "Red"
```

And that parenthesis can be used in order to express precedence:
```sql
(t.firstName = "Sam" or t.age >= 15.5) and t.preferences.favoriteColor = "Red"
```

Note that strings must be denoted with double quotes. And that all numbers are treated as floats, whether they are integers or not.

At the moment the following Binary Operators are supported.

||||||||
|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| < | > | >= | <= | = | != | ~ |
||||||| Contains |

For setwise operations, `AND` and `OR` are supported. As shown above, keywords/operators are not case sensitive, identifiers used to field access are.

## Using this Library
Kweery provides a few ways of being used depending on your needs.
First, if you can operate on a finite set of elements then you can use the `exec<T>` instance method from a Kweery object in order to filter an `T[]`.

```ts
import { Kweery } from "kweery";

let people: Person[] = [...];
let matchedSet = await Kweery.exec("age > 21 and age < 55", people);
```

If you need to apply a predicate to filter of a set that is perhaps not finite, you can use the `getPredicateFor()` instance method. This will return a predicate that can be used to filter items. Of course, it will return `true` for rows that meet the conditions, and `false` for all others.

```ts
import { Kweery } from "kweery";

let predicate = await Kweery.getPredicateFor("age > 21 and age < 55");

function onNewEntry(entry : Entry){
  if(predicate(entry)){
    pushToDisplay(entry);
  }
}
```

And lastly, if you want to get ahold of the AST yourself for whatever reason, perhaps saving to JSON or passing around, you can get it with;
```ts
import { Kweery } from "kweery";

let ast = await Kweery.parse("age > 21 and age < 55");
// If you want to execute the AST on an object, you can use the apply() method.
let meetsCriteria : boolean = ast.apply({age: 25, name: "Sam"});
```
# Basic Form

```sql
select * from TABLE as t
where
{
t.name = "Sam" and t.age > 19 or t.id != null
}
```

```lisp
(And 
    (= (Prop t (Field name)) (Const Sam))
    (Or 
      (> (Prop t (Field age)) (Const 19))
      (!= (Prop t (Field id)) (Const null)))
```

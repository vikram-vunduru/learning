# JavaScript Developer I (JSI) — CRT-600 Study Guide

## Exam Facts
| Detail | Value |
|--------|-------|
| Exam Code | CRT-600 |
| Questions | 60 |
| Time | ~105 minutes |
| Pass Score | 65% (39/60) |
| Cost | $200 |
| Format | Multiple choice + multi-select |

## Why This Exam Matters to Me
JSI tests JavaScript at the language level — the stuff that causes real bugs in LWC. Closures, `this` binding, Promises, event loop. Passing this means I can explain *why* my LWC code works, not just that it does.

## Exam Weight Breakdown
| Domain | Weight | Lectures |
|--------|--------|----------|
| Variables, Types & Operators | ~7% | L01 |
| Conditionals, Loops & Error Handling | ~8% | L02 |
| Functions, Scope & Closures | ~11% | L03, L04 |
| Objects, Arrays & Iterators | ~25% | L05–L09 |
| Classes & Modules | ~16% | L05–L07 |
| Asynchronous JavaScript | ~20% | L10 |
| Browser & Node APIs | ~13% | L11–L14 |

## 4-Week Study Plan

**Week 1 — Fundamentals (L01–L04)**
- Set up Node.js locally. Run every code example in the REPL.
- L01: `typeof` traps, coercion, `??` vs `||`
- L02: switch fall-through, for...of vs for...in, finally
- L03–L04: closures and the loop-var bug — extra time here. These are exam staples.

**Week 2 — Objects, Arrays & Iterators (L05–L08)**
- L05–L06: destructuring, spread, array methods — practice map/filter/reduce on real data
- L07: prototype chain — understand `Object.create()` and `hasOwnProperty`
- L08: iterators and generators — know the `{ value, done }` protocol cold

**Week 3 — Classes, Modules & Async (L09–L16)**
- L09–L10: `this` binding — this is the highest-risk area. Drill call/apply/bind and arrow vs regular
- L11: modules — live bindings, static vs dynamic import, tree shaking
- L12–L13: event loop, Promises, async/await — run every Promise ordering example by hand first
- L14–L16: Node.js, Jest testing, TypeScript basics

**Week 4 — LWC, Advanced Topics & Review (L17–L20 + exam prep)**
- L17–L20: LWC decorators, lifecycle hooks, performance, security
- Take 2 full practice exams timed. Review every wrong answer.
- Final day: light review of `this` binding and Promise ordering only.

## Practice Questions

**Q:** Which keyword creates a block-scoped binding that cannot be reassigned?
**A:** `const`. Note: `const` prevents re-assignment of the binding, not mutation of the value. `const arr = []; arr.push(1)` is legal.

**Q:** An arrow function in an LWC event handler correctly accesses `this.someProperty`, but a regular function does not. Why?
**A:** Arrow functions have no own `this` — they capture `this` lexically from the surrounding scope at definition time. In an LWC class method, that means the component instance. A regular function gets `this` determined by the call site; in strict mode (LWC uses strict), it's `undefined` when called as a callback.

**Q:** What does this print?
```javascript
console.log(typeof null);
console.log(typeof undefined);
console.log(null === undefined);
console.log(null == undefined);
```
**A:** `"object"`, `"undefined"`, `false`, `true`. The `typeof null === "object"` is a historical JS bug. `null == undefined` is `true` via the loose equality special rule — the one case where `==` is acceptable as an idiom.

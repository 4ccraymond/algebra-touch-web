// src/math/id.ts

let termCounter = 0;

export function nextTermId(): string {
  termCounter += 1;
  return `t-${termCounter}`;
}

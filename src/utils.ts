/**
 * @internal
 */
export function invariant(cond: any, message: string): asserts cond {
  if (!cond) throw new Error(message);
}

const alreadyWarned: { [message: string]: boolean } = {};

/**
 * @internal
 */
export function warnOnce(message: string, cond: boolean = false): void {
  if (!cond && !alreadyWarned[message]) {
    alreadyWarned[message] = true;
    console.warn(message);
  }
}

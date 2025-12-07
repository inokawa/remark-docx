/**
 * @internal
 */
export const unreachable = (_: never): never => {
  throw new Error("unreachable");
};

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
export function warnOnce(cond: boolean, message: string): void {
  if (!cond && !alreadyWarned[message]) {
    alreadyWarned[message] = true;
    console.warn(message);
  }
}

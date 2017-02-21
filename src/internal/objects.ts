export const assignSignature = <T1 extends T2, T2>(target: T1, ...sources: (T1 | T2)[]): T1 => {
  throw 'nope';
};

export const assign: typeof assignSignature = function (target: {}): {} {
  const args = arguments;
  const result = {};

  for (let i = 1, len = args.length; i < len; i++) {
    const nextSource = args[i];
    if (!nextSource) {
      continue;
    }
    for (const nextKey in nextSource) {
      if (nextSource.hasOwnProperty(nextKey)) {
        result[nextKey] = nextSource[nextKey];
      }
    }
  }

  return result;
};

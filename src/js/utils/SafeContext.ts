import React, { Context } from 'react';

type MaybeContext<T> = Context<T | undefined>;

export function useSafeContext<T>(ctx: MaybeContext<T>): () => T {
  return function(): T {
    const context = React.useContext(ctx as MaybeContext<T>);
    if (context === undefined) {
      throw new Error(`context must be used within the right Provider`);
    }

    return context;
  }
}

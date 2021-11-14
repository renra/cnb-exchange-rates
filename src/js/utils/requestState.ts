// Inspired by Elm's RemoteData
export type RequestState<T> =
    | {
        state: 'not_asked'
      }
    | {
        state: 'loading'
      }
    | {
        state: 'failure',
        error: string
      }
    | {
        state: 'success',
        response: T
      }


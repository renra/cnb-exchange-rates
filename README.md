# CNB Exchange Rates

## Development flow

```
$ docker-compose up
```

The project will be recompiled after each change (except for config - you have to restart docker-compose for those) and you can see them on `http://localhost:3000` (or whatever your port override is).


## About the bundling

* I did not want to use Webpack because it brings tons of additional complexity
* `tsc` cannot bundle the whole application on its own
* `swc` is promising and could even replace tsc in the future, but right now cannot bundle on its own either. There's a coming bundling feature called `spack` but it's not mature enough at this time.
* So, taking inspiration at the great Phoenix framework, I've used `esbuild` in the end in tandem with `tsc`

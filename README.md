# react-routing-resolver [![Build Status](https://travis-ci.org/azu/react-routing-resolver.svg?branch=master)](https://travis-ci.org/azu/react-routing-resolver)

React Routing component, but it does't mount component. 
Instead of, It just resolve routing.

## Features

- Tiny Routing library
- Not mount, but resolve path
- Support TypeScript

## Install

Install with [npm](https://www.npmjs.com/):

    npm install react-routing-resolver

## Usage

## Overview components

use `<Router>` and `<Route>` for declarative routing.

### `<Router>` component

`<Router>` component is a parent of `<Route>` component.

```jsx
<Router>
    <Route />
    <Route />
    <Route />
</Router>
```

### `<Router>` props

- `history`: a instance of [history package](https://github.com/ReactTraining/history)
- `currentPath`: current path(path is same format with `location.pathname`
- `onHistoryChange`: call the handler when the history is changed.

When the `path` is change, this library change the browser `history` by `history.pushState`.
And if the `path` match `<Route pattern={pattern} onMatch={onMatch}>`, call the `onMatch` handler.

```jsx
import createHistory from "history/createBrowserHistory";
const history = createHistory();
<Router history={history} currentPath="/path/to/name" onHistoryChange={onHistoryChange}>
    <Route pattern="/view/:id" onMatch={onViewChange}/>
    <Route pattern="*" onMatch={onMatchOther}/>
</Router>;
```

## `<Route>` props

- `pattern`: path pattern string
  - pattern is used of [Path-to-RegExp](https://github.com/pillarjs/path-to-regexp "Path-to-RegExp")
  - `*` is special symbol. This pattern is matched when other pattern is not matched.
- `onMatch`: register `onMatch` handler that is called the `pattern` is match.
  - When used [Named Parameters](https://github.com/pillarjs/path-to-regexp "Named Parameters"), pass the parameters object to `onMatch` handler.

```jsx
<Router {...props}>
    {/* `<Route>` should be in `<Router />` */}
    <Route pattern="/view/:id" onMatch={onViewChange}/>
</Router>
```

## Example of `<Router>` and `<Route>`

```jsx
import createHistory from "history/createBrowserHistory";
const history = createHistory();
import {Router, Route} from "react-routing-resolver";
// pass `:id` as parameters object
const onViewChange = ({ id }) => {
  
};
// not match any
const onMatchOther = () => {
};

<Router currentPath={router.path} history={history}>
    <Route pattern="/view/:id" onMatch={onViewChange}/>
    <Route pattern="*" onMatch={onMatchOther}/>
</Router>;
```

See [`__test__`](./src/__test__) for more details.

## Reference

- [tj/react-enroute: React router with a small footprint for modern browsers](https://github.com/tj/react-enroute)
- [lapwinglabs/enroute: tiny functional router](https://github.com/lapwinglabs/enroute)
- [You might not need React Router](https://medium.freecodecamp.com/you-might-not-need-react-router-38673620f3d)
    - It is similar approach.

## Changelog

See [Releases page](https://github.com/azu/react-routing-resolver/releases).

## Running tests

Install devDependencies and Run `npm test`:

    npm i -d && npm test

## Contributing

Pull requests and stars are always welcome.

For bugs and feature requests, [please create an issue](https://github.com/azu/react-routing-resolver/issues).

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## Author

- [github/azu](https://github.com/azu)
- [twitter/azu_re](https://twitter.com/azu_re)

## License

MIT © azu

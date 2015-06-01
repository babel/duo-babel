[![Build Status](https://travis-ci.org/duojs/babel.svg)](https://travis-ci.org/babel/duo-babel)

# duo-babel

> [duo](http://duojs.org)-plugin for [babel](/babel/babel).


## Installation

```sh
$ npm install duo-babel
```

## Usage

From the CLI:

```sh
$ duo --use duo-babel
```

Using the API:

```js
var Duo = require('duo');
var babel = require('duo-babel');

Duo(__dirname)
  .entry('index.js')
  .use(babel())
  .run(function (err, results) {
    // ...
  });
```

## API

### babel([options])

Initialize a duo plugin. Available `options`:

 - `extensions` a list of file extensions that should be transpiled (default: `['.js', '.jsx', '.es', '.es6']`)
 - `onlyLocals` specify that any remotes should not be transpiled
 - `only` a list of glob patterns to only transpile
 - `ignore` a list of glob patterns to not transpile (the opposite of `only`)
 - anything else is passed directly to [babel](https://babeljs.io/docs/usage/options/)


### Selective Transpiling

In many cases, `onlyLocals` is needed early on. Your local scripts need to be
transpiled, but most of your dependencies don't need it. However, as time goes
on and you publish your own dependencies using ES6, you'll need something more
selective.

You can add an array as either `only` _or_ `ignore` (not both) to selectively
enable babel's transpilation.

Your patterns should match the directory structure that duo uses. (and that you
can see on disk)

 - `lib/**.js` will match any JS file in the local lib dir
 - `components/lodash-lodash@*/**.js` will match any version of lodash
 - `components/component-*/**.js` will match anything in the [component](https://github.com/component) organization.


### Source Maps

ES6 source-maps are turned on automatically when duo has enabled source-maps,
this feature can be disabled by explicitly setting the `sourceMaps` option.


## License

The MIT License

Copyright (C) 2014 BDO a.s &lt;labs@bdo.no&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the "Software"),
to deal in the Software without restriction, including without limitation
the rights to use, copy, modify, merge, publish, distribute, sublicense,
and/or sell copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included
in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE
OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

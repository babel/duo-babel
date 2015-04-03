[![Build Status](https://travis-ci.org/duojs/babel.svg)](https://travis-ci.org/babel/duo-babel)

duo-babel
========

[duo](http://duojs.org)-plugin for [babel/babel](/babel/babel).


Installation
------------

    $ npm install duo-babel


Usage
-----

From the CLI:

    $ duo --use duo-babel

Using the API:

```javascript
Duo(root)
  .entry(entry)
  .use(to5)
  .run(fn);
```


API
---

__babel([opts])__
Initialize a duo plugin. `opts` are passed directly into babel.


License
-------

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

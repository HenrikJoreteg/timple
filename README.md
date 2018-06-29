# timple

![](https://img.shields.io/npm/dm/timple.svg)![](https://img.shields.io/npm/v/timple.svg)![](https://img.shields.io/npm/l/timple.svg)

An extremely simplistic template system for generating JS files from valid JS files.

Created primarily for templating ServiceWorker scripts.

**"What the crap, Henrik. Why?!"**

Stay with me... say you're templating out something like a ServiceWorker file. I want to be able to create my own `sw.js` file, I don't want some lib to generate the entire thing. _But_, inevitably I want to be able to inject some stuff, like for example, a file manifest as is required by [workbox](https://workboxjs.org) for precaching, as an example.

In addition, I may want to inject some JS library code like [sw-toolbox](https://github.com/GoogleChromeLabs/sw-toolbox) or workbox, or I may have some CDN urls that only apply when building for production.

But here's the thing, I don't want some full-fledged friggin' template language like handlebars or whatnot and here's the kicker: I want my template itself to _just be a normal javascript file_ you know?! One containing actual, valid JavaScript in it so my editor knows how to handle it if it just give it a `.js` file extension.

I basically want to be able to create a `sw.js` file in my project that looks something like this:

**sw.js**:

```js
// inject lib
'{{{ swLibraryCode }}}'

const workbox = new Workbox()

// file manifest
workbox.precache('{{{ fileManifest }}}')

workbox.route('/api', workbox.routing.networkOnly)
workbox.route('{{cdnUrl}}/images/*', workbox.routing.cacheFirst)
```

:point-up: note that the above is completely valid JavaScript.

Then as part of the build process, or if I want to serve the SW dynamically I want to be able to inject some variables into that JS file intellgently.

_That is what this library does._

There's no support for loops, no `if` statements, just simple interpolation with a twist:

Everything that is dynamic _must be a string_ in your original template. This ensures that the template itself is still valid JS, which keeps the editors (and their code coloring logic) happy.

Anything that is a string with triple curlies `'{{{ someVar }}}'` will turn into a literal, so for example if you pass it a value for `someVar` tha is a `Number` it will become a number (not wrapped as a string), if you pass it an `Object` it will be `JSON.stringify()`-ed, if you pass it a `RegExp` it will turn it into a `/regexp/` literal.

Anything that is a string with double curlies `'{{ otherVar }}'` will remain wrapped as a string. In addition it tolerates not being the entire string. So you can have something like this `'{{someBaseCDN}}/other/path'` the result will still be a string: `'https://the.passed.in.cdn.url/other/path'`

That's it!

1. Strings with double curlies; stay strings
2. Strings with triple curlies; become JS literals

## install

```
npm install timple
```

## example

```javascript
const { populateTemplate } = require('timple')
const template = require('fs').readFileSync('./sw.js')

const templateData = {
  cdnUrl: 'https://assets.something.com'
}

const finalString = populateTemplate(template, templateData)
```

## API reference

Timple exports an object with the following methods:

- `populateTemplate(templateString, variablesObject)`: returns string with template variables populated.
- `getTemplateFunctionFromFile(templatePath)`: returns a ready-to-go template function that can be called with just the variables object.
- `writeTemplatedFileSync(templateFilePath, outputFilePath, variablesObject)`: convenience function for build scripts and such. Just takes an input pathname, and output pathname, and writes the output to the outputFilePath with populated variables.

## Changelog

- `2.0.0`: now exporting several functions instead of just the template population function.
- `1.0.0`: initial release

## credits

If you like this follow [@HenrikJoreteg](http://twitter.com/henrikjoreteg) on twitter.

## license

[MIT](http://mit.joreteg.com/)

const tripleRE = /\"?\'?\{\{\{ ?([A-Za-z0-9_-]+) ?\}\}\}\"?\'?/g
const doubleRE = /(\"?\'?)\{\{ ?([A-Za-z0-9_-]+) ?\}\}(\"?\'?)/g

const ensureExists = (name, vars) => {
  if (!vars.hasOwnProperty(name)) {
    throw Error(`Value for ${name} was not supplied`)
  }
}

module.exports = (inputString, vars) =>
  inputString
    .replace(tripleRE, (wholeMatch, name) => {
      ensureExists(name, vars)
      const value = vars[name]
      const type = typeof value
      if (value instanceof RegExp || type === 'number' || type === 'string') {
        return value
      }
      return JSON.stringify(value, null, 2)
    })
    .replace(doubleRE, (wholeMatch, preQuote, name, postQuote) => {
      ensureExists(name, vars)
      return preQuote + vars[name] + postQuote
    })

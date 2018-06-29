const fs = require('fs')
const tripleRE = /\"?\'?\{\{\{ ?([A-Za-z0-9_-]+) ?\}\}\}\"?\'?/g
const doubleRE = /(\"?\'?)\{\{ ?([A-Za-z0-9_-]+) ?\}\}(\"?\'?)/g

const ensureExists = (name, vars) => {
  if (!vars.hasOwnProperty(name)) {
    throw Error(`Value for ${name} was not supplied`)
  }
}

const populateTemplate = (inputString, vars) =>
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

const getTemplateFunctionFromFile = filePath => {
  const template = fs.readFileSync(filePath, 'utf8')
  return vars => populateTemplate(template, vars)
}

const writeTemplatedFileSync = (templatePath, outputPath, vars) => {
  const templateFn = getTemplateFunctionFromFile(templatePath)
  fs.writeFileSync(outputPath, templateFn(vars), 'utf8')
}

module.exports = {
  populateTemplate,
  getTemplateFunctionFromFile,
  writeTemplatedFileSync
}

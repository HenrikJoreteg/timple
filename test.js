const test = require('tape')
const { populateTemplate } = require('./')

test('inserts values according to type', t => {
  const cases = {
    'something "{{cool}}"': 'something "coolVal"',
    'something "{{cool}}" "{{cool}}"': 'something "coolVal" "coolVal"',
    'something "{{other}}" "{{cool}}"': 'something "otherVal" "coolVal"',
    'something "{{cool}}/isthis"': 'something "coolVal/isthis"',
    'something "https://{{cool}}/path"': 'something "https://coolVal/path"',
    'something "{{{regex}}}" "{{ other }}"': 'something /reg/ "otherVal"',
    'something "{{ other }}" "{{{regex}}}"': 'something "otherVal" /reg/',
    '"{{{ obj }}}"': '{\n  "name": "value"\n}',
    '"{{{ arr }}}"': '[\n  "thing"\n]'
  }

  const data = {
    regex: /reg/,
    cool: 'coolVal',
    other: 'otherVal',
    obj: { name: 'value' },
    arr: ['thing']
  }

  for (let input in cases) {
    const output = cases[input]
    t.equal(
      populateTemplate(input, data),
      output,
      `${input} should become ${output}`
    )
  }
  t.end()
})

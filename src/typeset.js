// French typography: a no-break space before : ; ? ! % and », and after «,
// so a sign never starts a line on its own. Other languages are left as is.
export const typeset = (text, lang) => (lang === 'fr' && typeof text === 'string' ? text.replace(/ ([:;?!%»])/g, '\u00a0$1').replace(/« /g, '«\u00a0') : text)

// The same through every string of a set of texts (objects and arrays)
export function typesetAll(value, lang) {
  if (typeof value === 'string') return typeset(value, lang)
  if (Array.isArray(value)) return value.map((item) => typesetAll(item, lang))
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, typesetAll(item, lang)]))
  return value
}

// A small syntax highlighter for the code excerpts on project pages, for
// JavaScript and CSS. It returns tokens ({ type, text }) that the page draws
// as spans, so no HTML is ever built from strings.

const RULES = {
  js: [
    ['comment', /\/\/[^\n]*|\/\*[\s\S]*?\*\//y],
    ['string', /'(?:\\.|[^'\\\n])*'|"(?:\\.|[^"\\\n])*"|`(?:\\.|[^`\\])*`/y],
    ['keyword', /\b(?:const|let|var|function|return|if|else|new|true|false|null|undefined|for|of|while|import|export|from|async|await)\b/y],
    ['number', /\b\d+(?:\.\d+)?\b/y],
    ['function', /\b[A-Za-z_$][\w$]*(?=\s*\()/y],
    ['property', /(?<=\.)[A-Za-z_$][\w$]*/y],
  ],
  css: [
    ['comment', /\/\*[\s\S]*?\*\//y],
    ['keyword', /@[\w-]+/y],
    // A selector: anything up to an opening brace, within one statement
    ['selector', /[^\s{};][^{};]*?(?=\s*\{)/y],
    ['property', /[\w-]+(?=\s*:)/y],
    ['function', /[\w-]+(?=\()/y],
    ['number', /(?<![\w-])-?\d*\.?\d+(?:%|[a-z]+)?/y],
  ],
}

export const LANGUAGE_NAMES = { js: 'JavaScript', css: 'CSS' }

export function highlight(source, lang) {
  const rules = RULES[lang] || []
  const tokens = []
  let plain = ''
  let i = 0
  const flush = () => {
    if (plain) tokens.push({ type: 'plain', text: plain })
    plain = ''
  }
  while (i < source.length) {
    let matched = false
    for (const [type, rule] of rules) {
      rule.lastIndex = i
      const m = rule.exec(source)
      if (m && m[0].length) {
        flush()
        tokens.push({ type, text: m[0] })
        i += m[0].length
        matched = true
        break
      }
    }
    if (!matched) {
      plain += source[i]
      i += 1
    }
  }
  flush()
  return tokens
}

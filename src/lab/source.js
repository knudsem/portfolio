// The CSS and JavaScript of each demo, read from the very files that run it
// (between /* demo:id */ and /* /demo */), so the code shown can never
// drift from the code that plays. Loaded only when a code panel opens.
import css from './demos.css?raw'
import js from './scripts.js?raw'

function regions(source, id) {
  const open = `/* demo:${id} */`
  const parts = []
  for (let start = source.indexOf(open); start >= 0; start = source.indexOf(open, start + 1)) {
    const end = source.indexOf('/* /demo */', start)
    if (end < 0) throw new Error(`Demo "${id}" is not closed`)
    parts.push(source.slice(start + open.length, end).trim())
  }
  return parts.join('\n\n')
}

export function sourceOf(id) {
  const style = regions(css, id)
  if (!style) throw new Error(`Demo "${id}" has no CSS`)
  return { css: style, js: regions(js, id) }
}

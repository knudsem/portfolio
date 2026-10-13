// The code shown on the Trimension page is the code that runs the demos:
// excerpts are read from the files themselves, between /* excerpt:name */
// and /* /excerpt */ markers, so they can never drift apart. A name can mark
// several regions; they are joined, with the code left out marked by /* … */.
import eonsCss from './eons.css?raw'
import scrollScenesJs from './scrollScenes.js?raw'

function excerpt(source, name) {
  const open = `/* excerpt:${name} */`
  const parts = []
  for (let start = source.indexOf(open); start >= 0; start = source.indexOf(open, start + 1)) {
    const end = source.indexOf('/* /excerpt */', start)
    if (end < 0) throw new Error(`Excerpt "${name}" is not closed`)
    parts.push(source.slice(start + open.length, end).trim())
  }
  if (!parts.length) throw new Error(`Excerpt "${name}" not found`)
  return parts.join('\n\n/* … */\n\n')
}

export const EXCERPTS = {
  'eons-fragments': excerpt(eonsCss, 'fragments'),
  'eons-hands': excerpt(eonsCss, 'hands'),
  'scroll-scenes': scrollScenesJs.trim(),
}

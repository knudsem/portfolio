// Runs the browser test suites against the built site.
//
//   npm run build && npm test     every suite in tests/suites, in Chromium
//   npm test -- lab archive       only the suites whose names contain a word
//   npm run test:browsers -- webkit
//                                 the cross-browser suite, in one engine
//                                 (chromium, webkit or firefox)
//
// It serves dist/ with vite preview on port 4173, unless something already
// answers there (or at BASE_URL). Each suite prints "ok" and "FAIL" lines;
// a suite fails on any FAIL line or if it stops with an error.
import { spawn } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { BASE, ROOT } from './lib.mjs'

const args = process.argv.slice(2)
const engineAt = args.indexOf('--engine')
const engine = engineAt >= 0 ? args[engineAt + 1] : null
const words = args.filter((arg, i) => !arg.startsWith('--') && (engineAt < 0 || i !== engineAt + 1))

const suites = engine
  ? [path.join(ROOT, 'tests/browsers.test.mjs')]
  : fs.readdirSync(path.join(ROOT, 'tests/suites'))
      .filter((file) => file.endsWith('.test.mjs'))
      .filter((file) => !words.length || words.some((word) => file.includes(word)))
      .sort()
      .map((file) => path.join(ROOT, 'tests/suites', file))

const answers = async () => {
  try {
    return (await fetch(BASE)).ok
  } catch {
    return false
  }
}

let server = null
if (!(await answers())) {
  if (!fs.existsSync(path.join(ROOT, 'dist/index.html'))) {
    console.error('No build to test: run "npm run build" first.')
    process.exit(1)
  }
  server = spawn(process.execPath, [path.join(ROOT, 'node_modules/vite/bin/vite.js'), 'preview', '--port', '4173', '--strictPort'], { cwd: ROOT, stdio: 'ignore' })
  for (let i = 0; i < 100 && !(await answers()); i++) await new Promise((done) => setTimeout(done, 200))
  if (!(await answers())) {
    console.error(`The site did not start at ${BASE}.`)
    server.kill()
    process.exit(1)
  }
}

const run = (file) => new Promise((done) => {
  const child = spawn(process.execPath, [file], { cwd: ROOT, env: { ...process.env, ENGINE: engine || 'chromium' } })
  let out = ''
  child.stdout.on('data', (chunk) => { out += chunk })
  child.stderr.on('data', (chunk) => { out += chunk })
  child.on('close', (code) => done({ code, out }))
})

let checks = 0
const failed = []
const started = Date.now()
for (const file of suites) {
  const name = path.basename(file, '.test.mjs') + (engine ? ` (${engine})` : '')
  const { code, out } = await run(file)
  const lines = out.split('\n')
  const ok = lines.filter((line) => line.startsWith('ok')).length
  const fails = lines.filter((line) => line.startsWith('FAIL'))
  checks += ok + fails.length
  if (fails.length || code !== 0) {
    failed.push(name)
    console.log(`✗ ${name}: ${fails.length} of ${ok + fails.length} checks failed${code !== 0 && !fails.length ? ', and it stopped with an error' : ''}`)
    for (const line of fails) console.log(`    ${line}`)
    if (!fails.length) console.log(out.split('\n').slice(-15).map((line) => `    ${line}`).join('\n'))
  } else {
    console.log(`✓ ${name}: ${ok} checks`)
  }
  for (const line of lines.filter((line) => line.startsWith('info'))) console.log(`    ${line}`)
}

server?.kill()
const time = Math.round((Date.now() - started) / 1000)
console.log(`\n${suites.length - failed.length} of ${suites.length} suites passed, ${checks} checks, ${time}s`)
if (failed.length) console.log(`Failed: ${failed.join(', ')}`)
process.exit(failed.length ? 1 : 0)

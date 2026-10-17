// Shared by the test suites: where the site runs, where the repo is, and
// axe (the accessibility checker) ready to be injected into a page.
import fs from 'node:fs'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'

export const BASE = (process.env.BASE_URL || 'http://localhost:4173').replace(/\/$/, '')
export const ROOT = fileURLToPath(new URL('..', import.meta.url)).replace(/\/$/, '')
export const AXE = fs.readFileSync(createRequire(import.meta.url).resolve('axe-core/axe.min.js'), 'utf8')

// Words that must never appear on the site (a place, people's names, a
// client's private details) are not written in the repo: they live in
// tests/.private-words, one pattern per line, kept out of Git. Without that
// file, the checks that use them say they are skipped.
export const PRIVATE = (() => {
  try {
    const words = fs.readFileSync(new URL('./.private-words', import.meta.url), 'utf8').split('\n').map((w) => w.trim()).filter(Boolean)
    return words.length ? new RegExp(words.join('|'), 'i') : null
  } catch {
    return null
  }
})()
export const skipPrivate = (label) => console.log(`skip ${label} (no tests/.private-words here)`)

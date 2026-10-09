// Something@something.tld, with no spaces and no empty parts.
const EMAIL_PATTERN = /^[^\s@]+@(?:[^\s@.]+\.)+[^\s@.]{2,}$/

export function isValidEmail(email) {
  return EMAIL_PATTERN.test(email)
}

// Popular providers, used to catch typos such as "gmial.com" or "gmail.con".
const KNOWN_DOMAINS = [
  'gmail.com', 'googlemail.com', 'hotmail.com', 'hotmail.fr', 'hotmail.co.uk',
  'outlook.com', 'outlook.fr', 'live.com', 'live.fr', 'msn.com',
  'yahoo.com', 'yahoo.fr', 'yahoo.co.uk', 'ymail.com', 'icloud.com', 'me.com', 'mac.com',
  'aol.com', 'gmx.com', 'gmx.fr', 'mail.com', 'email.com', 'proton.me', 'protonmail.com',
  'orange.fr', 'wanadoo.fr', 'free.fr', 'sfr.fr', 'laposte.net',
  'bigpond.com', 'optusnet.com.au',
]

// Real endings that must never be "corrected" (so hotmail.be or yahoo.de stay as typed).
const KNOWN_ENDINGS = [
  'com', 'fr', 'net', 'org', 'co.uk', 'com.au', 'net.au', 'de', 'be', 'ch', 'it', 'es',
  'nl', 'dk', 'ca', 'io', 'me', 'eu', 'info',
]

function editDistance(a, b) {
  const row = Array.from({ length: b.length + 1 }, (_, i) => i)
  for (let i = 1; i <= a.length; i++) {
    let diagonal = row[0]
    row[0] = i
    for (let j = 1; j <= b.length; j++) {
      const above = row[j]
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, diagonal + (a[i - 1] === b[j - 1] ? 0 : 1))
      diagonal = above
    }
  }
  return row[b.length]
}

function splitDomain(domain) {
  const dot = domain.indexOf('.')
  return [domain.slice(0, dot), domain.slice(dot + 1)]
}

// Returns a corrected address when the domain looks like a typo of a popular
// provider, otherwise null.
export function suggestEmail(email) {
  const at = email.lastIndexOf('@')
  if (at < 1) return null
  const domain = email.slice(at + 1).toLowerCase()
  if (domain.indexOf('.') < 1 || KNOWN_DOMAINS.includes(domain)) return null

  const [name, ending] = splitDomain(domain)
  let best = null
  for (const known of KNOWN_DOMAINS) {
    const [knownName, knownEnding] = splitDomain(known)
    const nameDistance = editDistance(name, knownName)
    const endingDistance = editDistance(ending, knownEnding)
    const nameMatches = name === knownName
      || (name.length >= 3 && nameDistance <= (knownName.length >= 5 ? 2 : 1))
    const endingMatches = ending === knownEnding
      || (endingDistance === 1 && !KNOWN_ENDINGS.includes(ending))
    if (nameMatches && endingMatches) {
      const score = nameDistance + endingDistance
      if (!best || score < best.score) best = { domain: known, score }
    }
  }
  return best ? `${email.slice(0, at)}@${best.domain}` : null
}

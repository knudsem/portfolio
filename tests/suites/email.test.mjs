import { isValidEmail, suggestEmail } from "../../src/email.js";
import { ROOT } from '../lib.mjs';
let fail = 0;
const check = (label, got, want) => { const ok = got === want; if (!ok) fail++; console.log(`${ok ? 'ok  ' : 'FAIL'} ${label} -> ${got}${ok ? '' : `   (expected ${want})`}`); };
// format
for (const [e, want] of [['name@company.com', true], ['jean.dupont@orange.fr', true], ['a.b+tag@sub.domain.co.uk', true], ['not-an-email', false], ['name@company', false], ['name@company.c', false], ['name@@x.com', false], ['name@x..com', false], ['na me@x.com', false], ['@x.com', false], ['name@.com', false], ['', false]])
  check(`valid(${JSON.stringify(e)})`, isValidEmail(e), want);
// typos that should be caught
for (const [e, want] of [['jean@gmial.com', 'jean@gmail.com'], ['jean@gmail.con', 'jean@gmail.com'], ['jean@gmail.co', 'jean@gmail.com'], ['jean@gmal.com', 'jean@gmail.com'], ['jean@hotmial.fr', 'jean@hotmail.fr'], ['jean@hotmail.cm', 'jean@hotmail.com'], ['jean@yaho.fr', 'jean@yahoo.fr'], ['jean@yahoo.fe', 'jean@yahoo.fr'], ['jean@outlok.com', 'jean@outlook.com'], ['jean@orange.fe', 'jean@orange.fr'], ['jean@fre.fr', 'jean@free.fr'], ['Jean.Dupont@GMIAL.COM', 'Jean.Dupont@gmail.com'], ['bob@bigpnd.com', 'bob@bigpond.com']])
  check(`suggest(${e})`, suggestEmail(e), want);
// real addresses that must NOT be "corrected"
for (const e of ['jean@gmail.com', 'jean@hotmail.be', 'jean@yahoo.de', 'jean@mail.com', 'jean@email.com', 'jean@ymail.com', 'jean@protonmail.ch', 'jean@bigpond.net.au', 'jean@airbus.com', 'jean@tpg.com.au', 'jean@aim.com', 'jean@gmx.de', 'jean@company.fr', 'jean@studio.io', 'jean@live.be', 'jean@icloud.fr', 'jean@laposte.net', 'jean@wanadoo.fr'])
  check(`suggest(${e})`, suggestEmail(e), null);
console.log(fail ? `\n${fail} FAILED` : '\nall passed');
process.exit(fail ? 1 : 0);

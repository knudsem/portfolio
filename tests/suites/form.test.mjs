import { chromium } from 'playwright';
import { BASE } from '../lib.mjs';
const b = await chromium.launch();
let fail = 0;
const check = (label, ok, info = '') => { if (!ok) fail++; console.log(`${ok ? 'ok  ' : 'FAIL'} ${label}${info ? '  [' + info + ']' : ''}`); };

async function setup(lang, reply) {
  const ctx = await b.newContext({ locale: lang === 'fr' ? 'fr-FR' : 'en-US', timezoneId: lang === 'fr' ? 'Europe/Paris' : 'America/New_York', viewport: { width: 1280, height: 900 } });
  const p = await ctx.newPage();
  const posts = [];
  // Intercept the form service: nothing is ever really sent.
  await p.route('**/formsubmit.co/**', async (route) => {
    posts.push(JSON.parse(route.request().postData()));
    if (reply === 'network-down') return route.abort('failed');
    await route.fulfill(reply);
  });
  await p.goto(BASE); await p.waitForTimeout(300);
  return { ctx, p, posts };
}
const ok200 = { status: 200, contentType: 'application/json', body: '{"success":"true","message":"The form was submitted successfully."}' };
const state = (p) => p.evaluate(() => ({
  errors: [...document.querySelectorAll('.field-error')].map(e => e.id + ': ' + e.textContent),
  invalid: [...document.querySelectorAll('[aria-invalid="true"]')].map(e => e.id),
  focused: document.activeElement?.id,
  describedby: document.querySelector('#cf-email')?.getAttribute('aria-describedby'),
  success: !!document.querySelector('.contact-success'),
  formError: document.querySelector('.form-error')?.textContent || null,
}));

// 1. Empty form (English)
{
  const { ctx, p, posts } = await setup('en', ok200);
  await p.click('.form-submit'); await p.waitForTimeout(300);
  const s = await state(p);
  check('empty form: nothing sent', posts.length === 0, `requests=${posts.length}`);
  check('empty form: 3 clear errors shown', s.errors.length === 3 && s.errors[0].includes('Please enter your name'), s.errors.join(' | '));
  check('empty form: fields marked invalid, focus on first problem', s.invalid.join() === 'cf-name,cf-email,cf-message' && s.focused === 'cf-name', `${s.invalid} focus=${s.focused}`);
  check('empty form: email error is linked to the field for screen readers', s.describedby === 'cf-email-error');
  // fixing a field removes its error live
  await p.fill('#cf-name', 'Jane'); await p.waitForTimeout(150);
  const s2 = await state(p);
  check('typing a name removes that error immediately', !s2.errors.some(e => e.startsWith('cf-name')) && !s2.invalid.includes('cf-name'));
  await ctx.close();
}
// 2. Invalid email (French), error messages in French
{
  const { ctx, p, posts } = await setup('fr', ok200);
  await p.fill('#cf-name', 'Jean'); await p.fill('#cf-email', 'pas-un-email'); await p.fill('#cf-message', 'Bonjour');
  await p.click('.form-submit'); await p.waitForTimeout(300);
  const s = await state(p);
  check('FR invalid email: nothing sent', posts.length === 0);
  check('FR invalid email: French error message, focus on email', s.errors.length === 1 && s.errors[0].includes('Cette adresse email semble incorrecte') && s.focused === 'cf-email', s.errors.join(' | '));
  // switching language translates the visible error
  await p.click('.lang-btn[lang="en"]'); await p.waitForTimeout(700);
  const s2 = await state(p);
  check('switching to EN translates the error message', s2.errors[0]?.includes("doesn't look right"), s2.errors.join(' | '));
  await ctx.close();
}
// 3. Typo suggestion
{
  const { ctx, p, posts } = await setup('fr', ok200);
  await p.fill('#cf-email', 'jean.dupont@gmial.com'); await p.press('#cf-email', 'Tab'); await p.waitForTimeout(200);
  const hint = await p.evaluate(() => document.querySelector('.field-hint')?.textContent || null);
  check('typo gmial.com: suggestion appears after leaving the field', hint === 'Vous vouliez dire jean.dupont@gmail.com\u00a0?', hint);
  check('suggestion sits in a live region, so screen readers announce it', await p.evaluate(() => !!document.querySelector('.field-hint').closest('[aria-live="polite"]')));
  check('after Tab, focus is in the message box', await p.evaluate(() => document.activeElement.id) === 'cf-message');
  await p.keyboard.press('Shift+Tab'); await p.waitForTimeout(100);
  check('Shift+Tab reaches the suggestion button', await p.evaluate(() => document.activeElement.classList.contains('suggestion-btn')));
  await p.keyboard.press('Enter'); await p.waitForTimeout(200);
  check('one click (or Enter) fixes the address', await p.inputValue('#cf-email') === 'jean.dupont@gmail.com' && await p.evaluate(() => !document.querySelector('.field-hint')));
  await p.fill('#cf-email', 'jean@yahoo.fe'); await p.click('#cf-message'); await p.waitForTimeout(200);
  await p.click('.suggestion-btn'); await p.waitForTimeout(200);
  check('mouse click on the suggestion fixes yahoo.fe -> yahoo.fr', await p.inputValue('#cf-email') === 'jean@yahoo.fr');
  await p.fill('#cf-email', 'jean@hotmail.be'); await p.press('#cf-email', 'Tab'); await p.waitForTimeout(200);
  check('real address hotmail.be: no suggestion', await p.evaluate(() => !document.querySelector('.field-hint')));
  check('nothing was sent during all this', posts.length === 0);
  await ctx.close();
}
// 4. Valid message: sent once, trimmed, success shown and focused
{
  const { ctx, p, posts } = await setup('en', ok200);
  await p.fill('#cf-name', '  Jane Smith '); await p.fill('#cf-email', ' jane@company.com '); await p.fill('#cf-message', '  I need a Shopify store.  ');
  await p.click('.form-submit'); await p.waitForTimeout(500);
  const s = await state(p);
  check('valid form: exactly one request', posts.length === 1, JSON.stringify(posts[0]));
  check('valid form: values cleaned of extra spaces', posts[0]?.name === 'Jane Smith' && posts[0]?.email === 'jane@company.com' && posts[0]?.message === 'I need a Shopify store.' && posts[0]?._subject === 'Portfolio contact from Jane Smith');
  check('valid form: success message shown and focused for screen readers', s.success && await p.evaluate(() => document.activeElement.classList.contains('contact-success')));
  await ctx.close();
}
// 5. Service says success "false" (e.g. form not activated)
{
  const { ctx, p, posts } = await setup('en', { status: 200, contentType: 'application/json', body: '{"success":"false","message":"This form needs Activation."}' });
  await p.fill('#cf-name', 'Jane'); await p.fill('#cf-email', 'jane@company.com'); await p.fill('#cf-message', 'Hello');
  await p.click('.form-submit'); await p.waitForTimeout(500);
  const s = await state(p);
  const link = await p.evaluate(() => document.querySelector('.form-error a')?.getAttribute('href'));
  check('service refuses: real error shown (no fake success)', !s.success && s.formError?.startsWith('Something went wrong') && link === 'mailto:mathiasknudsen31@gmail.com', `${s.formError} ${link}`);
  check('service refuses: what they typed is kept', await p.inputValue('#cf-message') === 'Hello');
  await ctx.close();
}
// 6. Server error and network down
for (const [label, reply] of [['server error 500', { status: 500, body: 'oops' }], ['network down', 'network-down']]) {
  const { ctx, p } = await setup('fr', reply);
  await p.fill('#cf-name', 'Jean'); await p.fill('#cf-email', 'jean@orange.fr'); await p.fill('#cf-message', 'Bonjour');
  await p.click('.form-submit'); await p.waitForTimeout(500);
  const s = await state(p);
  check(`${label}: French error with email fallback, announced as alert`, !s.success && s.formError?.startsWith('Une erreur est survenue') && await p.evaluate(() => document.querySelector('.form-error').getAttribute('role') === 'alert'), s.formError);
  await ctx.close();
}
// 7. Bot fills the hidden trap field
{
  const { ctx, p, posts } = await setup('en', ok200);
  await p.fill('#cf-name', 'Bot'); await p.fill('#cf-email', 'bot@spam.com'); await p.fill('#cf-message', 'Buy now');
  const hp = await p.evaluate(() => { const r = document.querySelector('.hp-field').getBoundingClientRect(); return { x: r.left, tab: document.querySelector('#cf-honey').tabIndex, hidden: document.querySelector('.hp-field').getAttribute('aria-hidden') }; });
  await p.evaluate(() => { document.querySelector('#cf-honey').value = 'http://spam.example'; });
  await p.click('.form-submit'); await p.waitForTimeout(500);
  check('bot filling the hidden field: nothing sent, bot sees fake success', posts.length === 0 && (await state(p)).success);
  check('trap field is off screen, not reachable by Tab, hidden from screen readers', hp.x < -5000 && hp.tab === -1 && hp.hidden === 'true', JSON.stringify(hp));
  await ctx.close();
}
// 8. Inputs are 16px (no zoom on iPhone)
{
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 } });
  const p = await ctx.newPage(); await p.goto(BASE); await p.waitForTimeout(300);
  const sizes = await p.evaluate(() => [...document.querySelectorAll('.form-input')].map(i => getComputedStyle(i).fontSize));
  check('form fields use 16px text (iPhones will not zoom in)', sizes.every(s => s === '16px'), sizes.join(','));
  await ctx.close();
}
console.log(fail ? `\n${fail} FAILED` : '\nall passed');
await b.close();
process.exit(fail ? 1 : 0);

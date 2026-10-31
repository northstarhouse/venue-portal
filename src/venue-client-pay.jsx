// Public clients-only page (#pay): venue code -> event dashboard (payments, insurance, questionnaire, brick, message).
import { formatVenueCode } from './venue-code.js';
import { AgreementSigningPage, createAgreementApi } from './venue-contracts.jsx';
const style = `.cp-page{overflow-x:hidden;--gold:#886c44;--ink:#2c2418;--muted:#6f685c;--line:#cfc2aa;--paper:#fffdfa;min-height:100vh;background:#fbf8f2;color:var(--ink);font-family:system-ui,-apple-system,'Segoe UI',sans-serif;padding:28px 16px 48px}.cp-shell{max-width:560px;margin:0 auto}.cp-shell.wide{max-width:1080px}
.cp-brandrow{display:flex;align-items:center;gap:14px;letter-spacing:.28em;font-size:11px;color:var(--gold);font-weight:700}.cp-brandrow:after{content:"";height:1px;background:var(--gold);opacity:.45;flex:1;min-width:48px}
.cp-page h1{font-family:Cardo,Georgia,serif;font-weight:700;font-size:28px;line-height:1.15;margin:8px 0 18px}
.cp-head{position:relative;display:flex;justify-content:space-between;align-items:flex-start;gap:16px;min-height:196px;margin-bottom:18px}
.cp-head-img{position:absolute;top:-24px;right:calc(50% - 50vw);height:290px;width:min(calc(8% + 50vw),840px);background:#d9cdb8 url(assets/header-house.jpg) center/cover;filter:saturate(.8) brightness(1.04);opacity:.95;-webkit-mask-image:linear-gradient(to right,transparent 0,#000 36%),linear-gradient(to bottom,#000 64%,transparent 100%);-webkit-mask-composite:source-in;mask-image:linear-gradient(to right,transparent 0,#000 36%),linear-gradient(to bottom,#000 64%,transparent 100%);mask-composite:intersect;pointer-events:none}
.cp-hico{display:inline-flex;align-items:center;justify-content:center;width:30px;height:30px;border-radius:50%;background:#f1e8d8;color:var(--gold);flex:none;margin-right:10px;vertical-align:middle}.cp-acc-head .cp-h{display:inline-flex;align-items:center}.cp-card>h2{display:flex;align-items:center}
.cp-days{display:grid;gap:14px;max-height:340px;overflow-y:auto;margin:14px 0}.cp-day b{display:block;font-size:14px;margin-bottom:6px}.cp-times{display:flex;flex-wrap:wrap;gap:8px}.cp-time{border:1px solid var(--gold);background:#fff;color:var(--gold);padding:7px 14px;font:inherit;font-size:13px;font-weight:600;cursor:pointer;border-radius:0}.cp-time[aria-pressed=true],.cp-time:hover{background:var(--gold);color:#fff}
.cp-msgbtn{display:inline-flex;align-items:center;gap:10px;margin-top:26px;background:#fff;border:1px solid var(--gold);color:var(--gold);padding:12px 20px;font:inherit;font-size:12px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;cursor:pointer;border-radius:0}.cp-msgbtn:hover{background:var(--gold);color:#fff}
.cp-head-main{position:relative;z-index:1;max-width:62%;padding-top:6px}.cp-page .cp-head h1{font-size:clamp(28px,4vw,40px);margin:36px 0 18px}
.cp-sub{display:flex;align-items:center;gap:10px;color:var(--muted);font-size:14px;flex-wrap:wrap}.cp-sub i{width:1px;height:14px;background:#b9ab92;display:inline-block}
.cp-head-side{position:relative;z-index:1;align-self:stretch;display:flex;flex-direction:column;justify-content:space-between;align-items:flex-end}.cp-countdown{background:var(--gold);color:#fff;padding:12px 28px 10px;text-align:center;display:inline-block;min-width:150px}.cp-countdown strong{display:block;font-family:Cardo,Georgia,serif;font-size:38px;font-weight:400;line-height:1.05}.cp-countdown hr{border:0;border-top:1px solid rgba(255,255,255,.55);margin:5px 16px 7px}.cp-countdown span{font-size:11px;letter-spacing:.2em;text-transform:uppercase}
.cp-tiles{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:12px;margin-bottom:18px;position:relative;z-index:1}
.cp-tile{display:flex;align-items:center;gap:14px;text-align:left;background:rgba(255,253,250,.9);border:1px solid var(--line);border-left:3px solid #c9a46a;padding:14px 14px 14px 16px;font:inherit;cursor:pointer;color:inherit;box-shadow:0 1px 2px rgba(60,45,20,.05)}.cp-tile:hover{background:#fff}.cp-ico{position:relative}.cp-tick{position:absolute;right:-5px;bottom:-5px;width:25px;height:25px;border-radius:50%;background:var(--gold);color:#fff;border:2px solid #fffdfa;display:flex;align-items:center;justify-content:center}
.cp-ico{flex:none;width:46px;height:46px;border-radius:50%;background:#f1e9da;color:#8a6c40;display:flex;align-items:center;justify-content:center}
.cp-txt{flex:1;min-width:0}.cp-tile small{display:block;font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:var(--muted);font-weight:700}.cp-tile b{display:block;font-family:Cardo,Georgia,serif;font-size:22px;font-weight:700;line-height:1.2;margin:3px 0 1px}.cp-tile em{font-style:normal;font-size:12px;color:var(--muted)}.cp-chev{display:none}
.cp-cols{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px;align-items:start}.cp-col{min-width:0}
.cp-card{background:var(--paper);border:1px solid var(--line);padding:22px 24px;margin-bottom:18px;box-shadow:0 1px 2px rgba(60,45,20,.05)}
.cp-card .cp-h,.cp-card h2{font-family:Cardo,Georgia,serif;font-size:14px;font-weight:700;letter-spacing:.17em;text-transform:uppercase;margin:0}.cp-card>h2{margin:0 0 14px;padding-bottom:10px;border-bottom:1px solid var(--line)}
.cp-acc-head{width:100%;display:flex;align-items:center;gap:12px;background:none;border:0;padding:0;font:inherit;color:inherit;cursor:pointer;text-align:left}.cp-acc-head .cp-grow{flex:1}.cp-acc-chev{transition:transform .15s;color:#7b7366}.cp-acc-head[aria-expanded=true] .cp-acc-chev{transform:rotate(90deg)}.cp-acc-body{margin-top:14px;padding-top:14px;border-top:1px solid var(--line)}.cp-acc-body[hidden]{display:none}
.cp-pill{white-space:nowrap;display:inline-flex;align-items:center;gap:6px;font-size:12px;font-weight:600;padding:4px 12px;border-radius:999px;background:#faf0e6;color:#9a5d22}.cp-pill.ok{background:#e4eee4;color:#3f6b47}
.cp-field{display:block;font-size:13px;font-weight:600;margin-bottom:14px}.cp-field input,.cp-field textarea,.cp-field select{display:block;width:100%;box-sizing:border-box;margin-top:6px;border:1px solid #dcd3c4;background:#fff;border-radius:0;padding:12px;font:inherit;font-size:16px;font-weight:400}.cp-req{color:#b23b2e}
.cp-btn-quiet{background:#fff;color:var(--gold);border:1px solid var(--gold);border-radius:0;padding:11px 20px;font:inherit;font-size:12px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;cursor:pointer}.cp-btn{background:var(--gold);color:#fff;border:0;border-radius:0;padding:13px 22px;font:inherit;font-size:12px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;cursor:pointer}.cp-btn:after{content:" \\2192"}.cp-btn:disabled{opacity:.55;cursor:default}a.cp-btn{display:inline-block;text-decoration:none}
.cp-muted{color:var(--muted);font-size:13px;line-height:1.55}.cp-error{background:#f9eae7;color:#a64f3c;border:1px solid #a64f3c;padding:10px 12px;font-size:13px;margin-bottom:14px}.cp-ok{background:#edf4ed;color:#426b4a;border:1px solid #426b4a;padding:10px 12px;font-size:13px;margin-bottom:14px}
.cp-big{font-family:Cardo,Georgia,serif;font-size:30px;font-weight:700;line-height:1.1}.cp-bar{height:8px;background:#f1e9dc;overflow:hidden;margin:14px 0}.cp-bar span{display:block;height:100%;background:#6b8c6c}
.cp-next{display:flex;gap:10px;align-items:center;background:#f4eee3;padding:12px 14px;font-size:14px;margin-bottom:14px}.cp-next svg{flex:none;color:var(--gold)}
.cp-check{display:flex;gap:8px;align-items:center;font-weight:400;margin:4px 0}.cp-check input{width:auto;margin:0}
.cp-qcols{column-count:2;column-gap:44px;margin-bottom:22px}.cp-qsec-wrap{break-inside:avoid-column;margin-bottom:30px}.cp-qcols .cp-sec{margin-top:0}@media(max-width:820px){.cp-qcols{column-count:1}}
.cp-sec{font-family:Cardo,Georgia,serif;font-weight:700;font-size:19px;color:var(--gold);text-align:center;margin:30px 0 18px;padding:12px 8px;border-top:1px solid var(--gold);border-bottom:1px solid var(--gold)}.cp-lab{display:block;font-weight:400;font-size:15px;line-height:1.45}.cp-note{display:block;font-style:italic;font-weight:400;color:var(--muted);font-size:13px;margin-top:2px}.cp-fieldimg{display:block;width:100%;height:auto;margin:0 0 16px;border:1px solid var(--line)}.cp-field input::placeholder,.cp-field textarea::placeholder{color:#9a9488;font-size:15px;font-weight:400}
@media(max-width:1100px){.cp-tiles{grid-template-columns:repeat(3,minmax(0,1fr))}}
@media(max-width:820px){.cp-tiles{grid-template-columns:repeat(2,minmax(0,1fr))}.cp-tile{gap:10px;padding:12px}.cp-ico{width:38px;height:38px}.cp-chev{display:none}.cp-cols{grid-template-columns:1fr}.cp-head{flex-direction:column;min-height:0;padding-top:96px}.cp-head-img{top:-28px;left:-16px;right:-16px;bottom:auto;height:150px;width:auto;opacity:.6;-webkit-mask-image:linear-gradient(to bottom,#000 40%,transparent 100%);mask-image:linear-gradient(to bottom,#000 40%,transparent 100%)}.cp-head-main{max-width:100%}.cp-head-side{width:100%;flex-direction:row;align-items:center;justify-content:flex-start}}`;
const money = c => (c / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' });

const ICONS = {
  coins: <><ellipse cx="12" cy="6" rx="7" ry="3" /><path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6" /><path d="M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" /></>,
  shield: <><path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" /><path d="M9 12l2 2 4-4" /></>,
  clipboard: <><rect x="6" y="4" width="12" height="17" rx="1" /><path d="M9 4h6v3H9z" /><path d="M9 14l2 2 4-4" /></>,
  doc: <><path d="M7 3h7l4 4v14H7z" /><path d="M14 3v4h4" /><path d="M10 12h5M10 16h5" /></>,
  calendar: <><rect x="4" y="5" width="16" height="15" rx="1" /><path d="M4 10h16M8 3v4M16 3v4" /></>,
  card: <><rect x="3" y="6" width="18" height="13" rx="1" /><path d="M3 10h18M7 15h4" /></>,
  chat: <><path d="M4 5h16v11H10l-5 4v-4H4z" /><path d="M8 9.5h8M8 12.5h5" /></>,
  walk: <><path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0113 0c0 5.4-6.5 11-6.5 11z" /><circle cx="12" cy="10" r="2.4" /></>,
  brick: <><rect x="3" y="5" width="18" height="14" rx="1" /><path d="M3 10h18M3 15h18M9 5v5M15 10v5M9 15v4" /></>,
  chevron: <path d="M9 6l6 6-6 6" />,
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
};
const Icon = ({ name, size = 22 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{ICONS[name]}</svg>;
const Pill = ({ ok, yes, no }) => <span className={'cp-pill' + (ok ? ' ok' : '')}>{ok && <Icon name="check" size={13} />}{ok ? yes : no}</span>;

// Collapsible card. Content stays mounted (so typed answers survive closing); tiles can open it by id.
// Until a client has signed the rental agreement, this is what the couple sees after entering their venue code.
// Once someone signs, the event page unlocks (the Rental agreement card there keeps prompting anyone who still needs to sign).
function AgreementGate({ api, code, name, baseUrl, apiKey, agreement: first, eventName, onUnlock }) {
  const [agreement, setAgreement] = React.useState(first);
  const [token, setToken] = React.useState('');
  const [busy, setBusy] = React.useState('');
  const [err, setErr] = React.useState('');
  const agreementApi = React.useMemo(() => createAgreementApi({ baseUrl, apiKey }), [baseUrl, apiKey]);
  const clients = agreement.signers.filter(s => s.role === 'client');
  async function open(signerId) {
    setErr(''); setBusy(signerId);
    try { const o = await api('agreement_link', { code, name, signer_id: signerId }); setToken(o.token); }
    catch (e) { setErr(e.message || 'Could not open the agreement. Please try again.'); }
    setBusy('');
  }
  async function back() {
    setToken('');
    try {
      const o = await api('agreement_status', { code, name });
      const a = o.agreement;
      if (!a || a.status !== 'pending' || a.signers.filter(s => s.role === 'client').every(s => s.status === 'signed')) onUnlock();
      else setAgreement(a); // one partner signed: stay here so the other can sign on the same device, no log out
    } catch (e) { /* stay on this screen */ }
  }
  if (token) return <div style={{ position: 'fixed', inset: 0, background: '#fbf8f2', zIndex: 1000, overflow: 'auto' }}>
    <div style={{ position: 'sticky', top: 0, background: '#fffdfa', borderBottom: '1px solid #cfc2aa', padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 2 }}>
      <span style={{ letterSpacing: '.2em', fontSize: 11, color: '#886c44', fontWeight: 700 }}>NORTH STAR HOUSE</span>
      <button type="button" className="cp-btn" onClick={back}>I'm done, continue</button>
    </div>
    <AgreementSigningPage api={agreementApi} token={token} />
  </div>;
  return <>
    <div className="cp-brandrow">NORTH STAR HOUSE</div>
    <h1>{eventName ? eventName : 'Your event'}</h1>
    <div className="cp-card" style={{ maxWidth: 640 }}>
      <h2>Your rental agreement</h2>
      <p className="cp-muted" style={{ marginTop: 0 }}>Welcome. Before your event page opens, please review and sign your rental agreement. It takes a few minutes: you read each numbered term and initial it, confirm with a code we email you, and sign. As soon as you submit, your event page unlocks.</p>
      {clients.map(c => <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', margin: '12px 0' }}>
        <span style={{ flex: 1, minWidth: 140 }}><strong>{c.name}</strong>{c.status === 'signed' && <><br /><span className="cp-muted">Signed ✓</span></>}</span>
        {c.status !== 'signed' && <button type="button" className="cp-btn" disabled={!!busy} onClick={() => open(c.id)}>{busy === c.id ? 'Opening…' : 'Review & sign as ' + String(c.name).split(' ')[0]}</button>}
      </div>)}
      {clients.some(c => c.status === 'signed') && <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid #e6dfd3' }}>
        <p className="cp-muted" style={{ marginTop: 0 }}>You can sign for each person right here, one after the other. Whenever you're ready, continue to your event page. Anyone who hasn't signed yet can still do it from the Rental agreement card there.</p>
        <button type="button" className="cp-btn-quiet" onClick={onUnlock}>Continue to my event page</button>
      </div>}
      {err && <div className="cp-error" role="alert">{err}</div>}
    </div>
  </>;
}

// The rental agreement: status for each signer, and signing right here (same emailed-code verification as the email link).
function AgreementCard({ api, code, name, baseUrl, apiKey }) {
  const dateOf = ts => new Date(ts).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const [state, setState] = React.useState(undefined); // undefined = loading, null = no agreement yet
  const [token, setToken] = React.useState('');
  const [busy, setBusy] = React.useState('');
  const [err, setErr] = React.useState('');
  const agreementApi = React.useMemo(() => createAgreementApi({ baseUrl, apiKey }), [baseUrl, apiKey]);
  const load = React.useCallback(() => api('agreement_status', { code, name }).then(o => setState(o.agreement)).catch(() => setState(null)), [api, code, name]);
  React.useEffect(() => { load(); }, [load]);
  async function open(signerId) {
    setErr(''); setBusy(signerId);
    try { const o = await api('agreement_link', { code, name, signer_id: signerId }); setToken(o.token); }
    catch (e) { setErr(e.message || 'Could not open the agreement. Please try again.'); }
    setBusy('');
  }
  function close() { setToken(''); load(); }
  if (state === undefined) return null;
  const legacy = !!(state && state.legacy);
  const clients = state ? state.signers.filter(s => s.role === 'client') : [];
  const venue = state ? state.signers.filter(s => s.role === 'venue') : [];
  const mine = clients.filter(s => s.status !== 'signed');
  const allSigned = state && (state.status === 'completed' || legacy);
  const pill = !state ? <Pill ok={false} yes="" no="Coming soon" /> : allSigned ? <Pill ok={true} yes="Fully signed" no="" /> : mine.length ? <Pill ok={false} yes="" no="Needs your signature" /> : <Pill ok={false} yes="" no="Waiting for the venue" />;
  return <>
    <Acc id="cp-agreement" icon="doc" title="Rental agreement" pill={pill} defaultOpen={!!state && !allSigned}>
      {!state && <p className="cp-muted" style={{ marginTop: 0 }}>Your rental agreement isn't ready yet. We'll email you as soon as it's available, and you'll be able to sign it right here.</p>}
      {legacy && <p className="cp-muted" style={{ marginTop: 0 }}>Your rental agreement is signed and on file with North Star House.</p>}
      {state && !legacy && <>
        <p className="cp-muted" style={{ marginTop: 0 }}>{allSigned ? 'Everyone has signed. You can open your agreement any time to review it or download a copy.' : 'Your rental agreement is here to review any time. We countersign once every client has signed.'}</p>
        {clients.map(s => <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', margin: '10px 0' }}>
          <span style={{ flex: 1, minWidth: 140 }}><strong>{s.name}</strong><br /><span className="cp-muted">{s.status === 'signed' ? 'Signed ' + dateOf(s.signed_at) : 'Not signed yet'}</span></span>
          {s.status !== 'signed' && <button type="button" className="cp-btn" disabled={!!busy} onClick={() => open(s.id)}>{busy === s.id ? 'Opening…' : 'Review & sign'}</button>}
        </div>)}
        {clients.some(c => c.status === 'signed') && (() => { const viewer = clients.find(c => c.status === 'signed'); return <div style={{ margin: '14px 0 4px' }}><button type="button" className="cp-btn-quiet" disabled={!!busy} onClick={() => open(viewer.id)}>{busy === viewer.id ? 'Opening…' : 'View rental agreement'}</button></div>; })()}
        {venue.map(s => <p key={s.id} className="cp-muted" style={{ margin: '10px 0 0' }}>North Star House countersignature: {s.status === 'signed' ? 'signed ' + dateOf(s.signed_at) : clients.every(c => c.status === 'signed') ? 'in progress' : 'after all clients have signed'}</p>)}
      </>}
      {err && <div className="cp-error" role="alert" style={{ marginTop: 10 }}>{err}</div>}
    </Acc>
    {token && <div style={{ position: 'fixed', inset: 0, background: '#fbf8f2', zIndex: 1000, overflow: 'auto' }}>
      <div style={{ position: 'sticky', top: 0, background: '#fffdfa', borderBottom: '1px solid #cfc2aa', padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 2 }}>
        <span style={{ letterSpacing: '.2em', fontSize: 11, color: '#886c44', fontWeight: 700 }}>NORTH STAR HOUSE</span>
        <button type="button" className="cp-btn-quiet" onClick={close}>Back to my event page</button>
      </div>
      <AgreementSigningPage api={agreementApi} token={token} />
    </div>}
  </>;
}

function Acc({ id, title, icon, pill, defaultOpen, children }) {
  const [open, setOpen] = React.useState(!!defaultOpen);
  React.useEffect(() => {
    const h = e => { if (e.detail === id) setOpen(true); };
    window.addEventListener('cp-open', h); return () => window.removeEventListener('cp-open', h);
  }, [id]);
  return <div className="cp-card" id={id}>
    <button type="button" className="cp-acc-head" aria-expanded={open} onClick={() => setOpen(o => !o)}><span className="cp-h">{icon && <span className="cp-hico"><Icon name={icon} size={16} /></span>}{title}</span><span className="cp-grow">{pill}</span><span className="cp-acc-chev"><Icon name="chevron" size={18} /></span></button>
    <div className="cp-acc-body" hidden={!open}>{children}</div>
  </div>;
}

function loadPayPal(clientId) {
  if (window.paypal) return Promise.resolve(window.paypal);
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'https://www.paypal.com/sdk/js?client-id=' + encodeURIComponent(clientId) + '&currency=USD&intent=capture&disable-funding=credit';
    s.onload = () => resolve(window.paypal); s.onerror = () => reject(new Error('PayPal could not be loaded.'));
    document.head.appendChild(s);
  });
}

function Questionnaire({ api, code, name, onSaved }) {
  const [form, setForm] = React.useState(null), [answers, setAnswers] = React.useState({}), [err, setErr] = React.useState(''), [busy, setBusy] = React.useState(false), [done, setDone] = React.useState(false);
  React.useEffect(() => { api('questionnaire_get', { code, name }).then(d => { setForm(d); setAnswers(d.answers || {}); }).catch(e => setErr(e.message)); }, []);
  const set = (id, v) => setAnswers(a => ({ ...a, [id]: v }));
  async function save(e) {
    e.preventDefault(); if (busy) return; setBusy(true); setErr(''); setDone(false);
    try { await api('questionnaire_save', { code, name, answers }); setDone(true); onSaved(); } catch (x) { setErr(x.message); } finally { setBusy(false); }
  }
  if (!form) return err ? <div className="cp-error" role="alert">{err}</div> : <p className="cp-muted">Loading…</p>;
  // Consecutive fields with the same section share one titled block (same layout as the HoneyBook questionnaire).
  const groups = [];
  form.fields.forEach(f => { const last = groups[groups.length - 1]; if (last && last.section === f.section) last.fields.push(f); else groups.push({ section: f.section, fields: [f] }); });
  return <form onSubmit={save}>
    <p className="cp-muted">We're so excited to host your wedding at the North Star House! To help us prepare, we're collecting important event details. Our team will review everything and connect with you if we need to coordinate on any specific details.</p>
    {form.submitted && <p className="cp-muted"><em>Your answers are saved. You can change them any time before your event.</em></p>}
    {err && <div className="cp-error" role="alert">{err}</div>}
    {done && <div className="cp-ok" role="status">Submitted. Thank you!</div>}
    <div className="cp-qcols">
    {groups.map((g, gi) => <div className="cp-qsec-wrap" key={gi}>
    {g.section && <h3 className="cp-sec">{g.section}</h3>}
    {g.fields.map(f => <div className="cp-field" key={f.id}>
      {f.image && <img className="cp-fieldimg" src={f.image} alt={f.imageAlt || ''} loading="lazy" />}
      <span className="cp-lab">{f.label}{f.required && <span className="cp-req"> *</span>}</span>
      {f.note && <span className="cp-note">{f.note}</span>}
      {f.type === 'long_text' ? <textarea rows={3} placeholder={f.placeholder || ''} value={answers[f.id] || ''} onChange={e => set(f.id, e.target.value)} />
        : f.type === 'yes_no' ? <select value={answers[f.id] || ''} onChange={e => set(f.id, e.target.value)}><option value="">—</option><option>Yes</option><option>No</option></select>
        : f.type === 'multiple_choice' && f.display === 'dropdown' ? <select value={answers[f.id] || ''} onChange={e => set(f.id, e.target.value)}><option value="">—</option>{f.options.map(o => <option key={o} value={o}>{o}</option>)}</select>
        : f.type === 'multiple_choice' ? f.options.map(o => <label className="cp-check" key={o}><input type="radio" name={f.id} checked={answers[f.id] === o} onChange={() => set(f.id, o)} />{o}</label>)
        : f.type === 'checkboxes' ? f.options.map(o => <label className="cp-check" key={o}><input type="checkbox" checked={(answers[f.id] || []).includes(o)} onChange={e => set(f.id, e.target.checked ? [...(answers[f.id] || []), o] : (answers[f.id] || []).filter(x => x !== o))} />{o}</label>)
        : <input placeholder={f.placeholder || ''} value={answers[f.id] || ''} onChange={e => set(f.id, e.target.value)} />}
    </div>)}
    </div>)}
    </div>
    <button className="cp-btn" disabled={busy}>{busy ? 'Saving…' : form.submitted ? 'Update my answers' : 'Submit'}</button>
  </form>;
}

function Brick({ api, code, name, initial, done, onSaved }) {
  const [lines, setLines] = React.useState(() => [0, 1, 2].map(i => (initial && initial[i]) || '')), [err, setErr] = React.useState(''), [busy, setBusy] = React.useState(false), [saved, setSaved] = React.useState(false);
  const set = (i, v) => { setSaved(false); setLines(ls => ls.map((l, j) => (j === i ? v.slice(0, 20) : l))); };
  async function save(e) {
    e.preventDefault(); if (busy) return;
    if (!window.confirm('Submit this wording? Once submitted it cannot be changed here.')) return;
    setBusy(true); setErr('');
    try { const r = await api('brick_save', { code, name, lines }); setSaved(true); onSaved(r.brick_lines); } catch (x) { setErr(x.message); } finally { setBusy(false); }
  }
  return <form onSubmit={save}>
    <p className="cp-muted">Every wedding includes an engraved brick on the grounds. Choose your wording below: 3 lines, up to 20 characters each, including spaces and punctuation.{!done && ' Once you submit, it cannot be changed, so please check spelling.'}</p>
    {err && <div className="cp-error" role="alert">{err}</div>}
    {done && <div className="cp-ok" role="status">{saved ? 'Submitted. Thank you!' : 'Your wording has been submitted.'} It can no longer be changed here. If something needs to change, please contact the venue.</div>}
    <div style={{ background: '#e9e1d3', border: '2px solid #b9ab92', padding: '18px 12px', margin: '0 0 16px', textAlign: 'center', fontFamily: 'Cardo,Georgia,serif', letterSpacing: 2, minHeight: 96 }} aria-label="Brick preview">
      {lines.map((l, i) => <div key={i} style={{ minHeight: 26, fontSize: 18, color: '#4a4033' }}>{l || ' '}</div>)}
    </div>
    {lines.map((l, i) => <label className="cp-field" key={i}>Line {i + 1} <span className="cp-muted">({l.length}/20)</span><input value={l} maxLength={20} autoComplete="off" disabled={done} onChange={e => set(i, e.target.value)} /></label>)}
    {!done && <button className="cp-btn" disabled={busy || !lines.some(l => l.trim())}>{busy ? 'Submitting…' : 'Submit my wording'}</button>}
  </form>;
}

const fmtWalk = (w, o) => new Date(w.date + 'T' + w.start_time).toLocaleString('en-US', o);

// Same open tour times as the website; booking goes straight to the team.
// booked = the couple's walk-through ({ date, start_time }) once scheduled.
function WalkThrough({ api, code, name, booked, onBooked }) {
  const [slots, setSlots] = React.useState(null);
  const [pick, setPick] = React.useState(null);
  const [phone, setPhone] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const [err, setErr] = React.useState('');
  const load = React.useCallback(() => api('tour_slots', { code, name }).then(r => setSlots(r.slots || [])).catch(() => setSlots([])), [api, code, name]);
  React.useEffect(() => { load(); }, [load]);
  const days = React.useMemo(() => { const m = new Map(); (slots || []).forEach(x => { if (!m.has(x.date)) m.set(x.date, []); m.get(x.date).push(x); }); return [...m.entries()]; }, [slots]);
  const chosen = (slots || []).find(x => x.id === pick);
  const time = t => new Date('2000-01-01T' + t).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  const day = d => new Date(d + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  async function book() {
    if (busy || !chosen) return;
    setBusy(true); setErr('');
    try { const r = await api('tour_book', { code, name, slot_id: pick, phone }); onBooked(r.walkthrough); }
    catch (e) { setErr(e.message); setPick(null); load(); }
    finally { setBusy(false); }
  }
  if (booked) return <div className="cp-ok" role="status">Your walk-through is scheduled for {fmtWalk(booked, { weekday: 'long', month: 'long', day: 'numeric' })} at {fmtWalk(booked, { hour: 'numeric', minute: '2-digit' })}. To change it, use "Message our team".</div>;
  return <>
    <p className="cp-muted" style={{ marginTop: 0 }}>Want to see the estate again before your day? Pick a time that works for you.</p>
    {err && <div className="cp-error" role="alert">{err}</div>}
    {slots === null ? <p className="cp-muted">Loading available times…</p> : days.length === 0 ? <p className="cp-muted">No open times right now. Use "Message our team" and we'll find a time with you.</p> : <div className="cp-days">
      {days.map(([d, ts]) => <div className="cp-day" key={d}><b>{day(d)}</b><div className="cp-times">{ts.map(x => <button type="button" key={x.id} className="cp-time" aria-pressed={x.id === pick} onClick={() => setPick(x.id)}>{time(x.start_time)}</button>)}</div></div>)}
    </div>}
    {chosen && <>
      <label className="cp-field">Phone number (optional)<input type="tel" value={phone} onChange={e => setPhone(e.target.value)} /></label>
      <button type="button" className="cp-btn" disabled={busy} onClick={book}>{busy ? 'Booking…' : 'Confirm ' + time(chosen.start_time) + ', ' + day(chosen.date)}</button>
    </>}
  </>;
}

function MessageTeam({ api, code, name }) {
  const [people, setPeople] = React.useState(null), [pick, setPick] = React.useState(0), [via, setVia] = React.useState('email'), [text, setText] = React.useState('');
  const [err, setErr] = React.useState(''), [busy, setBusy] = React.useState(false), [ok, setOk] = React.useState(false);
  React.useEffect(() => { api('message_contacts', { code, name }).then(o => setPeople(o.contacts || [])).catch(() => setPeople([])); }, [api, code, name]);
  async function send(e) {
    e.preventDefault(); if (busy) return; setBusy(true); setErr(''); setOk(false);
    try { await api('send_message', { code, name, contact_id: pick, reply_via: via, message: text }); setOk(true); setText(''); } catch (x) { setErr(x.message); } finally { setBusy(false); }
  }
  const me = people && people[pick];
  return <form onSubmit={send}>
    <p className="cp-muted">Questions, changes, or something we should know? Send a note straight to our venue team.</p>
    {err && <div className="cp-error" role="alert">{err}</div>}
    {ok && <div className="cp-ok" role="status">Message sent. Our team will get back to you soon.</div>}
    {people === null ? <p className="cp-muted">Loading…</p> : <>
      <label className="cp-field">Who is this from?
        <select value={pick} onChange={e => setPick(Number(e.target.value))}>{people.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select>
      </label>
      <div className="cp-field" role="radiogroup" aria-label="How would you like us to reply?">
        How would you like us to reply?
        <label className="cp-check"><input type="radio" name="reply-via" checked={via === 'email'} onChange={() => setVia('email')} />Email{me && me.email ? ' (' + me.email + ')' : ''}</label>
        <label className="cp-check"><input type="radio" name="reply-via" checked={via === 'phone'} onChange={() => setVia('phone')} />Phone call{me && me.phone ? ' (' + me.phone + ')' : ''}</label>
      </div>
      <label className="cp-field">Message <span className="cp-muted">({text.length}/2000)</span><textarea rows={5} maxLength={2000} value={text} onChange={e => { setOk(false); setText(e.target.value); }} /></label>
      <button className="cp-btn" disabled={busy || !text.trim() || !me}>{busy ? 'Sending…' : 'Send message'}</button>
    </>}
  </form>;
}

export function ClientPayPage({ api, baseUrl, apiKey }) {
  const [code, setCode] = React.useState(() => { const h = new URLSearchParams(window.location.hash.slice(1)).get('code'); return h ? formatVenueCode(h, true) : ''; }), [name, setName] = React.useState(''), [needsName, setNeedsName] = React.useState(false);
  const [data, setData] = React.useState(null), [error, setError] = React.useState(''), [busy, setBusy] = React.useState(false);
  const [amount, setAmount] = React.useState(''), [receipt, setReceipt] = React.useState(null), [insNote, setInsNote] = React.useState('');
  const [payError, setPayError] = React.useState('');
  const [gate, setGate] = React.useState(null);
  const ppRef = React.useRef(null), live = React.useRef({});
  live.current = { code, name, amount };

  async function lookup(e) {
    e && e.preventDefault(); if (busy) return; setBusy(true); setError('');
    try {
      const d = await api('lookup', { code, name });
      let gateAgreement = null;
      try { const o = await api('agreement_status', { code, name }); const a = o.agreement; if (a && a.status === 'pending' && !a.signers.some(x => x.role === 'client' && x.status === 'signed')) gateAgreement = a; } catch (e) { /* no gate if the agreement can't be checked */ }
      setGate(gateAgreement); setData(d); setNeedsName(false);
      setAmount(d.next_due ? (d.next_due.amount_cents / 100).toFixed(2) : '');
    } catch (err) { setNeedsName(!!err.needs_name); setError(err.message); } finally { setBusy(false); }
  }

  React.useEffect(() => {
    if (!data || !data.paypal_client_id || !ppRef.current) return;
    let cancelled = false; ppRef.current.innerHTML = '';
    loadPayPal(data.paypal_client_id).then(pp => {
      if (cancelled || !ppRef.current) return;
      pp.Buttons({
        style: { layout: 'vertical', shape: 'rect', label: 'pay' },
        createOrder: async () => {
          setPayError('');
          const cents = Math.round(parseFloat(live.current.amount) * 100);
          if (!(cents >= 100)) { const m = 'Enter an amount of at least $1.00.'; setPayError(m); throw new Error(m); }
          return (await api('create_order', { code: live.current.code, name: live.current.name, amount_cents: cents })).id;
        },
        onApprove: async d => {
          try {
            const r = await api('capture_order', { code: live.current.code, name: live.current.name, order_id: d.orderID });
            setReceipt(r); setData(prev => ({ ...prev, ...r }));
          } catch (err) { setPayError(err.message); }
        },
        onError: err => setPayError(err && err.message ? err.message : 'The payment could not be completed.'),
      }).render(ppRef.current);
    }).catch(err => setPayError(err.message));
    return () => { cancelled = true; };
  }, [data && data.paypal_client_id, !!data, !!gate]);

  async function uploadInsurance(file) {
    if (!file) return; setInsNote(''); setError('');
    if (file.size > 8 * 1024 * 1024) { setError('The file must be under 8 MB.'); return; }
    setBusy(true);
    try {
      const base64 = await new Promise((res, rej) => { const fr = new FileReader(); fr.onload = () => res(String(fr.result).split(',')[1]); fr.onerror = () => rej(new Error('Could not read the file.')); fr.readAsDataURL(file); });
      await api('upload_insurance', { code, name, mime_type: file.type, base64 });
      setData(d => ({ ...d, insurance_uploaded: true })); setInsNote('Thank you. Your insurance was received.');
    } catch (err) { setError(err.message); } finally { setBusy(false); }
  }

  const pct = data && data.total_cents ? Math.min(100, data.paid_cents / data.total_cents * 100) : 0;
  const fmt = (d, o) => new Date(d + 'T12:00:00').toLocaleDateString('en-US', o);
  const daysTo = data ? Math.ceil((new Date(data.event_date + 'T12:00:00') - new Date()) / 86400000) : 0;
  const go = id => {
    window.dispatchEvent(new CustomEvent('cp-open', { detail: id }));
    setTimeout(() => { const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 30);
  };
  const tile = (id, icon, label, value, sub, ok) => <button type="button" className="cp-tile" onClick={() => go(id)}>
    <span className="cp-ico"><Icon name={icon} />{ok === true && <span className="cp-tick"><Icon name="check" size={15} /></span>}</span>
    <span className="cp-txt"><small>{label}</small>{value ? <b>{value}</b> : null}<em>{sub}</em></span></button>;
  return <main className="cp-page"><style>{style}</style><div className={'cp-shell' + (data ? ' wide' : '')}>
    {!data ? <>
      <div className="cp-brandrow">NORTH STAR HOUSE</div>
      <h1>Your event</h1>
      {error && <div className="cp-error" role="alert">{error}</div>}
      <form className="cp-card" onSubmit={lookup}>
        <h2>Enter your venue code</h2>
        <p className="cp-muted">Your venue code is your event date, written like <strong>DEC-28-2026</strong>. Anyone paying on your behalf can use the same code, and the payment will be added to your booking.</p>
        <label className="cp-field">Venue code<input value={code} onChange={e => setCode(formatVenueCode(e.target.value, e.target.value.length >= code.length))} placeholder="DEC-28-2026" autoComplete="off" autoCapitalize="characters" spellCheck={false} /></label>
        {needsName && <label className="cp-field">Last name on the booking<input value={name} onChange={e => setName(e.target.value)} autoComplete="off" /></label>}
        <button className="cp-btn" disabled={busy || !code.trim()}>{busy ? 'Checking…' : 'Continue'}</button>
      </form>
    </> : gate ? <AgreementGate api={api} code={code} name={name} baseUrl={baseUrl} apiKey={apiKey} agreement={gate} eventName={data.name} onUnlock={() => setGate(null)} /> : <>
      <header className="cp-head">
        <div className="cp-head-img" aria-hidden="true" />
        <div className="cp-head-main">
          <div className="cp-brandrow">NORTH STAR HOUSE</div>
          <h1>{data.name}</h1>
          <div className="cp-sub"><Icon name="calendar" size={16} /><span>{fmt(data.event_date, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span></div>
          <button type="button" className="cp-msgbtn" onClick={() => go('cp-message')}><Icon name="chat" size={17} />Message our team</button>
        </div>
        <div className="cp-head-side">
          <div className="cp-countdown">{daysTo > 0 ? <><strong>{daysTo}</strong><hr /><span>{daysTo === 1 ? 'day to go' : 'days to go'}</span></> : daysTo === 0 ? <strong style={{ fontSize: 24 }}>Today!</strong> : <strong style={{ fontSize: 20 }}>Congratulations</strong>}</div>
        </div>
      </header>
      {error && <div className="cp-error" role="alert">{error}</div>}
      <div className="cp-tiles">
        {tile('cp-payments', 'coins', 'Balance', data.has_schedule ? money(data.balance_cents) : '—', data.has_schedule ? 'of ' + money(data.total_cents) : 'No schedule yet', data.has_schedule ? data.balance_cents === 0 : null)}
        {tile('cp-insurance', 'shield', 'Insurance', data.insurance_uploaded ? '' : 'To do', 'Certificate of insurance', data.insurance_uploaded)}
        {tile('cp-questionnaire', 'clipboard', 'Questionnaire', data.questionnaire_done ? '' : 'To do', 'Wedding day details', data.questionnaire_done)}
        {tile('cp-brick', 'doc', 'Legacy brick', data.brick_done ? '' : 'To do', '3 lines, 20 characters', data.brick_done)}
        {tile('cp-walkthrough', 'walk', 'Walk-through', data.walkthrough ? '' : 'Optional', data.walkthrough ? 'Scheduled ' + fmtWalk(data.walkthrough, { month: 'short', day: 'numeric' }) + ', ' + fmtWalk(data.walkthrough, { hour: 'numeric', minute: '2-digit' }) : 'Second visit to the estate', data.walkthrough ? true : null)}
      </div>
      <div className="cp-cols">
        <div className="cp-col">
          <AgreementCard api={api} code={code} name={name} baseUrl={baseUrl} apiKey={apiKey} />
          <div className="cp-card" id="cp-payments">
            <h2><span className="cp-hico"><Icon name="card" size={16} /></span>Payments</h2>
            {data.has_schedule && <><div className="cp-big">{money(data.balance_cents)} <span className="cp-muted" style={{ fontFamily: 'system-ui,sans-serif', fontWeight: 400 }}>remaining of {money(data.total_cents)}</span></div>
              <div className="cp-bar"><span style={{ width: pct + '%' }} /></div>
              {Array.isArray(data.schedule) && data.schedule.length > 0 && <div style={{ margin: '4px 0 10px' }}>{data.schedule.map((p, i) => <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'space-between', padding: '7px 0', borderTop: i ? '1px solid #efe7d8' : 'none', fontSize: 13 }}><span><strong>{p.label}</strong><br /><span className="cp-muted">{p.due_date ? fmt(p.due_date, { month: 'long', day: 'numeric', year: 'numeric' }) : ''}</span></span><span style={{ textAlign: 'right' }}>{money(p.amount_cents)}<br /><span className={'cp-pill' + (p.paid ? ' ok' : '')} style={{ fontSize: 11, padding: '1px 9px' }}>{p.paid ? 'Paid' : 'Due'}</span></span></div>)}</div>}
              {data.next_due && <div className="cp-next"><Icon name="calendar" size={18} /><span>Next: {data.next_due.label} — {money(data.next_due.amount_cents)}{data.next_due.due_date ? ' due ' + fmt(data.next_due.due_date, { month: 'short', day: 'numeric', year: 'numeric' }) : ''}</span></div>}</>}
            {receipt && <div className="cp-ok" role="status">Payment of {money(receipt.paid_cents)} received and added to your booking. PayPal receipt: {receipt.receipt_id}</div>}
            {payError && <div className="cp-error" role="alert">{payError}</div>}
            {data.paypal_client_id ? <>
              <label className="cp-field">Amount (USD)<input value={amount} inputMode="decimal" onChange={e => setAmount(e.target.value.replace(/[^0-9.]/g, ''))} /></label>
              <div ref={ppRef} />
            </> : <p className="cp-muted" style={{ margin: 0 }}>{data.schedule_readonly ? 'Questions about a payment? Use "Message our team" above and we will help.' : 'Online payments are not available yet. Please contact us to arrange payment.'}</p>}
          </div>
          <Acc id="cp-insurance" icon="shield" title="Certificate of insurance" pill={<Pill ok={data.insurance_uploaded} yes="Received" no="Needed" />} defaultOpen={!data.insurance_uploaded}>
            <p className="cp-muted" style={{ marginTop: 0 }}>Event insurance is required and due one month before your wedding.</p>
            {data.insurance_uploaded && <div className="cp-ok" role="status">{insNote || 'We have your insurance on file. You can upload a replacement below.'}</div>}
            <label className="cp-field">Upload a PDF, JPG or PNG (up to 8 MB)<input type="file" accept="application/pdf,image/jpeg,image/png" disabled={busy} onChange={e => { uploadInsurance(e.target.files[0]); e.target.value = ''; }} /></label>
          </Acc>
          <Acc id="cp-walkthrough" icon="walk" title="Second walk-through" pill={<Pill ok={!!data.walkthrough} yes="Scheduled" no="Optional" />}>
            <WalkThrough api={api} code={code} name={name} booked={data.walkthrough} onBooked={w => setData(d => ({ ...d, walkthrough: w }))} />
          </Acc>
        </div>
        <div className="cp-col">
          <Acc id="cp-brick" icon="brick" title="Your legacy brick" pill={<Pill ok={data.brick_done} yes="Submitted" no="Needed" />} defaultOpen={!data.brick_done}>
            <Brick api={api} code={code} name={name} initial={data.brick_lines} done={data.brick_done} onSaved={lines => setData(d => ({ ...d, brick_lines: lines, brick_done: true }))} />
          </Acc>
          <Acc id="cp-message" icon="chat" title="Message our team">
            <MessageTeam api={api} code={code} name={name} />
          </Acc>
        </div>
      </div>
      <Acc id="cp-questionnaire" icon="clipboard" title="Event questionnaire" pill={<Pill ok={data.questionnaire_done} yes="Completed" no="To do" />} defaultOpen={!data.questionnaire_done}>
        <Questionnaire api={api} code={code} name={name} onSaved={() => setData(d => ({ ...d, questionnaire_done: true }))} />
      </Acc>
    </>}
  </div></main>;
}

export function createClientPayApi({ baseUrl, apiKey }) {
  return async (action, body) => {
    const res = await fetch(baseUrl + '/functions/v1/client-pay', { method: 'POST', headers: { 'Content-Type': 'application/json', apikey: apiKey, Authorization: 'Bearer ' + apiKey }, body: JSON.stringify({ ...body, action }) });
    const out = await res.json().catch(() => ({}));
    if (!res.ok) { const e = new Error(out.error || 'Something went wrong. Please try again.'); Object.assign(e, out); throw e; }
    return out;
  };
}

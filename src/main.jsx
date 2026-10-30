// Client event page for venue.northstarhouse.org: venue code -> dashboard. No staff features live here.
import { ClientPayPage, createClientPayApi } from './venue-client-pay.jsx';
import { AgreementSigningPage, createAgreementApi } from './venue-contracts.jsx';

const SUPABASE_URL = 'https://uvzwhhwzelaelfhfkvdb.supabase.co';
const SUPABASE_KEY = 'sb_publishable_EbFMfEbyEp3gASl-GZm3tQ_LnPEe5do'; // publishable (public) key

// A signing link from the agreement email (#agreement=...) opens the signing page directly; otherwise the event page.
const agreementToken = new URLSearchParams(window.location.hash.slice(1)).get('agreement');
ReactDOM.createRoot(document.getElementById('root')).render(
  agreementToken ? React.createElement(AgreementSigningPage, { api: createAgreementApi({ baseUrl: SUPABASE_URL, apiKey: SUPABASE_KEY }), token: agreementToken }) : React.createElement(ClientPayPage, { api: createClientPayApi({ baseUrl: SUPABASE_URL, apiKey: SUPABASE_KEY }), baseUrl: SUPABASE_URL, apiKey: SUPABASE_KEY })
);

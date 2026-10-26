// Client event page for venue.northstarhouse.org: venue code -> dashboard. No staff features live here.
import { ClientPayPage, createClientPayApi } from './venue-client-pay.jsx';

const SUPABASE_URL = 'https://uvzwhhwzelaelfhfkvdb.supabase.co';
const SUPABASE_KEY = 'sb_publishable_EbFMfEbyEp3gASl-GZm3tQ_LnPEe5do'; // publishable (public) key

ReactDOM.createRoot(document.getElementById('root')).render(
  React.createElement(ClientPayPage, { api: createClientPayApi({ baseUrl: SUPABASE_URL, apiKey: SUPABASE_KEY }) })
);

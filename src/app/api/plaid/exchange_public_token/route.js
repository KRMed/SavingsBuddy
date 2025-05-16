// /app/api/plaid/exchange_public_token/route.js
import { PlaidApi, Configuration, PlaidEnvironments } from 'plaid';

const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID;
const PLAID_SECRET = process.env.PLAID_SECRET;
const PLAID_ENV = process.env.PLAID_ENV || 'sandbox';

if (!PLAID_CLIENT_ID || !PLAID_SECRET) {
  console.error('PLAID_CLIENT_ID and PLAID_SECRET environment variables must be set.');
}

const configuration = new Configuration({
  basePath: PlaidEnvironments[PLAID_ENV],
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': PLAID_CLIENT_ID,
      'PLAID-SECRET': PLAID_SECRET,
    },
  },
});

const plaidClient = new PlaidApi(configuration);

export async function POST(request) {
  try {
    const { public_token } = await request.json();

    if (!public_token) {
      return new Response(JSON.stringify({ error: 'Public token is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const response = await plaidClient.itemPublicTokenExchange({
      public_token: public_token,
    });

    const access_token = response.data.access_token;
    // const item_id = response.data.item_id; // You might want to store this

    // In a real application, you should store the access_token securely, associated with the user.
    // For this example, we are returning it to the client, but this is not recommended for production.
    return new Response(JSON.stringify({ access_token: access_token }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error exchanging public token:', error.response ? error.response.data : error.message);
    return new Response(JSON.stringify({ error: 'Failed to exchange public token' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

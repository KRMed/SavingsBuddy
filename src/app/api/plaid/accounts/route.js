// src/app/api/plaid/accounts/route.js
import { PlaidApi, Configuration, PlaidEnvironments } from 'plaid';

const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID;
const PLAID_SECRET = process.env.PLAID_SECRET;
const PLAID_ENV = process.env.PLAID_ENV || 'sandbox';

if (!PLAID_CLIENT_ID || !PLAID_SECRET) {
  console.error('PLAID_CLIENT_ID and PLAID_SECRET environment variables must be set for accounts route.');
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
    const { access_token } = await request.json();

    if (!access_token) {
      return new Response(JSON.stringify({ error: 'Access token is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const accountsResponse = await plaidClient.accountsGet({ access_token });
    return new Response(JSON.stringify({ accounts: accountsResponse.data.accounts }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error fetching accounts:', error.response ? error.response.data : error.message);
    // Ensure error.response.data is included if it exists, as it often has Plaid specific error codes.
    const errorPayload = { 
      error: 'Failed to fetch accounts', 
      details: error.message 
    };
    if (error.response && error.response.data) {
      errorPayload.plaid_error = error.response.data;
    }
    return new Response(JSON.stringify(errorPayload), {
      status: 500, // Or error.response.status if available and relevant
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

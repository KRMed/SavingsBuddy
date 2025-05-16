import { PlaidApi, Configuration, PlaidEnvironments } from 'plaid';

export async function POST(request) {
  const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID;
  const PLAID_SECRET = process.env.PLAID_SECRET;
  const PLAID_ENV = process.env.PLAID_ENV || 'sandbox';

  if (!PLAID_CLIENT_ID || !PLAID_SECRET) {
    console.error('PLAID_CLIENT_ID and PLAID_SECRET environment variables must be set.');
    return new Response(JSON.stringify({ error: 'Server configuration error: Plaid credentials missing. Please check server logs and .env.local file.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!PlaidEnvironments[PLAID_ENV]) {
    const validEnvs = Object.keys(PlaidEnvironments).join(', ');
    console.error(`Invalid PLAID_ENV: \"${PLAID_ENV}\". Must be one of ${validEnvs}`);
    return new Response(JSON.stringify({ error: `Server configuration error: Invalid PLAID_ENV. Set it to one of: ${validEnvs}.` }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const configuration = new Configuration({
    basePath: PlaidEnvironments[PLAID_ENV],
    baseOptions: {
      headers: {
        'PLAID-CLIENT-ID': PLAID_CLIENT_ID,
        'PLAID-SECRET': PLAID_SECRET,
        'Plaid-Version': '2020-09-14',
      },
    },
  });

  const plaidClient = new PlaidApi(configuration);

  try {
    const user = {
      client_user_id: 'user_' + Date.now(), // Replace with a persistent unique user ID from your system
    };

    const linkTokenParams = {
      user: user,
      client_name: 'SavingsBuddy',
      products: ['transactions'],
      country_codes: ['US'],
      language: 'en',
    };

    const createTokenResponse = await plaidClient.linkTokenCreate(linkTokenParams);

    return new Response(JSON.stringify({ link_token: createTokenResponse.data.link_token }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error creating link token:', error.response ? JSON.stringify(error.response.data, null, 2) : error.message);
    const errorMessage = error.response && error.response.data && error.response.data.error_message 
      ? error.response.data.error_message 
      : 'Failed to create link token due to server-side issue.';
    return new Response(JSON.stringify({ 
      error: errorMessage, 
      error_type: error.response && error.response.data && error.response.data.error_type,
      error_code: error.response && error.response.data && error.response.data.error_code 
    }), {
      status: (error.response && error.response.status) || 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

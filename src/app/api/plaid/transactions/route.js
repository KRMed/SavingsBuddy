// /app/api/plaid/transactions/route.js
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
    const { access_token, account_id } = await request.json(); // Added account_id

    if (!access_token) {
      return new Response(JSON.stringify({ error: 'Access token is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Set cursor to null to fetch all transactions for the last 30 days
    // For subsequent calls, use the next_cursor provided in the response
    let cursor = null; 

    // New transactions updates since "cursor"
    let added = [];
    let modified = [];
    // Removed transaction ids
    let removed = [];
    let hasMore = true;

    // Iterate through each page of new transaction updates for item
    // This is simplified for the example; in a real app, you'd persist the cursor
    // and manage updates more robustly. The prompt asks to fetch every time page is reloaded,
    // so we are not implementing full sync here. We'll fetch recent transactions.

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30); // 30 days ago
    const endDate = new Date(); // Today

    const requestOptions = { // Define requestOptions
      count: 100, // Fetch up to 100 transactions
      offset: 0,
    };

    if (account_id) { // If an account_id is provided, filter by it
      requestOptions.account_ids = [account_id];
    }

    const transactionsResponse = await plaidClient.transactionsGet({
      access_token: access_token,
      start_date: startDate.toISOString().split('T')[0], // YYYY-MM-DD
      end_date: endDate.toISOString().split('T')[0],     // YYYY-MM-DD
      options: requestOptions, // Use the modified options
    });
    
    let latest_transactions = transactionsResponse.data.transactions;
    const total_transactions = transactionsResponse.data.total_transactions;
    
    // The transactions in the response are paginated, so make multiple calls while
    // incrementing the offset to retrieve all transactions.
    // For this example, we're just taking the first page (up to 100).
    // If you want all transactions, you'd loop here.

    return new Response(JSON.stringify({ latest_transactions: latest_transactions, total_transactions: total_transactions }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error fetching transactions:', error.response ? error.response.data : error.message);
    return new Response(JSON.stringify({ error: 'Failed to fetch transactions' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

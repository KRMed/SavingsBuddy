'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useRouter } from 'next/navigation';
import { PlaidLink, usePlaidLink } from 'react-plaid-link';

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [linkToken, setLinkToken] = useState(null);
  const [accessToken, setAccessToken] = useState(null); // In a real app, store this securely, likely server-side.
  const [transactions, setTransactions] = useState([]);
  const [plaidLoading, setPlaidLoading] = useState(false);
  const [userStreak, setUserStreak] = useState(0); // Added userStreak state
  const [accounts, setAccounts] = useState([]); // Added accounts state
  const [selectedAccountId, setSelectedAccountId] = useState(''); // Added selectedAccountId state
  const [userGoals, setUserGoals] = useState({ budget_goal: 0, savings_goal: 0 }); // Added userGoals state
  const [budgetGoalMet, setBudgetGoalMet] = useState(false); // Added budgetGoalMet state
  const [savingsGoalMet, setSavingsGoalMet] = useState(false); // Added savingsGoalMet state
  const [lastStreakUpdateDate, setLastStreakUpdateDate] = useState(null); // Added state for last streak update date

  // State for editing goals
  const [isEditingBudgetGoal, setIsEditingBudgetGoal] = useState(false);
  const [newBudgetGoal, setNewBudgetGoal] = useState('');
  const [isEditingSavingsGoal, setIsEditingSavingsGoal] = useState(false);
  const [newSavingsGoal, setNewSavingsGoal] = useState('');

  // redirect if not logged in
  useEffect(() => {
    async function checkLoginAndFetchData() {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        console.error("Error getting session:", sessionError);
        router.push('/login');
        return;
      }

      if (!session) {
        router.push('/login');
      } else {
        // Session exists, now fetch user data including streak, goals, and last streak update date
        try {
          const { data: userData, error: userError } = await supabase
            .from('profiles') // Assuming a 'profiles' table
            .select('current_streak, budget_goal, savings_goal, last_streak_update_date') // Added last_streak_update_date
            .eq('id', session.user.id)
            .single(); // Assuming one row per user

          if (userError) {
            console.error('Error fetching user profile:', userError);
            // Handle error, maybe set streak to a default or show an error message
            // For now, we'll let it use the default 0
          } else if (userData) {
            setUserStreak(userData.current_streak || 0);
            setUserGoals({
              budget_goal: userData.budget_goal || 0,
              savings_goal: userData.savings_goal || 0,
            });
            setLastStreakUpdateDate(userData.last_streak_update_date); // Set last streak update date
          }
        } catch (e) {
          console.error('Exception fetching user profile:', e);
        } finally {
          setLoading(false);
        }
      }
    };
    checkLoginAndFetchData();
  }, [router]);

  // Fetch Link Token
  useEffect(() => {
    const fetchLinkToken = async () => {
      try {
        const response = await fetch('/api/plaid/create_link_token', { method: 'POST' });
        const contentType = response.headers.get("content-type");

        if (!response.ok) {
          let errorPayload = { error: `Request failed with status ${response.status} ${response.statusText}` };
          if (contentType && contentType.includes("application/json")) {
            const errorJson = await response.json();
            errorPayload = { ...errorPayload, ...errorJson };
          } else {
            const errorText = await response.text();
            console.error("Received non-JSON error response from /api/plaid/create_link_token. Raw response:", errorText);
          }
        }

        if (contentType && contentType.includes("application/json")) {
          const responseData = await response.json();
          const { link_token, error: apiError } = responseData;

          if (apiError) {
            console.error("API returned success status but with error in JSON payload:", responseData);
            const err = new Error(apiError);
            err.details = "API indicated an error in the JSON response.";
            err.error_type = responseData.error_type;
            err.error_code = responseData.error_code;
            throw err;
          }
          setLinkToken(link_token);
        } else {
          const responseText = await response.text();
          console.error("Expected JSON response from /api/plaid/create_link_token but received:", contentType, ". Raw response:", responseText);
          const err = new Error("Invalid response type from server.");
          err.details = `Expected application/json but got ${contentType || 'unknown'}. See browser console for raw response.`;
          throw err;
        }

      } catch (error) {
        const errorMessage = error.message || "Unknown error occurred";
        const errorDetails = error.details || "No additional details.";
        const errorHint = error.hint || "";
        console.error(`Error fetching link token: ${errorMessage}. Details: ${errorDetails}. ${errorHint}`, error);
        setLinkToken(null);
      }
    };

    if (!loading && !accessToken) { // Only fetch if user is logged in and we don't have an access token yet (or link token)
      fetchLinkToken();
    }
  }, [loading, accessToken]); // Refetch if loading state changes or if accessToken is cleared

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: async (public_token, metadata) => {
      // Exchange public_token for access_token
      setPlaidLoading(true);
      try {
        const response = await fetch('/api/plaid/exchange_public_token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ public_token }),
        });
        const { access_token } = await response.json();
        setAccessToken(access_token);
        
      } catch (error) {
        console.error("Error exchanging public token:", error);
      } finally {
        setPlaidLoading(false);
      }
    },
    onExit: (err, metadata) => {
      console.log("Plaid Link exited:", err, metadata);
    },
  });

  // Fetch Accounts if accessToken is available
  useEffect(() => {
    const fetchAccounts = async () => {
      if (accessToken) {
        setPlaidLoading(true);
        try {
          const response = await fetch('/api/plaid/accounts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ access_token: accessToken }),
          });
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch accounts');
          }
          const data = await response.json();
          setAccounts(data.accounts || []);
          if (data.accounts && data.accounts.length > 0) {
            setSelectedAccountId(data.accounts[0].account_id); // Select the first account by default
          }
        } catch (error) {
          console.error("Error fetching accounts:", error);
          setAccounts([]);
        } finally {
          setPlaidLoading(false);
        }
      }
    };

    if (!loading) { // Only fetch if user is logged in
      fetchAccounts();
    }
  }, [accessToken, loading]);

  // Fetch Transactions if accessToken and selectedAccountId are available
  useEffect(() => {
    const fetchTransactions = async () => {
      if (accessToken && selectedAccountId) { // Check for selectedAccountId
        setPlaidLoading(true);
        try {
          const response = await fetch('/api/plaid/transactions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              access_token: accessToken,
              account_id: selectedAccountId // Send selectedAccountId
            }),
          });
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch transactions');
          }
          const data = await response.json();
          setTransactions(data.latest_transactions || []);
        } catch (error) {
          console.error("Error fetching transactions:", error);
          setTransactions([]); // Clear transactions on error
        } finally {
          setPlaidLoading(false);
        }
      } else {
        setTransactions([]); // Clear transactions if no account is selected
      }
    };

    if (!loading) { 
        fetchTransactions();
    }
  }, [accessToken, selectedAccountId, loading]); // Add selectedAccountId to dependency array

  // Evaluate goals when transactions or userGoals change
  useEffect(() => {
    if (!accessToken || !selectedAccountId || transactions.length === 0) {
      setBudgetGoalMet(false);
      setSavingsGoalMet(false);
      return;
    }

    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

    // Filter transactions for today and for the selected account
    const todaysTransactions = transactions.filter(t => {
      // Ensure t.date is in 'YYYY-MM-DD' format or convert it
      // Assuming t.date is already in 'YYYY-MM-DD'
      return t.date === today && accounts.find(acc => acc.account_id === selectedAccountId && acc.type === 'depository' && (acc.subtype === 'checking' || acc.subtype === 'savings')); // Consider only depository accounts for these goals
    });

    // Budget Goal: total expenses in checking account for that day is less than their budget
    let dailyExpenses = 0;
    todaysTransactions.forEach(t => {
      const account = accounts.find(acc => acc.account_id === selectedAccountId);
      if (account && account.subtype === 'checking' && t.amount > 0) { // Positive amount is an expense from Plaid's perspective for depository accounts
        dailyExpenses += t.amount;
      }
    });
    setBudgetGoalMet(dailyExpenses < userGoals.budget_goal);

    // Savings Goal: saved more money than their savings goal
    let dailySavingsContributions = 0;
    todaysTransactions.forEach(t => {
      const account = accounts.find(acc => acc.account_id === selectedAccountId);
      // Assuming Plaid represents deposits/inflows to savings accounts as negative amounts
      if (account && account.subtype === 'savings' && t.amount < 0) {
        dailySavingsContributions += Math.abs(t.amount);
      }
    });
    setSavingsGoalMet(dailySavingsContributions >= userGoals.savings_goal);

  }, [transactions, selectedAccountId, userGoals, accessToken, accounts]);

  // useEffect for updating streak based on goal completion
  useEffect(() => {
    const updateUserStreak = async () => {
      const today = new Date().toISOString().split('T')[0];
      const { data: { session } } = await supabase.auth.getSession();

      if (!session || !session.user) {
        // console.log("User not authenticated, cannot update streak.");
        return;
      }

      // Check if goals are met and if streak hasn't been updated today
      if ((budgetGoalMet || savingsGoalMet) && lastStreakUpdateDate !== today) {
        try {
          const newStreak = (userStreak || 0) + 1;
          const { error } = await supabase
            .from('profiles')
            .update({ current_streak: newStreak, last_streak_update_date: today })
            .eq('id', session.user.id);

          if (error) {
            console.error('Error updating streak:', error);
          } else {
            setUserStreak(newStreak);
            setLastStreakUpdateDate(today);
            console.log('Streak updated successfully to:', newStreak, 'on', today);
          }
        } catch (e) {
          console.error('Exception updating streak:', e);
        }
      }
    };

    // Only run if not loading (initial data fetched) and goal states have been determined.
    if (!loading && (budgetGoalMet !== undefined && savingsGoalMet !== undefined)) {
       updateUserStreak();
    }
  }, [budgetGoalMet, savingsGoalMet, loading, userStreak, lastStreakUpdateDate, router]); // Dependencies for streak update

  const handleGoalUpdate = async (goalType, newValue) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session || !session.user) {
      console.error('User not authenticated for goal update');
      // Optionally, show a message to the user
      return;
    }

    const numericValue = parseFloat(newValue);
    if (isNaN(numericValue) || numericValue < 0) {
      console.error('Invalid goal value');
      // Optionally, show a message to the user
      return;
    }

    let updateData = {};
    if (goalType === 'budget') {
      updateData = { budget_goal: numericValue };
    } else if (goalType === 'savings') {
      updateData = { savings_goal: numericValue };
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', session.user.id);

      if (error) {
        console.error(`Error updating ${goalType} goal:`, error);
        // Optionally, show an error message to the user
      } else {
        setUserGoals(prevGoals => ({ ...prevGoals, ...updateData }));
        if (goalType === 'budget') {
          setIsEditingBudgetGoal(false);
        } else if (goalType === 'savings') {
          setIsEditingSavingsGoal(false);
        }
        console.log(`${goalType} goal updated successfully.`);
      }
    } catch (e) {
      console.error(`Exception updating ${goalType} goal:`, e);
      // Optionally, show an error message to the user
    }
  };

  if (loading) return <p className="text-center text-xl p-10">Loading user session...</p>;

  //plaid
  
    return (
  <div className="h-screen bg-gray-100">
    <div className="flex flex-row h-full">
      <aside className="bg-gray-700 flex flex-col items-center justify-start h-[600px] w-[300px] m-8 p-4">
        <h3 className="text-xl text-center mb-4">Transactions History</h3>
        {plaidLoading && <p>Loading Plaid data...</p>}
        {!accessToken && !plaidLoading && (
          <>
            <p className="text-center mb-2">Authenticate with Plaid to see your transactions.</p>
            <button
              onClick={() => open()}
              disabled={!ready || plaidLoading}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            >
              Authenticate with Plaid
            </button>
          </>
        )}
        {accessToken && !plaidLoading && accounts.length > 0 && (
          <div className="mb-4 w-full">
            <label htmlFor="account-select" className="block text-sm font-medium text-white mb-1">Select Account:</label>
            <select
              id="account-select"
              value={selectedAccountId}
              onChange={(e) => setSelectedAccountId(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              disabled={plaidLoading}
            >
              {accounts.map((account) => (
                <option key={account.account_id} value={account.account_id}>
                  {account.name} ({account.subtype})
                </option>
              ))}
            </select>
          </div>
        )}
        {accessToken && !plaidLoading && transactions.length > 0 && (
          <ul className="overflow-y-auto w-full">
            {transactions.map((transaction) => (
              <li key={transaction.transaction_id} className="mb-2 p-2 bg-gray-600 rounded">
                <p className="font-semibold">{transaction.name}</p>
                <p className="text-sm">${transaction.amount.toFixed(2)} ({transaction.date})</p>
              </li>
            ))}
          </ul>
        )}
        {accessToken && !plaidLoading && transactions.length === 0 && selectedAccountId && (
          <p>No transactions found for the selected account.</p>
        )}
         {accessToken && !plaidLoading && accounts.length === 0 && !plaidLoading && (
          <p>No accounts found. Try re-authenticating with Plaid.</p>
        )}
      </aside>
      <div className="flex flex-col flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl text-black font-semibold">Streak: {userStreak}</h2>
          <div className="bg-gray-700 px-6 py-2 rounded text-xl">Badge</div>
        </div>
        <div className="bg-gray-700 p-6 rounded w-[500px]">
          <h3 className="text-2xl mb-4">Daily Goals:</h3>
          {!accessToken ? (
            <p className="text-gray-400">Please authenticate with Plaid to track your goals.</p>
          ) : (
            <ul>
              <li className="flex items-center mb-2">
                <input type="checkbox" checked={budgetGoalMet} disabled className="mr-2 h-5 w-5 accent-green-500" />
                <span>Expenses under daily budget (Target: ${userGoals.budget_goal})</span>
              </li>
              <li className="flex items-center">
                <input type="checkbox" checked={savingsGoalMet} disabled className="mr-2 h-5 w-5 accent-green-500" />
                <span>Met daily savings goal (Target: ${userGoals.savings_goal})</span>
              </li>
            </ul>
          )}
        </div>
        {/* Settings Section */}
        <div className="bg-gray-700 p-6 rounded w-[500px] mt-8">
          <h3 className="text-2xl mb-4">Settings</h3>
          {/* Budget Goal Setting */}
          <div className="flex items-center mb-4">
            <label htmlFor="budgetGoalInput" className="mr-2 text-white">Daily Budget Goal:</label>
            <input 
              type="number" 
              id="budgetGoalInput" 
              value={isEditingBudgetGoal ? newBudgetGoal : userGoals.budget_goal} 
              onChange={(e) => setNewBudgetGoal(e.target.value)} 
              disabled={!isEditingBudgetGoal} 
              className="p-1 rounded bg-gray-600 text-white w-24 mr-2 disabled:opacity-70"
            />
            <button 
              onClick={() => {
                if (isEditingBudgetGoal) {
                  handleGoalUpdate('budget', newBudgetGoal);
                } else {
                  setNewBudgetGoal(userGoals.budget_goal.toString());
                  setIsEditingBudgetGoal(true);
                }
              }}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded"
            >
              {isEditingBudgetGoal ? 'Confirm' : 'Edit'}
            </button>
          </div>

          {/* Savings Goal Setting */}
          <div className="flex items-center mb-4">
            <label htmlFor="savingsGoalInput" className="mr-2 text-white">Daily Savings Goal:</label>
            <input 
              type="number" 
              id="savingsGoalInput" 
              value={isEditingSavingsGoal ? newSavingsGoal : userGoals.savings_goal} 
              onChange={(e) => setNewSavingsGoal(e.target.value)} 
              disabled={!isEditingSavingsGoal} 
              className="p-1 rounded bg-gray-600 text-white w-24 mr-2 disabled:opacity-70"
            />
            <button 
              onClick={() => {
                if (isEditingSavingsGoal) {
                  handleGoalUpdate('savings', newSavingsGoal);
                } else {
                  setNewSavingsGoal(userGoals.savings_goal.toString());
                  setIsEditingSavingsGoal(true);
                }
              }}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded"
            >
              {isEditingSavingsGoal ? 'Confirm' : 'Edit'}
            </button>
          </div>
          {/* <p className="text-gray-400">Settings content will go here.</p> */}
        </div>
      </div>
    </div>
  </div>
);
}

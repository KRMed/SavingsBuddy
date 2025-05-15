'use client';

export default function Dashboard() {
    return (
  <div className="h-screen bg-gray-100">
    <div className="flex flex-row h-full">
      <aside className="bg-gray-700 flex items-center justify-center h-[600px] w-[300px] m-8">
        <span className="text-2xl text-center">Transactions History</span>
      </aside>
      <div className="flex flex-col flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl text-black font-semibold">Streak: {"99"}</h2>
          <div className="bg-gray-700 px-6 py-2 rounded text-xl">Badge</div>
        </div>
        <div className="bg-gray-700 p-6 rounded w-[500px]">
          <h3 className="text-2xl mb-4">Completed at least one:</h3>
          <ul>
            <li className="flex items-center mb-2">
              <span className="inline-block w-6 h-6 mr-2 border-2 border-black rounded">
                <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </span>
              Expenses under x amount
            </li>
            <li className="flex items-center">
              <span className="inline-block w-6 h-6 mr-2 border-2 border-black rounded">
                <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </span>
              Saved x amount
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

}

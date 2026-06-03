function ModeSelector({ onSelect }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <h1 className="text-4xl font-bold text-indigo-700 mb-2">
        TaxMate
      </h1>

      <p className="text-gray-600 mb-10 text-center max-w-md">
        Understand your salary, compare tax regimes, and get smart tax insights.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
        {/* QUICK MODE */}
        <button
          type="button"
          onClick={() => onSelect("quick")}
          className="text-left bg-white rounded-2xl shadow hover:shadow-lg transition p-8 border border-transparent hover:border-indigo-500"
        >
          <h2 className="text-2xl font-semibold text-indigo-600 mb-3">
            Quick Estimate
          </h2>
          <p className="text-gray-600">
            Just want to know how much tax you need to pay?
            Enter your income and get instant results.
          </p>
        </button>

        {/* DETAILED MODE */}
        <button
          type="button"
          onClick={() => onSelect("detailed")}
          className="text-left bg-white rounded-2xl shadow hover:shadow-lg transition p-8 border border-transparent hover:border-indigo-500"
        >
          <h2 className="text-2xl font-semibold text-indigo-600 mb-3">
            Detailed Analysis
          </h2>
          <p className="text-gray-600">
            Want a full breakdown, regime comparison, and tax-saving guidance?
            Dive deeper here.
          </p>
        </button>
      </div>
    </div>
  );
}

export default ModeSelector;

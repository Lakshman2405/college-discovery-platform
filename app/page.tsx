import SearchBar from "./components/SearchBar";
import Link from "next/link";

async function getColleges() {
  const res = await fetch(
    "http://localhost:3000/api/colleges",
    {
      cache: "no-store",
    }
  );

  return res.json();
}

export default async function Home() {
  const colleges = await getColleges();

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-8 py-12">

        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-extrabold text-white mb-4">
            Find Your Perfect Engineering College
          </h1>

          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            AI-powered college discovery platform for exploring colleges,
            comparing options, and predicting the best college & branch
            combinations based on your rank and career goals.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <Link
            href="/predictor"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg transition"
          >
            🤖 AI Predictor
          </Link>

          <Link
            href="/compare"
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg transition"
          >
            ⚖️ Compare Colleges
          </Link>
        </div>

        {/* Stats Section */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-6 shadow-xl text-center">
            <h2 className="text-4xl font-bold text-blue-600">
              {colleges.length}+
            </h2>
            <p className="text-gray-600 mt-2">
              Colleges
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-xl text-center">
            <h2 className="text-4xl font-bold text-green-600">
              50+
            </h2>
            <p className="text-gray-600 mt-2">
              Branches
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-xl text-center">
            <h2 className="text-4xl font-bold text-purple-600">
              AI
            </h2>
            <p className="text-gray-600 mt-2">
              Prediction Engine
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-xl text-center">
            <h2 className="text-4xl font-bold text-orange-600">
              3
            </h2>
            <p className="text-gray-600 mt-2">
              Recommendation Levels
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <div className="text-4xl mb-4">🔍</div>

            <h3 className="text-xl font-bold text-black mb-2">
              Discover Colleges
            </h3>

            <p className="text-gray-600">
              Search and explore top engineering colleges with fees,
              ratings, placements and detailed information.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <div className="text-4xl mb-4">🤖</div>

            <h3 className="text-xl font-bold text-black mb-2">
              AI Recommendations
            </h3>

            <p className="text-gray-600">
              Get personalized Dream, Target and Safe college
              recommendations using rank and career preferences.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <div className="text-4xl mb-4">⚖️</div>

            <h3 className="text-xl font-bold text-black mb-2">
              Compare Colleges
            </h3>

            <p className="text-gray-600">
              Compare colleges side-by-side on fees, ratings,
              placements and other important metrics.
            </p>
          </div>
        </div>

        {/* College Explorer */}
        <div className="bg-white rounded-3xl p-8 shadow-2xl">
          <h2 className="text-3xl font-bold text-black mb-6">
            Explore Colleges
          </h2>

          <SearchBar colleges={colleges} />
        </div>
      </div>
    </main>
  );
}
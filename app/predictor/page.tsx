"use client";

import { useState } from "react";

export default function PredictorPage() {
  const [rank, setRank] = useState("");
  const [branch, setBranch] = useState("Computer Science");
  const [goal, setGoal] = useState("Highest Package");
  const [results, setResults] = useState<any[]>([]);

  const predict = async () => {
    const res = await fetch(
      `/api/predictor?rank=${rank}&branch=${branch}&goal=${goal}`
    );

    const data = await res.json();

    setResults(data);
  };

  const dream = results.filter(
    (r) => r.category === "Dream"
  );

  const target = results.filter(
    (r) => r.category === "Target"
  );

  const safe = results.filter(
    (r) => r.category === "Safe"
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold text-white mb-3">
          AI College & Branch Predictor
        </h1>

        <p className="text-slate-300 mb-8">
          Get personalized college recommendations based on rank, branch preference and career goals.
        </p>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <input
            type="number"
            placeholder="Enter JEE Rank"
            value={rank}
            onChange={(e) => setRank(e.target.value)}
            className="bg-white text-black p-4 rounded-xl shadow"
          />

          <select
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            className="bg-white text-black p-4 rounded-xl shadow"
          >
            <option>Computer Science</option>
            <option>AI & ML</option>
            <option>AI & Data Science</option>
            <option>ECE</option>
            <option>Mechanical</option>
            <option>Civil</option>
          </select>

          <select
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className="bg-white text-black p-4 rounded-xl shadow"
          >
            <option>Highest Package</option>
            <option>Research</option>
            <option>Coding Culture</option>
          </select>
        </div>

        <button
          onClick={predict}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold"
        >
          Predict Colleges
        </button>

        {results.length === 0 && (
          <div className="mt-8 text-slate-300">
            Enter your rank and click Predict.
          </div>
        )}

        <div className="mt-10 space-y-10">
          <div>
            <h2 className="text-2xl font-bold text-red-400 mb-4">
              🎯 Dream Colleges
            </h2>

            <div className="space-y-4">
              {dream.map((item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-lg p-5 border-l-4 border-red-500"
                >
                  <h3 className="text-xl font-bold text-black">
                    {item.college}
                  </h3>

                  <p className="text-gray-700">
                    Branch: {item.branch}
                  </p>

                  <p className="text-gray-700">
                    Match Score: {item.score}%
                  </p>

                  <p className="text-gray-500 mt-2">
                    {item.reason}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">
              📈 Target Colleges
            </h2>

            <div className="space-y-4">
              {target.map((item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-lg p-5 border-l-4 border-yellow-500"
                >
                  <h3 className="text-xl font-bold text-black">
                    {item.college}
                  </h3>

                  <p className="text-gray-700">
                    Branch: {item.branch}
                  </p>

                  <p className="text-gray-700">
                    Match Score: {item.score}%
                  </p>

                  <p className="text-gray-500 mt-2">
                    {item.reason}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-green-400 mb-4">
              ✅ Safe Colleges
            </h2>

            <div className="space-y-4">
              {safe.map((item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-lg p-5 border-l-4 border-green-500"
                >
                  <h3 className="text-xl font-bold text-black">
                    {item.college}
                  </h3>

                  <p className="text-gray-700">
                    Branch: {item.branch}
                  </p>

                  <p className="text-gray-700">
                    Match Score: {item.score}%
                  </p>

                  <p className="text-gray-500 mt-2">
                    {item.reason}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
"use client";

import { useEffect, useState } from "react";

export default function ComparePage() {
  const [colleges, setColleges] = useState<any[]>([]);
  const [college1, setCollege1] = useState("");
  const [college2, setCollege2] = useState("");

  useEffect(() => {
    fetch("/api/colleges")
      .then((res) => res.json())
      .then(setColleges);
  }, []);

  const c1 = colleges.find((c) => c.id === Number(college1));
  const c2 = colleges.find((c) => c.id === Number(college2));

  const feeWinner =
    c1 && c2 ? (c1.fees < c2.fees ? c1.id : c2.id) : null;

  const ratingWinner =
    c1 && c2 ? (c1.rating > c2.rating ? c1.id : c2.id) : null;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold text-white mb-3">
          Compare Colleges
        </h1>

        <p className="text-slate-300 mb-10 text-lg">
          Compare top colleges side-by-side and find the best fit.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <div>
            <label className="block text-white mb-2">
              Select College 1
            </label>

            <select
              value={college1}
              onChange={(e) => setCollege1(e.target.value)}
              className="w-full bg-white text-black p-4 rounded-xl shadow-lg"
            >
              <option value="">Choose College</option>

              {colleges.map((college) => (
                <option
                  key={college.id}
                  value={college.id}
                >
                  {college.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-white mb-2">
              Select College 2
            </label>

            <select
              value={college2}
              onChange={(e) => setCollege2(e.target.value)}
              className="w-full bg-white text-black p-4 rounded-xl shadow-lg"
            >
              <option value="">Choose College</option>

              {colleges.map((college) => (
                <option
                  key={college.id}
                  value={college.id}
                >
                  {college.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {c1 && c2 && (
          <div className="grid md:grid-cols-2 gap-8">
            {[c1, c2].map((college) => (
              <div
                key={college.id}
                className="bg-white rounded-3xl shadow-2xl p-8"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-bold text-black">
                    {college.name}
                  </h2>
                </div>

                <div className="space-y-4">
                  <div className="bg-slate-100 p-4 rounded-xl">
                    <p className="text-sm text-gray-500">
                      Location
                    </p>
                    <p className="text-lg font-semibold text-black">
                      📍 {college.location}
                    </p>
                  </div>

                  <div className="bg-slate-100 p-4 rounded-xl">
                    <p className="text-sm text-gray-500">
                      Fees
                    </p>

                    <p className="text-lg font-semibold text-black">
                      💰 ₹{college.fees.toLocaleString()}
                    </p>

                    {feeWinner === college.id && (
                      <span className="inline-block mt-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                        🏆 Lower Fees
                      </span>
                    )}
                  </div>

                  <div className="bg-slate-100 p-4 rounded-xl">
                    <p className="text-sm text-gray-500">
                      Rating
                    </p>

                    <p className="text-lg font-semibold text-black">
                      ⭐ {college.rating}
                    </p>

                    {ratingWinner === college.id && (
                      <span className="inline-block mt-2 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-semibold">
                        🏆 Best Rating
                      </span>
                    )}
                  </div>

                  <div className="bg-slate-100 p-4 rounded-xl">
                    <p className="text-sm text-gray-500">
                      Placements
                    </p>

                    <p className="text-lg font-semibold text-black">
                      💼 {college.placements}
                    </p>
                  </div>

                  <div className="bg-slate-100 p-4 rounded-xl">
                    <p className="text-sm text-gray-500">
                      About
                    </p>

                    <p className="text-black">
                      {college.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
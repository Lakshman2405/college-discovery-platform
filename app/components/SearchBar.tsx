"use client";

import Link from "next/link";
import { useState } from "react";

export default function SearchBar({
  colleges,
}: {
  colleges: any[];
}) {
  const [search, setSearch] = useState("");

  const filtered = colleges.filter(
    (college) =>
      college.name
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      college.location
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <>
      <div className="mb-8">
        <input
          type="text"
          placeholder="🔍 Search colleges by name or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-4 rounded-2xl border border-slate-200 text-black text-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-6 flex justify-between items-center">
        <h3 className="text-xl font-bold text-black">
          Available Colleges
        </h3>

        <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-semibold">
          {filtered.length} Results
        </span>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((college) => (
          <Link
            href={`/college/${college.id}`}
            key={college.id}
            className="group bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-5">
              <h2 className="text-2xl font-bold text-white">
                {college.name}
              </h2>

              <p className="text-blue-100 mt-1">
                📍 {college.location}
              </p>
            </div>

            {/* Body */}
            <div className="p-6">
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-gray-500">
                    Fees
                  </p>

                  <p className="font-bold text-black">
                    ₹{college.fees.toLocaleString()}
                  </p>
                </div>

                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-gray-500">
                    Rating
                  </p>

                  <p className="font-bold text-black">
                    ⭐ {college.rating}
                  </p>
                </div>
              </div>

              <div className="bg-green-50 rounded-xl p-3 mb-4">
                <p className="text-xs text-green-700">
                  Placement Package
                </p>

                <p className="font-bold text-green-800">
                  💼 {college.placements}
                </p>
              </div>

              <p className="text-gray-600 text-sm line-clamp-3 mb-5">
                {college.description}
              </p>

              <div className="flex justify-between items-center">
                <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-semibold">
                  Rank Range
                </span>

                <span className="text-sm text-gray-600">
                  {college.minRank} - {college.maxRank}
                </span>
              </div>

              <div className="mt-5 text-blue-600 font-semibold group-hover:text-indigo-600">
                View Details →
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <div className="text-5xl mb-4">🔍</div>

          <h3 className="text-2xl font-bold text-gray-700 mb-2">
            No colleges found
          </h3>

          <p className="text-gray-500">
            Try searching with another keyword.
          </p>
        </div>
      )}
    </>
  );
}
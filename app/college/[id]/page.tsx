import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function CollegePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const college = await prisma.college.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      branches: true,
    },
  });

  if (!college) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">

        <Link
          href="/"
          className="inline-block mb-6 text-blue-300 hover:text-blue-200"
        >
          ← Back to Colleges
        </Link>

        {/* Header */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8">
            <h1 className="text-5xl font-bold text-white">
              {college.name}
            </h1>

            <p className="text-blue-100 text-xl mt-3">
              📍 {college.location}
            </p>
          </div>

          <div className="p-8">
            <p className="text-gray-700 text-lg leading-relaxed">
              {college.description}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-xl text-center">
            <div className="text-4xl mb-2">💰</div>

            <h2 className="text-2xl font-bold text-black">
              ₹{college.fees.toLocaleString()}
            </h2>

            <p className="text-gray-500">
              Annual Fees
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-xl text-center">
            <div className="text-4xl mb-2">⭐</div>

            <h2 className="text-2xl font-bold text-black">
              {college.rating}
            </h2>

            <p className="text-gray-500">
              Rating
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-xl text-center">
            <div className="text-4xl mb-2">💼</div>

            <h2 className="text-2xl font-bold text-black">
              {college.placements}
            </h2>

            <p className="text-gray-500">
              Placement Package
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-xl text-center">
            <div className="text-4xl mb-2">🏆</div>

            <h2 className="text-2xl font-bold text-black">
              {college.minRank} - {college.maxRank}
            </h2>

            <p className="text-gray-500">
              Rank Range
            </p>
          </div>
        </div>

        {/* Branches */}
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-black mb-6">
            Available Branches
          </h2>

          {college.branches.length === 0 ? (
            <p className="text-gray-500">
              No branch information available.
            </p>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {college.branches.map((branch) => (
                <div
                  key={branch.id}
                  className="border rounded-2xl p-5 bg-slate-50"
                >
                  <h3 className="text-xl font-bold text-black mb-3">
                    {branch.name}
                  </h3>

                  <div className="space-y-2 text-gray-700">
                    <p>
                      🎯 Cutoff Rank:
                      {" "}
                      {branch.openingRank} - {branch.closingRank}
                    </p>

                    <p>
                      💰 Avg Package:
                      {" "}
                      {branch.avgPackage} LPA
                    </p>

                    <p>
                      👨‍💻 Coding Score:
                      {" "}
                      {branch.codingScore}/10
                    </p>

                    <p>
                      🔬 Research Score:
                      {" "}
                      {branch.researchScore}/10
                    </p>

                    <p>
                      🌍 Alumni Score:
                      {" "}
                      {branch.alumniScore}/10
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </main>
  );
}
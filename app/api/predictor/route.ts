import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const rank = Number(
    req.nextUrl.searchParams.get("rank")
  );

  const branchPreference =
    req.nextUrl.searchParams.get("branch") || "";

  const goal =
    req.nextUrl.searchParams.get("goal") || "";

  const branches = await prisma.branch.findMany({
    include: {
      college: true,
    },
  });

  const recommendations = branches
    .map((b) => {
      let score = 0;

      // Rank suitability
      if (
        rank >= b.openingRank &&
        rank <= b.closingRank
      ) {
        score += 40;

        const range =
          b.closingRank - b.openingRank;

        const position =
          (rank - b.openingRank) /
          Math.max(range, 1);

        if (position < 0.3) {
          score += 20;
        } else if (position < 0.7) {
          score += 10;
        }
      }

      // Branch preference
      if (
        b.name
          .toLowerCase()
          .includes(
            branchPreference.toLowerCase()
          )
      ) {
        score += 20;
      }

      // Goal-based scoring
      if (goal === "Highest Package") {
        score += Math.min(
          b.avgPackage,
          30
        );
      }

      if (goal === "Research") {
        score +=
          b.researchScore * 2;
      }

      if (goal === "Coding Culture") {
        score +=
          b.codingScore * 2;
      }

      // College rating bonus
      score += b.college.rating * 2;

      // Alumni bonus
      score += b.alumniScore;

      score = Math.round(score);

      let category = "Safe";

      if (score >= 90) {
        category = "Dream";
      } else if (score >= 75) {
        category = "Target";
      }

      return {
        college: b.college.name,
        collegeRating:
          b.college.rating,
        branch: b.name,
        package: b.avgPackage,
        score,
        category,
        reason:
          `${b.name} at ${b.college.name} matches your profile with strong alignment to ${goal}.`,
      };
    })
    .filter((r) => r.score >= 50)
    .sort((a, b) => b.score - a.score)
    .slice(0, 12);

  return NextResponse.json(
    recommendations
  );
}
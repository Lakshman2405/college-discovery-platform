import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.branch.deleteMany();
  await prisma.college.deleteMany();

  await prisma.college.createMany({
    data: [
      {
        name: "IIT Madras",
        location: "Chennai",
        fees: 250000,
        rating: 4.9,
        placements: "22 LPA",
        description: "Top engineering institute in India.",
        minRank: 1,
        maxRank: 500,
      },
      {
        name: "IIT Bombay",
        location: "Mumbai",
        fees: 260000,
        rating: 4.8,
        placements: "24 LPA",
        description: "Premier IIT with excellent placements.",
        minRank: 1,
        maxRank: 700,
      },
      {
        name: "IIT Delhi",
        location: "Delhi",
        fees: 250000,
        rating: 4.8,
        placements: "23 LPA",
        description: "Leading engineering institution.",
        minRank: 1,
        maxRank: 800,
      },
      {
        name: "NIT Trichy",
        location: "Trichy",
        fees: 180000,
        rating: 4.6,
        placements: "18 LPA",
        description: "Best NIT in India.",
        minRank: 2000,
        maxRank: 12000,
      },
      {
        name: "NIT Warangal",
        location: "Warangal",
        fees: 175000,
        rating: 4.5,
        placements: "17 LPA",
        description: "Top-ranked NIT.",
        minRank: 3000,
        maxRank: 15000,
      },
      {
        name: "IIIT Hyderabad",
        location: "Hyderabad",
        fees: 320000,
        rating: 4.8,
        placements: "28 LPA",
        description: "Excellent CSE programs.",
        minRank: 500,
        maxRank: 5000,
      },
      {
        name: "BITS Pilani",
        location: "Pilani",
        fees: 450000,
        rating: 4.7,
        placements: "20 LPA",
        description: "Top private engineering college.",
        minRank: 1000,
        maxRank: 8000,
      },
      {
        name: "VIT Vellore",
        location: "Vellore",
        fees: 220000,
        rating: 4.3,
        placements: "12 LPA",
        description: "Popular private university.",
        minRank: 10000,
        maxRank: 50000,
      },
      {
        name: "SRM University",
        location: "Chennai",
        fees: 240000,
        rating: 4.1,
        placements: "10 LPA",
        description: "Well-known private university.",
        minRank: 15000,
        maxRank: 60000,
      },
      {
        name: "DTU",
        location: "Delhi",
        fees: 190000,
        rating: 4.5,
        placements: "15 LPA",
        description: "Strong engineering reputation.",
        minRank: 5000,
        maxRank: 20000,
      },
    ],
  });

  const colleges = await prisma.college.findMany();

  const iitMadras = colleges.find(c => c.name === "IIT Madras");
  const nitTrichy = colleges.find(c => c.name === "NIT Trichy");
  const iiitHyd = colleges.find(c => c.name === "IIIT Hyderabad");
  const dtu = colleges.find(c => c.name === "DTU");

  await prisma.branch.createMany({
    data: [
      {
        collegeId: iitMadras!.id,
        name: "Computer Science",
        openingRank: 1,
        closingRank: 150,
        avgPackage: 35,
        codingScore: 10,
        researchScore: 10,
        alumniScore: 10,
      },
      {
        collegeId: iitMadras!.id,
        name: "AI & Data Science",
        openingRank: 50,
        closingRank: 250,
        avgPackage: 32,
        codingScore: 10,
        researchScore: 9,
        alumniScore: 10,
      },
      {
        collegeId: iitMadras!.id,
        name: "ECE",
        openingRank: 200,
        closingRank: 800,
        avgPackage: 24,
        codingScore: 8,
        researchScore: 9,
        alumniScore: 10,
      },

      {
        collegeId: nitTrichy!.id,
        name: "Computer Science",
        openingRank: 2000,
        closingRank: 9000,
        avgPackage: 20,
        codingScore: 9,
        researchScore: 7,
        alumniScore: 8,
      },
      {
        collegeId: nitTrichy!.id,
        name: "ECE",
        openingRank: 4000,
        closingRank: 14000,
        avgPackage: 16,
        codingScore: 8,
        researchScore: 7,
        alumniScore: 8,
      },

      {
        collegeId: iiitHyd!.id,
        name: "Computer Science",
        openingRank: 300,
        closingRank: 2500,
        avgPackage: 30,
        codingScore: 10,
        researchScore: 9,
        alumniScore: 8,
      },
      {
        collegeId: iiitHyd!.id,
        name: "AI & ML",
        openingRank: 500,
        closingRank: 3500,
        avgPackage: 28,
        codingScore: 10,
        researchScore: 8,
        alumniScore: 8,
      },

      {
        collegeId: dtu!.id,
        name: "Computer Engineering",
        openingRank: 5000,
        closingRank: 15000,
        avgPackage: 16,
        codingScore: 8,
        researchScore: 6,
        alumniScore: 8,
      },
      {
        collegeId: dtu!.id,
        name: "Software Engineering",
        openingRank: 6000,
        closingRank: 18000,
        avgPackage: 15,
        codingScore: 8,
        researchScore: 6,
        alumniScore: 8,
      },
    ],
  });

  console.log("Database Seeded");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
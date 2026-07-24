# 🎓 College Discovery Platform

A full-stack web application to discover engineering colleges, compare them, and get AI-powered college recommendations based on JEE rank and career preferences.

**Live:** [https://college-discovery-platform-eight-gamma.vercel.app/](https://college-discovery-platform-eight-gamma.vercel.app/)

**Repository:** [https://github.com/Lakshman2405/college-discovery-platform](https://github.com/Lakshman2405/college-discovery-platform)

---

## Table of Contents

1. [Features & Implementation](#features--implementation)
2. [Tech Stack](#tech-stack)
3. [Database Schema](#database-schema)
4. [Project Structure](#project-structure)
5. [Core Implementation Details](#core-implementation-details)
6. [API Documentation](#api-documentation)
7. [Setup & Installation](#setup--installation)
8. [How It Works](#how-it-works)
9. [Current Data](#current-data)
10. [Future Enhancements](#future-enhancements)

---

## Features & Implementation

### 1. **Browse & Search Colleges** 🔍

**What it does:**
- Users can search colleges by name or location on the homepage
- Displays all colleges in a responsive grid (3 columns on desktop, 2 on tablet, 1 on mobile)
- Shows live result count as you type
- Clicking any college opens its detailed page

**Implementation (SearchBar.tsx):**
- **Client-side component** with `"use client"` directive (React 19 client state)
- Uses React `useState` hook to manage search input
- Filters colleges using `string.includes()` with case-insensitive matching on both `college.name` and `college.location`
- Displays each college as a card with:
  - College name and location (in gradient header: blue-600 to indigo-600)
  - Annual fees formatted with Indian rupee (₹) and `.toLocaleString()` for thousands separator
  - Star rating (⭐)
  - Placement package (💼)
  - First 3 lines of description (line-clamped)
  - JEE rank range (e.g., "1 - 500")
  - Link to `/college/{id}` page
- **Empty state**: Shows "No colleges found" with search icon if no results match

**Code Flow:**
```tsx
const filtered = colleges.filter(
  (college) =>
    college.name.toLowerCase().includes(search.toLowerCase()) ||
    college.location.toLowerCase().includes(search.toLowerCase())
);

// Then maps filtered colleges to clickable cards
filtered.map((college) => (
  <Link href={`/college/${college.id}`}>
    // Card renders fees, rating, placements, description
  </Link>
))
```

---

### 2. **College Detail Page** 🏫

**What it does:**
- Displays comprehensive information about a single college
- Shows all available branches at that college with specific metrics
- Dynamic routing using `[id]` parameter

**Implementation (college/[id]/page.tsx):**
- **Server-side component** using Next.js 16 async/await
- Uses Prisma ORM to fetch college data:
  ```typescript
  const college = await prisma.college.findUnique({
    where: { id: Number(id) },
    include: { branches: true }  // Includes related branches
  });
  ```
- Shows 404 page if college not found using `notFound()` from Next.js navigation
- **College header** displays:
  - Name in large heading (5xl)
  - Location with pin emoji (📍)
  - Full description paragraph
- **Stats section** in 4-column grid showing:
  - 💰 Annual fees (formatted with `.toLocaleString()`)
  - ⭐ Rating (float value)
  - 💼 Placements (string like "22 LPA")
  - 🏆 Rank range (min-max)
- **Branches section** displays all branches in a 2-column grid with:
  - Branch name (e.g., "Computer Science", "AI & Data Science")
  - 🎯 Cutoff rank (opening and closing)
  - 💰 Average package in LPA (rupees)
  - 👨‍💻 Coding score (0-10)
  - 🔬 Research score (0-10)
  - 🌍 Alumni score (0-10)

**Conditional Rendering:**
```tsx
{college.branches.length === 0 ? (
  <p>No branch information available.</p>
) : (
  // Grid of branches with all metrics
)}
```

---

### 3. **Compare Colleges** ⚖️

**What it does:**
- Allows side-by-side comparison of exactly 2 colleges
- Highlights which college has lower fees and higher rating
- Client-side filtering with dropdowns

**Implementation (compare/page.tsx):**
- **Client-side component** using React hooks (`useState`, `useEffect`)
- Fetches all colleges from `/api/colleges` endpoint on component mount
- Two dropdown selects (`<select>`) for college selection:
  ```tsx
  <select value={college1} onChange={(e) => setCollege1(e.target.value)}>
    {colleges.map((college) => (
      <option value={college.id}>{college.name}</option>
    ))}
  </select>
  ```
- **Comparison logic**:
  ```typescript
  const feeWinner = c1 && c2 ? (c1.fees < c2.fees ? c1.id : c2.id) : null;
  const ratingWinner = c1 && c2 ? (c1.rating > c2.rating ? c1.id : c2.id) : null;
  ```
- Only displays comparison cards when **both** colleges are selected
- **Comparison card** for each college shows:
  - 📍 Location
  - 💰 Fees with "🏆 Lower Fees" badge if it wins
  - ⭐ Rating with "🏆 Best Rating" badge if it wins
  - 💼 Placement package
  - Full college description
- Each metric is in a separate `.bg-slate-100` rounded box for clarity
- Side-by-side layout: `grid-cols-2` on desktop (adapts to `grid-cols-1` on mobile)

---

### 4. **AI College & Branch Predictor** 🤖

**What it does:**
- Takes student input: **JEE rank**, **branch preference**, **career goal**
- Returns categorized recommendations: Dream (red), Target (yellow), Safe (green)
- Shows match score and personalized reasoning for each recommendation

**Frontend Implementation (predictor/page.tsx):**
- **Client-side component** with form inputs:
  - **Rank input**: `<input type="number">` for JEE rank
  - **Branch select**: Dropdown with options:
    - Computer Science (default)
    - AI & ML
    - AI & Data Science
    - ECE
    - Mechanical
    - Civil
  - **Goal select**: Dropdown with options:
    - Highest Package (default)
    - Research
    - Coding Culture
- **Predict button** calls backend API:
  ```typescript
  const res = await fetch(
    `/api/predictor?rank=${rank}&branch=${branch}&goal=${goal}`
  );
  const data = await res.json();
  setResults(data);
  ```
- **Results filtering** separates recommendations by category:
  ```typescript
  const dream = results.filter((r) => r.category === "Dream");
  const target = results.filter((r) => r.category === "Target");
  const safe = results.filter((r) => r.category === "Safe");
  ```
- **Three result sections** (if results exist):
  - **🎯 Dream Colleges** (red border, score < 50)
  - **📈 Target Colleges** (yellow border, score 50-75)
  - **✅ Safe Colleges** (green border, score ≥ 75+)
- **Result card** for each recommendation displays:
  - College name (h3, bold)
  - Branch name
  - Match score (0-100)
  - Generated reason text (e.g., "Computer Science at IIT Madras matches your profile...")

---

## Backend: AI Recommendation Algorithm

**Endpoint:** `GET /api/predictor?rank=5000&branch=Computer%20Science&goal=Highest%20Package`

**Implementation (api/predictor/route.ts):**

1. **Fetch all branches** from database with college info:
   ```typescript
   const branches = await prisma.branch.findMany({
     include: { college: true }
   });
   ```

2. **Calculate score** for each branch (mapped over all branches):

   ```typescript
   let score = 0;
   
   // 1. RANK SUITABILITY (40 points base)
   if (rank >= b.openingRank && rank <= b.closingRank) {
     score += 40;
     
     // Bonus: If in top 30% of range (+20), else if in top 70% (+10)
     const range = b.closingRank - b.openingRank;
     const position = (rank - b.openingRank) / Math.max(range, 1);
     
     if (position < 0.3) score += 20;  // Near opening rank (good fit)
     else if (position < 0.7) score += 10;  // Mid-range fit
   }
   
   // 2. BRANCH PREFERENCE MATCH (20 points)
   if (b.name.toLowerCase().includes(branchPreference.toLowerCase())) {
     score += 20;
   }
   
   // 3. GOAL-BASED BONUS
   if (goal === "Highest Package") {
     score += Math.min(b.avgPackage, 30);  // Cap at 30, so max 10+30=40
   }
   if (goal === "Research") {
     score += b.researchScore * 2;  // 0-20 points (0-10 score × 2)
   }
   if (goal === "Coding Culture") {
     score += b.codingScore * 2;  // 0-20 points (0-10 score × 2)
   }
   
   // 4. COLLEGE RATING BONUS (weighted)
   score += b.college.rating * 2;  // 0-10 points (1-5 rating × 2)
   
   // 5. ALUMNI NETWORK BONUS
   score += b.alumniScore;  // 0-10 points
   ```

3. **Score categorization**:
   ```typescript
   let category = "Safe";  // Default
   if (score >= 90) category = "Dream";
   else if (score >= 75) category = "Target";
   ```

4. **Filter & return**:
   ```typescript
   recommendations
     .filter((r) => r.score >= 50)  // Only scores 50+ shown
     .sort((a, b) => b.score - a.score)  // Highest scores first
     .slice(0, 12);  // Max 12 results
   ```

5. **Response object** for each recommendation:
   ```typescript
   {
     college: string,           // e.g., "IIT Madras"
     collegeRating: number,     // e.g., 4.9
     branch: string,            // e.g., "Computer Science"
     package: number,           // e.g., 35 (LPA)
     score: number,             // 0-100+
     category: string,          // "Dream" | "Target" | "Safe"
     reason: string             // Auto-generated message
   }
   ```

**Scoring Example:**
```
Student: Rank 2500, Branch: CS, Goal: Highest Package

NIT Trichy - Computer Science:
├─ Rank check (2500 between 2000-9000): +40
├─ Position in range (2500-2000)/(9000-2000) = 0.071 (< 0.3): +20
├─ Branch match (CS contains CS): +20
├─ Package bonus (min(20, 30)): +20
├─ College rating (4.6 × 2): +9.2
├─ Alumni score: +8
└─ TOTAL: 117.2 → 117 → Category "Dream" (≥90)
```

---

## Tech Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Frontend** | Next.js | 16.2.7 | React framework with SSR, API routes |
| | React | 19.2.4 | UI component library |
| | TypeScript | 5.x | Type-safe JavaScript |
| | Tailwind CSS | 4.x | Utility-first CSS styling |
| | React Icons | 5.6.0 | Icon library (not used currently) |
| **Backend** | Next.js API Routes | 16.2.7 | Serverless endpoints in `/api` |
| | Prisma ORM | 6.9.0 | Type-safe database queries |
| | NextAuth.js | 4.24.14 | Auth library (not yet implemented) |
| | bcryptjs | 3.0.3 | Password hashing (not yet used) |
| **Database** | PostgreSQL | - | Neon serverless instance |
| | Prisma Client | 6.9.0 | TypeScript database client |
| **Deployment** | Vercel | - | Next.js hosting |
| | Neon | - | Serverless PostgreSQL |

---

## Database Schema

### College Model
```prisma
model College {
  id          Int      @id @default(autoincrement())
  name        String
  location    String
  fees        Int
  rating      Float
  placements  String
  description String
  minRank     Int
  maxRank     Int
  
  branches    Branch[]  @relation
}
```

**Fields Explained:**
- `id`: Auto-incrementing primary key
- `name`: College full name (e.g., "IIT Madras")
- `location`: City/state (e.g., "Chennai")
- `fees`: Annual fees in rupees (e.g., 250000 = ₹2,50,000)
- `rating`: Overall rating on 1-5 scale (e.g., 4.9)
- `placements`: Average package as string (e.g., "22 LPA")
- `minRank`: Minimum JEE rank for admission
- `maxRank`: Maximum JEE rank cutoff
- `branches`: One-to-many relationship with Branch table

### Branch Model
```prisma
model Branch {
  id              Int     @id @default(autoincrement())
  collegeId       Int
  name            String
  openingRank     Int
  closingRank     Int
  avgPackage      Float
  codingScore     Int
  researchScore   Int
  alumniScore     Int
  
  college         College @relation(fields: [collegeId], references: [id])
  @@index([collegeId])
}
```

**Fields Explained:**
- `id`: Auto-incrementing primary key
- `collegeId`: Foreign key to College table
- `name`: Branch name (e.g., "Computer Science", "AI & Data Science")
- `openingRank`: Best (lowest) JEE rank to get this branch
- `closingRank`: Worst (highest) JEE rank to get this branch
- `avgPackage`: Average placement package in LPA (rupees)
- `codingScore`: Quality of coding culture (0-10 scale)
- `researchScore`: Research opportunities score (0-10 scale)
- `alumniScore`: Alumni network strength (0-10 scale)
- `@@index([collegeId])`: Database index for fast lookups by college

---

## Project Structure

```
college-discovery-platform/
│
├── app/
│   ├── page.tsx                        # Homepage (search colleges)
│   ├── layout.tsx                      # Root layout with metadata
│   ├── globals.css                     # Global styles & Tailwind import
│   │
│   ├── api/
│   │   ├── colleges/
│   │   │   └── route.ts               # GET /api/colleges (all colleges JSON)
│   │   │
│   │   └── predictor/
│   │       └── route.ts               # GET /api/predictor (recommendations)
│   │
│   ├── components/
│   │   └── SearchBar.tsx              # Search & college cards component
│   │
│   ├── college/
│   │   └── [id]/
│   │       └── page.tsx               # Single college detail page
│   │
│   ├── compare/
│   │   └── page.tsx                   # Compare 2 colleges page
│   │
│   └── predictor/
│       └── page.tsx                   # AI predictor form & results page
│
├── lib/
│   └── prisma.ts                      # Prisma client singleton
│
├── prisma/
│   ├── schema.prisma                  # Database schema definition
│   └── seed.ts                        # Database seeding script
│
├── public/
│   └── Screenshots/                   # Demo screenshots
│
├── package.json                        # Dependencies & scripts
├── tsconfig.json                       # TypeScript configuration
├── tailwind.config.ts                  # Tailwind CSS config
├── next.config.ts                      # Next.js config
├── postcss.config.mjs                  # PostCSS config for Tailwind
│
└── README.md                           # This file
```

---

## Core Implementation Details

### How Pages Are Rendered

#### 1. **Homepage** (app/page.tsx) - Server Component
```typescript
import { prisma } from "@/lib/prisma";

async function getColleges() {
  return await prisma.college.findMany();
}

export default async function Home() {
  const colleges = await getColleges();
  
  return (
    <main>
      {/* Hero section with title & buttons to /predictor and /compare */}
      {/* Stats grid showing college count, 50+ branches, AI indicator, 3 levels */}
      {/* SearchBar component with colleges prop */}
    </main>
  );
}
```

- **Server-side**: Fetches all colleges at build/request time using Prisma
- Passes colleges to SearchBar child component
- Displays 4 stats cards (dynamic college count, fixed "50+" branches, "AI" indicator, "3" levels)
- Provides links to /predictor and /compare pages

#### 2. **SearchBar** (app/components/SearchBar.tsx) - Client Component
- Marked with `"use client"` for client-side interactivity
- Manages search state with `useState`
- Real-time filtering without API call (all data already loaded)
- Responsive grid: 3 cols on desktop → 2 cols on tablet → 1 col on mobile

#### 3. **College Detail** (app/college/[id]/page.tsx) - Server Component
- Uses dynamic route parameter `[id]`
- Fetches single college with branches:
  ```typescript
  const college = await prisma.college.findUnique({
    where: { id: Number(id) },
    include: { branches: true }
  });
  ```
- Returns 404 if not found using Next.js `notFound()`
- Renders college info + all branches with their metrics

#### 4. **Compare Page** (app/compare/page.tsx) - Client Component
- Marked with `"use client"` for interactivity
- Uses `useEffect` to fetch colleges on mount
- Manages two college selections with `useState`
- Conditionally renders comparison only when both selected
- Calculates and highlights winners (lower fees, higher rating)

#### 5. **Predictor Page** (app/predictor/page.tsx) - Client Component
- Form inputs: rank (number), branch (select), goal (select)
- Fetches recommendations from `/api/predictor` endpoint
- Filters results by category (Dream/Target/Safe)
- Renders 3 sections only if results exist
- Each result shows score, branch, reasoning

### Prisma Client Singleton

**lib/prisma.ts:**
```typescript
import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient();

if (process.env.NODE_ENV !== "production")
  globalForPrisma.prisma = prisma;
```

- Creates single Prisma instance across application
- Prevents multiple instances in development (hot reload issue)
- Reuses instance in production
- Used in all server components and API routes via `import { prisma } from "@/lib/prisma"`

---

## API Documentation

### 1. `GET /api/colleges`

**Purpose:** Returns all colleges in database

**Request:**
```http
GET /api/colleges
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "IIT Madras",
    "location": "Chennai",
    "fees": 250000,
    "rating": 4.9,
    "placements": "22 LPA",
    "description": "Top engineering institute in India.",
    "minRank": 1,
    "maxRank": 500
  },
  ...
]
```

**Code:**
```typescript
export async function GET() {
  const colleges = await prisma.college.findMany();
  return NextResponse.json(colleges);
}
```

---

### 2. `GET /api/predictor`

**Purpose:** Returns AI-ranked college recommendations

**Request Parameters:**
- `rank` (required): Student's JEE rank (number)
- `branch` (optional): Preferred branch (string)
- `goal` (optional): Career goal (string)

**Example:**
```http
GET /api/predictor?rank=5000&branch=Computer%20Science&goal=Highest%20Package
```

**Response:**
```json
[
  {
    "college": "NIT Trichy",
    "collegeRating": 4.6,
    "branch": "Computer Science",
    "package": 20,
    "score": 95,
    "category": "Target",
    "reason": "Computer Science at NIT Trichy matches your profile with strong alignment to Highest Package."
  },
  {
    "college": "IIIT Hyderabad",
    "collegeRating": 4.8,
    "branch": "Computer Science",
    "package": 30,
    "score": 102,
    "category": "Dream",
    "reason": "Computer Science at IIIT Hyderabad matches your profile with strong alignment to Highest Package."
  },
  ...
]
```

**Filtering Rules:**
- Only returns recommendations with score ≥ 50
- Returns max 12 results
- Sorted by score (highest first)
- Categories: Dream (score ≥ 90), Target (75-90), Safe (50-75)

---

## Setup & Installation

### Prerequisites
- **Node.js** 18+ (verify: `node --version`)
- **npm** or **yarn**
- **PostgreSQL** database (free Neon account: https://neon.tech)
- **Git**

### Step-by-Step Setup

#### 1. Clone Repository
```bash
git clone https://github.com/Lakshman2405/college-discovery-platform.git
cd college-discovery-platform
```

#### 2. Install Dependencies
```bash
npm install
```

Installs:
- Next.js 16, React 19, TypeScript
- Prisma & @prisma/client
- Tailwind CSS & PostCSS
- NextAuth, bcryptjs (for future use)

#### 3. Create Environment File

Create `.env.local` in project root:

```env
# PostgreSQL connection string from Neon
DATABASE_URL="postgresql://user:password@region.neon.tech:5432/college_db?sslmode=require"
```

**How to get DATABASE_URL:**
1. Go to https://neon.tech
2. Sign up or login
3. Create a new project
4. Copy connection string from dashboard
5. Paste into `.env.local`

#### 4. Generate Prisma Client
```bash
npx prisma generate
```

Creates TypeScript types for database schema.

#### 5. Setup Database

```bash
# Create tables based on schema.prisma
npx prisma migrate dev --name init
```

If this is first time, it will:
- Create database
- Run migrations
- Generate Prisma client

#### 6. Seed Sample Data

```bash
npm run seed
# or
npx tsx prisma/seed.ts
```

Inserts 10 sample colleges with 16 branches total from `prisma/seed.ts`.

#### 7. Start Development Server

```bash
npm run dev
```

Opens at **http://localhost:3000**

### Other Useful Commands

```bash
# View database GUI tool (Prisma Studio)
npx prisma studio
# Opens http://localhost:5555

# Build for production
npm run build

# Run linter
npm run lint

# Reset database (⚠️ deletes all data)
npx prisma migrate reset
```

---

## How It Works

### User Flow: Discovering a College

1. **User visits homepage** (`/`)
2. Sees search bar with all colleges loaded
3. Types college name or location
4. Results filter in real-time (client-side)
5. Clicks college card
6. Navigates to `/college/[id]`
7. **Server fetches** that college + all branches
8. Page displays college info and branch details

### User Flow: AI Recommendation

1. **User visits predictor** (`/predictor`)
2. Enters:
   - JEE Rank: 5000
   - Branch: "Computer Science"
   - Goal: "Highest Package"
3. Clicks "Predict Colleges"
4. **Frontend sends** GET request to `/api/predictor?rank=5000&branch=Computer%20Science&goal=Highest%20Package`
5. **Backend fetches** all branches from database
6. **Scores each branch** using recommendation algorithm:
   - Rank suitability (40 pts base + bonuses)
   - Branch match (20 pts)
   - Goal bonus (package/research/coding)
   - College rating (0-10 pts)
   - Alumni score (0-10 pts)
7. **Categorizes** by score:
   - Dream: score ≥ 90
   - Target: score 75-90
   - Safe: score 50-75
8. **Filters** to score ≥ 50, sorts high-to-low, limits to 12 results
9. **Returns JSON** to frontend
10. **Frontend separates** by category and displays results

### User Flow: Comparing Colleges

1. **User visits compare** (`/compare`)
2. **Component loads** all colleges via `/api/colleges` (useEffect)
3. Selects College 1 from dropdown
4. Selects College 2 from dropdown
5. **Component calculates**:
   - Which has lower fees
   - Which has higher rating
6. **Displays side-by-side** with badges for winner
7. Can select different colleges and compare again

---

## Current Data

### Sample Colleges (10 Total)
Seeded from `prisma/seed.ts`:
1. **IIT Madras** - 3 branches (CS, AI&DS, ECE)
2. **IIT Bombay** - (branches in seed.ts)
3. **IIT Delhi** - (branches in seed.ts)
4. **NIT Trichy** - 2 branches (CS, ECE)
5. **NIT Warangal** - (branches in seed.ts)
6. **IIIT Hyderabad** - 2 branches (CS, AI&ML)
7. **BITS Pilani** - (branches in seed.ts)
8. **VIT Vellore** - (branches in seed.ts)
9. **SRM University** - (branches in seed.ts)
10. **DTU** - 2 branches (Computer Eng, Software Eng)

### Sample Branch Data (16 Total)
Each branch includes:
- Opening & closing JEE rank
- Average placement package (LPA)
- Coding, Research, Alumni scores (0-10 scale)

**Example: IIT Madras - Computer Science**
```
├─ Opening Rank: 1
├─ Closing Rank: 150
├─ Avg Package: 35 LPA
├─ Coding Score: 10/10
├─ Research Score: 10/10
└─ Alumni Score: 10/10
```

---

## Current Features

✅ **College browsing** with real-time search
✅ **Detail pages** with branch analytics
✅ **Side-by-side comparison** of 2 colleges
✅ **AI recommendation engine** with 3-tier categorization
✅ **Multiple branches** (CS, AI&ML, ECE, Mechanical, Civil)
✅ **Multiple goals** (Highest Package, Research, Coding Culture)
✅ **Responsive design** (Tailwind CSS)
✅ **Server & client components** (Next.js 16)
✅ **Type-safe queries** (TypeScript + Prisma)
✅ **Database seeding** (Prisma seed.ts)

---

## What's Not Included (Future Work)

❌ User authentication (NextAuth setup exists but not used)
❌ Save favorites to user account
❌ Student reviews/ratings
❌ Real JEE cutoff data (using sample data only)
❌ Advanced filtering (cutoff year, state quota, etc.)
❌ Mobile app
❌ Email notifications
❌ Real-time data updates
❌ Admin dashboard for data management

---

## Deployment

### Current Production Setup
- **Frontend**: Hosted on **Vercel** (automatic on push to `main`)
- **Database**: **Neon PostgreSQL** (serverless, auto-scaling)
- **Domain**: college-discovery-platform-eight-gamma.vercel.app

### Deploy Your Own

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to vercel.com
   - Click "New Project"
   - Select your GitHub repo
   - Click "Import"

3. **Set Environment Variables**
   - In Vercel dashboard → Settings → Environment Variables
   - Add `DATABASE_URL` (from Neon)

4. **Deploy**
   - Vercel automatically builds and deploys
   - View at dashboard URL

---

## Development Notes

### Code Style
- TypeScript for type safety
- ESLint configuration in `eslint.config.mjs`
- Tailwind CSS for styling
- Client components use `"use client"` directive
- Server components are async functions

### Performance Considerations
- SearchBar filtering is client-side (data already loaded)
- College detail page fetches only single college (efficient)
- Predictor fetches all branches once (9 total), scores in-memory
- Results limited to 12 (prevent huge responses)
- Prisma queries use `findMany()` and `findUnique()` (optimal)

### Database Index
- `@@index([collegeId])` on Branch model for fast lookups

---

## Author

**Sikhakolli Lakshman Guru Sai**

- GitHub: [@Lakshman2405](https://github.com/Lakshman2405)
- Email: lakshmangurusai24@gmail.com

---

## License

Educational use only. Not licensed for commercial purposes.

---

## Changelog

**v0.1.0** (Current)
- Initial release
- 10 colleges with 16 branches
- Basic search, detail, compare, predict features
- Deployed to Vercel

---

**Last Updated:** July 24, 2026

For updates and contributions, visit the [GitHub repository](https://github.com/Lakshman2405/college-discovery-platform).

# 🎓 College Discovery Platform

A full-stack web application to discover engineering colleges, compare them, and get AI-powered college recommendations based on JEE rank and preferences.

**Live:** [https://college-discovery-platform-eight-gamma.vercel.app/](https://college-discovery-platform-eight-gamma.vercel.app/)

---

## What It Does

### 1. **Browse Colleges** 🔍
- Search and explore engineering colleges by name or location
- View key metrics: fees, ratings, placement packages, rank ranges
- Click any college to see detailed info including all available branches

### 2. **Compare Colleges** ⚖️
- Select 2 colleges to compare side-by-side
- See: location, fees, rating, placements, rank range
- Highlights which college is cheaper and has higher rating

### 3. **AI Recommendations** 🤖
- Input your **JEE rank**, **preferred branch** (CS, ECE, AI&ML, etc.), and **career goal** (Highest Package, Research, Coding Culture)
- Get recommendations categorized as:
  - **🎯 Dream** - Lower admission probability but aspirational (score < 50)
  - **🟡 Target** - Good fit, likely to get in (score 50-75)
  - **🟢 Safe** - High admission probability, backup options (score ≥ 75+)
- Shows college name, branch, placement package, score, and match reasoning

---

## How The Recommendation Algorithm Works

The API at `/api/predictor` scores each college-branch combination:

```
Score = 
  + 40 pts if your rank falls within branch's rank range
  + 20 pts if in top 30% of the range
  + 20 pts if branch name matches your preference
  + Goal-based bonus (package value / research score / coding score)
  + College rating × 2
  + Alumni score
```

Then categorizes:
- **Dream**: score < 50
- **Target**: score 50-75
- **Safe**: score ≥ 75

---

## Tech Stack

**Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS

**Backend:** Next.js API Routes

**Database:** PostgreSQL (Neon serverless)

**ORM:** Prisma

**Deployment:** Vercel

---

## Database Schema

### Colleges Table
```
- id (auto-increment)
- name, location
- fees (annual)
- rating (1-5)
- placements (avg package string)
- description
- minRank, maxRank (JEE rank range)
```

### Branches Table
```
- id, collegeId
- name (CS, ECE, AI&ML, etc.)
- openingRank, closingRank (branch-specific rank cutoff)
- avgPackage (LPA)
- codingScore, researchScore, alumniScore (0-10 scale)
```

Current data: **10 colleges** with ~16 branches total

---

## Project Structure

```
app/
├── page.tsx                    # Homepage (search colleges)
├── college/[id]/page.tsx      # Single college detail page
├── compare/page.tsx            # Compare 2 colleges page
├── predictor/page.tsx          # AI recommendation form
├── api/
│   ├── colleges/route.ts       # GET all colleges
│   └── predictor/route.ts      # GET recommendations (query: rank, branch, goal)
└── components/
    └── SearchBar.tsx           # College search & display component

lib/
└── prisma.ts                   # Prisma client singleton

prisma/
├── schema.prisma               # Database models
└── seed.ts                     # Sample data (10 colleges)
```

---

## Setup

### Prerequisites
- Node.js 18+
- PostgreSQL database (use Neon: https://neon.tech)

### Install & Run

```bash
# 1. Clone and install
git clone https://github.com/Lakshman2405/college-discovery-platform.git
cd college-discovery-platform
npm install

# 2. Create .env.local
# Add: DATABASE_URL=your_neon_connection_string

# 3. Setup database
npx prisma generate
npx prisma migrate dev --name init

# 4. Seed sample data
npx prisma db seed

# 5. Start dev server
npm run dev
```

Open http://localhost:3000

---

## API Endpoints

### `GET /api/colleges`
Returns all colleges as JSON

### `GET /api/predictor?rank=5000&branch=Computer%20Science&goal=Highest%20Package`
Returns ranked recommendations with Dream/Target/Safe categories

---

## Current Features

✅ College search & filtering  
✅ College detail pages with branch analytics  
✅ Side-by-side college comparison  
✅ AI recommendation engine with 3-tier categorization  
✅ Multiple branch options (CS, AI&ML, ECE, Mechanical, Civil)  
✅ Multiple career goals (Highest Package, Research, Coding Culture)  
✅ Responsive design with Tailwind CSS  

---

## What's Not Included (Future Work)

- User authentication/accounts
- Save favorites or bookmarks
- Student reviews/ratings
- Real JEE cutoff data (seed data is sample only)
- Mobile app
- Advanced filters/sorting

---

## Development

```bash
# Run with hot reload
npm run dev

# Build for production
npm run build

# View database GUI
npx prisma studio

# Linting
npm run lint
```

---

## Deployment

Deployed to **Vercel** with **Neon PostgreSQL**:

1. Push to GitHub
2. Connect repo to Vercel
3. Add `DATABASE_URL` environment variable
4. Automatic deployment on push

---

## Author

**Sikhakolli Lakshman Guru Sai**

---

## License

Educational use only.

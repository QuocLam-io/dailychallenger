<div align="center">
  <br />
    <a href="https://youtu.be/EZajJGOMWas" target="_blank">
      <img src="assets/DChallengerBanner.png" alt="Project Banner">
    </a>
  <br />

  <div>
    <img src="https://img.shields.io/badge/-TypeScript-black?style=for-the-badge&logoColor=white&logo=typescript&color=3178C6" alt="**TypeScript**" />
    <img src="./src/assets/tag-vite.png" alt="Vite" height="28" />
    <img src="./src/assets/tag-clerk.png" alt="Clerk" height="28" />
    <img src="./src/assets/tag-motion.png" alt="Motion" height="28" />
    <img src="./src/assets/tag-supabase.png" alt="Supabase" height="28" />
    <img src="./src/assets/tag-zustand.png" alt="Zustand" height="28" />

  </div>

  <h3 align="center">Daily Challenger</h3>****

   <div align="center">
     Crush Goals, Build Habits, and Share the Journey
    </div>
</div>

## 📋 <a name="table">Table of Contents</a>

1. 🤖 [Introduction](#introduction)
2. ⚙️ [Tech Stack](#tech-stack)
3. 🔋 [Features](#features)
4. 🤸 [Quick Start](#quick-start)
5. 🕸️ [Snippets](#snippets)
6. 🚀 [More](#more)

## <a name="introduction">🤖 Introduction</a>

Built with Next.js, TypeScript, and Postgres, the University Library Management System is a production-grade platform featuring a public-facing app and an admin interface. It offers advanced functionalities like seamless book borrowing with reminders and receipts, robust user management, automated workflows, and a modern, optimized tech stack for real-world scalability.

If you're getting started and need assistance or face any bugs, join our active Discord community with over **50k+** members. It's a place where people help each other out.

<a href="https://discord.com/invite/n6EdbFJ" target="_blank"><img src="https://github.com/sujatagunale/EasyRead/assets/151519281/618f4872-1e10-42da-8213-1d69e486d02e" /></a>

## <a name="tech-stack">⚙️ Tech Stack</a>

- Javascript
- React
- Typescript
- Vite
- Clerk
- Motion
- Supabase
- Zustand

## <a name="features">🔋 Features</a>

### Features of the Daily Challenger Web App

👉 **Microservice Authentication**: 3rd-party authentication powered by Clerk, offering seamless sign-up, sign-in, user profile management, and support for existing email addresses.

👉 **Home Page**: Highlighted books and newly added books with 3D effects.

👉 **Library Page**: Advanced filtering, search, and pagination for book discovery.

👉 **Book Detail Pages**: Availability tracking, book summaries, videos, and suggestions for similar books.

👉 **Profile Page**: Manage accounts, track borrowed books, and download receipts.

👉 **Onboarding Workflows**: Automated welcome emails when users sign up, with follow-ups based on inactivity or activity dates.

👉 **Borrow Book Reminder**: Customized email notifications sent before, on, and after the due date, reminding users to return books or avoid charges.

👉 **Borrow Book Receipt**: Automatically generates a customized PDF receipt when a book is successfully borrowed.

👉 **Analytics Dashboard**: Statistics, new users, books, borrow requests, and more.

👉 **All Users Page**: View and manage users, including approving or revoking access.

👉 **Account Requests Page**: Admin approval for account requests, with email notifications for user verification.

👉 **All Books Page**: List and manage all library books with advanced search, pagination, and filters.

👉 **Book Management Forms**: Add new books and edit existing entries.

👉 **Book Details Page**: Detailed book information for administrators.

👉 **Borrow Records Page**: Complete borrow history with pagination and search.

👉 **Role Management**: Change user roles to invite more admins, with email notifications sent upon role updates.

👉 **Advanced Functionalities**: Caching, rate-limiting, DDoS protection, and custom notifications.

👉 **Database Management**: Postgres with Neon for scalable and collaborative database handling.

👉 **Real-time Media Processing**: ImageKit for image and video optimization and transformations.

👉 **Efficient Caching**: Upstash Redis for caching, workflows, and triggers.

👉 **Database ORM**: Drizzle ORM for simplified and efficient database interactions.

👉 **Modern UI/UX**: Built with TailwindCSS, ShadCN, and other cutting-edge tools.

👉 **Technology Stack**: Next.js with TypeScript for scalable development, and NextAuth for robust authentication.

👉 **Seamless Email Handling**: Resend for automated email communications, including notifications and updates.

and many more, including code architecture and reusability

## <a name="quick-start">🤸 Quick Start</a>

Follow these steps to set up the project locally on your machine.

**Prerequisites**

Make sure you have the following installed on your machine:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en)
- [npm](https://www.npmjs.com/) (Node Package Manager)

**Cloning the Repository**

```bash
git clone https://github.com/adrianhajdin/university-library-jsm.git
cd university-library-jsm
```

**Installation**

Install the project dependencies using npm:

```bash
npm install
```

**Set Up Environment Variables**

Create a new file named `.env` in the root of your project and add the following content:

```env
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=
IMAGEKIT_PRIVATE_KEY=
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=

NEXT_PUBLIC_API_ENDPOINT=
NEXT_PUBLIC_PROD_API_ENDPOINT=

DATABASE_URL=

UPSTASH_REDIS_URL=
UPSTASH_REDIS_TOKEN=

AUTH_SECRET=

# Required for workflow
QSTASH_URL=
QSTASH_TOKEN=

# RESEND_TOKEN=
RESEND_TOKEN=
```

Replace the placeholder values with your actual ImageKit, NeonDB, Upstash, and Resend credentials. You can obtain these credentials by signing up on the [ImageKit](https://bit.ly/49zmXkt), [NeonDB](https://fyi.neon.tech/1jsm), [Upstash](https://upstash.com/?utm_source=jsmastery1), and [Resend](https://resend.com/).

**Running the Project**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the project.

## <a name="snippets">🕸️ Snippets</a>

<details>
<summary><code>usePublicStore.ts</code></summary>

```typescript
import { create } from "zustand";

interface PublicStoreState {
  publicChallengerModalOpen: boolean;
  setPublicChallengerModalOpen: (isOpen: boolean) => void;
}

const usePublicStore = create<PublicStoreState>((set) => ({
  publicChallengerModalOpen: false,
  setPublicChallengerModalOpen: (isOpen) =>
    set({ publicChallengerModalOpen: isOpen }),
}));

export default usePublicStore;
```

</details>
<details>
<summary><code>Github Actions Cron Job</code></summary>

```yaml
# Github Actions Cron Job
name: Ping Supabase API

on:
  schedule:
    - cron: "0 0 */2 * *" # Runs every 2 days at midnight (UTC)
  workflow_dispatch: # Allows manual triggering

jobs:
  ping-api:
    runs-on: ubuntu-latest
    steps:
      - name: Send request to Supabase API
        run: |
          curl -X GET "https://acfwjcgwlkveknfqthsn.supabase.co/rest/v1/users" \
          -H "apikey: ${{ secrets.SUPABASE_API_KEY }}"
```

</details>

## <a name="more">🚀 More</a>

**Advance your skills with Next.js Pro Course**

Enjoyed creating this project? Dive deeper into our PRO courses for a richer learning adventure. They're packed with
detailed explanations, cool features, and exercises to boost your skills. Give it a go!

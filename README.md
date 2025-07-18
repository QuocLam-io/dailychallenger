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

Built with Vite, TypeScript, Supabase, and Postgres, Daily Challenger is a production-grade platform designed to help you set and track your daily personal challenges. It features a dynamic public interface paired with an intuitive admin dashboard, making it easy to log your progress and update your goals. With functionalities like automated daily challenge scheduling, progress tracking, and a social feed to view your friends’ challenges and achievements, Daily Challenger fosters accountability and motivation.

Powered by a modern, optimized tech stack for real-world scalability, the platform not only helps you stay on track with your own goals but also connects you with a community of like-minded individuals to celebrate successes and overcome challenges.

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

👉 **Public Section**: Experience Daily Challenger without an account! The public section lets anyone try out the core challenge features, create a challenge, and see how the platform works—no sign-in required. Perfect for quick demos, sharing with friends, or testing the product before joining the community.

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
<summary><code>Supabase Edge Function Cron Job</code></summary>

```typescript
Deno.serve(async (_req) => {
  const supabase = createClient(
    Deno.env.get("PROJECT_URL")!,
    Deno.env.get("SERVICE_ROLE_KEY")!
  );

  const now = new Date().toISOString();

  const { error } = await supabase
    .from("challenge_logs")
    .update({
      is_failed: true,
      failed_at: supabase.fn.cast("deadline", "timestamptz"),
    })
    .lte("deadline", now)
    .eq("completed", false)
    .eq("is_failed", false);

  if (error) {
    console.error("Failed to update challenge logs:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(JSON.stringify({ message: "Marked failed challenge logs" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
```

</details>
<details>
<summary><code>Auth: Private Routes</code></summary>

```typescript
interface UserTypes {
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: "user" | "admin" | "superadmin";
}

const PrivateRoutesWrapper = () => {
  const { isLoaded, user } = useUser();
  const setUserId = useUserStore((s) => s.setUserId);

  useEffect(() => {
    const checkUser = async () => {
      if (!isLoaded || !user) return;

      const email = user.primaryEmailAddress?.emailAddress;
      const firstName = user.firstName;
      const lastName = user.lastName;

      if (!email) return;

      try {
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("email", email)
          .single<UserTypes>();

        //if Error returned
        if (error && error.code !== "PGRST116") {
          console.error("Error fetching user:", error);
          return;
        }

        // If no user data exists, insert a new user
        if (!data) {
          const newUserRowData = {
            email,
            first_name: firstName,
            last_name: lastName,
            role: "user",
          };

          const { data: insertData, error: insertError } = await supabase
            .from("users")
            .insert([newUserRowData])
            .single();

          if (insertError) {
            console.error("Error inserting user:", insertError);
          } else {
            console.log("New user created", insertData);
          }
        }

        setUserId(user.id);
        console.log("blub");

      } catch (error) {
        console.error("Unexpected error:", error);
      }
    };

    checkUser();
  }, [isLoaded, user, setUserId]);

  if (!isLoaded) return <CarraigeLoader />;

  return <Outlet />;
};

 {/* Private Routes */}
          <Route
            path="/home"
            element={
              isSignedIn ? (
                <PrivateRoutesWrapper />
              ) : (
                <Navigate to="/" replace />
              )
            }
          >
            {/* <Route path="/home" element={<Home />} /> */}
            <Route index element={<Home />} />
            {/* Future private routes */}
            {/* <Route path="profile" element={<Profile />} /> */}
            {/* <Route path="settings" element={<Settings />} /> */}
          </Route>
```

</details>
<details>
<summary><code>Dynamic Navbar Spacer Component</code></summary>

```typescript
const NavSpacer = () => {
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const nav = document.getElementById("navbar");
    if (nav) {
      const resizeObserver = new ResizeObserver(() => {
        setHeight(nav.offsetHeight);
      });
      resizeObserver.observe(nav);

      setHeight(nav.offsetHeight);

      return () => resizeObserver.disconnect();
    }
  }, []);

  return <div  className="nav-spacer_wrapper" style={{ height }} aria-hidden="true" />;
};
```

</details>

## <a name="more">🚀 More</a>

**Share with your Friends**

Note to self: Write section to share with friends and advertise techs used in project like supabase and surge.

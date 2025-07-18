//React
import { useEffect, useState } from "react";
//Routing
import { Outlet } from "react-router-dom";
//Auth
import { useUser } from "@clerk/clerk-react";
//Zustand
import { useUserStore } from "@/stores/userStore.ts";
//Backend
import { supabase } from "../supabase-client.ts";
// import { createClient } from "@supabase/supabase-js";
//Components
import CarraigeLoader from "@/components/CarraigeLoader.tsx";

//Types
interface UserTypes {
  id: string;
  clerk_id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: "user" | "admin" | "superadmin";
  created_at?: string;
}

const PrivateRoutesWrapper = () => {
  const { isLoaded, user } = useUser();
  const setClerkId = useUserStore((s) => s.setClerkId);
  const setSupabaseId = useUserStore((s) => s.setSupabaseId);

  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      if (!isLoaded || !user) return;

      const clerkId = user.id;
      setClerkId(clerkId);

      const email = user.primaryEmailAddress?.emailAddress || null;
      const firstName = user.firstName || null;
      const lastName = user.lastName || null;
      if (!email) return;

      /* ---------------------- If user in db, set to zustand --------------------- */
      try {
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("clerk_id", clerkId)
          .single<UserTypes>();

        if (error && error.code !== "PGRST116") {
          console.error("Error fetching user:", error);
          return;
        }

        /* ----------------------- If no user in db, make one ----------------------- */
        if (!data) {
          const newUserRowData = {
            clerk_id: clerkId,
            email,
            first_name: firstName,
            last_name: lastName,
            role: "user",
          };

          const { data: insertData, error: insertError } = await supabase
            .from("users")
            .insert([newUserRowData]).single();

          if (insertError) {
            console.log("Insert error:", insertError);
            return;
          }

          if (!insertData) {
            console.log("Insert succeeded but no user data returned");
          }

          /* --------------- Fetches new user in db and sets in zustand --------------- */
          const { data: newUserData, error: fetchNewUserError } = await supabase
            .from("users")
            .select("*")
            .eq("email", email)
            .single<UserTypes>();

          if (fetchNewUserError || !newUserData) {
            console.error(
              "Failed to fetch user after insert",
              fetchNewUserError
            );
            return;
          }

          setSupabaseId(newUserData.id);
          setIsHydrated(true);
        } else {
          setSupabaseId(data.id);
          setIsHydrated(true);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      }
    };

    checkUser();
  }, [isLoaded, user, setClerkId, setSupabaseId]);

  //The useEffect and this If-Statement are racing, so we set a hydration state, otherwise the Outlet will rerender without the global state being properly populated and errors will occur because calls will be made without proper arguments (supabaseId)

  // when the useEffect sets the hydration state, the whole component rerenders
  if (!isLoaded || !isHydrated) return <CarraigeLoader />;

  return <Outlet />;
};

export default PrivateRoutesWrapper;

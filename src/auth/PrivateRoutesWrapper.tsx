//React
import { useEffect } from "react";
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
  const setUserId = useUserStore((s) => s.setUserId);

  useEffect(() => {
    const checkUser = async () => {
      //in case useUser() is too slow
      if (!isLoaded || !user) return;

      const clerkId = user.id;
      const email = user.primaryEmailAddress?.emailAddress || null;
      const firstName = user.firstName || null;
      const lastName = user.lastName || null;

      //hydrates zustand for ui purposes
      setUserId(clerkId);

      if (!email) return;

      /* ---------------------- If user in db, set to zustand --------------------- */
      try {
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("clerk_id", clerkId)
          // .eq("email", email)
          .single<UserTypes>();

        //if Error returned
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
            .insert([newUserRowData])
            .single();

          if (insertError) {
            console.log("Error inserting user:", insertError);
            return;
          }
          if (!insertData) {
            console.log("Insert succeeded but no user data returned");
          }

          /* --------------- Fetches new user in db and sets in zustand --------------- */

          const { data: newUserData, error: fetchNewUserError } = await supabase
            .from("users")
            .select("*")
            // .eq("clerk_id", clerkId)
            .eq("email", email)
            .single<UserTypes>();

          console.log("hmm");

          if (fetchNewUserError) {
            console.log(
              "Error fetching newly inserted user:",
              fetchNewUserError
            );
            return;
          }

          if (newUserData) {
            console.log("yata!");
            setUserId(newUserData.id);
          }

          /* -------------------------------------------------------------------------- */
        } else {
          console.log("there's data");
          setUserId(data.id);
        }
      } catch (error) {
        console.error("Unexpected error:", error);
      }
    };

    checkUser();
  }, [isLoaded, user, setUserId]);

  if (!isLoaded) return <CarraigeLoader />;

  return <Outlet />;
};

export default PrivateRoutesWrapper;

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
//Types
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
        console.log("blub")

        // if (data) {
        //   const supabase = createClient(
        //     import.meta.env.VITE_SUPABASE_URL,
        //     import.meta.env.VITE_SUPABASE_KEY
        //   );

        //   supabase.auth.getUser().then(({ error }) => {
        //     if (error) console.error("Error fetching user:", error);
        //   });
        // }
      } catch (error) {
        console.error("Unexpected error:", error);
      }
    };

    checkUser();
  }, [isLoaded, user, setUserId]);

  if (!isLoaded) return <div>Loading user...</div>;

  return <Outlet />;
};

export default PrivateRoutesWrapper;

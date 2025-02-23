import { useEffect } from "react";
//Styles
import "./Home.scss";
import { AnimatePresence } from "framer-motion";
//Auth
import { useUser } from "@clerk/clerk-react";
//Backend
import { supabase } from "../supabase-client.ts";
// Zustand

//Components
import Overlay from "@/components/Overlay.tsx";
import ChallengerForm from "@/components/ChallengerForm.tsx";

//supabase user types
interface UserTypes {
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: "user" | "admin" | "superadmin";
}

const Home: React.FC = () => {
  const { user } = useUser();

  useEffect(() => {
    const checkUser = async () => {
      if (!user) return;

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

        if (data) {
          console.log("Suck my dick!");
        }
      } catch (error) {
        console.error("Unexpected error:", error);
      }
    };

    checkUser();
  }, [user]);

  return (
    <main>
      <p>Blub</p>
      {/* Write conditional logic to display email id no name exists */}

      <AnimatePresence>
        <Overlay>
          <ChallengerForm />
        </Overlay>
      </AnimatePresence>
    </main>
  );
};

export default Home;

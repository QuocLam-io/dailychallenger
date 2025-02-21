import { useEffect } from "react";
//Styles
import "./Home.scss";
//Auth
import { useUser } from "@clerk/clerk-react";
//Backend
import { supabase } from "../supabase-client.js";

const Home = () => {
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
          .single();

        console.log(data, "data");

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
      } catch (error) {
        console.error("Unexpected error:", error);
      }
    };

    checkUser();
  }, []);

  return (
    <main>
      <p>Home</p>

      {/* Write conditional logic to display email id no name exists */}
    </main>
  );
};

export default Home;

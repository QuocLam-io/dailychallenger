import React, { useEffect } from "react";
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

      const email = user.primaryEmailAddress.emailAddress;

      if (!email) return;

      try {
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("email", email)
          .single();

        console.log(data, "data");

        if (error && error.code !== "PGRST116") {
          console.error("Error fetching user:", error);
          return;
        }


      } catch (error) {}
    };

    checkUser();
  }, []);

  return <main>Home</main>;
};

export default Home;

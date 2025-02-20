import React, { useEffect } from "react";
//Styles
import "./Home.scss";
//Auth
import { useUser } from "@clerk/clerk-react";
//Backend
import { supabase } from "../supabase-client.js";

const Home = () => {
  const { user } = useUser();
  const name = user.primaryEmailAddress.emailAddress;
  console.log(name, "name");

  return <main>Home</main>;
};

export default Home;

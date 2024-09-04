import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import supabase from "../utils/supabase";

function Loggout() {
  async function signOutUser(): Promise<void> {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Error signing out:", error.message);
      throw error;
    }

    console.log("User signed out successfully");
  }

  useEffect(() => {
    signOutUser().catch((error) => {
      console.error("Sign-out failed:", error.message);
    });
  }, []);

  return <Navigate to="/" />;
}

export default Loggout;

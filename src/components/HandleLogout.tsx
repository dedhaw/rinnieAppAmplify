import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { signOut } from "@aws-amplify/auth";

interface props {
  setSession: (session: any) => void;
}

function Loggout({ setSession }: props) {
  async function signOutUser(): Promise<void> {
    await signOut();
    setSession(null);
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

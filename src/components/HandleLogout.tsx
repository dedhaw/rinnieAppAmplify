import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { signOut } from "@aws-amplify/auth";
import { useCookies } from "react-cookie";

function Loggout() {
  const [session, setSession, removeSession] = useCookies(["session"]);
  const [email, setEmail, removeEmail] = useCookies(["email"]);
  session;
  email;
  setSession;
  setEmail;
  async function signOutUser(): Promise<void> {
    await signOut();
    removeSession("session");
    removeEmail("email");
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

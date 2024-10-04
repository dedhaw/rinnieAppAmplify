import { Routes, Route } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import Home from "./views/Home";
import CreateForm from "./views/CreateForm";
import Archive from "./views/Archive";
import Profile from "./views/Profile";
import EmailForm from "./views/EmailForm";
import DisplayForm from "./views/DisplayForm";

import LoginForm from "./views/Login";

import Landing from "./views/LandingPage";
import GenerateForm from "./views/FillFormPage";
import FormSent from "./views/FormSent";
import Redirect from "./components/Landing/LandingRedirect";

import PNF from "./views/PageNotFound";
import { Amplify } from "aws-amplify";
import "@aws-amplify/ui-react/styles.css";
import Loggout from "./components/HandleLogout";
import SignupForm from "./views/Signup";
import Contact from "./views/Calendar";
import FPP from "./views/ForgotPasswordPage";

async function configureAmplify() {
  let awsExports: any;

  if (import.meta.env.VITE_APP_MODE === "DEV") {
    awsExports = (await import("./aws-exports-dev")).default;
  } else if (import.meta.env.VITE_APP_MODE === "PROD") {
    awsExports = (await import("./aws-exports")).default;
  }

  Amplify.configure(awsExports);
}

configureAmplify();

function App() {
  const [cookies] = useCookies(["session"]);
  const session = cookies.session || null;

  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <Routes>
      {!session && (
        <>
          <Route path="/" element={<Landing />} />
          <Route path="/landing/" element={<Redirect />} />
        </>
      )}

      {session && (
        <>
          <Route path="/" element={<Home />} />
          <Route path="/create-form/" element={<CreateForm />} />
          <Route path="/archive/" element={<Archive />} />
          <Route path="/profile/" element={<Profile />} />
          <Route path="/email-form/" element={<EmailForm />} />
          <Route path="/form/" element={<DisplayForm />} />
          <Route path="/landing/" element={<Landing />} />
        </>
      )}

      <Route path="/login/" element={<LoginForm />} />
      <Route path="/logout/" element={<Loggout />} />
      <Route path="/signup/" element={<SignupForm />} />
      <Route path="/login/forgot-password/" element={<FPP />} />

      <Route path="/contact/" element={<Contact />} />
      <Route path="/fill-form/" element={<GenerateForm />} />
      <Route path="/form-completed/" element={<FormSent />} />

      <Route path="/*" element={<PNF />} />
    </Routes>
  );
}

export default App;

import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

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
import Redirect from "./components/LandingRedirect";

import PNF from "./views/PageNotFound";
import { Amplify } from "aws-amplify";
import "@aws-amplify/ui-react/styles.css";
import awsExports from "./aws-exports";
// import { fetchAuthSession } from "@aws-amplify/auth";
import Loggout from "./components/HandleLogout";
import SignupForm from "./views/Signup";
Amplify.configure(awsExports);

function App() {
  const [session, setSession] = useState<any>(() => {
    const savedSession = localStorage.getItem("session");
    return savedSession ? JSON.parse(savedSession) : null;
  });

  useEffect(() => {
    if (session) {
      localStorage.setItem("session", JSON.stringify(session));
    } else {
      localStorage.removeItem("session");
    }
  }, [session]);

  const handleSetSession = (newSession: any) => {
    setSession(newSession);
  };

  return (
    <Router>
      <Routes>
        {!session && (
          <>
            <Route path="/" element={<Landing />} />
            <Route path="/landing/" element={<Redirect />} />
          </>
        )}

        {session && (
          <>
            <Route path="/" element={<Home session={session} />} />
            <Route
              path="/create-form/"
              element={<CreateForm session={session} />}
            />
            <Route path="/archive/" element={<Archive session={session} />} />
            <Route path="/profile/" element={<Profile session={session} />} />
            <Route
              path="/email-form/"
              element={<EmailForm session={session} />}
            />
            <Route path="/form/" element={<DisplayForm session={session} />} />
            <Route path="/landing/" element={<Landing />} />
          </>
        )}

        <Route
          path="/login/"
          element={<LoginForm setSession={handleSetSession} />}
        />
        <Route
          path="/logout/"
          element={<Loggout setSession={handleSetSession} />}
        />
        <Route path="/signup/" element={<SignupForm />} />

        <Route path="/fill-form/" element={<GenerateForm />} />
        <Route path="/form-completed/" element={<FormSent />} />

        <Route path="/*" element={<PNF />} />
      </Routes>
    </Router>
  );
}

export default App;

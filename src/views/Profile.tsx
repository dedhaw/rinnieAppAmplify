import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useCookies } from "react-cookie";
import Branding from "../components/Profile/Branding";
import LoadingScreen from "../components/LoadingScreen";
import Clause from "../components/Profile/Clause";
import "../styles/profile.css";
import UserInfo from "../components/Profile/UserInfo";
import PreviewPage from "../components/Profile/Preview";

function Profile() {
  const [session] = useCookies(["session"]);
  const [email] = useCookies(["email"]);

  const [user, setUserData] = useState<any>(null);
  const [data, setData] = useState<any>(null);

  const [loading, isLoading] = useState(false);

  const [section, setSection] = useState("profile");

  const [primaryColor, setPC] = useState("#fe9052");
  const [secondaryColor, setSC] = useState("#ebebeb");
  const [textColor, setTC] = useState("#333");
  const [bgColor, setBC] = useState("#fff");

  const branding = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_HOST}/branding/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + session.session, // prettier-ignore
          },
          body: JSON.stringify({ email: email.email }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data == false) {
          setPC("#fe9052");
          setSC("#ebebeb");
          setTC("#333");
          setBC("#fff");
        } else {
          setPC(data.primary_color);
          setSC(data.secondary_color);
          setTC(data.text_color);
          setBC(data.background_color);
        }
      } else {
        console.error("Failed to fetch data");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_APP_HOST}/user/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + session.session, // prettier-ignore
          },
          body: JSON.stringify({ email: email.email }),
        });

        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        } else {
          console.error("Failed to fetch user");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const fetchClauses = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_APP_HOST}/docs/clause/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + session.session, // prettier-ignore
            },
            body: JSON.stringify({
              email: email.email,
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          setData(data);
        } else {
          console.error("Failed to fetch clause");
        }
      } catch (error) {
        console.error("Error fetching clause data:", error);
      }
    };

    fetchClauses();
    fetchUserData();
    branding();
  }, [session, email]);

  return (
    <>
      {section !== "preview" && (
        <>
          <Navbar pageType="protected" />
          <h1>Profile</h1>
          <div style={{ height: "100vh" }}>
            {section === "profile" && (
              <section>
                {user != null && data != null && loading != true && (
                  <>
                    <UserInfo user={user} setSection={setSection} />

                    <Clause
                      data={data}
                      setData={setData}
                      session={session}
                      email={email}
                      isLoading={isLoading}
                    />
                  </>
                )}
                {((user == null && data == null) || loading == true) && (
                  <LoadingScreen />
                )}
              </section>
            )}
            {section === "branding" && (
              <Branding
                primaryColor={primaryColor}
                secondaryColor={secondaryColor}
                textColor={textColor}
                bgColor={bgColor}
                session={session}
                email={email}
                setPC={setPC}
                setBC={setBC}
                setSC={setSC}
                setTC={setTC}
                setSection={setSection}
              />
            )}
          </div>
        </>
      )}
      {section === "preview" && <PreviewPage setSection={setSection} />}
    </>
  );
}

export default Profile;

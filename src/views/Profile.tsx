import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useCookies } from "react-cookie";
import { FaRegTrashAlt } from "react-icons/fa";
import "../styles/profile.css";
import Branding from "../components/Profile/Branding";
import LoadingScreen from "../components/LoadingScreen";

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

  const deleteClause = async (id: string) => {
    isLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_HOST}/docs/clause/delete/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + session.session, // prettier-ignore
          },
          body: JSON.stringify({ email: email.email, id: id }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setData(data);
      } else {
        console.error("Failed to delete clause");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    isLoading(false);
  };

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

  const renderClauses = (data: any[]) => {
    return data.map((item) => {
      return (
        <>
          <h3>{item.name}</h3>
          <div className="no-border center-text">
            <section className="interior">
              <p
                style={{
                  margin: "0px",
                  padding: "0px",
                  width: "100%",
                  textAlign: "left",
                }}
              >
                {item.clause}
              </p>
            </section>
            <button
              className="icon_button_delete"
              onClick={() => deleteClause(item.id)}
            >
              <FaRegTrashAlt size={30} />
            </button>
          </div>
        </>
      );
    });
  };

  return (
    <>
      <Navbar pageType="protected" />
      <h1>Profile</h1>
      <div style={{ height: "100vh" }}>
        {section === "profile" && (
          <section>
            {user != null && data != null && loading != true && (
              <>
                <h2>
                  {user.first_name} {user.last_name}
                </h2>
                <div className="no-border center-text">
                  <h2 style={{ padding: "0px 20px" }}>Email: {user.email}</h2>
                  <h2 style={{ padding: "0px 20px" }}>Phone: {user.cell}</h2>
                </div>
                <div className="no-border center-text">
                  <h2 style={{ padding: "0px 20px" }}>
                    Broker License: {user.license}
                  </h2>
                  <h2 style={{ padding: "0px 20px" }}>
                    Brokerage: {user.brokerage_name}
                  </h2>
                  <h2 style={{ padding: "0px 20px" }}>
                    Brokerage: {user.brokerage_license}
                  </h2>
                </div>
                <div className="no-border" style={{ justifyContent: "center" }}>
                  <img src={user.signature} />
                </div>
                <div className="no-border" style={{ justifyContent: "center" }}>
                  <button>Edit</button>
                  <button onClick={() => setSection("branding")}>
                    Branding
                  </button>
                </div>

                <section style={{ width: "100%" }}>
                  <h2>Clause Settings</h2>
                  {data.length > 0 && <>{renderClauses(data)}</>}
                  {data.length <= 0 && <p>You have no saved clauses!</p>}
                </section>
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
  );
}

export default Profile;

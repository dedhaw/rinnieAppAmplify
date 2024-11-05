import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useCookies } from "react-cookie";
import { FaRegTrashAlt } from "react-icons/fa";
import { ChromePicker } from "react-color";

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
  const [logo, setLogo] = useState(null);

  const handlePCChange = (newColor: any) => {
    setPC(newColor.hex);
  };
  const handleSCChange = (newColor: any) => {
    setSC(newColor.hex);
  };
  const handleTCChange = (newColor: any) => {
    setTC(newColor.hex);
  };
  const handleBCChange = (newColor: any) => {
    setBC(newColor.hex);
  };
  const handleFileChange = (e) => {
    setLogo(e.target.files[0]);
  };

  const reset = () => {
    setPC("#fe9052");
    setSC("#ebebeb");
    setTC("#333");
    setBC("#fff");
  };

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
        console.log("Branding Data " + data);
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

  const saveBranding = async () => {
    isLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_HOST}/branding/save/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + session.session, // prettier-ignore
          },
          body: JSON.stringify({
            email: email.email,
            primaryColor: primaryColor,
            secondaryColor: secondaryColor,
            textColor: textColor,
            backgroundColor: bgColor,
          }),
        }
      );

      if (response.ok) {
        alert("Your settings have been saved!");
      } else {
        console.error("Failed to fetch data");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    isLoading(false);
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

  const handleUpload = async () => {
    if (!logo) return;
    console.log(logo);
    const formData = new FormData();
    formData.append("email", email.email);
    formData.append("image", logo);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_HOST}/branding/save-logo/`,
        {
          method: "POST",
          headers: {
            "Authorization": "Bearer " + session.session, // prettier-ignore
          },
          body: formData,
        }
      );

      if (response.ok) {
        console.log("SENT");
      } else {
        console.error("Failed to fetch user");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

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
              <div className="no-border" style={{ justifyContent: "center" }}>
                <img className="loading" src="/loading.gif" alt="loading..." />
              </div>
            )}
          </section>
        )}
        {section === "branding" && (
          <>
            <div
              className="no-border create-sub"
              style={{
                justifyContent: "space-evenly",
                display: "flex",
              }}
            >
              <button
                className="cancel-button"
                onClick={() => setSection("profile")}
              >
                Cancel
              </button>
              <button className="cancel-button" onClick={reset}>
                Reset
              </button>
              <button className="submit-button" onClick={saveBranding}>
                Save
              </button>
            </div>
            <br />
            <section style={{ backgroundColor: bgColor }}>
              <h2 style={{ color: textColor }}>Branding Settings</h2>
              <section style={{ width: "100%", borderColor: secondaryColor }}>
                {/* <div className="buttons no-border"> */}
                <button
                  className="next-button"
                  style={{
                    margin: "auto",
                    justifySelf: "center",
                    display: "flex",
                    backgroundColor: primaryColor,
                    border: primaryColor,
                  }}
                >
                  Hello
                </button>
                {/* </div> */}
              </section>
            </section>
            <div
              style={{
                margin: "auto",
                display: "flex",
                justifyContent: "center",
                gap: "35px",
              }}
            >
              <div>
                <p>Primary Color</p>
                <ChromePicker color={primaryColor} onChange={handlePCChange} />
              </div>
              <div>
                <p>Secondary Color</p>
                <ChromePicker
                  color={secondaryColor}
                  onChange={handleSCChange}
                />
              </div>
              <div>
                <p>Text Color</p>
                <ChromePicker color={textColor} onChange={handleTCChange} />
              </div>
              <div>
                <p>Background Color</p>
                <ChromePicker color={bgColor} onChange={handleBCChange} />
              </div>
            </div>
            <br />
            <div
              style={{
                margin: "auto",
                display: "flex",
                justifyContent: "center",
                gap: "35px",
              }}
            >
              <input type="file" onChange={handleFileChange} />
              <button onClick={handleUpload}>Upload</button>
            </div>
            <br />
          </>
        )}
      </div>
    </>
  );
}

export default Profile;

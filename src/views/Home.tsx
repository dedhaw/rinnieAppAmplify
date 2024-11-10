import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/home.css";
import { PiHandWavingBold } from "react-icons/pi";
import { IoClose } from "react-icons/io5";
import { useCookies } from "react-cookie";
import LoadingScreen from "../components/LoadingScreen";

function Home() {
  const navigate = useNavigate();

  const [session] = useCookies(["session"]);
  const [email] = useCookies(["email"]);

  const [userData, setUserData] = useState<any>(null);
  const [data, setData] = useState<any>(null);
  const [loading, isLoading] = useState(false);

  const fillForm = (id: string) => {
    window.open(`/fill-form?id=${id}`, "_blank");
  };

  const emailForm = (id: string) => {
    navigate(`/email-form?id=${id}`);
  };

  const displayForm = (id: string) => {
    navigate(`/form?id=${id}`);
  };

  const archive = async (id: string) => {
    isLoading(!loading);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_HOST}/docs/archive/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + session.session, // prettier-ignore
          },
          body: JSON.stringify({ id: id }),
        }
      );

      if (response.ok) {
        console.log("Form archived");
        window.location.reload();
      } else {
        console.error("Failed to archive form");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    isLoading(!loading);
  };

  const sortData = () => {
    return data.sort((a: any, b: any) => {
      const dateA = new Date(a[5]);
      const dateB = new Date(b[5]);
      return dateB.getTime() - dateA.getTime();
    });
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
          body: JSON.stringify({
            email: email.email,
          }),
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

    const fetchData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_APP_HOST}/docs/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + session.session, // prettier-ignore
          },
          body: JSON.stringify({
            email: email.email,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setData(data);
        } else {
          console.error("Failed to fetch data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchUserData();
    fetchData();
  }, [session]);

  const renderData = () => {
    const sortedData = sortData();

    return sortedData.map((item: any, i: any) => {
      const id = item[0];
      const form = item[1];
      var title = "";

      if (form == "Form 41") {
        title = "Buyer Brokerage Agreement";
      }
      if (form == "Form 41") {
        title = "Buyer Brokerage Agreement";
      }
      if (item[4] != "") {
        title += " | ";
        title += item[4];
      }

      if (item[3] == false) {
        if (item[2] == false) {
          return (
            <div key={i}>
              <p>{title}</p>
              <button onClick={() => displayForm(id)}>Display Form</button>
              <button onClick={() => emailForm(id)}>Email Form to Buyer</button>
              <button onClick={() => fillForm(id)}>Fill Form on device</button>
              <button onClick={() => archive(id)} className="icon_button">
                <IoClose size={30} />
              </button>
            </div>
          );
        }
      }
    });
  };

  const renderCompletedData = () => {
    const sortedData = sortData();
    return sortedData.map((item: any, i: any) => {
      const id = item[0];
      const form = item[1];
      var title = "";

      if (form == "Form 41") {
        title = "Buyer Brokerage Agreement";
      }
      if (item[4] != "") {
        title += " | ";
        title += item[4];
      }

      if (item[3] == false) {
        if (item[2] == true) {
          return (
            <div key={i}>
              <p>{title}</p>
              <button onClick={() => displayForm(id)}>Display Form</button>
              <p>This Form has been completed!</p>
              <button className="icon_button" onClick={() => archive(id)}>
                <IoClose size={30} />
              </button>
            </div>
          );
        }
      }
    });
  };

  return (
    <>
      <Navbar pageType="protected" />
      {userData !== null && data !== null && loading === false && (
        <>
          <h1>
            Welcome {userData.first_name} <PiHandWavingBold color="#fe9052" />
          </h1>
          {data.length > 0 && (
            <>
              <section>{renderData()}</section>
              <h2 className="completed">Completed</h2>
              <section>{renderCompletedData()}</section>
            </>
          )}
          {data.length === 0 && (
            <>
              <section>
                <p style={{ textAlign: "center" }}>No Forms Created</p>
              </section>
            </>
          )}
        </>
      )}

      {(userData === null || data === null || loading === true) && (
        <LoadingScreen />
      )}
      <br />
    </>
  );
}

export default Home;

import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import "../styles/home.css";
import { FaCheck } from "react-icons/fa6";
import { FaRegTrashAlt } from "react-icons/fa";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

function Archive() {
  const navigate = useNavigate();

  const [session] = useCookies(["session"]);
  const [email] = useCookies(["email"]);

  const [data, setData] = useState<any>(null);
  const [loading, isLoading] = useState(false);

  const displayForm = (id: string) => {
    navigate(`/form?id=${id}`);
  };

  const remove = async (id: string) => {
    isLoading(!loading);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_HOST}/docs/delete/`,
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
        console.log("Form unarchived");
        window.location.reload();
      } else {
        console.error("Failed to unarchive form");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    isLoading(!loading);
  };

  const unarchive = async (id: string) => {
    isLoading(!loading);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_HOST}/docs/unarchive/`,
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
        console.log("Form unarchived");
        window.location.reload();
      } else {
        console.error("Failed to unarchive form");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    isLoading(!loading);
  };

  const removeAll = async () => {
    isLoading(!loading);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_HOST}/docs/delete-all/`,
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
        console.log("Form unarchived");
        window.location.reload();
      } else {
        console.error("Failed to unarchive form");
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
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_APP_HOST}/docs/archives/`,
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
          setData(data);
        } else {
          console.error("Failed to fetch data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const renderData = () => {
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
      var completed = "Incompleted";
      if (item[2] == true) {
        completed = "Completed";
      }

      if (item[3] == true) {
        return (
          <div key={i}>
            <p>{title}</p>
            <p>{completed}</p>
            <button onClick={() => displayForm(id)}>Display Form</button>
            <button className="icon_button_alt" onClick={() => unarchive(id)}>
              <FaCheck size={30} />
            </button>
            <button className="icon_button_delete" onClick={() => remove(id)}>
              <FaRegTrashAlt size={30} />
            </button>
          </div>
        );
      }
    });
  };
  return (
    <>
      <Navbar pageType="protected" />
      <h1>
        Archive <FaRegTrashAlt color="#fe9052" />
      </h1>
      {data !== null && loading === false && (
        <>
          {data.length > 0 && (
            <section>
              <div className="buttons no-border">
                <button
                  className="delete"
                  style={{ margin: "auto" }}
                  onClick={() => removeAll()}
                >
                  Delete All
                </button>
              </div>
              {renderData()}
            </section>
          )}
          {data.length <= 0 && (
            <section>
              <p style={{ textAlign: "center" }}>No Forms Created</p>
            </section>
          )}
        </>
      )}
      {(data === null || loading === true) && (
        <div style={{ margin: "10px auto", textAlign: "center" }}>
          <img className="loading" src="/loading.gif" alt="loading..." />
        </div>
      )}
    </>
  );
}

export default Archive;

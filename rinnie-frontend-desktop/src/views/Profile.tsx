import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { props } from "../utils/supabase";

function Profile({ session }: props) {
  const [user, setUserData] = useState<any>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/user/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: session }),
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

    fetchUserData();
  }, [session]);

  return (
    <>
      <Navbar pageType="protected" />
      <h1>Profile</h1>
      <div style={{ height: "100vh" }}>
        <section>
          {user != null && (
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
              </div>
            </>
          )}
          {user == null && (
            <div className="no-border" style={{ justifyContent: "center" }}>
              <img className="loading" src="/loading.gif" alt="loading..." />
            </div>
          )}
        </section>
      </div>
    </>
  );
}

export default Profile;

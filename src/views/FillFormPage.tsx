import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import LoadingScreen from "../components/FillForm/LoadingScreen";
import { checkDocEditable } from "../utils/Secure";
import { useCookies } from "react-cookie";

import Form41 from "../components/FillForm/Form41";

function GenerateForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const [loading, isLoading] = useState(true);
  const [branding, setBranding] = useState<any>(false);
  const [session] = useCookies(["session"]);

  const id = queryParams.get("id") || "";
  if (id == "") {
    navigate("/page-not-found");
  }

  useEffect(() => {
    const check = async () => {
      const data = await checkDocEditable(id);
      if (data == false) {
        navigate("/page-not-found");
      }
    };

    check();

    const getBranding = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_APP_HOST_OPEN}/branding/get/`,
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
          const data = await response.json();
          console.log("Branding Data " + data);
          setBranding(data);
          isLoading(false);
        } else {
          console.error("Failed to fetch data");
          isLoading(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        isLoading(false);
      }
    };

    getBranding();
  }, []);

  return (
    <>
      {loading === true && <LoadingScreen />}
      {loading === false && (
        <Form41 branding={branding} session={session} id={id} />
      )}
    </>
  );
}

export default GenerateForm;

import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/forms.css";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import "@cyntler/react-doc-viewer/dist/index.css";
interface props {
  session: any;
}
import { checkUserDocAccess } from "../utils/Secure";

function DisplayForm({ session }: props) {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id") || "";
  const goHome = () => {
    navigate("/");
  };

  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
  const [docs, setDocs] = useState<any[]>([]);

  const archive = async (id: string) => {
    try {
      const response = await fetch(
        `https://ali5u9l6fk.execute-api.us-east-1.amazonaws.com/prod/docs/archive/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
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
  };

  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
    };

    const fetchData = async () => {
      try {
        const check = await checkUserDocAccess(session, id);
        if (check == false) {
          navigate("/page-not-found");
        }
        const response = await fetch(
          `https://ali5u9l6fk.execute-api.us-east-1.amazonaws.com/prod/doc/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              'Accept': "application/pdf", // prettier-ignore
            },
            body: JSON.stringify({ id: id }),
          }
        );

        if (response.ok) {
          const data = await response.blob();
          const url = URL.createObjectURL(data);
          console.log(data);
          console.log(url);

          const docObject = {
            uri: url,
            fileType: "pdf",
            fileName: "your-document-name.pdf",
          };

          setDocs([docObject]);
        } else {
          console.error("Failed to fetch data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    // const getPDF = async () => {
    //   try {
    //     const response = await fetch(`https://ali5u9l6fk.execute-api.us-east-1.amazonaws.com/prod/doc/`, {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //       body: JSON.stringify({ id: id }),
    //     });

    //     if (response.ok) {
    //       const data = await response.blob();
    //       console.log(data);
    //       const url = URL.createObjectURL(data);
    //       console.log(url);
    //       const docObject = {
    //         uri: url,
    //         fileType: "pdf",
    //         fileName: "your-document-name.pdf",
    //       };

    //       setDocs([docObject]);
    //     }
    //   } catch (error) {
    //     console.error("Error:", error);
    //   }
    // };

    // getPDF();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [session, id]);

  return (
    <>
      <Navbar pageType="protected" />
      <div className="header">
        <h1>Buyer Brokerage Services Agreement</h1>
      </div>
      <div
        className="button-container"
        style={{ maxWidth: "400px", margin: "auto" }}
      >
        <button className="cancel-button" onClick={goHome}>
          Back
        </button>
        <button className="submit-button" onClick={() => archive(id)}>
          Archive
        </button>
      </div>
      {viewportWidth > 800 && (
        <div
          style={{
            justifyContent: "center",
            display: "flex",
            marginTop: "20px",
            borderRadius: "8px",
            width: "100%",
          }}
        >
          {docs.length > 0 && (
            <DocViewer
              documents={docs}
              pluginRenderers={DocViewerRenderers}
              theme={{
                primary: "#ffd5bb",
                secondary: "#ffd5bb",
                tertiary: "#fff",
                textPrimary: "#333333",
                textSecondary: "#333333",
                textTertiary: "#333333",
                disableThemeScrollbar: false,
              }}
              style={{ width: 1000, height: 1000 }}
            />
          )}
          {docs.length <= 0 && (
            <div style={{ margin: "10px auto", textAlign: "center" }}>
              <img className="loading" src="/loading.gif" alt="loading..." />
            </div>
          )}
        </div>
      )}
      {viewportWidth <= 800 && (
        <div
          style={{
            justifyContent: "center",
            display: "flex",
            marginTop: "20px",
            borderRadius: "8px",
            width: "80vw",
            marginRight: "auto",
            marginLeft: "auto",
          }}
        >
          <DocViewer
            documents={docs}
            pluginRenderers={DocViewerRenderers}
            theme={{
              primary: "#ffd5bb",
              secondary: "#ffd5bb",
              tertiary: "#fff",
              textPrimary: "#333333",
              textSecondary: "#333333",
              textTertiary: "#333333",
              disableThemeScrollbar: false,
            }}
            style={{ width: 1000, height: 500 }}
          />
        </div>
      )}
    </>
  );
}

export default DisplayForm;

import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/forms.css";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import "@cyntler/react-doc-viewer/dist/index.css";
import { useCookies } from "react-cookie";
import { checkUserDocAccess } from "../utils/Secure";

function DisplayForm() {
  const navigate = useNavigate();

  const [session] = useCookies(["session"]);
  const [email] = useCookies(["email"]);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id") || "";
  const goHome = () => {
    navigate("/");
  };

  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
  const [docs, setDocs] = useState<any[]>([]);
  const [images, setImages] = useState([]);

  function isIpad() {
    const userAgent = navigator.userAgent;

    return (
      /iPad/.test(userAgent) ||
      (navigator.maxTouchPoints > 1 && /Macintosh/.test(userAgent))
    );
  }

  const archive = async (id: string) => {
    try {
      const response = await fetch(
        `https://ali5u9l6fk.execute-api.us-east-1.amazonaws.com/prod/docs/archive/`,
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
  };

  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
    };
    const check = async () => {
      const data = await checkUserDocAccess(email.email, id);
      if (data == false) {
        navigate("/page-not-found");
      }
    };

    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://ali5u9l6fk.execute-api.us-east-1.amazonaws.com/prod/doc/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + session.session, // prettier-ignore
              'Accept': "application/pdf", // prettier-ignore
            },
            body: JSON.stringify({ id: id, is_ipad: isIpad() }),
          }
        );

        if (response.ok) {
          if (!isIpad()) {
            const data = await response.blob();
            const url = URL.createObjectURL(data);

            const docObject = {
              uri: url,
              fileType: "pdf",
              fileName: "your-document-name.pdf",
            };

            setDocs([docObject]);
          } else {
            const data = await response.json();
            setImages(data.images);
            setDocs(["docObject"]);
          }
        } else {
          console.error("Failed to fetch data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    check();
    fetchData();

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
            <>
              {!isIpad() && (
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
              {isIpad() && (
                <>
                  <div className="stack-images">
                    {images.map((img, index) => (
                      <img
                        key={index}
                        src={`data:image/png;base64,${img}`}
                        alt={`Page ${index + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
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
          {!isIpad() && (
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
          )}
          {isIpad() && (
            <>
              {images.map((img, index) => (
                <img
                  key={index}
                  src={`data:image/png;base64,${img}`}
                  alt={`Page ${index + 1}`}
                  style={{ display: "block", marginBottom: "10px" }}
                />
              ))}
            </>
          )}
        </div>
      )}
    </>
  );
}

export default DisplayForm;

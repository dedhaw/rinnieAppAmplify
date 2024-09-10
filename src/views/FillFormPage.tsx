import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import Navbar from "../components/Navbar";
import Modal from "../components/Modal";
import SignatureBox from "../components/SignatureBox";
import { checkDocEditable } from "../utils/Secure";
import "../styles/forms.css";

import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";

function GenerateForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const id = queryParams.get("id") || "";
  if (id == "") {
    navigate("/page-not-found");
  }

  const [step, setStep] = useState("info");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, isLoading] = useState(false);

  const closeModal = () => {
    setIsModalOpen(false);
    isLoading(false);
  };

  const [buyerCount, setBuyers] = useState(1);
  const [docs, setDocs] = useState<any[]>([]);

  const [firstName1, set1FirstName] = useState("");
  const [lastName1, set1LastName] = useState("");
  const [email1, set1Email] = useState("");
  const [phone1, set1Phone] = useState("");
  const [initials1, set1Initials] = useState("");

  const [firstName2, set2FirstName] = useState("");
  const [lastName2, set2LastName] = useState("");
  const [email2, set2Email] = useState("");
  const [phone2, set2Phone] = useState("");
  const [initials2, set2Initials] = useState("");

  const signatureRef1 = useRef<HTMLCanvasElement>(null);
  const signatureRef2 = useRef<HTMLCanvasElement>(null);

  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);

  useEffect(() => {
    const check = async () => {
      const data = await checkDocEditable(id);
      if (data == false) {
        navigate("/page-not-found");
      }
    };

    check();

    const handleResize = () => {
      setViewportWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const newInitials = `${firstName1.charAt(0) || ""}${
      lastName1.charAt(0) || ""
    }`.toUpperCase();
    set1Initials(newInitials);
  }, [firstName1, lastName1]);

  useEffect(() => {
    const newInitials = `${firstName2.charAt(0) || ""}${
      lastName2.charAt(0) || ""
    }`.toUpperCase();
    set2Initials(newInitials);
  }, [firstName2, lastName2]);

  const handleBuyerCount = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value == "One") {
      setBuyers(1);
    } else if (e.target.value == "Two") {
      setBuyers(2);
    }
  };

  const handleAccept = () => {
    setStep("signature");
  };

  const addBuyerSigs = async (id: string, image1: any, image2: any = null) => {
    try {
      isLoading(true);
      const response = await fetch(
        `https://ali5u9l6fk.execute-api.us-east-1.amazonaws.com/prod/docs/add-signatures/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            document_id: id,
            signature1: image1,
            signature2: image2,
          }),
        }
      );

      if (response.ok) {
        console.log("added signatures");
        isLoading(false);
      } else {
        console.error("Failed to generate form");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fillForm = async (id: string) => {
    isLoading(true);
    setIsModalOpen(true);
    if (buyerCount == 1) {
      try {
        const response = await fetch(
          `https://ali5u9l6fk.execute-api.us-east-1.amazonaws.com/prod/docs/generate/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              'Accept': "application/pdf", // prettier-ignore
            },
            body: JSON.stringify({
              form_id: id,
              first_name_b1: firstName1,
              last_name_b1: lastName1,
              initials_b1: initials1,
              email_b1: email1,
              cell_b1: phone1,
            }),
          }
        );

        if (response.ok) {
          console.log("Form generated");
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
          isLoading(false);
        } else {
          console.error("Failed to generate form");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    } else {
      try {
        const response = await fetch(
          `https://ali5u9l6fk.execute-api.us-east-1.amazonaws.com/prod/docs/generate/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              'Accept': "application/pdf", // prettier-ignore
            },
            body: JSON.stringify({
              form_id: id,
              first_name_b1: firstName1,
              last_name_b1: lastName1,
              initials_b1: initials1,
              email_b1: email1,
              cell_b1: phone1,
              first_name_b2: firstName2,
              last_name_b2: lastName2,
              initials_b2: initials2,
              email_b2: email2,
              cell_b2: phone2,
            }),
          }
        );

        if (response.ok) {
          console.log("Form generated");
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
          isLoading(false);
        } else {
          console.error("Failed to generate form");
          isLoading(!isLoading);
          setIsModalOpen(!isModalOpen);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        isLoading(!isLoading);
        setIsModalOpen(!isModalOpen);
      }
    }
  };

  const handleSubmit = (id: string) => {
    isLoading(true);
    if (signatureRef1.current) {
      const canvas = signatureRef1.current;
      const signatureImage1 = canvas.toDataURL("image/png");

      const blankCanvas = document.createElement("canvas");
      blankCanvas.width = canvas.width;
      blankCanvas.height = canvas.height;
      const blankImage = blankCanvas.toDataURL("image/png");
      var cont = true;
      var signatureImage2;
      if (buyerCount == 2) {
        if (signatureRef2.current) {
          const canvas2 = signatureRef2.current;
          signatureImage2 = canvas2.toDataURL("image/png");
          if (signatureImage2 == blankImage) {
            alert("Please fill out all signatures.");
            cont = false;
          }
        }
      }

      if (cont == true) {
        if (signatureImage1 == blankImage) {
          alert("Please fill out all signatures.");
        } else {
          console.log("buyers: ", buyerCount);
          if (buyerCount == 1) {
            addBuyerSigs(id, signatureImage1);
            console.log("fname: ", firstName1);
            console.log("lname: ", lastName1);
            console.log("initials: ", initials1);
            console.log("email: ", email1);
            console.log("phone: ", phone1);
          } else if (buyerCount == 2) {
            addBuyerSigs(id, signatureImage1, signatureImage2);
            console.log("fname: ", firstName1);
            console.log("lname: ", lastName1);
            console.log("initials: ", initials1);
            console.log("email: ", email1);
            console.log("phone: ", phone1);
            console.log("fname: ", firstName2);
            console.log("lname: ", lastName2);
            console.log("initials: ", initials2);
            console.log("email: ", email2);
            console.log("phone: ", phone2);
          }

          navigate("/form-completed");
        }
      }
    } else {
      alert("Please fill out all signatures.");
    }
  };

  const [currentPage, setCurrentPage] = useState<number | null>(null);

  useEffect(() => {
    const updatePageNumber = () => {
      const pageInfoElement = document.getElementById("pdf-pagination-info");
      if (pageInfoElement) {
        const pageText = pageInfoElement.textContent || "";
        const match = pageText.match(/Page (\d+)\/\d+/);
        if (match) {
          setCurrentPage(parseInt(match[1], 10));
        }
      }
    };

    updatePageNumber();

    const interval = setInterval(updatePageNumber, 1000);

    return () => clearInterval(interval);
  }, []);

  /* @vite-ignore */
  function useRouteCss(route: string, cssFile: string) {
    const location = useLocation();
    React.useEffect(() => {
      if (location.pathname === route) {
        import(cssFile /* @vite-ignore */);
      }
    }, [location, route, cssFile]);
  }

  useRouteCss("/fill-form", "../styles/pdf.css");

  return (
    <>
      <Navbar pageType="none" />
      <h1>Buyer Disclosure Form</h1>
      <section style={{ margin: "0px, auto", textAlign: "center" }}>
        {step === "info" && (
          <>
            <p>How Many Buyers?</p>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="option"
                  value="One"
                  checked={buyerCount === 1}
                  onChange={handleBuyerCount}
                  className="radio-input"
                />
                <span className="radio-label-text">One</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="option"
                  value="Two"
                  checked={buyerCount === 2}
                  onChange={handleBuyerCount}
                  className="radio-input"
                />
                <span className="radio-label-text">Two</span>
              </label>
            </div>
            <br />
            <p>Buyer One</p>
            <div className="form-group two-fields">
              <input
                type="text"
                id="first-name1"
                value={firstName1}
                onChange={(e) => set1FirstName(e.target.value)}
                placeholder="First Name"
                required
              />
              <input
                type="text"
                id="last-name1"
                value={lastName1}
                onChange={(e) => set1LastName(e.target.value)}
                placeholder="Last Name"
                required
              />
              <input
                type="text"
                id="initials1"
                value={initials1}
                onChange={(e) => set1Initials(e.target.value)}
                placeholder="Initials"
                required
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                id="email1"
                value={email1}
                onChange={(e) => set1Email(e.target.value)}
                placeholder="Email"
                required
              />
            </div>
            <div className="form-group">
              <input
                type="tel"
                id="phone1"
                value={phone1}
                onChange={(e) => set1Phone(e.target.value)}
                placeholder="Phone"
                pattern="[0-9]{10}"
                inputMode="numeric"
                required
              />
            </div>
            {buyerCount === 2 && (
              <>
                <p>Buyer Two</p>
                <div className="form-group two-fields">
                  <input
                    type="text"
                    id="first-name2"
                    value={firstName2}
                    onChange={(e) => set2FirstName(e.target.value)}
                    placeholder="First Name"
                    required
                  />
                  <input
                    type="text"
                    id="last-name2"
                    value={lastName2}
                    onChange={(e) => set2LastName(e.target.value)}
                    placeholder="Last Name"
                    required
                  />
                  <input
                    type="text"
                    id="initials2"
                    value={initials2}
                    onChange={(e) => set2Initials(e.target.value)}
                    placeholder="Initials"
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="email"
                    id="email2"
                    value={email2}
                    onChange={(e) => set2Email(e.target.value)}
                    placeholder="Email"
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="tel"
                    id="phone2"
                    value={phone2}
                    onChange={(e) => set2Phone(e.target.value)}
                    placeholder="Phone"
                    pattern="[0-9]{10}"
                    inputMode="numeric"
                    required
                  />
                </div>
                {firstName1.length > 0 &&
                  lastName1.length > 0 &&
                  email1.length > 0 &&
                  phone1.length > 0 &&
                  firstName2.length > 0 &&
                  lastName2.length > 0 &&
                  email2.length > 0 &&
                  phone2.length > 0 && (
                    <button
                      className="next-button"
                      onClick={() => fillForm(id)}
                    >
                      Next
                    </button>
                  )}
              </>
            )}
            {buyerCount === 1 && (
              <>
                {firstName1.length > 0 &&
                  lastName1.length > 0 &&
                  email1.length > 0 &&
                  phone1.length > 0 && (
                    <button
                      className="next-button"
                      onClick={() => fillForm(id)}
                    >
                      Next
                    </button>
                  )}
              </>
            )}
            {viewportWidth > 800 && (
              <Modal isOpen={isModalOpen} onClose={closeModal}>
                {loading === false && (
                  <>
                    <p>
                      Please navigate to the last page of the document to
                      proceed.
                    </p>
                    <div className="doc-container no-border ">
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
                        style={{ width: 1000 }}
                      />
                    </div>
                    <p>
                      I acknowledge that I have read and understand the terms of
                      this contract.
                    </p>
                    <br />
                    {currentPage === 3 && (
                      <>
                        <button
                          className="accept-button"
                          onClick={handleAccept}
                        >
                          Accept
                        </button>
                        <br />
                      </>
                    )}
                  </>
                )}
                {loading === true && (
                  <div style={{ margin: "10px auto", textAlign: "center" }}>
                    <img
                      className="loading"
                      src="/loading.gif"
                      alt="loading..."
                    />
                  </div>
                )}
              </Modal>
            )}
          </>
        )}

        {step === "signature" && (
          <>
            {loading === false && (
              <>
                <h2>
                  {firstName1} {lastName1} Signature:
                </h2>
                <SignatureBox ref={signatureRef1} />
                {buyerCount === 2 && (
                  <>
                    <h2>
                      {firstName2} {lastName2} Signature:
                    </h2>
                    <SignatureBox ref={signatureRef2} />
                  </>
                )}
                <button
                  type="submit"
                  className="submit-button"
                  onClick={() => handleSubmit(id)}
                >
                  Submit
                </button>
              </>
            )}
            {loading === true && (
              <div style={{ margin: "10px auto", textAlign: "center" }}>
                <img className="loading" src="/loading.gif" alt="loading..." />
              </div>
            )}
          </>
        )}
      </section>
      {viewportWidth <= 800 && isModalOpen && step === "info" && (
        <>
          <div style={{ margin: "10px auto", textAlign: "center" }}>
            <p>Please navigate to the last page of the document to proceed.</p>
          </div>
          <div
            style={{
              justifyContent: "center",
              display: "flex",
              marginTop: "20px",
              borderRadius: "8px",
            }}
          >
            {loading == false && (
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
                style={{ width: 1000 }}
              />
            )}
            {loading === true && (
              <div style={{ margin: "10px auto", textAlign: "center" }}>
                <img className="loading" src="/loading.gif" alt="loading..." />
              </div>
            )}
          </div>
          <section>
            <p>
              I acknowledge that I have read and understand the terms of this
              contract.
            </p>
            <br />
            {currentPage === 3 && (
              <div className="no-border" style={{ justifyContent: "center" }}>
                <button className="next-button" onClick={handleAccept}>
                  Accept
                </button>
              </div>
            )}
          </section>
        </>
      )}
    </>
  );
}

export default GenerateForm;

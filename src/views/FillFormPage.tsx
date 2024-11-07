import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import Navbar from "../components/FillForm/Navbar";
import { default as NB } from "../components/Navbar";
import Modal from "../components/Modal";
import SignatureBox from "../components/SignatureBox";
import InitialBox from "../components/InitialsBox";
import { checkDocEditable } from "../utils/Secure";
import { scrollToSection } from "../utils/ScrollToSection";

import "../styles/forms.css";
import "../styles/pdf.css";

import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";

import { useCookies } from "react-cookie";
function GenerateForm() {
  const [session] = useCookies(["session"]);
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const [branding, setBranding] = useState<any>(false);
  const [starting, isStarting] = useState(true);

  const id = queryParams.get("id") || "";
  if (id == "") {
    navigate("/page-not-found");
  }

  function isIpad() {
    const userAgent = navigator.userAgent;

    return (
      /iPad/.test(userAgent) ||
      (navigator.maxTouchPoints > 1 && /Macintosh/.test(userAgent))
    );
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
  const [images, setImages] = useState([]);

  const [firstName1, set1FirstName] = useState("");
  const [lastName1, set1LastName] = useState("");
  const [email1, set1Email] = useState("");
  const [phone1, set1Phone] = useState("");

  const [firstName2, set2FirstName] = useState("");
  const [lastName2, set2LastName] = useState("");
  const [email2, set2Email] = useState("");
  const [phone2, set2Phone] = useState("");

  const signatureRef1 = useRef<HTMLCanvasElement>(null);
  const initialRef1 = useRef<HTMLCanvasElement>(null);
  const signatureRef2 = useRef<HTMLCanvasElement>(null);
  const initialRef2 = useRef<HTMLCanvasElement>(null);

  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);

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
          isStarting(false);
        } else {
          console.error("Failed to fetch data");
          isStarting(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        isStarting(false);
      }
    };

    getBranding();

    const handleResize = () => {
      setViewportWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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

  const addBuyerSigs = async (
    id: string,
    image1: any,
    in1: any,
    image2: any = null,
    in2: any = null
  ) => {
    var name2 = null;
    var email = null;
    if (buyerCount == 2) {
      name2 = firstName2 + " " + lastName2;
      email = email2;
    }
    try {
      isLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_APP_HOST_OPEN}/docs/add-signatures/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            document_id: id,
            signature1: image1,
            initials1: in1,
            signature2: image2,
            initials2: in2,
            buyer1_name: firstName1 + " " + lastName1,
            buyer1_email: email1,
            buyer2_name: name2,
            buyer2_email: email,
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
    scrollToSection("document-review");

    if (buyerCount == 1) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_APP_HOST_OPEN}/docs/generate/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              'Accept': "application/pdf", // prettier-ignore
              "Authorization": "Bearer " + session.session, // prettier-ignore
            },
            body: JSON.stringify({
              form_id: id,
              first_name_b1: firstName1,
              last_name_b1: lastName1,
              email_b1: email1,
              cell_b1: phone1,
              is_ipad: isIpad(),
            }),
          }
        );

        if (response.ok) {
          console.log("Form generated");
          if (!isIpad()) {
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
            const data = await response.json();
            setImages(data.images);
          }
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
          `${import.meta.env.VITE_APP_HOST_OPEN}/docs/generate/`,
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
              email_b1: email1,
              cell_b1: phone1,
              first_name_b2: firstName2,
              last_name_b2: lastName2,
              email_b2: email2,
              cell_b2: phone2,
              is_ipad: isIpad(),
            }),
          }
        );

        if (response.ok) {
          console.log("Form generated");
          if (!isIpad()) {
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
            const data = await response.json();
            setImages(data.images);
          }
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
    if (signatureRef1.current && initialRef1.current) {
      const canvas = signatureRef1.current;
      const signatureImage1 = canvas.toDataURL("image/png");

      const blankCanvas = document.createElement("canvas");
      blankCanvas.width = canvas.width;
      blankCanvas.height = canvas.height;
      const blankImage = blankCanvas.toDataURL("image/png");

      const canvasI = initialRef1.current;
      const initialsImage1 = canvasI.toDataURL("image/png");

      const blankCanvasI = document.createElement("canvas");
      blankCanvasI.width = canvasI.width;
      blankCanvasI.height = canvasI.height;
      const blankImageI = blankCanvas.toDataURL("image/png");
      var cont = true;

      var signatureImage2;
      var initialsImage2;
      if (buyerCount == 2) {
        if (signatureRef2.current && initialRef2.current) {
          const canvas2 = signatureRef2.current;
          const canvasI2 = initialRef2.current;

          signatureImage2 = canvas2.toDataURL("image/png");
          initialsImage2 = canvasI2.toDataURL("image/png");
          if (signatureImage2 == blankImage || initialsImage2 == blankImageI) {
            alert("Please fill out all signatures.");
            cont = false;
          }
        }
      }

      if (cont == true) {
        if (signatureImage1 == blankImage || initialsImage1 == blankImageI) {
          alert("Please fill out all signatures.");
        } else {
          console.log("buyers: ", buyerCount);
          if (buyerCount == 1) {
            addBuyerSigs(id, signatureImage1, initialsImage1);
            console.log("fname: ", firstName1);
            console.log("lname: ", lastName1);
            console.log("email: ", email1);
            console.log("phone: ", phone1);
          } else if (buyerCount == 2) {
            addBuyerSigs(
              id,
              signatureImage1,
              initialsImage1,
              signatureImage2,
              initialsImage2
            );
            console.log("fname: ", firstName1);
            console.log("lname: ", lastName1);
            console.log("email: ", email1);
            console.log("phone: ", phone1);
            console.log("fname: ", firstName2);
            console.log("lname: ", lastName2);
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

  var primaryColor = "#fe9052";
  var secondaryColor = "#ebebeb";
  var backgroundColor = "#fff";
  var textColor = "#333";
  var logo = null;
  var banner = null;

  if (branding != false) {
    var primaryColor = String(branding.primary_color);
    var secondaryColor = String(branding.secondary_color);
    var backgroundColor = String(branding.background_color);
    var textColor = String(branding.text_color);
    console.log(branding.logo);
    var logo = branding.logo;
    var banner = branding.banner;
  }

  return (
    <>
      {starting === false && (
        <>
          <div
            style={{
              color: textColor + " !important",
              backgroundColor: backgroundColor,
            }}
          >
            <Navbar
              backgroundColor={backgroundColor}
              secondaryColor={secondaryColor}
              logo={logo}
            />

            {banner && (
              <>
                <br />
                <img className="banner" src={banner} />
              </>
            )}
            <h1 style={{ color: textColor }}>Buyer Brokerage Agreement</h1>
            <section
              style={{
                border: "2px solid" + secondaryColor,
                margin: "0px, auto",
                textAlign: "center",
              }}
            >
              {step === "info" && (
                <>
                  <p style={{ color: textColor }}>How Many Buyers?</p>
                  <div className="radio-group">
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="option"
                        value="One"
                        checked={buyerCount === 1}
                        onChange={handleBuyerCount}
                        className="radio-input"
                        style={{
                          backgroundColor:
                            buyerCount === 1 ? primaryColor : "#fff",
                          border:
                            buyerCount === 1
                              ? "11px solid" + primaryColor
                              : "1px solid" + primaryColor,
                        }}
                      />
                      <span
                        className="radio-label-text"
                        style={{ color: textColor }}
                      >
                        One
                      </span>
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="option"
                        value="Two"
                        checked={buyerCount === 2}
                        onChange={handleBuyerCount}
                        className="radio-input"
                        style={{
                          backgroundColor:
                            buyerCount === 2 ? primaryColor : "#fff",
                          border:
                            buyerCount === 2
                              ? "11px solid" + primaryColor
                              : "1px solid" + primaryColor,
                        }}
                      />
                      <span
                        className="radio-label-text"
                        style={{ color: textColor }}
                      >
                        Two
                      </span>
                    </label>
                  </div>
                  <br />
                  <p style={{ color: textColor }}>Buyer One</p>
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
                      <p style={{ color: textColor }}>Buyer Two</p>
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
                            style={{
                              backgroundColor: primaryColor,
                              borderColor: primaryColor,
                            }}
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
                          <p style={{ color: textColor }}>
                            Please navigate to the last page of the document to
                            proceed.
                          </p>
                          {!isIpad() && (
                            <>
                              <div className="doc-container no-border fill ">
                                <DocViewer
                                  documents={docs}
                                  pluginRenderers={DocViewerRenderers}
                                  theme={{
                                    primary: primaryColor,
                                    secondary: secondaryColor,
                                    tertiary: "#fff",
                                    textPrimary: "#333333",
                                    textSecondary: "#333333",
                                    textTertiary: "#333333",
                                    disableThemeScrollbar: false,
                                  }}
                                  style={{ width: 1000 }}
                                />
                              </div>
                              <p style={{ color: textColor }}>
                                I acknowledge that I have read and understand
                                the terms of this contract.
                              </p>
                              {currentPage === 3 && (
                                <button
                                  className="accept-button"
                                  onClick={handleAccept}
                                >
                                  Accept
                                </button>
                              )}
                            </>
                          )}
                          {isIpad() && (
                            <>
                              {images.map((img, index) => (
                                <img
                                  key={index}
                                  src={`data:image/png;base64,${img}`}
                                  alt={`Page ${index + 1}`}
                                  style={{
                                    display: "block",
                                    marginBottom: "10px",
                                  }}
                                />
                              ))}
                              <p style={{ color: textColor }}>
                                I acknowledge that I have read and understand
                                the terms of this contract.
                              </p>
                              <br />
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
                        <div
                          style={{ margin: "10px auto", textAlign: "center" }}
                        >
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
                      <h2 style={{ color: textColor }}>
                        {firstName1} {lastName1} Initials:
                      </h2>
                      <InitialBox ref={initialRef1} />
                      <h2 style={{ color: textColor }}>
                        {firstName1} {lastName1} Signature:
                      </h2>
                      <SignatureBox ref={signatureRef1} />
                      {buyerCount === 2 && (
                        <>
                          <h2 style={{ color: textColor }}>
                            {firstName2} {lastName2} Initials:
                          </h2>
                          <InitialBox ref={initialRef2} />
                          <h2 style={{ color: textColor }}>
                            {firstName2} {lastName2} Signature:
                          </h2>
                          <SignatureBox ref={signatureRef2} />
                        </>
                      )}
                      <button
                        type="submit"
                        className="submit-button"
                        style={{
                          backgroundColor: primaryColor,
                          borderColor: primaryColor,
                        }}
                        onClick={() => handleSubmit(id)}
                      >
                        Submit
                      </button>
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
                </>
              )}
            </section>
            {viewportWidth <= 800 && isModalOpen && step === "info" && (
              <>
                <div
                  id="document-review"
                  style={{ margin: "10px auto", textAlign: "center" }}
                >
                  <p style={{ color: textColor }}>
                    Please navigate to the last page of the document to proceed.
                  </p>
                </div>
                <div
                  style={{
                    justifyContent: "center",
                    display: "flex",
                    marginTop: "20px",
                    borderRadius: "8px",
                  }}
                >
                  {!isIpad() && (
                    <>
                      {loading == false && (
                        <DocViewer
                          documents={docs}
                          pluginRenderers={DocViewerRenderers}
                          className="fill"
                          theme={{
                            primary: primaryColor,
                            secondary: secondaryColor,
                            tertiary: "#fff",
                            textPrimary: "#333333",
                            textSecondary: "#333333",
                            textTertiary: "#333333",
                            disableThemeScrollbar: false,
                          }}
                          style={{ width: 1000 }}
                        />
                      )}
                    </>
                  )}
                  {isIpad() && (
                    <>
                      {loading == false && (
                        <>
                          {images.map((img, index) => (
                            <img
                              key={index}
                              src={`data:image/png;base64,${img}`}
                              alt={`Page ${index + 1}`}
                              style={{ display: "block", marginBottom: "10px" }}
                            />
                          ))}
                          <div
                            className="no-border"
                            style={{ justifyContent: "center" }}
                          >
                            <button
                              className="next-button"
                              onClick={handleAccept}
                            >
                              Accept
                            </button>
                          </div>
                        </>
                      )}
                    </>
                  )}
                  {loading === true && (
                    <>
                      <div style={{ margin: "10px auto", textAlign: "center" }}>
                        <img
                          className="loading"
                          src="/loading.gif"
                          alt="loading..."
                        />
                      </div>
                    </>
                  )}
                </div>
                <section style={{ border: "2px solid" + secondaryColor }}>
                  <p style={{ color: textColor }}>
                    I acknowledge that I have read and understand the terms of
                    this contract.
                  </p>
                  <br />
                  {currentPage === 3 && (
                    <div
                      className="no-border"
                      style={{ justifyContent: "center" }}
                    >
                      <button
                        className="next-button"
                        style={{
                          backgroundColor: primaryColor,
                          borderColor: primaryColor,
                        }}
                        onClick={handleAccept}
                      >
                        Accept
                      </button>
                    </div>
                  )}
                </section>
              </>
            )}
            <br />
          </div>
        </>
      )}
      {starting === true && (
        <>
          <NB pageType="none" />
          <div>
            <img
              src="/pu.png"
              style={{
                height: "250px",
                width: "auto",
                display: "flex",
                margin: "100px auto auto auto",
              }}
              alt=""
            />
            <h2>Powered by Rinnie</h2>
            <div
              className="no-border"
              style={{
                justifyContent: "center",
                margin: "auto",
                display: "flex",
              }}
            >
              <img className="loading" src="/loading.gif" alt="loading..." />
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default GenerateForm;

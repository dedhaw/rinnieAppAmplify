import { useState, useEffect } from "react";
import { ChromePicker } from "react-color";

interface BrandingProps {
  setSection: Function;
  primaryColor: string;
  setPC: Function;
  secondaryColor: string;
  setSC: Function;
  bgColor: string;
  setBC: Function;
  textColor: string;
  setTC: Function;
  session: any;
  email: any;
}

const Branding: React.FC<BrandingProps> = ({
  setSection,
  primaryColor,
  secondaryColor,
  bgColor,
  textColor,
  session,
  email,
  setPC,
  setSC,
  setBC,
  setTC,
}) => {
  const [brandingLoading, isBLoading] = useState(false);
  const [logo, setLogo] = useState(null);
  const [banner, setBanner] = useState(null);

  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
    };

    if (brandingLoading) {
      handleBLoading();
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [brandingLoading]);

  const handleBLoading = () => {
    alert("Loading...");
    isBLoading(false);
  };

  const handleLogoUpload = async () => {
    if (!logo) return;
    isBLoading(true);
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
        isBLoading(false);
        alert("Image was uploaded successfully");
      } else {
        console.error("Failed to fetch user");
        isBLoading(false);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      isBLoading(false);
    }
  };

  const handleBannerUpload = async () => {
    if (!banner) return;
    isBLoading(true);
    const formData = new FormData();
    formData.append("email", email.email);
    formData.append("image", banner);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_HOST}/branding/save-banner/`,
        {
          method: "POST",
          headers: {
            "Authorization": "Bearer " + session.session, // prettier-ignore
          },
          body: formData,
        }
      );

      if (response.ok) {
        isBLoading(false);
        alert("Image was uploaded successfully");
      } else {
        console.error("Failed to fetch user");
        isBLoading(false);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      isBLoading(false);
    }
  };

  const saveBranding = async () => {
    isBLoading(true);
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
        isBLoading(false);
      } else {
        console.error("Failed to fetch data");
        isBLoading(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      isBLoading(false);
    }
  };

  const resetBrandingImage = async () => {
    isBLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_HOST}/branding/reset/`,
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
        isBLoading(false);
        alert("Successfully reset images");
      } else {
        isBLoading(false);
        console.error("Failed to fetch");
      }
    } catch (error) {
      isBLoading(false);
      console.error("Error fetching data:", error);
    }
  };

  const reset = () => {
    setPC("#fe9052");
    setSC("#ebebeb");
    setTC("#333");
    setBC("#fff");
  };

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
  const handleLogoChange = (e: any) => {
    if (e) {
      setLogo(e.target.files[0]);
    }
  };
  const handleBannerChange = (e: any) => {
    if (e) {
      setBanner(e.target.files[0]);
    }
  };

  return (
    <>
      <div
        className="no-border create-sub"
        style={{
          justifyContent: "space-evenly",
          display: "flex",
        }}
      >
        <button className="cancel-button" onClick={() => setSection("profile")}>
          Back
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
          <p style={{ color: textColor }}>
            See what your changes look like on the clients screen by clicking
            the button below!
          </p>
          <button
            className="next-button"
            style={{
              margin: "auto",
              justifySelf: "center",
              display: "flex",
              backgroundColor: primaryColor,
              border: primaryColor,
            }}
            onClick={() => setSection("preview")}
          >
            Click here to preview
          </button>
        </section>
      </section>
      {viewportWidth > 1001 && (
        <>
          <div className="color-picker">
            <div>
              <p>Primary Color</p>
              <ChromePicker color={primaryColor} onChange={handlePCChange} />
            </div>
            <div>
              <p>Secondary Color</p>
              <ChromePicker color={secondaryColor} onChange={handleSCChange} />
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
          <section
            style={{
              margin: "auto",
              display: "flex",
              justifyContent: "center",
              gap: "35px",
            }}
          >
            <div
              style={{
                display: "inline",
              }}
            >
              <h2>Logo Upload</h2>
              <input type="file" accept="image/*" onChange={handleLogoChange} />
              <br />
              <br />
              <button
                style={{ margin: "auto", display: "flex" }}
                onClick={handleLogoUpload}
              >
                Save Logo
              </button>
            </div>

            <div
              style={{
                display: "inline",
                justifyContent: "center",
              }}
            >
              <h2>Banner Upload</h2>
              <input
                type="file"
                accept="image/*"
                onChange={handleBannerChange}
              />
              <br />
              <br />
              <button
                style={{ margin: "auto", display: "flex" }}
                onClick={handleBannerUpload}
              >
                Save Banner
              </button>
            </div>
          </section>
          <div className="buttons">
            <button
              className="delete"
              style={{ width: "auto" }}
              onClick={resetBrandingImage}
            >
              Reset Images
            </button>
          </div>
          <br />
        </>
      )}
      {viewportWidth < 1000 && viewportWidth > 500 && (
        <>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              margin: "auto",
            }}
          >
            <div
              style={{
                width: "50%",
                margin: "auto",
                display: "grid",
                justifyContent: "center",
              }}
            >
              <div>
                <p> Primary Color</p>
                <ChromePicker color={primaryColor} onChange={handlePCChange} />
                <p>Secondary Color</p>
                <ChromePicker
                  color={secondaryColor}
                  onChange={handleSCChange}
                />
                <div></div>
                <div>
                  <p>Text Color</p>
                  <ChromePicker color={textColor} onChange={handleTCChange} />
                </div>
                <div>
                  <p>Background Color</p>
                  <ChromePicker color={bgColor} onChange={handleBCChange} />
                </div>
              </div>
            </div>
            <div style={{ width: "50%" }}>
              <div
                style={{
                  display: "inline",
                }}
              >
                <h2>Logo Upload</h2>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                />
                <br />
                <br />
                <button
                  style={{ margin: "auto", display: "flex" }}
                  onClick={handleLogoUpload}
                >
                  Save Logo
                </button>
              </div>

              <div
                style={{
                  display: "inline",
                  justifyContent: "center",
                }}
              >
                <h2>Banner Upload</h2>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBannerChange}
                />
                <br />
                <br />
                <button
                  style={{ margin: "auto", display: "flex" }}
                  onClick={handleBannerUpload}
                >
                  Save Banner
                </button>
                <div className="buttons">
                  <button
                    className="delete"
                    style={{ width: "auto" }}
                    onClick={resetBrandingImage}
                  >
                    Reset Images
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      {viewportWidth <= 500 && (
        <>
          <div
            style={{
              width: "50%",
              margin: "auto",
              display: "grid",
              justifyContent: "center",
            }}
          >
            <div>
              <p> Primary Color</p>
              <ChromePicker color={primaryColor} onChange={handlePCChange} />
              <p>Secondary Color</p>
              <ChromePicker color={secondaryColor} onChange={handleSCChange} />
              <div></div>
              <div>
                <p>Text Color</p>
                <ChromePicker color={textColor} onChange={handleTCChange} />
              </div>
              <div>
                <p>Background Color</p>
                <ChromePicker color={bgColor} onChange={handleBCChange} />
              </div>
            </div>
          </div>
          <br />
          <div style={{ width: "50%", margin: "auto" }}>
            <div
              style={{
                display: "inline",
              }}
            >
              <h2>Logo Upload</h2>
              <input type="file" accept="image/*" onChange={handleLogoChange} />
              <br />
              <br />
              <button
                style={{ margin: "auto", display: "flex" }}
                onClick={handleLogoUpload}
              >
                Save Logo
              </button>
            </div>

            <div
              style={{
                display: "inline",
                justifyContent: "center",
              }}
            >
              <h2>Banner Upload</h2>
              <input
                type="file"
                accept="image/*"
                onChange={handleBannerChange}
              />
              <br />
              <br />
              <button
                style={{ margin: "auto", display: "flex" }}
                onClick={handleBannerUpload}
              >
                Save Banner
              </button>
              <div className="buttons">
                <button
                  className="delete"
                  style={{ width: "auto" }}
                  onClick={resetBrandingImage}
                >
                  Reset Images
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Branding;

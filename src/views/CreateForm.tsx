import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import styled from "styled-components";
import "../styles/forms.css";
import { useLoadScript, StandaloneSearchBox } from "@react-google-maps/api";
import { useCookies } from "react-cookie";

const libraries: any = ["places", "localContext"];

const Slider = styled.input.attrs({
  type: "range",
  max: 10,
  step: 0.25,
})`
  -webkit-appearance: none;
  -moz-appearance: none;
  outline: 0;
  height: 12px;
  border-radius: 40px;
  background: ${(props: any) =>
    `linear-gradient(to right, #ff914b 0%, #ff914b ${props.value * 10}%, #fff ${
      props.value * 10
    }%, #fff 100%)`};
  box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.5);

  ::-webkit-slider-thumb {
    -webkit-appearance: none;
  }

  ::-moz-range-thumb {
    -webkit-appearance: none;
  }
`;

function CreateForm() {
  const navigate = useNavigate();

  const [session] = useCookies(["session"]);
  const [email] = useCookies(["email"]);

  const [loading, isLoading] = useState(false);
  const [loadingSection, isLoadingSection] = useState(false);

  const [name, setName] = useState("");
  const [exclusive, setExclusive] = useState("Exclusive");
  const [areaA, setAreaA] = useState("EastSide Area");
  const [areaB, setAreaB] = useState("");
  const [area, setArea] = useState("EastSide Area");
  const [percent, setPercent] = useState<any>(1.5);
  const [price, setPrice] = useState<any>(4999);
  const [perOrPri, setPerOrPri] = useState("percent");
  const [period, setPeriod] = useState<any>(60);
  const [clause, setClause] = useState<any>(null);
  const [clauseName, setClauseName] = useState<any>(null);
  const [mode, setMode] = useState("create");
  const [data, setData] = useState<any>([]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  // @ts-ignore
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyCqdjoH_TIE8gJou9QTabYVKDxFjW-MuY0",
    libraries,
  });

  const searchBoxRef = useRef<google.maps.places.SearchBox | null>(null);

  const onPlaceChanged = () => {
    const place = searchBoxRef.current?.getPlaces()?.[0];
    if (place && place.formatted_address) {
      setAreaB(place.formatted_address);
      setArea(place.formatted_address);
    }
  };

  const handleEXChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setExclusive(event.target.value);
  };

  const handleAreaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAreaA(event.target.value);
    if (areaA != "Other") {
      setArea(event.target.value);
    }
  };

  const fetchClauses = async () => {
    isLoadingSection(true);
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
    isLoadingSection(false);
  };

  const saveClause = async () => {
    isLoadingSection(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_HOST}/docs/clause/save/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + session.session, // prettier-ignore
          },
          body: JSON.stringify({
            email: email.email,
            name: clauseName,
            clause: clause,
          }),
        }
      );

      if (response.ok) {
        console.log("Clause saved");
        alert("Clause was saved successfully");
        const data = await response.json();
        setData(data);
      } else {
        console.error("Failed to save clause");
      }
    } catch (error) {
      console.error("Error saving clause:", error);
    }
    isLoadingSection(false);
  };

  const renderClauses = (data: any[]) => {
    return data.map((item) => {
      return (
        <button className="button-list" onClick={() => selectClause(item)}>
          {item.name}
        </button>
      );
    });
  };

  const selectClause = (item: any) => {
    setClause(item.clause);
    setClauseName(item.name);
  };

  const handleClauseSubmit = (cancel: boolean) => {
    if (cancel) {
      setClause(null);
      setClauseName(null);
    } else if (clause == "") {
      setClause(null);
    }
    if (clauseName == "") {
      setClauseName(null);
    }

    setMode("create");
  };

  const handleClauseEditor = () => {
    fetchClauses();
    setMode("clause");
  };

  const handleCommisionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPerOrPri(event.target.value);
  };

  const sendForm = async () => {
    var percentString: any = null;
    var priceString: any = null;
    if (perOrPri == "percent") {
      percentString = percent.toString();
    } else {
      priceString = price.toString();
    }
    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_HOST}/docs/create/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + session.session, // prettier-ignore
          },
          body: JSON.stringify({
            email: email.email,
            doc_type: "Form 41",
            doc_name: name,
            area: area,
            exclusive: exclusive,
            percent: percentString,
            price: priceString,
            period: period,
            clause: clause,
          }),
        }
      );

      if (response.ok) {
        console.log("form created");
        navigate("/");
      } else {
        console.error("Failed to create form");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    isLoading(true);
    sendForm();
  };

  return (
    <>
      <Navbar pageType="protected" />
      {loading === false && (
        <>
          <h1>Create Form</h1>
          {mode === "create" && (
            <section>
              <form onSubmit={handleSubmit} className="create-form">
                <div className="form-group">
                  <input
                    className="name-input"
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Name your form (Optional)"
                    style={{
                      marginLeft: "auto",
                      marginRight: "auto",
                      textAlign: "center",
                    }}
                  />
                </div>
                <p>Select exclusivity:</p>
                <div className="radio-group">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="option"
                      value="Exclusive"
                      checked={exclusive === "Exclusive"}
                      onChange={handleEXChange}
                      className="radio-input"
                    />
                    <span className="radio-label-text">Exclusive</span>
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="option"
                      value="Non-Exclusive"
                      checked={exclusive === "Non-Exclusive"}
                      onChange={handleEXChange}
                      className="radio-input"
                    />
                    <span className="radio-label-text">Non-Exclusive</span>
                  </label>
                </div>

                <p>Select the area:</p>
                <div className="radio-group">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="area-option"
                      value="EastSide Area"
                      checked={areaA === "EastSide Area"}
                      onChange={handleAreaChange}
                      className="radio-input"
                    />
                    <span className="radio-label-text">EastSide</span>
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="area-option"
                      value="Greater Seattle Area"
                      checked={areaA === "Greater Seattle Area"}
                      onChange={handleAreaChange}
                      className="radio-input"
                    />
                    <span className="radio-label-text">Greater Seattle</span>
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="area-option"
                      value="Other"
                      checked={areaA === "Other"}
                      onChange={handleAreaChange}
                      className="radio-input"
                    />
                    <span className="radio-label-text">Other</span>
                  </label>
                </div>
                {areaA === "Other" && (
                  <StandaloneSearchBox
                    onLoad={(ref) => (searchBoxRef.current = ref)}
                    onPlacesChanged={() => onPlaceChanged()}
                  >
                    <input
                      className="area-input"
                      type="text"
                      id="Area"
                      value={areaB}
                      onChange={(e) => {
                        setArea(e.target.value);
                        setAreaB(e.target.value);
                      }}
                      onKeyDown={handleKeyDown}
                      placeholder="Enter the Address"
                      required
                    />
                  </StandaloneSearchBox>
                )}

                <p>Select commission structure:</p>
                <div className="radio-group" style={{ marginBottom: "0px" }}>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="commision"
                      value="percent"
                      checked={perOrPri == "percent"}
                      onChange={handleCommisionChange}
                      className="radio-input"
                    />
                    <span className="radio-label-text">Percent</span>
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="commision"
                      value="price"
                      checked={perOrPri == "price"}
                      onChange={handleCommisionChange}
                      className="radio-input"
                    />
                    <span className="radio-label-text">Flat Fee</span>
                  </label>
                </div>
                <div
                  className="no-border"
                  style={{
                    textAlign: "center",
                    justifyContent: "center",
                    display: "grid",
                    marginBottom: "0px",
                  }}
                >
                  {perOrPri === "percent" && (
                    <>
                      <br />
                      <Slider
                        value={percent}
                        onChange={(e) => setPercent(e.target.value)}
                        className="slider"
                      />
                      <p>{percent}%</p>
                    </>
                  )}
                  {perOrPri === "price" && (
                    <>
                      <div
                        className="no-border form-group"
                        style={{ marginBottom: "0px", paddingBottom: "0px" }}
                      >
                        <p style={{ marginBottom: "0px" }}>
                          $
                          <input
                            type="text"
                            style={{
                              width: "100px",
                              height: "30px",
                              margin: "auto",
                            }}
                            id="price"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            inputMode="numeric"
                            required
                          />
                        </p>
                      </div>
                    </>
                  )}
                </div>

                <p style={{ marginBottom: "0px" }}>Select number of days:</p>
                <div
                  className="form-group"
                  style={{
                    width: "300px",
                    margin: "auto",
                  }}
                >
                  <p className="text-input">
                    <input
                      type="text"
                      style={{ width: "60px", height: "30px", margin: "auto" }}
                      id="period"
                      value={period}
                      onChange={(e) => setPeriod(e.target.value)}
                      inputMode="numeric"
                      required
                    />{" "}
                    Days
                  </p>
                </div>
                {clause === null && <br />}
                {clause != null && (
                  <>
                    <p>Clause:</p>
                    <p>{clause}</p>
                  </>
                )}

                <div
                  className="no-border create-sub"
                  style={{ justifyContent: "center" }}
                >
                  <button
                    className="cancel-button"
                    onClick={handleClauseEditor}
                  >
                    Add Clauses
                  </button>
                  <button type="submit" className="submit-button">
                    Submit
                  </button>
                </div>
              </form>
            </section>
          )}
          {mode === "clause" && (
            <section>
              <p>
                Set additional clauses in your contract that will go under the
                "other" section of the document.
              </p>
              <div className="form-group">
                <input
                  className="name-input"
                  type="text"
                  id="name"
                  value={clauseName}
                  onChange={(e) => setClauseName(e.target.value)}
                  placeholder="Name your clause (Optional for saving)"
                  style={{
                    marginLeft: "auto",
                    marginRight: "auto",
                    textAlign: "center",
                  }}
                />
              </div>
              <div className="form-group two-fields">
                <textarea
                  name="clause"
                  id="clause"
                  value={clause}
                  onChange={(e) => setClause(e.target.value)}
                  placeholder="Add clause here..."
                ></textarea>
                <section className="clause-section">
                  {loadingSection === false && (
                    <>
                      {data.length <= 0 && <p>There are no saved clauses.</p>}
                      {data.length > 0 && (
                        <>
                          <p>Saved Clause:</p>
                          {renderClauses(data)}
                        </>
                      )}
                    </>
                  )}
                  {loadingSection === true && (
                    <div
                      style={{
                        textAlign: "center",
                      }}
                      className="no-border"
                    >
                      <img
                        className="loading"
                        src="/loading.gif"
                        alt="loading..."
                      />
                    </div>
                  )}
                </section>
              </div>
              <div
                className="no-border create-sub"
                style={{ justifyContent: "center" }}
              >
                <button
                  className="cancel-button"
                  onClick={() => handleClauseSubmit(true)}
                >
                  Cancel
                </button>
                {clauseName != null && clauseName != "" && (
                  <>
                    <button className="cancel-button" onClick={saveClause}>
                      Save
                    </button>
                  </>
                )}
                <button
                  className="submit-button"
                  onClick={() => handleClauseSubmit(false)}
                >
                  Submit
                </button>
              </div>
            </section>
          )}
        </>
      )}
      {loading === true && (
        <div style={{ margin: "10px auto", textAlign: "center" }}>
          <img className="loading" src="/loading.gif" alt="loading..." />
        </div>
      )}
    </>
  );
}

export default CreateForm;

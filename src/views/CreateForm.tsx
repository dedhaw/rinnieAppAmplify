import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import styled from "styled-components";
import "../styles/forms.css";
import { useLoadScript, StandaloneSearchBox } from "@react-google-maps/api";

const libraries: any = ["places", "localContext"];

interface props {
  session: any;
}

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

function CreateForm({ session }: props) {
  const navigate = useNavigate();
  const [loading, isLoading] = useState(false);

  const [name, setName] = useState("");

  const [exclusive, setExclusive] = useState("Exclusive");

  const [areaA, setAreaA] = useState("EastSide Area");
  const [areaB, setAreaB] = useState("");
  const [area, setArea] = useState("EastSide Area");

  const [percent, setPercent] = useState<any>(1.5);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  // @ts-ignore
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_APP_GOOGLE_API_KEY,
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

  const sendForm = async () => {
    var percentString: string = percent.toString();
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/docs/create/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: session,
            doc_type: "Form 41",
            doc_name: name,
            area: area,
            exclusive: exclusive,
            percent: percentString,
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
          <section className="form">
            <form onSubmit={handleSubmit} className="create-form">
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
              <div
                className="no-border"
                style={{
                  textAlign: "center",
                  justifyContent: "center",
                  display: "grid",
                }}
              >
                <p>Commision Percentage:</p>
                <Slider
                  value={percent}
                  onChange={(e) => setPercent(e.target.value)}
                  className="slider"
                />
                <p>{percent}%</p>
              </div>
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
                  }}
                />
              </div>
              <br />
              <div className="no-border" style={{ justifyContent: "center" }}>
                <button type="submit" className="submit-button">
                  Submit
                </button>
              </div>
            </form>
          </section>
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

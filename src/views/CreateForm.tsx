import { useState } from "react";
import Form41 from "../components/CreateForm/Form41";
import Navbar from "../components/Navbar";
import LoadingScreen from "../components/LoadingScreen";
import FormSelector from "../components/CreateForm/FormSelector";

function CreateForm() {
  const [loading, isLoading] = useState(false);
  const [form, setForm] = useState("none");

  return (
    <>
      <Navbar pageType="protected" />
      {loading === false && (
        <>
          <h1>Create Form</h1>
          {form === "none" && <FormSelector setForm={setForm} />}
          {form === "Form 41 | Buyer Brokerage Service Agreement" && (
            <Form41 isLoading={isLoading} />
          )}
        </>
      )}
      {loading === true && (
        <>
          <LoadingScreen />
          <p>Creating form...</p>
        </>
      )}
    </>
  );
}

export default CreateForm;

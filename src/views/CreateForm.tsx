import { useState } from "react";
import Form41 from "../components/CreateForm/Form41";
import Navbar from "../components/Navbar";
import LoadingScreen from "../components/LoadingScreen";

function CreateForm() {
  const [loading, isLoading] = useState(false);

  return (
    <>
      <Navbar pageType="protected" />
      {loading === false && (
        <>
          <h1>Create Form</h1>
          <Form41 isLoading={isLoading} />
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

import Navbar from "../components/Navbar";
import ConfettiAnimation from "../components/ConfettiAnimation";

function FormSent() {
  return (
    <>
      <Navbar pageType="none" />

      <ConfettiAnimation run={true} />
      <div className="centered">
        <h1>Congratulations!</h1>
        <p>You have filled out a Buyer Disclosure Form with Dev Dhawan!</p>
        <p>
          I will be emailing you and your agent shortly with more information.
        </p>
      </div>
    </>
  );
}

export default FormSent;

import Dropdown from "../Dropdown";

interface FormSelectorProps {
  setForm: Function;
}

const FormSelector: React.FC<FormSelectorProps> = ({ setForm }) => {
  const set = (result: String) => {
    setForm(result);
  };

  return (
    <section>
      <p>Additional forms coming soon.</p>
      <Dropdown
        options={["Form 41 | Buyer Brokerage Service Agreement"]}
        onSelect={set}
        selectName="a form"
      />
    </section>
  );
};

export default FormSelector;

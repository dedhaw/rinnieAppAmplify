import React, { useState } from "react";

interface DropdownProps {
  options: string[];
  label?: string;
  selectName?: string;
  onSelect: (selectedOption: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({
  options,
  label,
  selectName,
  onSelect,
}) => {
  const [selectedOption, setSelectedOption] = useState<string>("");

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    setSelectedOption(selectedValue);
    onSelect(selectedValue);
  };

  var sn = "an option";
  if (selectName) {
    sn = selectName;
  }

  return (
    <div className="form-group">
      <label htmlFor="dropdown">{label}</label>
      <select
        id="dropdown"
        value={selectedOption}
        onChange={handleSelectChange}
      >
        <option value="">Select {sn}</option>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;

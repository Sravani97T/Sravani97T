import React, { useState } from "react";

const options = ["Apple", "Banana", "Cherry", "Date", "Elderberry", "Fig", "Grape", "Honeydew"];

const DropdownSearch = () => {
  const [query, setQuery] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [showDropdown, setShowDropdown] = useState(false);

  const filterOptions = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (value.length >= 2) {
      const filtered = options.filter((option) => option.toLowerCase().includes(value.toLowerCase()));
      setFilteredOptions(filtered);
    } else {
      setFilteredOptions(options);
    }
    setShowDropdown(true);
  };

  const selectOption = (option) => {
    setQuery(option);
    setShowDropdown(false);
  };

  return (
    <div className="dropdown" onBlur={() => setTimeout(() => setShowDropdown(false), 200)}>
      <input 
        type="text" 
        value={query} 
        onChange={filterOptions} 
        onFocus={() => setShowDropdown(true)} 
        placeholder="Search..." 
      />
      {showDropdown && (
        <div className="dropdown-content">
          {filteredOptions.map((option, index) => (
            <div key={index} onClick={() => selectOption(option)}>
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownSearch;

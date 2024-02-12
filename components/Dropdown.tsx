import React, { useState, Dispatch, SetStateAction, useRef } from 'react';
import useClickOutside from '../lib/useClickOutside';

interface DropdownProps {
    options: { name: string, index: number }[];
    setResult: Dispatch<SetStateAction<number>>;
    location: number
}

const Dropdown: React.FC<DropdownProps> = ({ options, location, setResult }) => {
    const [selectedOption, setSelectedOption] = useState<string | null>(options[location - 1].name);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [hovered, setHovered] = useState(Array(options.length).fill(false))
    const dropdownRef = useRef(null)
    useClickOutside(dropdownRef, () => setIsDropdownOpen(false))
    const handleOptionClick = (name: string, index: number) => {
        setResult(index)
        setSelectedOption(name)
        setIsDropdownOpen(false);
    };
    const modifyHovered = (index: number, value: boolean) => {
        const newHovered = Array(options.length).fill(false)
        newHovered[index] = value
        setHovered(newHovered)
    }

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <div style={{ position: "relative", zIndex: 1, width: "93%" }}>
            <div onClick={toggleDropdown} style={{ cursor: 'pointer', border: '1px solid #ccc', padding: 5, borderRadius: '4px', zIndex: 2, backgroundColor: "white" }}>
                {selectedOption || 'Select an option'}
            </div>
            {isDropdownOpen && (
                <div ref={dropdownRef} style={{ border: '1px solid #ccc', marginTop: '4px', borderRadius: '4px', position: 'absolute', top: "100%", left: "0", zIndex: 3, maxHeight: "150px", overflowY: "auto", width: "100%", backgroundColor: "white" }}>
                    {options.map((option, i) => (
                        <div key={option.index} onMouseEnter={() => modifyHovered(i, true)} onMouseLeave={() => modifyHovered(i, false)} onClick={() => handleOptionClick(option.name, option.index)} style={{ padding: '8px', cursor: 'pointer', backgroundColor: hovered[i] ? "#F5F5F5" : "white" }}>
                            {option.name}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dropdown
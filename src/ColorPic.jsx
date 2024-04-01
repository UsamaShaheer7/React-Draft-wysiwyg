import React, { useState } from "react";
import PropTypes from "prop-types";
import { BlockPicker } from "react-color";
import { IoColorPaletteSharp } from "react-icons/io5";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
const ColorPic = ({ expanded, onExpandEvent, onChange, currentState }) => {
  const [color, setColor] = useState(currentState.color);

  const stopPropagation = (event) => {
    event.stopPropagation();
  };

  const handleChange = (selectedColor) => {
    setColor(selectedColor.hex);
    onChange("color", selectedColor.hex);
  };

  ColorPic.propTypes = {
    expanded: PropTypes.bool,
    onExpandEvent: PropTypes.func,
    onChange: PropTypes.func,
    currentState: PropTypes.object,
  };
  return (
    <div
      aria-haspopup="true"
      aria-expanded={expanded}
      aria-label="rdw-color-picker"
      className=" bg-white h-[20px] w-[30px] mt-[5px] ml-[5px]  mr-[5px] rounded-sm"
    >
      <div
        onClick={onExpandEvent}
        className=" flex justify-center items-center"
      >
        <IoColorPaletteSharp className="h-[20px] w-[20px]" />
      </div>
      {expanded ? (
        <div className=" absolute z-10 flex justify-center">
          <div onClick={stopPropagation}>
            <BlockPicker color={color} onChangeComplete={handleChange} />
          </div>
        </div>
      ) : null}
    </div>
  );
};
export default ColorPic;

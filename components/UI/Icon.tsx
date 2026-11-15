import React from "react";

interface IconProps {
  name: string;
}

export const Icon: React.FC<IconProps> = ({ name }) => {
  return (
    <svg className="i" aria-hidden="true">
      <use href={"#i-" + name} />
    </svg>
  );
};

export default Icon;

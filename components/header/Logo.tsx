import React from "react";
import { data } from "../../utilities/bookingUtils";

const Logo: React.FC = () => {
  if (data.logo_img) {
    return (
      <div
        className="logo has-img"
        role="img"
        aria-label={data.name}
        style={{ backgroundImage: `url('${data.logo_img}')` }}
      ></div>
    );
  }
  return <div className="logo">{(data.name || "").charAt(0)}</div>;
};

export default Logo;

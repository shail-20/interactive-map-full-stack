import React from "react";

const MarkerPopup = ({ info }) => {
  return (
    <div>
      <b>Information:</b> {info ? info : "No info available"}
    </div>
  );
};

export default MarkerPopup;

import React from "react";
import "@/styles/pageLoader.css";

const PageLoader = ({
  size = 90,
  toothColor = "#ffffff",
  spinnerColor = "#00adac",
  background = "#8963a1",
}) => {
  return (
    <div
      className="page-loader"
      style={{ background }}
    >
      <div
        className="spinner"
        style={{
          width: size + 40,
          height: size + 40,
          borderColor: `${spinnerColor}33`,
          borderTopColor: spinnerColor,
        }}
      >
        <div
          className="tooth"
          style={{
            width: size,
            height: size + 20,
          }}
        >
          <span
            className="crown"
            style={{ background: toothColor }}
          />
          <span
            className="root left"
            style={{ background: toothColor }}
          />
          <span
            className="root right"
            style={{ background: toothColor }}
          />
        </div>
      </div>
    </div>
  );
};

export default PageLoader;

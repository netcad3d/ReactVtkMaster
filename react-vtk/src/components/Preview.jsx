import React from "react";

const Preview = ({ files }) => {
  if (!files.length) {
    return null;
  }

  setTimeout(() => {
    window.location.reload();
  }, 4500);

  return files.map((file, index) => (
    <div
      key={index}
      className=" w-[80%] p-3 mt-5 rounded-lg border-2 border-secondary flex flex-col"
    >
      <p className="text-white text-lg">{file.originalName}</p>
      <p className="text-white text-lg">{file.size / 1000000} mb</p>
    </div>
  ));
};

export default Preview;

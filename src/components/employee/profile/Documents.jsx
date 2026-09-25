import React, { useState } from "react";

const Documents = () => {
  const [documents, setDocuments] = useState([]);

  const handleFileChange = (e) => {
    setDocuments([...documents, ...e.target.files]);
  };

  const removeFile = (index) => {
    setDocuments(documents.filter((_, i) => i !== index));
  };

  return (
    <div className="rounded-xl border bg-white p-6">

      <h2 className="mb-4 text-lg font-semibold">
        Documents
      </h2>

      <input
        type="file"
        multiple
        onChange={handleFileChange}
      />

      {documents.map((file, index) => (
        <div
          key={index}
          className="mt-3 flex justify-between border p-3"
        >
          <span>{file.name}</span>

          <button
            onClick={() => removeFile(index)}
            className="text-red-600"
          >
            Remove
          </button>
        </div>
      ))}

    </div>
  );
};

export default Documents;
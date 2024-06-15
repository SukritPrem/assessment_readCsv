import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

export const InitialPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");
  const [errorCsV, setErrorCsv] = useState([]);
  const [vFlightNo, setVFlightNo] = useState("");
  const [errorFlightNo, setErrorFlightNo] = useState("");
  const navigate = useNavigate();

  const onFileChange = useCallback((event) => {
    console.log(event);
    const file = event.target.files[0];

    if (file && file.type !== "text/csv") {
      setError("Please select a CSV file.");
      setSelectedFile(null);
    } else {
      setError("");
      setSelectedFile(file);
    }
  }, []);

  const onFileUpload = useCallback(() => {
    // Handle the file upload logic here
    if (vFlightNo.length == 0) setErrorFlightNo("This field is required");

    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);
      console.log(formData.get("file"));
      // sendData(formData.get("file"));
      fetch("http://localhost:4000/upload", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((dataInit) => {
          if (dataInit.hasOwnProperty("data")) {
            console.log("File uploaded successfully:", dataInit);
            const fileName = dataInit["file_name"];
            dataInit = dataInit["data"];
            navigate("/result", {
              state: { dataInit, fileName },
            }); // Redirect with state
          } else {
            setErrorCsv(dataInit["errors"]);
          }
        })
        .catch((error) => {
          console.error("Error uploading file:", error);
        });
    } else {
      console.error("No file selected.");
    }
  }, [selectedFile]);

  const onFlightChange = useCallback((event) => {
    const input = event.target.value;
    const regex = /^[A-Z]{2}\d+$/;
    if (input.length >= 4 && input.length <= 6 && regex.test(input)) {
      setVFlightNo(input);
      setErrorFlightNo("");
    } else {
      setErrorFlightNo("Invalid flight no format");
    }
  });

  return (
    <div>
      <h1>Initial Page</h1>
      <div>
        <div>Flight no</div>
        <input
          type="text"
          id="name"
          name="name"
          required
          minLength="2"
          maxLength="7"
          onChange={onFlightChange}
        />
      </div>
      {errorFlightNo && <div style={{ color: "red" }}>{errorFlightNo}</div>}
      <div>
        <div>CSV file</div>
        <input type="file" onChange={onFileChange} />
        <button onClick={onFileUpload}>Save</button>
      </div>
      {errorCsV &&
        errorCsV.map((value) => <div style={{ color: "red" }}>{value}</div>)}
      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>
  );
};

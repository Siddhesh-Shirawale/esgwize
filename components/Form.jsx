import React, { useState } from "react";
import axios from "axios";
import { Alert, Button, TextField } from "@mui/material";
import { styled } from "@mui/material/styles";
import CircularProgress from "@mui/material/CircularProgress";
import { TextareaAutosize } from "@mui/base/TextareaAutosize";

import UploadIcon from "@mui/icons-material/Upload";

const Form = () => {
  const [query, setQuery] = useState("");
  const [output, setOutput] = useState("");
  const [searchErr, setSearchErr] = useState("");
  const [uploadErr, setUploadErr] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [collectionName, setCollectionName] = useState("");
  const [loader, setLoader] = useState(false);
  const [uploadLoader, setUploadLoader] = useState(false);
  const [uploader, setUploader] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  const handleSearch = async () => {
    try {
      setLoader(true);
      const reqBody = {
        data: {
          messages: [
            {
              role: "system",
              content:
                "You are genie please give answers. Please look into context and response should be in less than 10 words",
            },
            { role: "user", content: query },
          ],
          model: "gpt-3.5-turbo-16k",
          collection_name: "support",
          mapping: 0,
        },
      };
      const response = await axios.post(
        "https://api.esgwizedemo.com/query_chatcompletion",
        reqBody,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjaGF0Z3B0IiwibmFtZSI6IkFnb3JkaWEiLCJpYXQiOjE2ODY4MDM2NjN9.OAU1_NdvpA7C0MfRdabbxslU3fqZfdWdxNKpP7HZRaE",
          },
        }
      );

      if (response) {
        setLoader(false);

        console.log(response);
        setOutput(response);
      }
    } catch (error) {
      setSearchErr(error.message);
      setLoader(false);
      setTimeout(() => {
        setSearchErr("");
      }, 5000);
    }
  };
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // console.log(selectedFile);

  const handleUpload = async () => {
    if (collectionName === "" || selectedFile === null) {
      setUploadErr("Please fill all fields!");

      setTimeout(() => {
        setUploadErr("");
      }, 5000);
    }

    setUploadLoader(true);
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("collection_name", "support");

    try {
      const response = await axios.post(
        "https://api.esgwizedemo.com/upsert-file",
        formData,

        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjaGF0Z3B0IiwibmFtZSI6IkFnb3JkaWEiLCJpYXQiOjE2ODY4MDM2NjN9.OAU1_NdvpA7C0MfRdabbxslU3fqZfdWdxNKpP7HZRaE",
          },
        }
      );

      if (response) {
        console.log(response);
        setUploadLoader(false);
        setUploadSuccess(true);
        setTimeout(() => {
          setUploadSuccess(false);
        }, 5000);
      }
    } catch (error) {
      setUploadLoader(false);
      console.log(error);
    }
  };
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <h3 style={{ textAlign: "center" }}>Upload/Upsert document</h3>
      <div
        style={{
          border: "1px solid black",
          padding: "20px",
          borderRadius: "8px",
          marginBottom: "50px",
          width: "500px",
        }}
      >
        {uploadErr !== "" ? <Alert severity="error">{uploadErr}</Alert> : ""}
        {uploadSuccess ? (
          <Alert severity="success">Document uploaded !</Alert>
        ) : (
          ""
        )}
        {!uploader ? (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Button
              component="span"
              variant="contained"
              onClick={() => setUploader(true)}
            >
              Upload Document
            </Button>
          </div>
        ) : (
          <>
            <div>
              <div>
                <TextField
                  id="outlined-basic"
                  label="Collection name"
                  variant="outlined"
                  value={collectionName}
                  onChange={(e) => setCollectionName(e.target.value)}
                  style={{ marginBottom: "10px", width: "100%" }}
                />
              </div>
              <div style={{ display: "flex" }}>
                <input
                  accept=".doc,.docx,.pdf,.txt" // Specify allowed file types
                  type="file"
                  id="fileInput"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
                <label htmlFor="fileInput">
                  <Button
                    component="span"
                    variant="contained"
                    style={{ marginRight: "20px" }}
                  >
                    <UploadIcon />
                  </Button>
                </label>
                <Button
                  variant="contained"
                  onClick={handleUpload}
                  disabled={!selectedFile}
                >
                  {uploadLoader ? (
                    <CircularProgress color="info" size={25} />
                  ) : (
                    "Upload"
                  )}
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
      <h3 style={{ textAlign: "center" }}>Search functionality</h3>
      {searchErr !== "" ? <Alert severity="error">{searchErr}</Alert> : ""}
      <div
        style={{
          border: "1px solid black",
          padding: "20px",
          borderRadius: "8px",
          marginBottom: "50px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ display: "flex" }}>
          <TextField
            id="outlined-basic"
            label="Search"
            variant="outlined"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ marginRight: "10px", width: "80%" }}
          />
          {/* <TextareaAutosize
            aria-label="minimum height"
            minRows={3}
            placeholder="Minimum 3 rows"
          /> */}
          <Button
            onClick={handleSearch}
            variant="contained"
            // style={{
            //   color: "white",
            //   backgroundColor: "#1688d0",
            //   borderRadius: "4px",
            //   padding: "5px",
            // }}
          >
            {!loader ? "Search" : <CircularProgress color="info" />}
          </Button>
        </div>

        <div style={{ padding: "20px" }}>
          {output ? output : "Output will be visible here."}
        </div>
      </div>
    </div>
  );
};

export default Form;

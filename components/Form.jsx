import React, { Fragment, useState, useRef, useEffect } from "react";
import axios from "axios";
import { Alert, Button, Divider, TextField } from "@mui/material";
import { styled } from "@mui/material/styles";
import CircularProgress from "@mui/material/CircularProgress";
import { TextareaAutosize } from "@mui/base/TextareaAutosize";
import "./Form.module.scss";
import UploadIcon from "@mui/icons-material/Upload";
import MessageComponent from "./MessageComponent";

const Form = () => {
  const [query, setQuery] = useState("");
  const [output, setOutput] = useState([]);
  const [searchErr, setSearchErr] = useState("");
  const [uploadErr, setUploadErr] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const [collectionName, setCollectionName] = useState("");
  const [queryCollectionName, setQueryCollectionName] = useState("");
  const [loader, setLoader] = useState(false);
  const [uploadLoader, setUploadLoader] = useState(false);
  const [uploader, setUploader] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const chatContainerRef = useRef(null);
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  const handleSearch = async () => {
    try {
      setLoader(true);

      const messageBody = {
        role: "user",
        content: query,
        id: new Date().valueOf(),
      };

      setOutput((prev) => [...prev, messageBody]);
      const reqBody = {
        data: {
          messages: [
            {
              role: "system",
              content:
                "You are genie please give answers. Please look into context and provide appropriate response",
            },
            { role: "user", content: query },
          ],
          model: "gpt-3.5-turbo-16k",
          collection_name: queryCollectionName,
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

        // console.log(response);
        setOutput((prev) => [
          ...prev,
          {
            role: "assistant",
            content: response?.["data"],
            id: new Date().valueOf(),
          },
        ]);

        // scrollToBottom();
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

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      // Call your search function here, e.g., search(searchTerm);
      handleSearch();
    }
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

    const collectionNameId = collectionName + new Date().valueOf();
    console.log(collectionNameId);
    setQueryCollectionName(collectionNameId);
    formData.append("collection_name", collectionNameId);

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
        // console.log(response);
        setUploadLoader(false);
        setSuccessMsg(
          `New collection created with collection id - ${collectionNameId}`
        );
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

  const clearAllMessages = () => {
    setOutput([]);
  };

  useEffect(() => {
    scrollToBottom();
  }, [output]);
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
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
        {uploadSuccess ? <Alert severity="success">{successMsg}</Alert> : ""}
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
          width: "90%",
        }}
      >
        <div
          style={{ display: "flex", flexDirection: "column", width: "100%" }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <TextField
              id="outlined-basic"
              label="Collection name"
              variant="outlined"
              value={queryCollectionName}
              onChange={(e) => setQueryCollectionName(e.target.value)}
              style={{ width: "50%" }}
            />
            <Button size="small" variant="contained" onClick={clearAllMessages}>
              Clear
            </Button>
          </div>
          <Divider />

          <div
            ref={chatContainerRef}
            style={{ height: "400px", width: "100%", overflowY: "auto" }}
          >
            {output?.map((data) => (
              <Fragment key={data?.["id"]}>
                <MessageComponent message={data} />
              </Fragment>
            ))}
          </div>

          <div style={{ display: "flex" }}>
            <TextField
              id="outlined-basic"
              label="Search"
              variant="outlined"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyPress}
              style={{ marginRight: "10px", width: "90%" }}
            />
            <Button
              onClick={handleSearch}
              variant="contained"
              style={{ width: "100px" }}
            >
              {!loader ? "Search" : <CircularProgress color="info" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Form;

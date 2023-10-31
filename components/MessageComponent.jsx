import React from "react";
import styles from "./Form.module.scss";
const MessageComponent = ({ message }) => {
  return (
    <>
      {message?.["role"] === "assistant" ? (
        <div
          className={styles.chat}
          style={{
            minHeight: "50px",
            display: "flex",
            justifyContent: "flex-start",
            margin: "20px auto",
          }}
        >
          <div className={styles.msgreceived}>{message?.["content"]}</div>
        </div>
      ) : (
        <div
          style={{
            minHeight: "50px",
            display: "flex",
            justifyContent: "flex-end",
            margin: "20px auto",
          }}
        >
          <div className={styles.msgsent}>{message?.["content"]}</div>
        </div>
      )}
    </>
  );
};

export default MessageComponent;

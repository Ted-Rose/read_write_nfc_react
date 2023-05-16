import React, { useEffect } from "react";

const Nfc = () => {
  useEffect(() => {
    const log = (...args) => {
      const line = args
        .map((argument) =>
          typeof argument === "string" ? argument : JSON.stringify(argument)
        )
        .join(" ");

      document.querySelector("#log").textContent += line + "\n";
    };

    const setStatus = (status) => {
      document.querySelector("#status").textContent = status;
    };

    const setContent = (newContent) => {
      const content = document.querySelector("#content");
      while (content.hasChildNodes()) {
        content.removeChild(content.lastChild);
      }
      content.appendChild(newContent);
    };

    const scanButton = document.querySelector("#scanButton");

    if (!("NDEFReader" in window))
      setStatus("Web NFC is not available. Use Chrome on Android.");

    scanButton.addEventListener("click", async () => {
      log("User clicked scan button");

      try {
        const ndef = new NDEFReader();
        await ndef.scan();
        log("> Scan started");

        ndef.addEventListener("readingerror", () => {
          log("Argh! Cannot read data from the NFC tag. Try another one?");
        });

        ndef.addEventListener("reading", ({ message, serialNumber }) => {
          log(`> Serial Number: ${serialNumber}`);
          log(`> Records: (${message.records.length})`);
        });
      } catch (error) {
        log("Argh! " + error);
      }
    });
  }, []);

  return (
    <div className="output">
      <div id="content"></div>
      <div id="status"></div>
      <pre id="log"></pre>
      <button id="scanButton">Scan</button>
    </div>
  );
};

export default Nfc;

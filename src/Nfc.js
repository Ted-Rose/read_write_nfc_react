import React, { useEffect, useState } from "react";

const Nfc = () => {
  const [serialNumber, setSerialNumber] = useState("");

  const my_array = [
    {
      key: "Vārds",
      value: "Dāvids",
    },
    {
      key: "NFC_numurs",
      value: "04:89:d0:3a:4b:11:90",
    },
    {
      key: "Nauda",
      value: 150,
    },
    {
      key: "Vārds",
      value: "John",
    },
    {
      key: "NFC_numurs",
      value: "03:ab:cd:ef:12:34:56",
    },
    {
      key: "Nauda",
      value: 200,
    },
  ];

  function getNaudaAndVards(serialNumber) {
    serialNumber = "04:89:d0:3a:4b:11:90";
    const item = Object.entries(my_array).find(([key]) => key === serialNumber);

    if (item) {
      const { Nauda, Vārds } = item;
      return (
        <div>
          <p>Nauda: {Nauda}</p>
          <p>Vārds: {Vārds}</p>
        </div>
      );
    } else {
      return <p>Item not found.</p>;
    }
  }

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
          log(`> Tavas NFC kartes nr ir: ${serialNumber}`);
          setSerialNumber({ serialNumber });
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
      {getNaudaAndVards(serialNumber)}
      <button id="scanButton">Scan</button>
    </div>
  );
};

export default Nfc;

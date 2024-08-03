import { ChangeEvent, useState } from "react";
import github from "./assets/github.svg";
import "./App.css";

interface IngredientHealthData {
  ingredient: string;
  health_score: string;
  explanation: string;
  banned_in: string[];
  preservative: boolean;
  causes_allergic_reaction: boolean;
  causes_digestive_issues: boolean;
}

interface IngredientsHealthData {
  [ingredientName: string]: IngredientHealthData;
}

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showFullDetail, setShowFullDetail] = useState<boolean>(false);
  const [ingredientMetricNames] = useState<string[]>([
    "banned_in",
    "preservative",
    "causes_allergic_reaction",
    "causes_digestive_issues",
  ]);

  const [ingredientHealthData, setIngredientHealthData] =
    useState<IngredientsHealthData | null>(null);

  const analyseIngredients = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/ingredient", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        if (result.ingredientHealthData != null) {
          setIngredientHealthData(result.ingredientHealthData);
        }
        console.log("File uploaded successfully:", result);
      } else {
        console.error("File upload failed:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fileInputHandler = async (event: ChangeEvent<HTMLInputElement>) => {
    const file: File | null = event.target.files?.item(0)
      ? event.target.files?.item(0)
      : null;

    if (file != null) {
      setSelectedFile(file);
      await analyseIngredients(file);
    }
  };

  const getIngredientMetricValue = (ingredientMetricName: string) => {
    if (ingredientHealthData == null) return;

    if (ingredientMetricName === "banned_in") {
      let totalBannedIngredients = 0;
      Object.keys(ingredientHealthData).forEach((ingredientName) => {
        if (ingredientHealthData[ingredientName].banned_in.length > 0) {
          totalBannedIngredients = totalBannedIngredients + 1;
        }
      });
      return (
        <tr style={{ fontSize: "0.7rem" }}>
          <td style={{ textAlign: "left" }}>No. of banned ingredients:</td>
          <td style={{ textAlign: "center" }}>{totalBannedIngredients}</td>
        </tr>
      );
    }

    if (ingredientMetricName === "preservative") {
      let totalPreservativeIngredients = 0;
      Object.keys(ingredientHealthData).forEach((ingredientName) => {
        if (ingredientHealthData[ingredientName].preservative === true) {
          totalPreservativeIngredients = totalPreservativeIngredients + 1;
        }
      });
      return (
        <tr style={{ fontSize: "0.7rem" }}>
          <td style={{ textAlign: "left" }}>No. of Preservatives:</td>
          <td style={{ textAlign: "center" }}>
            {totalPreservativeIngredients}
          </td>
        </tr>
      );
    }

    if (ingredientMetricName === "causes_allergic_reaction") {
      let totalAllergicIngredients = 0;
      Object.keys(ingredientHealthData).forEach((ingredientName) => {
        if (
          ingredientHealthData[ingredientName].causes_allergic_reaction === true
        ) {
          totalAllergicIngredients = totalAllergicIngredients + 1;
        }
      });
      return (
        <tr style={{ fontSize: "0.7rem" }}>
          <td style={{ textAlign: "left" }}>No. of Potential Allergens:</td>
          <td style={{ textAlign: "center" }}>{totalAllergicIngredients}</td>
        </tr>
      );
    }

    if (ingredientMetricName === "causes_digestive_issues") {
      let totalDigestiveIssueIngredients = 0;
      Object.keys(ingredientHealthData).forEach((ingredientName) => {
        if (
          ingredientHealthData[ingredientName].causes_digestive_issues === true
        ) {
          totalDigestiveIssueIngredients = totalDigestiveIssueIngredients + 1;
        }
      });
      return (
        <tr style={{ fontSize: "0.7rem" }}>
          <td style={{ textAlign: "left" }}>No. of Digestive Irritants:</td>
          <td style={{ textAlign: "center" }}>
            {totalDigestiveIssueIngredients}
          </td>
        </tr>
      );
    }

    return null;
  };

  const getIngredientFullRecord = (ingredientName: string) => {
    if (ingredientHealthData == null) return null;
    console.log("adding record for ", ingredientName);

    return (
      <tr
        style={{
          fontSize: "0.6rem",
          marginBottom: "0.25rem",
          marginTop: "0.25rem",
        }}
      >
        <td
          style={{ textAlign: "center" }}
          title={ingredientHealthData[ingredientName].explanation}
        >
          {ingredientName}
        </td>
        <td style={{ textAlign: "center" }}>
          {ingredientHealthData[ingredientName].health_score}
        </td>
        <td style={{ textAlign: "center" }}>
          {`${ingredientHealthData[ingredientName].preservative}`}
        </td>
        <td
          style={{ textAlign: "center" }}
          title={`${ingredientHealthData[ingredientName].banned_in.join(", ")}`}
        >
          {`${ingredientHealthData[ingredientName].banned_in.length}`}
        </td>
        <td style={{ textAlign: "center" }}>
          {`${ingredientHealthData[ingredientName].causes_allergic_reaction}`}
        </td>
        <td style={{ textAlign: "center" }}>
          {`${ingredientHealthData[ingredientName].causes_digestive_issues}`}
        </td>
      </tr>
    );
  };

  const reset = () => {
    setSelectedFile(null);
    setShowFullDetail(false);
    setIngredientHealthData(null);
  };

  return (
    <>
      <div
        style={{
          width: "100%",
          height: "10%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "left",
            gap: 5,
            alignItems: "center",
          }}
        >
          <h1
            style={{
              fontSize: "1.3rem",
              fontWeight: "bold",
              fontFamily: "'Krona One', sans-serif",
            }}
          >
            DIET HUB |
          </h1>
          <h2
            style={{
              fontSize: "0.8rem",
              fontWeight: "normal",
              fontFamily: "Michroma, sans-serif",
              letterSpacing: "1.5pt",
            }}
          >
            {" "}
            AI Ingredient Analyzer
          </h2>
        </div>
        <img src={github} width={"30px"} height={"30px"} />
      </div>

      {selectedFile ? (
        <div
          style={{
            width: "80%",
            height: "85%",
            margin: "auto",
            display: "flex",
            flexDirection: "row",
            gap: 10,
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
          }}
        >
          {ingredientHealthData && showFullDetail ? (
            <div
              style={{
                position: "absolute",
                top: "0",
                left: "0",
                height: "100%",
                width: "100%",
                overflow: "scroll",
                backgroundColor: "black",
                zIndex: 1000,
                padding: "1rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "1rem",
                }}
              >
                <p style={{ fontSize: "1rem" }}>Full Analysis Result: </p>
                <button
                  style={{ fontSize: "0.6rem" }}
                  onClick={() => {
                    setShowFullDetail(false);
                  }}
                >
                  Close
                </button>
              </div>
              <table style={{ flex: 1, width: "100%", borderRadius: "7px" }}>
                <tr
                  style={{
                    borderBottom: "1px solid white",
                    fontSize: "0.6rem",
                    color: "#4fccff",
                    letterSpacing: "1pt",
                    marginBottom: "0.25rem",
                    marginTop: "0.25rem",
                  }}
                >
                  <th style={{ textAlign: "center", fontWeight: "bold" }}>
                    Ingredient
                  </th>
                  <th style={{ textAlign: "center", fontWeight: "bold" }}>
                    Score
                  </th>
                  <th style={{ textAlign: "center", fontWeight: "bold" }}>
                    Preservative
                  </th>
                  <th style={{ textAlign: "center", fontWeight: "bold" }}>
                    Banned
                  </th>
                  <th style={{ textAlign: "center", fontWeight: "bold" }}>
                    Allergen
                  </th>
                  <th style={{ textAlign: "center", fontWeight: "bold" }}>
                    Digestive Irritant
                  </th>
                </tr>
                {Object.keys(ingredientHealthData).map((ingredientName) => {
                  return getIngredientFullRecord(ingredientName);
                })}
              </table>
            </div>
          ) : null}

          <div
            style={{
              position: "relative",
              flex: 1,
              height: "70vh",
              objectFit: "contain",
            }}
          >
            <img
              src={URL.createObjectURL(selectedFile)}
              width={"100%"}
              height={"100%"}
              style={{
                objectFit: "contain",
                opacity: "0.5",
                borderRadius: "7px",
                animation:
                  ingredientHealthData == null ? "fade 3s infinite" : undefined,
              }}
            />
          </div>
          {ingredientHealthData ? (
            <div style={{ flex: 1 }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                <button
                  style={{ fontSize: "0.6rem" }}
                  onClick={() => {
                    setShowFullDetail(true);
                  }}
                >
                  Full Result
                </button>
                <button style={{ fontSize: "0.6rem" }} onClick={reset}>
                  New
                </button>
                <button
                  style={{ fontSize: "0.6rem" }}
                  onClick={async () => {
                    setShowFullDetail(false);
                    setIngredientHealthData(null);
                    await analyseIngredients(selectedFile);
                  }}
                >
                  Retry
                </button>
              </div>
              <p
                style={{
                  width: "100%",
                  color: "skyblue",
                  fontSize: "0.8rem",
                  textAlign: "center",
                  letterSpacing: "1pt",
                }}
              >
                Statistics:
              </p>
              <table style={{ margin: "auto", letterSpacing: "1pt" }}>
                {ingredientMetricNames.map((ingredientMetricName) => {
                  return getIngredientMetricValue(ingredientMetricName);
                })}
              </table>
            </div>
          ) : null}
        </div>
      ) : (
        <div
          style={{
            width: "80%",
            height: "85%",
            margin: "auto",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <p>
            Upload a picture of ingredients list on any food package to find out
            each ingredient’s health information.
          </p>
          <input type="file" accept="image/*" onChange={fileInputHandler} />
        </div>
      )}
      <footer
        style={{
          maxHeight: "5%",
          overflow: "hidden",
          fontSize: "0.7rem",
          letterSpacing: "1pt",
        }}
      >
        <p>
          built by <a href="https://prashantsihag.com">Prashant Sihag</a>
        </p>
      </footer>
    </>
  );
}

export default App;

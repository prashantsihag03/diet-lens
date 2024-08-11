import { ChangeEvent, useState } from "react";
import "./App.css";
import Footer from "./Footer";
import IngredientAnalyserForm from "./IngredientAnalyserForm";
import Header from "./Header";
import AnalysisStatus from "./AnalysisStatus";
import AnalysisFullTable, { IngredientsHealthData } from "./AnalysisFullTable";
import ImageDisplay from "./ImageDisplay";
import AnalysisMetrics from "./AnalysisMetrics";

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showFullDetail, setShowFullDetail] = useState<boolean>(false);
  const [analysisStatus, setAnalysisStatus] = useState<string | null>(null);
  const [statusColor, setStatusColor] = useState<"green" | "maroon">("green");

  const [ingredientHealthData, setIngredientHealthData] =
    useState<IngredientsHealthData | null>(null);

  const analyseIngredients = async (file: File) => {
    setAnalysisStatus(null);
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
        setAnalysisStatus(null);
        return;
      } else {
        if (response.status === 429) {
          setAnalysisStatus(
            "Too many requests. Please try again after some time."
          );
          setStatusColor("maroon");
          return;
        }
        if (response.status === 415) {
          setAnalysisStatus(
            "Unsupported media type provided. Please try again with 'jpg', 'jpeg', or 'png' image."
          );
          setStatusColor("maroon");
          return;
        }
        setAnalysisStatus("Failed. Please try again");
        setStatusColor("maroon");
      }
    } catch (error) {
      setAnalysisStatus("Error. Please try again later.");
      setStatusColor("maroon");
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

  const reset = () => {
    setSelectedFile(null);
    setShowFullDetail(false);
    setIngredientHealthData(null);
  };

  return (
    <>
      <Header />
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
          {analysisStatus != null ? (
            <AnalysisStatus
              color={statusColor}
              status={analysisStatus}
              actionHandler={reset}
              actiontext="Retry"
            />
          ) : null}

          {ingredientHealthData && showFullDetail ? (
            <AnalysisFullTable
              ingredientHealthData={ingredientHealthData}
              onClose={() => {
                setShowFullDetail(false);
              }}
            />
          ) : null}

          <ImageDisplay
            animate={ingredientHealthData == null && analysisStatus == null}
            imgFile={selectedFile}
          />

          {ingredientHealthData ? (
            <div style={{ flex: 1 }}>
              <AnalysisMetrics ingredientHealthData={ingredientHealthData} />
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 5,
                  paddingTop: "3rem",
                }}
              >
                <button
                  style={{ fontSize: "0.6rem", letterSpacing: "1pt" }}
                  onClick={() => {
                    setShowFullDetail(true);
                  }}
                >
                  Full Result
                </button>
                <button
                  style={{ fontSize: "0.6rem", letterSpacing: "1pt" }}
                  onClick={reset}
                >
                  New
                </button>
                <button
                  style={{ fontSize: "0.6rem", letterSpacing: "1pt" }}
                  onClick={async () => {
                    setShowFullDetail(false);
                    setIngredientHealthData(null);
                    await analyseIngredients(selectedFile);
                  }}
                >
                  Retry
                </button>
              </div>
            </div>
          ) : null}
        </div>
      ) : (
        <IngredientAnalyserForm fileInputHandler={fileInputHandler} />
      )}
      <Footer />
    </>
  );
}

export default App;

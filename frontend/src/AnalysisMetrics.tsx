import { ReactNode, useState } from "react";
import { IngredientsHealthData } from "./AnalysisFullTable";

const AnalysisMetrics: React.FC<{
  ingredientHealthData: IngredientsHealthData;
}> = ({
  ingredientHealthData,
}: {
  ingredientHealthData: IngredientsHealthData;
}) => {
  const [activeTableTitle, setActiveTableTitle] = useState<string | null>(null);
  const [ingredientMetricNames] = useState<string[]>([
    "banned_in",
    "preservative",
    "causes_allergic_reaction",
    "causes_digestive_issues",
  ]);

  const createMetricRow = (
    ingredientMetricName: string,
    metricDisplayValue: string,
    metricValue: number
  ) => {
    return (
      <tr
        className="metricRow"
        onClick={() => {
          setActiveTableTitle(ingredientMetricName);
        }}
      >
        <td style={{ textAlign: "left", padding: "0.5rem 1rem" }}>
          {metricDisplayValue}
        </td>
        <td style={{ textAlign: "center", padding: "0.5rem 1rem" }}>
          {metricValue}
        </td>
      </tr>
    );
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
      return createMetricRow(
        ingredientMetricName,
        "No. of banned ingredients:",
        totalBannedIngredients
      );
    }

    if (ingredientMetricName === "preservative") {
      let totalPreservativeIngredients = 0;
      Object.keys(ingredientHealthData).forEach((ingredientName) => {
        if (ingredientHealthData[ingredientName].preservative === true) {
          totalPreservativeIngredients = totalPreservativeIngredients + 1;
        }
      });
      return createMetricRow(
        ingredientMetricName,
        "No. of Preservatives:",
        totalPreservativeIngredients
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
      return createMetricRow(
        ingredientMetricName,
        "No. of Potential Allergens:",
        totalAllergicIngredients
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
      return createMetricRow(
        ingredientMetricName,
        "No. of Digestive Irritants:",
        totalDigestiveIssueIngredients
      );
    }

    return null;
  };

  const createMetricDetailTable = (records: ReactNode, headers?: string[]) => {
    return (
      <table
        style={{
          width: "90%",
          letterSpacing: "1pt",
          backgroundColor: "#101010",
          padding: "1rem",
          color: "#a0a0a0",
          borderCollapse: "separate",
          borderSpacing: "12px 25px",
          fontFamily: "sans-serif",
        }}
      >
        {headers ? (
          <tr style={{ color: "skyblue" }}>
            {headers.map((header) => (
              <th>{header}</th>
            ))}
          </tr>
        ) : null}
        {records}
      </table>
    );
  };

  const getIngredientMetricDetailValue = (ingredientMetricName: string) => {
    if (ingredientMetricName === "banned_in") {
      return createMetricDetailTable(
        Object.keys(ingredientHealthData)
          .filter(
            (ingredientName) =>
              ingredientHealthData[ingredientName].banned_in.length > 0
          )
          .map((ingredientName) => {
            return (
              <tr>
                <td>{ingredientName}</td>
                <td>
                  {ingredientHealthData[ingredientName].banned_in.join(", ")}
                </td>
                <td>{ingredientHealthData[ingredientName].explanation}</td>
              </tr>
            );
          }),
        ["Ingredient", "Banned in", "Description"]
      );
    }

    if (ingredientMetricName === "preservative") {
      return createMetricDetailTable(
        Object.keys(ingredientHealthData)
          .filter(
            (ingredientName) =>
              ingredientHealthData[ingredientName].preservative
          )
          .map((ingredientName) => {
            return (
              <tr>
                <td>{ingredientName}</td>
                <td>{ingredientHealthData[ingredientName].explanation}</td>
              </tr>
            );
          }),
        ["Ingredient", "Description"]
      );
    }

    if (ingredientMetricName === "causes_allergic_reaction") {
      return createMetricDetailTable(
        Object.keys(ingredientHealthData)
          .filter(
            (ingredientName) =>
              ingredientHealthData[ingredientName].causes_allergic_reaction
          )
          .map((ingredientName) => {
            return (
              <tr>
                <td>{ingredientName}</td>
                <td>{ingredientHealthData[ingredientName].explanation}</td>
              </tr>
            );
          }),
        ["ingredient", "Description"]
      );
    }

    if (ingredientMetricName === "causes_digestive_issues") {
      return createMetricDetailTable(
        Object.keys(ingredientHealthData)
          .filter(
            (ingredientName) =>
              ingredientHealthData[ingredientName].causes_digestive_issues
          )
          .map((ingredientName) => {
            return (
              <tr>
                <td>{ingredientName}</td>
                <td>{ingredientHealthData[ingredientName].explanation}</td>
              </tr>
            );
          }),
        ["ingredient", "Description"]
      );
    }
    return ingredientMetricName;
  };

  return (
    <>
      {activeTableTitle != null ? (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: "black",
            zIndex: 10000,
            overflow: "scroll",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "90%",
              letterSpacing: "1pt",
              backgroundColor: "#101010",
              padding: "0rem 1rem",
              position: "sticky",
              top: "0%",
            }}
          >
            <p style={{ textTransform: "capitalize", fontSize: "1.2rem" }}>
              {activeTableTitle.replace(/_/g, " ")}
            </p>
            <button
              style={{
                margin: "auto",
                marginRight: 0,
                marginLeft: 0,
                fontSize: "0.8rem",
                backgroundColor: "whitesmoke",
                color: "black",
              }}
              onClick={() => {
                setActiveTableTitle(null);
              }}
            >
              Close
            </button>
          </div>
          {getIngredientMetricDetailValue(activeTableTitle)}
        </div>
      ) : null}
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
      <table
        style={{
          letterSpacing: "1pt",
          width: "100%",
          padding: "0rem 1rem",
          borderCollapse: "separate",
          borderSpacing: "2px 5px",
        }}
      >
        {ingredientMetricNames.map((ingredientMetricName) => {
          return getIngredientMetricValue(ingredientMetricName);
        })}
      </table>
    </>
  );
};

export default AnalysisMetrics;

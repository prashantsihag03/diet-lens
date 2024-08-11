export interface IngredientHealthData {
  ingredient: string;
  health_score: string;
  explanation: string;
  banned_in: string[];
  preservative: boolean;
  causes_allergic_reaction: boolean;
  causes_digestive_issues: boolean;
}

export interface IngredientsHealthData {
  [ingredientName: string]: IngredientHealthData;
}

interface AnalysisFullTableProps {
  ingredientHealthData: IngredientsHealthData;
  onClose?: () => void;
}

const AnalysisFullTable: React.FC<AnalysisFullTableProps> = ({
  ingredientHealthData,
  onClose,
}: AnalysisFullTableProps) => {
  const getIngredientFullRecord = (ingredientName: string) => {
    if (ingredientHealthData == null) return null;

    return (
      <tr
        style={{
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

  return (
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
          position: "sticky",
          top: "0%",
          backgroundColor: "black",
        }}
      >
        <p style={{ fontSize: "1rem" }}>Full Analysis Result: </p>
        <button
          style={{ fontSize: "0.6rem" }}
          onClick={() => {
            onClose ? onClose() : null;
          }}
        >
          Close
        </button>
      </div>
      <table
        style={{
          flex: 1,
          width: "100%",
          borderRadius: "7px",
          fontSize: "0.6rem",
        }}
      >
        <tr
          style={{
            borderBottom: "1px solid white",
            color: "#4fccff",
            letterSpacing: "1pt",
            marginBottom: "0.25rem",
            marginTop: "0.25rem",
          }}
        >
          <th style={{ textAlign: "center", fontWeight: "bold" }}>
            Ingredient
          </th>
          <th style={{ textAlign: "center", fontWeight: "bold" }}>Score</th>
          <th style={{ textAlign: "center", fontWeight: "bold" }}>
            Preservative
          </th>
          <th style={{ textAlign: "center", fontWeight: "bold" }}>Banned</th>
          <th style={{ textAlign: "center", fontWeight: "bold" }}>Allergen</th>
          <th style={{ textAlign: "center", fontWeight: "bold" }}>
            Digestive Irritant
          </th>
        </tr>
        {Object.keys(ingredientHealthData).map((ingredientName) => {
          return getIngredientFullRecord(ingredientName);
        })}
      </table>
    </div>
  );
};

export default AnalysisFullTable;

import { ChangeEvent } from "react";

const IngredientAnalyserForm: React.FC<{
  fileInputHandler: (event: ChangeEvent<HTMLInputElement>) => Promise<void>;
}> = ({
  fileInputHandler,
}: {
  fileInputHandler: (event: ChangeEvent<HTMLInputElement>) => Promise<void>;
}) => {
  return (
    <div
      style={{
        width: "90%",
        height: "85%",
        margin: "auto",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        letterSpacing: "1pt",
      }}
    >
      <p>
        Upload a picture of ingredients list on any food package to find out
        each ingredient’s health information.
      </p>
      <p style={{ fontSize: "0.6rem" }}>
        Supported image formats are "jpg", "jpeg" or "png" with file size no
        more than 1 MB.
      </p>

      <input
        type="file"
        accept="image/jpg, image/jpeg, image/png"
        onChange={fileInputHandler}
        style={{ textAlign: "center", padding: "1rem", color: "steelblue" }}
      />
    </div>
  );
};

export default IngredientAnalyserForm;

interface AnalysisStatusProps {
  status: string | null;
  color: "green" | "maroon";
  actionHandler?: () => void;
  actiontext?: string;
}

const AnalysisStatus: React.FC<AnalysisStatusProps> = ({
  status,
  color,
  actionHandler,
  actiontext,
}: AnalysisStatusProps) => {
  return (
    <p
      style={{
        position: "absolute",
        padding: "1rem",
        zIndex: 1000,
        backgroundColor: color,
        borderRadius: "7px",
        fontSize: "0.6rem",
        letterSpacing: "1pt",
        top: 0,
      }}
    >
      {status}
      {color === "maroon" && actionHandler != null && actiontext ? (
        <>
          {". "}
          <a
            onClick={() => {
              actionHandler();
            }}
            style={{
              letterSpacing: "1pt",
              fontSize: "0.6rem",
              textDecorationLine: "underline",
              color: "skyblue",
            }}
          >
            {actiontext}
          </a>
        </>
      ) : null}
    </p>
  );
};

export default AnalysisStatus;

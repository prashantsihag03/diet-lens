import github from "./assets/github.svg";

const Header: React.FC = () => {
  return (
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
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <h1
          style={{
            margin: "0",
            padding: "0",
            fontSize: "1.3rem",
            fontWeight: "bold",
            fontFamily: "'Krona One', sans-serif",
          }}
        >
          DIET LENS
        </h1>
        <h2
          style={{
            margin: "0",
            padding: "0",
            fontSize: "0.8rem",
            fontWeight: "normal",
            fontFamily: "Michroma, sans-serif",
            letterSpacing: "1.5pt",
          }}
        >
          {" * "}
          AI Ingredient Analyzer
        </h2>
      </div>
      <a href="https://github.com/prashantsihag03/diet-lens">
        <img src={github} width={"30px"} height={"30px"} />
      </a>
    </div>
  );
};

export default Header;

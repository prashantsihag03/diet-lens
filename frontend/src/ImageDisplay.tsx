const ImageDisplay: React.FC<{
  imgFile: File;
  animate: boolean;
}> = ({ imgFile, animate }: { imgFile: File; animate: boolean }) => {
  return (
    <div
      style={{
        position: "relative",
        flex: 1,
        height: "70vh",
        objectFit: "contain",
      }}
    >
      <img
        src={URL.createObjectURL(imgFile)}
        width={"100%"}
        height={"100%"}
        style={{
          objectFit: "contain",
          opacity: "0.5",
          borderRadius: "7px",
          animation: animate ? "fade 3s infinite" : undefined,
        }}
      />
    </div>
  );
};

export default ImageDisplay;

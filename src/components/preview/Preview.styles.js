export const styles = theme => ({
  placeholder: {
    textAlign: "center",
    zIndex: 9999,
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "&::after": {
      content: '""',
      background: "rgba(0, 0, 0, 0.2)",
      position: "absolute",
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      zIndex: -1
    }
  },
  selectors: {
    position: "fixed",
    left: 20,
    top: 20,
    background: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 10
  },
  select: {
    width: 80,
    "&:not(:last-of-type)": {
      marginRight: 10
    }
  }
});

import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { useColorMode, Button, Container } from "@chakra-ui/react";

export default function AdminToggleTheme() {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Container
      style={{
        position: "fixed",
        bottom: "1rem",
        right: "1rem",
        zIndex: 100,
        backgroundColor: colorMode === "light" ? "black" : "white",
        padding: "10px",
        borderRadius: "50%",
        width: "50px",
        height: "50px",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "1.5rem",
        fontWeight: "bold",
        color: colorMode === "light" ? "white" : "black",
        textAlign: "center",
        cursor: "pointer",
        userSelect: "none",
        outline: "none",
        transition: "all 0.3s ease-in-out",
      }}
      onClick={toggleColorMode}
    >
      <Button
        style={{
          backgroundColor: "transparent",
        }}
      >
        {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
      </Button>
    </Container>
  );
}

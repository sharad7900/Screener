import { Button, Input, useMediaQuery, Box, Flex } from "@chakra-ui/react";
import { TypeAnimation } from "react-type-animation";
import Footer from "./Footer";
import { useNavigate } from "react-router";
import { useState } from "react";
import finalTable from "./Final_Table.json";
import { BiSearch } from "react-icons/bi";
import ListOfSearch from "./ListOfSearch";
import "./Welcome.css";
import Navbar from "./Navbar";

const Welcome = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredFunds, setFilteredFunds] = useState([]);
  const [isMobile] = useMediaQuery("(max-width: 600px)");
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/Screens");
  };

  const fundNames = Object.values(finalTable).map((fund) => Object.keys(fund)[0]);
  const NameToId = Object.fromEntries(
    Object.entries(finalTable).map(([id, obj]) => [Object.keys(obj)[0], id])
  );

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.trim() === "") setFilteredFunds([]);
    else
      setFilteredFunds(
        fundNames.filter((name) =>
          name.toLowerCase().includes(value.toLowerCase())
        )
      );
  };

  return (
    <div className="page-wrapper">
      <div className="bgimage mainContent">
        <Navbar/>
        <Flex
          direction="column"
          align="center"
          justify="center"
          minH="80vh"
          position="relative"
        >
          <Box
            className="animationType glassmorph"
            mt={isMobile ? "7vh" : "5vh"}
            mb={isMobile ? "5vh" : "4vh"}
          >
            <span className="mainHeading" style={{paddingRight:"0.8vh"}}>Find the right pick with </span>
            <TypeAnimation
  style={{
    fontWeight: "bold",
    fontSize: isMobile ? "1.6rem" : "2.7rem",
    fontFamily: "Montserrat",
    background: "linear-gradient(90deg, #00eeff, #FFD700, #ff1493 90%)",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    color: "transparent",
    WebkitTextFillColor: "transparent",
    textShadow: "0 2px 12px rgba(0,0,0,0.16)",
    display: "inline-block",
  }}
  sequence={[
    " Mutual Fund Screener",
  ]}
  speed={30}
/>

          </Box>
          <Box className="txt glassmorph">
            The tool you need to make wise & effective investment decisions
          </Box>
          <Box
            className="EnterBTN glassmorph"
            mt={isMobile ? "6vh" : "8vh"}
            mb={isMobile ? "4vh" : "6vh"}
          >
            <Button
              p={[2, 4]}
              pt={[3, 5]}
              pb={[3, 5]}
              fontSize={["1rem", "1.1rem", "1.2rem"]}
              borderRadius={["12px", "18px"]}
              width={["90vw", "auto"]}
              background="linear-gradient(90deg, #ef32d9 0%, #89fffd 100%)"
              color="black"
              boxShadow="0 2px 8px rgba(172, 31, 255, 0.25)"
              _hover={{
                background: "linear-gradient(90deg, #b400ff 0%, #6e27ff 100%)",
                color: "#fff",
                transform: "scale(1.05)",
              }}
              onClick={handleClick}
              transition="all 0.3s"
            >
              Enter in Screener &rarr;
            </Button>
          </Box>
          <Box className="searchbox glassmorph" mt={isMobile ? "4vh" : "10vh"} width={isMobile ? "96vw" : "440px"}>
            <p
              style={{
                color: "black",
                textAlign: "center",
                paddingTop: "2%",
                fontWeight: "600",
                letterSpacing: "1px",
              }}
            >
              Search the scheme name:
            </p>
            <Flex className="searchinput" align="center" mt={2}>
              <BiSearch color="black" size={22} />
              <Input
                placeholder="Search Mutual Fund Scheme"
                value={searchTerm}
                onChange={handleSearchChange}
                border="none"
                color="black"
                fontSize={isMobile ? "1rem" : "1.06rem"}
                ml={2}
                p={2}
                bg="transparent"
              />
            </Flex>
            {filteredFunds.length > 0 && (
              <div
                style={{
                  margin: isMobile ? "2% 2% 0% 2%" : "2% 15% 0% 15%",
                  backgroundColor: "rgba(255,255,255,0.98)",
                  padding: "1%",
                  borderRadius: "16px",
                  maxHeight: isMobile ? "110px" : "200px",
                  overflowY: "scroll",
                  border: "2px solid #b400ff",
                  boxShadow: "0 2px 12px rgba(140,140,140,0.12)",
                  zIndex: 2,
                  position: "relative",
                }}
              >
                <ListOfSearch params={{ filteredFunds, NameToId }} />
              </div>
            )}
          </Box>
        </Flex>
      </div>
      <div className="footer">
        <Footer />
      </div>
    </div>
  );
};

export default Welcome;

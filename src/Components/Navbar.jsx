import { Flex, Image, Text, Button, HStack } from "@chakra-ui/react";
import { useNavigate } from "react-router";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <Flex
      className="navbar glassmorph"
      align="center"
      justify="space-between"
      px={{ base: 4, md: 8 }}
      py={{ base: 2, md: 3 }}
      position="sticky"
      top={0}
      width="100%"
      zIndex={100}
      background="rgba(255,255,255,0.12)"
      backdropFilter="blur(14px)"
      boxShadow="0 4px 32px rgba(100, 22, 180, 0.11)"
    >
      <Flex align="center" cursor="pointer" onClick={() => navigate("/")}>
        <Image
          src="logo.png"
          alt="Logo"
          boxSize={{ base: "40px", md: "66px" }}
          borderRadius="full"
          mr={{ base: 2, md: 3 }}
          bg="white"
          p="0.5"
        />
        <Text
          fontSize={{ base: "lg", md: "2xl" }}
          fontWeight="bold"
          color="#fff"
          fontFamily="Montserrat"
          letterSpacing="1px"
          whiteSpace="nowrap"
        >
          SGC Screener
        </Text>
      </Flex>
      <HStack spacing={{ base: 4, md: 10 }} overflowX="auto" maxW={{ base: "60vw", md: "auto" }}>
        <Button
          variant="ghost"
          color="#fff"
          fontWeight="bold"
          fontFamily="Montserrat"
          fontSize={{ base: "sm", md: "md" }}
          onClick={() => navigate("/")}
          _hover={{ color: "#b400ff" }}
          mr={{ base: 2, md: 10 }}
          whiteSpace="nowrap"
          flexShrink={0}
        >
          Home
        </Button>
        <Button
          variant="ghost"
          color="#fff"
          fontWeight="bold"
          fontFamily="Montserrat"
          fontSize={{ base: "sm", md: "md" }}
          onClick={() => navigate("/Screens")}
          _hover={{ color: "#b400ff" }}
          mr={{ base: 2, md: 10 }}
          whiteSpace="nowrap"
          flexShrink={0}
        >
          MF Table
        </Button>
        <Button
          variant="ghost"
          color="#fff"
          fontWeight="bold"
          fontFamily="Montserrat"
          fontSize={{ base: "sm", md: "md" }}
          onClick={() => window.open("https://www.suigenerisconsulting.com/contact_us.php", "_blank")}
          _hover={{ color: "#b400ff" }}
          whiteSpace="nowrap"
          flexShrink={0}
        >
          Contact Us
        </Button>
      </HStack>
    </Flex>
  );
};

export default Navbar;

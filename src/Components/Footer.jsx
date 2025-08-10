import { Box, Flex, Text, Stack, useBreakpointValue } from "@chakra-ui/react";
import "./footer.css";

const Footer = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });

  const Disclaimer = (
    <>
      <Text fontSize="xs" textAlign="justify" mb={1}>
        Mutual fund investments are subject to market risks. Please read the
        scheme information and other related documents carefully before
        investing. Past performance of the schemes is neither an indicator nor a
        guarantee of future performance.
      </Text>
      <Text fontSize="xs" textAlign="justify" mb={1}>
        Please consider your specific investment requirements, risk tolerance,
        investment goal, time frame and the cost associated with the investment
        before choosing a mutual fund / fixed deposit, or designing a portfolio
        of mutual funds that suits your needs.
      </Text>
      <Text fontSize="xs" textAlign="justify">
        Sui Generis Consulting (SGC) Pvt. Ltd. has gathered the data,
        information, statistics from sources believed to be highly reliable and
        true. All necessary precautions have been taken to avoid any error,
        lapse or insufficiency, however, no representations or warranties are
        made (express or implied) as to the reliability, accuracy or completeness
        of such information. The Company cannot be held liable for any loss
        arising directly or indirectly from the use of, or any action taken in
        on, any information appearing herein.
      </Text>
    </>
  );

  return (
    <Box bg="gray.300" color="gray.800" px={{ base: 4, md: 6 }} py={8}>
      <Stack spacing={6}>
        {/* Top Section */}
        {isMobile ? (
          // Mobile: stacked & centered
          <Stack spacing={6} textAlign="center">
            <Box>
              <Text fontSize="lg" fontWeight="bold">
                ScreenerApp
              </Text>
              <Text fontSize="sm">
                © {new Date().getFullYear()} All rights reserved
              </Text>
            </Box>

            <Box>
              <Text fontWeight="semibold" mb={1}>
                Corporate Office:
              </Text>
              <Text fontSize="sm">
                Unit No.207, Padam Business Park,<br />
                Sector 12A, Awas Vikas Sikandra Yojna,<br />
                Agra – 282007, Uttar Pradesh, India
              </Text>
            </Box>

            <Box>
              <Text fontWeight="semibold" mb={1}>
                Contact:
              </Text>
              <Text fontSize="sm">📞 +91-562-2600020</Text>
              <Text fontSize="sm">📧 info@suigenerisconsulting.biz</Text>
            </Box>
          </Stack>
        ) : (
          // Desktop: evenly spaced columns
          <Flex justify="space-between" align="flex-start">
            <Box maxW="300px">
              <Text fontSize="lg" fontWeight="bold">
                ScreenerApp
              </Text>
              <Text fontSize="sm">
                © {new Date().getFullYear()} All rights reserved
              </Text>
            </Box>

            <Box maxW="350px" textAlign="center">
              <Text fontWeight="semibold" mb={1}>
                Corporate Office:
              </Text>
              <Text fontSize="sm">
                Unit No.207, Padam Business Park,<br />
                Sector 12A, Awas Vikas Sikandra Yojna,<br />
                Agra – 282007, Uttar Pradesh, India
              </Text>
            </Box>

            <Box textAlign="right">
              <Text fontWeight="semibold" mb={1}>
                Contact:
              </Text>
              <Text fontSize="sm">📞 +91-562-2600020</Text>
              <Text fontSize="sm">📧 info@suigenerisconsulting.biz</Text>
            </Box>
          </Flex>
        )}

        {/* Divider */}
        <Box height="1px" bg="gray.600" w="100%" />

        {/* Disclaimer & Author */}
        <Flex
          direction={{ base: "column", md: "row" }}
          mt={5}
          width="100%"
          maxWidth="1200px"
          mx="auto"
          gap={{ base: 4, md: 0 }}
        >
          {/* Disclaimer */}
          <Box width={{ base: "100%", md: "50%" }} pr={{ md: 4 }}>
            {Disclaimer}
          </Box>

          {/* Author Info */}
          <Box
            width={{ base: "100%", md: "50%" }}
            pl={{ md: 4 }}
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            textAlign="center"
          >
            <Text fontSize="sm">Made by Sharad Bansal</Text>
            <Text fontSize="sm">sharadbansal67@gmail.com</Text>
          </Box>
        </Flex>
      </Stack>
    </Box>
  );
};

export default Footer;

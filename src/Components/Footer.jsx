import React from 'react';
import { Box, Flex, Text, Stack } from '@chakra-ui/react';

const Footer = () => {
  return (
    <Box bg="gray.300" color="gray.800" px={6} py={8}>
      <Stack spacing={6}>
        <Flex justify="space-between" wrap="wrap" align="flex-start">
          <Box maxW="300px">
            <Text fontSize="lg" fontWeight="bold">
              ScreenerApp
            </Text>
            <Text fontSize="sm">© {new Date().getFullYear()} All rights reserved</Text>
          </Box>

          <Box maxW="350px">
            <Text fontWeight="semibold" mb={1}>Registered Office:</Text>
            <Text fontSize="sm">
              303, IIIrd Floor, E-7A, Friends Complex,<br />
              Near Hira Sweets, Vikas Marg, Delhi- 92
            </Text>
          </Box>

          <Box maxW="350px">
            <Text fontWeight="semibold" mb={1}>Corporate Office:</Text>
            <Text fontSize="sm">
              Unit No.207, Padam Business Park,<br />
              Sector 12A, Awas Vikas Sikandra Yojna,<br />
              Agra – 282007, Uttar Pradesh, India
            </Text>
          </Box>

          <Box>
            <Text fontWeight="semibold" mb={1}>Contact:</Text>
            <Text fontSize="sm">📞 +91-562-2600020</Text>
            <Text fontSize="sm">📧 info@suigenerisconsulting.biz</Text>
          </Box>
        </Flex>

        <Box height="1px" bg="gray.600" w="100%" />

        <Flex justify="center">
        <Box>
          <Text fontSize="sm">Made with ❤️ by Sharad Bansal</Text>
          <Text fontSize="sm">📧 sharadbansal67@gmail.com</Text>
        </Box>
          
        </Flex>
        
      </Stack>
    </Box>
  );
};

export default Footer;

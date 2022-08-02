import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
} from "@chakra-ui/react";
import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { getCookie } from "cookies-next";
import toast from "react-hot-toast";
import Head from "next/head";
import axios from "axios";
import { useRouter } from "next/router";

export default function SignupCard() {
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

  const handleClick = async (e) => {
    e.preventDefault();
    const emailRegex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (
      fullName === "" ||
      email === "" ||
      password === "" ||
      confirmPassword === ""
    ) {
      toast.error("Please fill all the fields");
    } else if (fullName.length < 3) {
      toast.error("Full name must be at least 3 characters");
    } else if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email");
    } else if (!passwordRegex.test(password)) {
      toast.error("Please enter a valid password");
    } else {
      try {
        await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/users/create`,
          {
            name: fullName,
            email: email,
            password: password,
          }
        );

        toast.success("Account created successfully");
        router.push("/login");
      } catch (err) {
        //  if status code is 409 (conflict) then show error
        if (err.response.status === 409) {
          toast.error("Email already exists");
        } else {
          toast.error("Something went wrong");
        }
      }
    }
  };

  return (
    <>
      <Head>
        <title>Register Now and be the best 🤙</title>
      </Head>

      <Flex
        minH={"100vh"}
        align={"center"}
        justify={"center"}
        bg={useColorModeValue("gray.50", "gray.800")}
      >
        <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
          <Stack align={"center"}>
            <Heading fontSize={"4xl"} textAlign={"center"}>
              Sign up
            </Heading>
            <Text fontSize={"lg"} color={"gray.600"}>
              to enjoy all of our cool features ✌️
            </Text>
          </Stack>
          <Box
            rounded={"lg"}
            bg={useColorModeValue("white", "gray.700")}
            boxShadow={"lg"}
            p={8}
          >
            <Stack spacing={4}>
              <HStack>
                <Box>
                  <FormControl id="firstName" isRequired>
                    <FormLabel>Full Name</FormLabel>
                    <Input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </FormControl>
                </Box>
                <Box>
                  <FormControl id="email" isRequired>
                    <FormLabel>Email address</FormLabel>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </FormControl>
                </Box>
              </HStack>

              <FormControl id="password" isRequired>
                <FormLabel>
                  <Text
                    fontSize={"xs"}
                    color={useColorModeValue("gray.600", "gray.300")}
                  >
                    (1 Uppercase,1 Lowercase,1 Symbol, Minimum 8 Characters)
                  </Text>
                  Password
                </FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <InputRightElement h={"full"}>
                    <Button
                      variant={"ghost"}
                      onClick={() =>
                        setShowPassword((showPassword) => !showPassword)
                      }
                    >
                      {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <FormControl id="confirmPassword" isRequired>
                <FormLabel>Confirm Password</FormLabel>
                <InputGroup>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </InputGroup>
              </FormControl>
              <Stack spacing={10} pt={2}>
                <Button
                  loadingText="Submitting"
                  size="lg"
                  bg={"blue.400"}
                  color={"white"}
                  _hover={{
                    bg: "blue.500",
                  }}
                  onClick={handleClick}
                >
                  Sign up
                </Button>
              </Stack>
              <Stack pt={6}>
                <Text align={"center"}>
                  Already a user?{" "}
                  <Link
                    color={"blue.400"}
                    onClick={() => {
                      router.push("/login");
                    }}
                  >
                    Login
                  </Link>
                </Text>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    </>
  );
}

export async function getServerSideProps({ req, res }) {
  const cookie = getCookie("token", {
    req,
    res,
  });
  console.log(cookie);
  if (cookie == undefined) {
    return {
      props: {},
    };
  }
  return {
    redirect: {
      destination: "/",
      permanent: false,
    },
  };
}

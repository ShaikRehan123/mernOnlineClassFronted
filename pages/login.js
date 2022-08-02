import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  Link,
  Button,
  Heading,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { getCookie, setCookie } from "cookies-next";
import Head from "next/head";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import axios from "axios";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const handleClick = async (e) => {
    e.preventDefault();
    try {
      const data = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/users/login`,
        {
          email: email,
          password: password,
        }
      );
      const jwt = data.data.token;
      const role_id = data.data.role_id;
      const name = data.data.name;
      const sEmail = data.data.email;
      const id = data.data.id;

      if (remember) {
        setCookie("token", jwt, { maxAge: 60 * 60 * 24 * 7 });
        setCookie("role_id", role_id, { maxAge: 60 * 60 * 24 * 7 });
        setCookie("name", name, { maxAge: 60 * 60 * 24 * 7 });
        setCookie("email", sEmail, { maxAge: 60 * 60 * 24 * 7 });
        setCookie("id", id, { maxAge: 60 * 60 * 24 * 7 });
      } else {
        setCookie("token", jwt);
        setCookie("role_id", role_id);
        setCookie("name", name);
        setCookie("email", sEmail);
        setCookie("id", id);
      }

      toast.success("Login Successful");

      router.push("/");
    } catch (err) {
      if (
        err.response.status === 400 &&
        err.response.data.message == "Invalid email or password"
      ) {
        toast.error("Invalid email or password");
      } else {
        toast.error("Something went wrong");
      }
    }
  };
  const router = useRouter();
  return (
    <>
      <Head>
        <title>Login Now and be the best 🤙</title>
      </Head>

      <Flex
        minH={"100vh"}
        align={"center"}
        justify={"center"}
        bg={useColorModeValue("gray.50", "gray.800")}
      >
        <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
          <Stack align={"center"}>
            <Heading fontSize={"4xl"}>Sign in to your account</Heading>
            <Text fontSize={"lg"} color={"gray.600"}>
              to enjoy all of our life changing{" "}
              <Link color={"blue.400"}>courses</Link> 👍
            </Text>
          </Stack>
          <Box
            rounded={"lg"}
            bg={useColorModeValue("white", "gray.700")}
            boxShadow={"lg"}
            p={8}
          >
            <Stack spacing={4}>
              <FormControl id="email">
                <FormLabel>Email address</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormControl>
              <FormControl id="password">
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </FormControl>
              <Stack spacing={10}>
                <Stack
                  direction={{ base: "column", sm: "row" }}
                  align={"start"}
                  justify={"center"}
                >
                  <Checkbox
                    id="remember"
                    isChecked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                  >
                    Remember me
                  </Checkbox>
                </Stack>
                <Button
                  bg={"blue.400"}
                  color={"white"}
                  _hover={{
                    bg: "blue.500",
                  }}
                  onClick={handleClick}
                >
                  Sign in
                </Button>
              </Stack>
              <Stack pt={6}>
                <Text align={"center"}>
                  Dont have an account?{" "}
                  <Link
                    color={"blue.400"}
                    onClick={() => {
                      router.push("/signup");
                    }}
                  >
                    Signup
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

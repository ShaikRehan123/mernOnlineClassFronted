import {
  Box,
  Flex,
  Avatar,
  Link,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useColorModeValue,
  Stack,
  useColorMode,
  Center,
} from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { deleteCookie, getCookie } from "cookies-next";
import { useRouter } from "next/router";
import Image from "next/image";
const NavLink = ({ children, onClick, isActive }) => (
  <Link
    px={2}
    py={1}
    rounded={"md"}
    _hover={{
      textDecoration: "none",
      bg: useColorModeValue("gray.200", "gray.700"),
    }}
    onClick={onClick}
    bg={isActive() ? useColorModeValue("gray.200", "gray.700") : undefined}
  >
    {children}
  </Link>
);

export default function Navbar() {
  const router = useRouter();
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <>
      <Box bg={useColorModeValue("gray.100", "gray.900")} px={4}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <Box>
            <Image
              src="/android-chrome-512x512.png"
              alt="logo"
              width={40}
              height={40}
              objectFit={"contain"}
              style={{
                cursor: "pointer",
              }}
              onClick={() => {
                router.push("/");
              }}
            />
          </Box>

          <Flex alignItems={"center"}>
            <Stack direction={"row"} spacing={7}>
              <NavLink
                onClick={() => {
                  if (router.pathname === "/") return;
                  router.push("/");
                }}
                isActive={() => router.pathname === "/"}
              >
                Home
              </NavLink>
              <NavLink
                onClick={() => {
                  if (router.pathname === "/courses") return;
                  router.push("/courses");
                }}
                isActive={() => router.pathname === "/courses"}
              >
                Courses
              </NavLink>
              <NavLink
                onClick={() => {
                  if (router.pathname === "/about") return;
                  router.push("/about");
                }}
                isActive={() => router.pathname === "/about"}
              >
                About
              </NavLink>
            </Stack>
          </Flex>

          <Flex alignItems={"center"}>
            <Stack direction={"row"} spacing={7}>
              <Button onClick={toggleColorMode}>
                {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
              </Button>

              <Menu>
                <MenuButton
                  as={Button}
                  rounded={"full"}
                  variant={"link"}
                  cursor={"pointer"}
                  minW={0}
                >
                  <Avatar
                    size={"sm"}
                    src={`https://avatars.dicebear.com/api/male/${getCookie(
                      "name"
                    )}.svg`}
                  />
                </MenuButton>
                <MenuList alignItems={"center"}>
                  <br />
                  <Center>
                    <Avatar
                      size={"2xl"}
                      src={`https://avatars.dicebear.com/api/male/${getCookie(
                        "name"
                      )}.svg`}
                    />
                  </Center>
                  <br />
                  <Center>
                    <p>{getCookie("name")}</p>
                  </Center>
                  <br />
                  <MenuDivider />
                  <MenuItem>My Courses</MenuItem>
                  <MenuItem>My Cart</MenuItem>
                  <MenuItem
                    onClick={() => {
                      deleteCookie("token");
                      deleteCookie("role_id");
                      deleteCookie("name");
                      deleteCookie("email");
                      deleteCookie("id");
                      router.push("/login");
                    }}
                  >
                    Logout
                  </MenuItem>
                </MenuList>
              </Menu>
            </Stack>
          </Flex>
        </Flex>
      </Box>
    </>
  );
}

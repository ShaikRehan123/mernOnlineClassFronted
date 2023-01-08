import Head from "next/head";
import { getCookie } from "cookies-next";
import AdminHomePage from "../components/Admin/AdminHomePage";
import {
  Container,
  useColorMode,
  Heading,
  Input,
  SimpleGrid,
  GridItem,
  Button,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from "@chakra-ui/react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import dayjs from "dayjs";
export default function Home({ categories }) {
  const { colorMode } = useColorMode();
  const router = useRouter();
  console.log(categories);
  return (
    <>
      <Head>
        <title>Admin (Create Course)</title>
      </Head>
      <AdminHomePage>
        <Container minW={"100%"}>
          <Container
            maxW="container.xl"
            color={colorMode === "light" ? "gray.100" : "gray.900"}
            background={colorMode === "light" ? "gray.900" : "white"}
            borderRadius="md"
            padding="4"
            marginBottom={10}
          >
            <Heading as="h4" size="md" textAlign="center">
              Create Category
            </Heading>
            <SimpleGrid
              marginY="4"
              columns={[1, 1, 1, 2]}
              spacingX="4"
              spacingY={4}
              as="form"
              encType="multipart/form-data"
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData();
                formData.append("name", e.target.category_name.value);
                // validations
                if (
                  e.target.category_name.value === "" ||
                  e.target.category_name.value === null
                ) {
                  toast.error("Please fill Category Name");
                } else {
                  try {
                    const res = await axios.post(
                      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/admin/create_category`,
                      formData,
                      // bearer token
                      {
                        headers: {
                          Authorization: `Bearer ${getCookie("token")}`,
                        },
                      }
                    );
                    // console.log(res);
                    toast.success("Category created successfully");
                    router.reload();
                  } catch (err) {
                    toast.error("Something went wrong");
                    console.log(err);
                  }
                }
              }}
            >
              <GridItem colSpan={[1, 1, 1, 2]}>
                <Input
                  placeholder="Category Name"
                  name="category_name"
                  type="text"
                  variant="outline"
                  size="sm"
                  borderRadius="md"
                  borderColor="gray.200"
                  borderWidth="1px"
                  borderStyle="solid"
                  _placeholder={{
                    color: "gray.500",
                  }}
                  _focus={{
                    borderColor: "blue.500",
                  }}
                  required
                />
              </GridItem>
              {/* submit button */}
              <GridItem
                colSpan={[2, 2, 2, 2]}
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <Button
                  variant="solid"
                  size="sm"
                  borderRadius="md"
                  borderColor="gray.200"
                  _hover={{
                    borderColor: "blue.500",
                  }}
                  _active={{
                    borderColor: "blue.500",
                  }}
                  _focus={{
                    borderColor: "blue.500",
                  }}
                  type="submit"
                  color={colorMode === "light" ? "gray.500" : "white"}
                  backgroundColor={colorMode === "light" ? "white" : "blue.400"}
                  paddingX={8}
                >
                  Submit
                </Button>
              </GridItem>
            </SimpleGrid>
          </Container>
        </Container>
        <Container
          maxW="container.xl"
          color={colorMode === "light" ? "gray.100" : "gray.900"}
          background={colorMode === "light" ? "gray.900" : "white"}
          borderRadius="md"
          padding="4"
        >
          <Heading as="h4" size="md" textAlign="center">
            All Categories
          </Heading>
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Category Name</Th>
                  <Th>Created At</Th>
                </Tr>
              </Thead>
              <Tbody>
                {categories.map((category) => (
                  <Tr key={category._id}>
                    <Td>{category.name}</Td>
                    {/* format as month_name, date, year */}
                    <Td>{dayjs(category.createdAt).format("MMM D, YYYY")}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Container>
      </AdminHomePage>
    </>
  );
}

export const getServerSideProps = async ({ req, res }) => {
  const cookie = getCookie("token", {
    req,
    res,
  });
  const role_id = getCookie("role_id", {
    req,
    res,
  });
  if (cookie != undefined && role_id == 1) {
    // get categories
    try {
      const categories = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/category/get_all_categories`
      );
      //   const courses = await axios.get(
      //     `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/course/get_all_courses`
      //   );
      return {
        props: {
          categories: categories.data.data,
          //   courses: courses.data.courses,
        },
      };
    } catch {
      return {
        props: {
          categories: [],
        },
      };
    }
  }
  if (role_id == 2) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    redirect: {
      destination: "/login",
      permanent: false,
    },
  };
};

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
  Textarea,
  Flex,
  Icon,
  Select,
  Checkbox,
  Button,
} from "@chakra-ui/react";
import { useRef } from "react";
import { AiOutlineUpload } from "react-icons/ai";
import axios from "axios";
import toast from "react-hot-toast";
export default function Home({ categories }) {
  const { colorMode } = useColorMode();
  const imageRef = useRef();
  return (
    <>
      <Head>
        <title>Admin (Create Course)</title>
      </Head>
      <AdminHomePage>
        <Container
          maxW="container.xl"
          color={colorMode === "light" ? "gray.100" : "gray.900"}
          background={colorMode === "light" ? "gray.900" : "white"}
          borderRadius="md"
          padding="4"
        >
          {/* create course */}
          <Heading as="h4" size="md" textAlign="center">
            Create Course
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
              // console.log(e.target.elements);
              formData.append("name", e.target.course_name.value);
              formData.append("image", imageRef.current.files[0]);
              formData.append("description", e.target.course_description.value);
              formData.append("category_id", e.target.course_category.value);
              formData.append("price", e.target.course_price.value);
              formData.append("is_active", e.target.is_active.checked);
              // is featured
              formData.append("is_featured", e.target.is_featured.checked);
              //  is trending
              formData.append("is_trending", e.target.is_trending.checked);
              // validations
              if (
                e.target.course_name.value === "" ||
                e.target.course_description.value === "" ||
                e.target.course_category.value === "" ||
                e.target.course_price.value === "" ||
                imageRef.current.files[0] === undefined
              ) {
                toast.error("Please fill all the fields");
              }
              // price validation should be greater than 0 and less than 10000
              else if (
                e.target.course_price.value < 0 ||
                e.target.course_price.value > 10000
              ) {
                toast.error("Price should be between 0 and 10000");
              }
              // image validation
              else if (imageRef.current.files[0].size > 5000000) {
                toast.error("Image size should be less than 5MB");
              }
              // description must be less than 1000 characters
              else if (e.target.course_description.value.length > 1000) {
                toast.error("Description should be less than 1000 characters");
              }
              // name must be less than 100 characters
              else if (e.target.course_name.value.length > 100) {
                toast.error("Name should be less than 100 characters");
              } else {
                try {
                  const res = await axios.post(
                    `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/admin/create_course`,
                    formData,
                    // bearer token
                    {
                      headers: {
                        Authorization: `Bearer ${getCookie("token")}`,
                      },
                    }
                  );
                  // console.log(res);
                  toast.success("Course created successfully");
                  router.reload();
                } catch (err) {
                  toast.error("Something went wrong");
                }
              }
            }}
          >
            <GridItem colSpan={[1, 1, 1, 2]}>
              <Input
                placeholder="Course Name"
                name="course_name"
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
            <GridItem colSpan={[1, 1, 1, 2]}>
              <Input
                placeholder="Course Price (0) for free"
                name="course_price"
                type="number"
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
            <GridItem colSpan={[2, 2, 2, 2]}>
              <Select
                placeholder="Course Category"
                name="course_category"
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
                color="gray.500"
                required
              >
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </Select>
            </GridItem>

            <GridItem
              // take up all the space
              colSpan={2}
            >
              <Textarea
                placeholder="Course Description"
                name="course_description"
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
            {/* isActive,isFeatured,isTrending (switch option) */}
            <GridItem colSpan={[12, 2, 2, 2]}>
              <Flex
                justifyContent="space-between"
                alignItems="center"
                color="gray.500"
              >
                <Checkbox
                  name="is_active"
                  variant="outline"
                  size="md"
                  borderRadius="md"
                  borderColor="gray.200"
                  padding={2}
                  borderWidth="1px"
                  borderStyle="solid"
                  _placeholder={{
                    color: "gray.500",
                  }}
                  // _focus={{
                  //   borderColor: "blue.500",
                  // }}
                >
                  Active
                </Checkbox>
                <Checkbox
                  name="is_featured"
                  variant="outline"
                  size="md"
                  borderRadius="md"
                  borderColor="gray.200"
                  padding={2}
                  borderWidth="1px"
                  borderStyle="solid"
                  _placeholder={{
                    color: "gray.500",
                  }}
                  // _focus={{
                  //   borderColor: "blue.500",
                  // }}
                >
                  Featured
                </Checkbox>
                <Checkbox
                  name="is_trending"
                  variant="outline"
                  size="md"
                  borderRadius="md"
                  borderColor="gray.200"
                  padding={2}
                  borderWidth="1px"
                  borderStyle="solid"
                  _placeholder={{
                    color: "gray.500",
                  }}
                  // _focus={{
                  //   borderColor: "blue.500",
                  // }}
                >
                  Trending
                </Checkbox>
              </Flex>
            </GridItem>
            <GridItem
              // take up all the space
              colSpan={2}
            >
              {/* file upload */}
              <Input
                placeholder="Course Image"
                name="course_image"
                type="file"
                variant="outline"
                size="sm"
                borderRadius="md"
                // borderColor={colorMode === "light" ? "gray.400" : "white"}
                borderWidth="1px"
                borderStyle="solid"
                _placeholder={{
                  color: "gray.500",
                }}
                _focus={{
                  borderColor: "blue.500",
                }}
                display="none"
                ref={imageRef}
                // required
              />
              <Flex
                display="flex"
                borderRadius="md"
                borderColor="gray.200"
                borderWidth="2px"
                borderStyle="dotted"
                padding="2"
                cursor="pointer"
                width={["full", "full", "full", "full"]}
                justifyContent="center"
                alignItems="center"
                height={["20", "20", "20", "20"]}
                onClick={() => imageRef.current.click()}
              >
                <Heading
                  as={"h3"}
                  size={["sm", "sm", "sm", "sm"]}
                  textAlign="center"
                  color="gray.500"
                >
                  Upload Image
                </Heading>
                <Icon as={AiOutlineUpload} color="gray.500" marginLeft="1" />
              </Flex>
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
      return {
        props: {
          categories: categories.data.data,
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

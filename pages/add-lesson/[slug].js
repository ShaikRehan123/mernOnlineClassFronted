import Head from "next/head";
import { getCookie } from "cookies-next";
import AdminHomePage from "../../components/Admin/AdminHomePage";
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
  Button,
  Text,
} from "@chakra-ui/react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { AiOutlineUpload } from "react-icons/ai";
import LessonCard from "../../components/Common/LessonCard";
export default function Home({ lessons, course_id }) {
  const { colorMode } = useColorMode();
  const router = useRouter();
  const videoRef = useRef(null);
  const [video, setVideo] = useState({
    url: "",
    file: "",
  });
  console.log(lessons);
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
            {/* create course */}
            <Heading as="h4" size="md" textAlign="center">
              Add Lesson to Course
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
                formData.append("course_id", course_id);
                formData.append("name", e.target.name.value);
                formData.append("description", e.target.description.value);
                formData.append("video", video.file);

                if (
                  e.target.name.value === "" ||
                  e.target.description.value === ""
                ) {
                  toast.error("Please fill all the fields");
                } else if (video.file === "") {
                  toast.error("Please select a video");
                } else if (video.file.size > 400000000) {
                  toast.error("Video size should be less than 400MB");
                } else {
                  // console.log(video.file.size / 1000000 + "MB");

                  // return;
                  try {
                    const res = await axios.post(
                      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/admin/upload_lesson`,
                      formData,
                      // bearer token
                      {
                        headers: {
                          Authorization: `Bearer ${getCookie("token")}`,
                        },
                      }
                    );
                    toast.success("Lesson created successfully");
                    router.reload();
                  } catch (err) {
                    console.log(err);
                    toast.error("Something went wrong, please try again later");
                  }
                }
              }}
            >
              <GridItem colSpan={[1, 1, 1, 2]}>
                <Input
                  placeholder="Lesson Name"
                  name="name"
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
                <Textarea
                  placeholder="Lesson Description"
                  name="description"
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

              <GridItem colSpan={2}>
                <Input
                  placeholder="Course Image"
                  name="vidoe"
                  type="file"
                  variant="outline"
                  size="sm"
                  borderRadius="md"
                  borderWidth="1px"
                  borderStyle="solid"
                  _placeholder={{
                    color: "gray.500",
                  }}
                  _focus={{
                    borderColor: "blue.500",
                  }}
                  display="none"
                  ref={videoRef}
                  // required
                  accept="video/*"
                  onChange={(e) => {
                    if (e.target.files.length !== 0) {
                      setVideo({
                        url: URL.createObjectURL(e.target.files[0]),
                        file: e.target.files[0],
                      });
                    }
                  }}
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
                  onClick={() => videoRef.current.click()}
                  _hover={{
                    borderColor: "blue.500",
                  }}
                  transition="all 0.3s ease"
                  _focus={{
                    borderColor: "blue.500",
                  }}
                >
                  <Heading
                    as={"h3"}
                    size={["sm", "sm", "sm", "sm"]}
                    textAlign="center"
                    color="gray.500"
                  >
                    Upload Video File
                  </Heading>
                  <Icon as={AiOutlineUpload} color="gray.500" marginLeft="1" />
                </Flex>
                {video.url && (
                  <div style={{ marginTop: "10px" }}>
                    <video
                      src={video.url}
                      controls
                      width="100%"
                      height="100%"
                    />
                  </div>
                )}
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
          <Container
            maxW="container.xl"
            color={colorMode === "light" ? "gray.100" : "gray.900"}
            background={colorMode === "light" ? "gray.900" : "white"}
            borderRadius="md"
            padding="4"
          >
            {/* create course */}
            <Heading as="h4" size="md" textAlign="center">
              All Lessons
            </Heading>
            {lessons.length <= 0 && (
              <Text as="p" size="md" textAlign="center" marginTop={4}>
                You have not created any lessons yet
              </Text>
            )}
            <Container
              maxW="container.xl"
              marginTop={4}
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
                gridGap: "20px",
              }}
            >
              {
                // map through all courses
                lessons.map((lesson) => {
                  return <LessonCard key={lesson._id} lesson={lesson} />;
                })
              }
            </Container>
          </Container>
        </Container>
      </AdminHomePage>
    </>
  );
}

export const getServerSideProps = async ({ req, res, params }) => {
  const cookie = getCookie("token", {
    req,
    res,
  });
  const role_id = getCookie("role_id", {
    req,
    res,
  });

  //    get course_id from url

  const course_id = params?.slug;

  if (cookie != undefined && role_id == 1) {
    // get categories
    try {
      const previousLessons = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/lessons/get-lessons`,
        {
          course_id: course_id,
        },
        {
          headers: {
            Authorization: `Bearer ${cookie}`,
          },
        }
      );
      if (previousLessons.data.status == "success") {
        return {
          props: {
            lessons: previousLessons.data.data,
            course_id: course_id,
          },
        };
      } else {
        return {
          props: {
            lessons: [],
            course_id: course_id,
          },
        };
      }
    } catch {
      return {
        props: {
          lessons: [],
          course_id: course_id,
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

import {
    Flex,
    Box,
    Image,
    Badge,
    useColorModeValue,
    Icon,
    chakra,
    Tooltip,
    HStack,
    Button,
} from "@chakra-ui/react";
import axios from "axios";
import {useRouter} from "next/router";
import {toast} from "react-hot-toast";
import {BsStar, BsStarFill, BsStarHalf} from "react-icons/bs";
import {MdOutlineAddShoppingCart, MdOutlineRemoveShoppingCart} from "react-icons/md";
import {getCookie} from "cookies-next";

// const data = {
//   isNew: true,
//   imageURL:
//     "https://images.unsplash.com/photo-1572635196237-14b3f281503f?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=4600&q=80",
//   name: "Wayfarer Classic",
//   price: 4.5,
//   rating: 2.5,
//   numReviews: 34,
// };

function Rating({rating, numReviews}) {
    return (
        <Box d="flex" alignItems="center">
            {Array(5)
                .fill("")
                .map((_, i) => {
                    const roundedRating = Math.round(rating * 2) / 2;
                    if (roundedRating - i >= 1) {
                        return (
                            <Icon
                                as={BsStarFill}
                                key={i}
                                style={{marginLeft: "1"}}
                                color="yellow.400"
                            />
                        );
                    }
                    if (roundedRating - i === 0.5) {
                        return (
                            <Icon
                                as={BsStarHalf}
                                key={i}
                                style={{marginLeft: "1"}}
                                color="yellow.400"
                            />
                        );
                    }
                    return (
                        <Icon
                            as={BsStar}
                            key={i}
                            style={{marginLeft: "1"}}
                            color="yellow.400"
                        />
                    );
                })}
            <Box
                as="span"
                ml="2"
                fontSize="sm"
                color={useColorModeValue("gray.900", "white")}
            >
                {numReviews} review{numReviews > 1 && "s"}
            </Box>
        </Box>
    );
}

function CourseCard({
                        name,
                        category_name,
                        image,
                        is_featured,
                        is_trending,
                        colorMode,
                        price,
                        isAdmin = false,
                        showAddLessonButton = false,
                        course_id,
                        showDeleteButton = false,
                        isAddedToCart = false,
                        showAddToCartButton = false,
                        showRemoveFromCartButton = false,
                    }) {
    const router = useRouter();

    const refreshData = () => {
        router.replace(router.asPath);
    };

    const deleteCourse = async () => {
        try {
            const res = await axios.delete(
                `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/course/delete/${course_id}`
            );
            if (res.data.status == "success") {
                toast.success(res.data.message || "Course deleted successfully");
                refreshData();
            } else {
                toast.error(res.data.message || "Something went wrong");
            }
        } catch (error) {
            toast.error(error.message || "Something went wrong");
        }
    };

    const addToCart = async (course_id) => {
        console.log(course_id);
        try {
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/cart/add`,
                {
                    course_id,
                },
                {
                    headers: {
                        Authorization: `Bearer ${getCookie("token")}`,
                    },
                }
            );
            if (res.data.status == "success") {
                toast.success(res.data.message || "Course added to cart successfully");
                refreshData();
            } else {
                toast.error(res.data.message || "Something went wrong");
            }
        } catch (err) {
            toast.error(err.message || "Something went wrong");
        }
    };

    const removeFromCart = async (course_id) => {
        try {
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/cart/remove`,
                {
                    course_id,
                },
                {
                    headers: {
                        Authorization: `Bearer ${getCookie("token")}`,
                    },
                }
            );
            if (res.data.status == "success") {
                toast.success(res.data.message || "Course removed from cart successfully");
                refreshData();
            } else {
                toast.error(res.data.message || "Something went wrong");
            }
        } catch (err) {
            toast.error(err.message || "Something went wrong");
        }
    };

    return (
        <Flex p={50} w="full" alignItems="center" justifyContent="center">
            <Box
                bg={useColorModeValue("white", "gray.800")}
                maxW="sm"
                borderWidth="1px"
                rounded="lg"
                shadow="lg"
                position="relative"
            >
                {/* {data.isNew && (
          <Circle
            size="10px"
            position="absolute"
            top={2}
            right={2}
            bg="red.200"
          />
        )} */}

                <Image
                    src={`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/assets/upload/course_images/${image}`}
                    alt={`Picture of ${name}`}
                    roundedTop="lg"
                />

                <Box p="6">
                    <HStack>
                        <Box d="flex" alignItems="baseline">
                            {is_featured && (
                                <Badge rounded="full" px="2" fontSize="0.8em" colorScheme="red">
                                    Featured
                                </Badge>
                            )}
                        </Box>
                        <Box d="flex" alignItems="baseline">
                            {is_trending && (
                                <Badge rounded="full" px="2" fontSize="0.8em" colorScheme="red">
                                    Trending
                                </Badge>
                            )}
                        </Box>
                    </HStack>
                    <Flex mt="1" justifyContent="space-between" alignContent="center">
                        <Box
                            fontSize="2xl"
                            fontWeight="semibold"
                            as="h4"
                            lineHeight="tight"
                            color={useColorModeValue("gray.900", "white")}
                        >
                            {name}
                        </Box>
                        {(!isAdmin && !isAddedToCart && showAddToCartButton) && (
                            <Tooltip
                                label="Add to cart"
                                bg="white"
                                placement={"top"}
                                color={"gray.800"}
                                fontSize={"1.2em"}
                            >
                                <chakra.a display={"flex"}>
                                    <Icon
                                        as={MdOutlineAddShoppingCart}
                                        h={7}
                                        w={7}
                                        alignSelf={"center"}
                                        color={colorMode === "light" ? "gray.800" : "white"}
                                        onClick={() => addToCart(course_id)}
                                        cursor={"pointer"}
                                    />
                                </chakra.a>
                            </Tooltip>
                        )}
                        {(!isAdmin && showRemoveFromCartButton) && (
                            <Tooltip
                                label="Remove from cart"
                                bg={"white"}
                                placement={"top"}
                                color={"gray.800"}
                                fontSize={"1.2em"}
                            >
                                <chakra.a display={"flex"}>
                                    <Icon
                                        as={MdOutlineRemoveShoppingCart}
                                        h={7}
                                        w={7}
                                        alignSelf={"center"}
                                        color={colorMode === "light" ? "gray.800" : "white"}
                                        onClick={() => removeFromCart(course_id)}
                                        cursor={"pointer"}
                                    />
                                </chakra.a>
                            </Tooltip>
                        )}
                    </Flex>

                    <Flex justifyContent="space-between" alignContent="center">
                        {/* <Rating rating={data.rating} numReviews={data.numReviews} /> */}
                        {/* created_at */}
                        <Box
                            fontSize="sm"
                            fontWeight="semibold"
                            as="h4"
                            lineHeight="tight"
                            color={useColorModeValue("gray.900", "white")}
                        >
                            {category_name}
                        </Box>
                        {/*
            <Box
              fontSize="sm"
              fontWeight="semibold"
              as="h4"
              lineHeight="tight"
              color={useColorModeValue("gray.900", "white")}
            >
              {author_name}
            </Box> */}
                        {price !== 0 ? (
                            <Box
                                fontSize="2xl"
                                color={colorMode === "light" ? "gray.800" : "white"}
                            >
                                <Box as="span" color={"gray.600"} fontSize="lg">
                                    ₹
                                </Box>
                                {price.toFixed(2)}
                            </Box>
                        ) : (
                            <Box
                                fontSize="2xl"
                                color={colorMode === "light" ? "gray.800" : "white"}
                            >
                                Free
                            </Box>
                        )}
                    </Flex>

                    {showAddLessonButton && (
                        <Box
                            mt="1"
                            fontWeight="semibold"
                            as="h4"
                            lineHeight="tight"
                            color={colorMode === "light" ? "gray.800" : "white"}
                            onClick={() => {
                                router.push("/add-lesson/" + course_id);
                            }}
                        >
                            <Button
                                colorScheme="teal"
                                variant="outline"
                                size="sm"
                                // onClick={onOpen}
                            >
                                Add Lesson
                            </Button>
                        </Box>
                    )}

                    {showDeleteButton && (
                        <Box
                            mt="1"
                            fontWeight="semibold"
                            as="h4"
                            lineHeight="tight"
                            color={colorMode === "light" ? "gray.800" : "white"}
                            onClick={() => {
                                const isConfirmed = confirm(
                                    "Are you sure you want to delete this course?"
                                );
                                if (isConfirmed) {
                                    deleteCourse();
                                }
                            }}
                        >
                            <Button colorScheme="red" variant="outline" size="sm">
                                Delete Course
                            </Button>
                        </Box>
                    )}
                </Box>
            </Box>
        </Flex>
    );
}

export default CourseCard;

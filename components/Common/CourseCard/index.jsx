import {
  Flex,
  Circle,
  Box,
  Image,
  Badge,
  useColorModeValue,
  Icon,
  chakra,
  Tooltip,
  HStack,
} from "@chakra-ui/react";
import { BsStar, BsStarFill, BsStarHalf } from "react-icons/bs";
import { FiShoppingCart } from "react-icons/fi";

// const data = {
//   isNew: true,
//   imageURL:
//     "https://images.unsplash.com/photo-1572635196237-14b3f281503f?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=4600&q=80",
//   name: "Wayfarer Classic",
//   price: 4.5,
//   rating: 2.5,
//   numReviews: 34,
// };

function Rating({ rating, numReviews }) {
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
                style={{ marginLeft: "1" }}
                color="yellow.400"
              />
            );
          }
          if (roundedRating - i === 0.5) {
            return (
              <Icon
                as={BsStarHalf}
                key={i}
                style={{ marginLeft: "1" }}
                color="yellow.400"
              />
            );
          }
          return (
            <Icon
              as={BsStar}
              key={i}
              style={{ marginLeft: "1" }}
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
  // created_at,
  image,
  //   is_active,
  is_featured,
  is_trending,
  // author_name,
  colorMode,
  price,
  isAdmin,
}) {
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
          src={`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/upload/course_images/${image}`}
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
            {!isAdmin && (
              <Tooltip
                label="Add to cart"
                bg="white"
                placement={"top"}
                color={"gray.800"}
                fontSize={"1.2em"}
              >
                <chakra.a href={"#"} display={"flex"}>
                  <Icon
                    as={FiShoppingCart}
                    h={7}
                    w={7}
                    alignSelf={"center"}
                    color={colorMode === "light" ? "gray.800" : "white"}
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
        </Box>
      </Box>
    </Flex>
  );
}

export default CourseCard;

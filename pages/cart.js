import {getCookie} from "cookies-next";
import axios from "axios";
import {Heading, SimpleGrid, Text, useColorMode} from "@chakra-ui/react";
import CourseCard from "../components/Common/CourseCard";
import Link from "next/link";

export default function Cart({role_id, cartItems = []}) {
    console.log(cartItems);
    const { colorMode } = useColorMode();

    return (
        <>
            <Heading as="h2" size="lg" textAlign="center" marginTop={4}>
                Your Cart
            </Heading>
            <SimpleGrid columns={[1, 1, 1, 2]} spacingX="4" spacingY={4}>
                {cartItems?.map((course) => {
                    console.log(course);
                    return (
                        <CourseCard
                            key={course._id}
                            course_id={course._id}
                            {...course}
                            colorMode={colorMode}
                            isAdmin={false}
                            showAddLessonButton={false}
                            showDeleteButton={false}
                            showRemoveFromCartButton={true}
                        />
                    );
                })}
            </SimpleGrid>
            {cartItems.length === 0 && (
                <>
                    <Heading as="h2" size="lg" textAlign="center" marginTop={4}>
                        Your cart is empty
                    </Heading>
                </>
            )}
        </>

    )
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
    if (cookie != undefined && role_id == "1") {
        return {
            props: {
                role_id,
            },
        };
    }

    if (cookie != undefined && role_id == "2") {
        try {
            const cartItems = await axios.get(
                `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/cart/getCart`,
                {
                    headers: {
                        Authorization: `Bearer ${cookie}`,
                    },
                }
            );
            return {
                props: {
                    role_id,
                    cartItems: cartItems.data.cartItems,
                },
            };
        } catch (err) {
            return {
                props: {
                    role_id,
                    cartItems: [],
                },
            };
        }
    }

    return {
        redirect: {
            destination: "/login",
            permanent: false,
        },
    };
}
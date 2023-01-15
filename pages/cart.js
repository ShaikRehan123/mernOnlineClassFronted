import {getCookie} from "cookies-next";
import axios from "axios";
import {Button, Flex, Heading, SimpleGrid, useColorMode,} from "@chakra-ui/react";
import CourseCard from "../components/Common/CourseCard";
import {useState} from "react";
import toast from "react-hot-toast";
import Script from "next/script";

export default function Cart({ role_id, cartItems = [] }) {
  const { colorMode } = useColorMode();
  const [selectedCoursesForCheckOut, setSelectedCoursesForCheckOut] = useState(
    []
  );


  const checkout = async () => {
    // console.log(selectedCoursesForCheckOut);
    const url = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/course/create-order`;
    try {
      const res = await axios.post(url, {
        courseIds: selectedCoursesForCheckOut,
        user_id: getCookie("user_id"),
      }, {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      })
        console.log(res);
      if(res.data.status === "success") {
        toast.success("Order created successfully");
        console.log(res.data)

        if(res.data.order !== 'free_course'){
          const keyURl = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/extra/get_razorpay_key`;
          let razorpayKey = await axios.get(keyURl);
          razorpayKey = razorpayKey.data.key;

          const options = {
            key: razorpayKey,
            amount: res.data.order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
            currency: "INR",
            name: "Mern Online Class Courses Purchase",
            description: res.data.courseNames,
            image: `${process.env.NEXT_PUBLIC_FRONTEND_BASE_URL}/android-chrome-512x512.png`,
            order_id: res.data.order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
            callback_url: `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/course/payment-verification`,
            prefill: {
              name: getCookie("name"),
              email: getCookie("email"),
            },
            notes: {
              "address": "Tirupati",
            },
            theme: {
              "color": "#171616"
            }
          };
          const razor = new window.Razorpay(options);
          razor.open();
        }else{
          window.location.href = `${process.env.NEXT_PUBLIC_FRONTEND_BASE_URL}/payment-success?order_id=free_course&payment_id=free_course`;
        }


      }else{
        toast.error(res.data.message || "Something went wrong");
      }
    } catch (err) {
        toast.error(err.message || "Something went wrong");
    }
  };

  return (
    <>
      <Heading as="h2" size="lg" textAlign="center" marginTop={4}>
        Your Cart
      </Heading>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />

      <SimpleGrid columns={[1, 1, 1, 2]} spacingX="4" spacingY={4}>
        {cartItems?.map((course) => {
          return (
            <div key={course._id} style={{ position: "relative" }}>
              <CourseCard
                course_id={course._id}
                {...course}
                colorMode={colorMode}
                isAdmin={false}
                showAddLessonButton={false}
                showDeleteButton={false}
                showRemoveFromCartButton={true}
                selectedCoursesForCheckOut={selectedCoursesForCheckOut}
                setSelectedCoursesForCheckOut={setSelectedCoursesForCheckOut}
                selectCoursesForCheckout={true}
              />
              {/* <Checkbox
                style={{
                  zIndex: 1000,
                  position: "absolute",
                  top: 0,
                  right: 0,
                }}
              >
                Add to checkout
              </Checkbox> */}
            </div>
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
      {/* <Text>Selected Courses: {selectedCoursesForCheckOut.length}</Text>
      <Text>Total Price: {selectedCoursesForCheckOut.length * 100}</Text> */}
      {selectedCoursesForCheckOut.length > 0 && (
        <Flex justifyContent="center">
          <Button
            colorScheme="teal"
            size="lg"
            marginTop={4}
            onClick={() => {
              checkout();
            }}
          >
            Checkout
          </Button>
        </Flex>
      )}
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
};

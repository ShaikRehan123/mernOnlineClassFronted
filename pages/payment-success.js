import {getCookie} from "cookies-next";
import {useRouter} from "next/router";

import {AiOutlineCheckCircle} from "react-icons/ai";

const PaymentSuccess = () => {
    const router = useRouter();
    return (
        <div className="container w-screen h-screen flex justify-center items-center flex-col md:flex-row">
            <div className="w-1/2 h-1/2 flex flex-col justify-center items-center">
                <h1 className="text-3xl font-bold">Payment Successful</h1>
                <p className="text-xl">Thank you for your purchase</p>
            </div>
            <div className="w-1/2 h-1/2 flex justify-center items-center flex-col">
                <AiOutlineCheckCircle className="text-6xl text-green-500"/>
                <div className="w-1/2 h-1/2 flex flex-col justify-center items-center">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-md" onClick={() => {
                        router.push("/my-courses");
                    }}>Go to My Courses</button>
                </div>
            </div>
        </div>
    )
    
}

export default PaymentSuccess;


export const getServerSideProps = async ({ req, res }) => {
    const cookie = getCookie("token", {
        req,
        res,
    });
    const role_id = getCookie("role_id", {
        req,
        res,
    });
    if (cookie !== undefined && role_id == "1") {
    //    redirect to admin dashboard
        return {
            redirect: {
                destination: "/",
                permanent: false,
            }
        }
    }


    if(cookie !== undefined && role_id == "2"){
        return {
            props: {
                role_id
            }
        }
    }



    return {
        redirect: {
            destination: "/login",
            permanent: false,
        },
    };
};

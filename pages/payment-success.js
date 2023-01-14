import {getCookie} from "cookies-next";

const PaymentSuccess = () => {
    return (
        <div>
            <h1>Payment Success</h1>
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
    if (cookie !== undefined) {
        return {
            props: {
                role_id,
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

import {getCookie} from "cookies-next";
import axios from "axios";
import {Container, useColorMode, useDisclosure} from "@chakra-ui/react";
import React, {useEffect, useState} from "react";
import {act} from "react-dom/test-utils";

const CourseLessons = ({role_id,course_id,courseLessons}) => {
    const { isOpen, onOpen, onClose } = useDisclosure({
        isOpen: true,
        onOpen: () => console.log("Opening..."),
        onClose: () => console.log("Closing..."),
    });

    const {colorMode} = useColorMode();

    const [activeLesson, setActiveLesson] = useState(courseLessons[0]);

    const [videoUrl, setVideoUrl] = useState('');

    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);

        const filteredLessons = courseLessons.filter(lesson => lesson.status !== 'completed');

        if(filteredLessons.length > 0){
            setActiveLesson(filteredLessons[0]);
            const currentTime = filteredLessons[0].videoCurrentTime;
            const videoUrl = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/assets/upload/course_videos/${filteredLessons[0].lesson.course_id}/${filteredLessons[0].lesson.video_link}#t=${currentTime}`;
            setVideoUrl(videoUrl);

        }else{
            setActiveLesson(courseLessons[courseLessons.length - 1]);
            console.log(courseLessons[courseLessons.length - 1]);
            const currentTime = courseLessons[courseLessons.length - 1].videoCurrentTime;
            const videoUrl = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/assets/upload/course_videos/${courseLessons[courseLessons.length - 1].lesson.course_id}/${courseLessons[courseLessons.length - 1].lesson.video_link}#t=${currentTime}`;
            console.log(videoUrl);
            setVideoUrl(videoUrl);
        }

    }, []);

    const changeLesson = async (lesson) => {
        // console.log(lesson);

        // if not active lesson i s already active
        if (lesson.lesson._id != activeLesson.lesson._id) {

            setActiveLesson(lesson);
            const currentTimeURL = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/course/get-lesson-current-time`;

            const body = {
                lesson_id: lesson.lesson._id,
                course_id: lesson.lesson.course_id,
            }

            const options = {
                headers: {
                    Authorization: `Bearer ${getCookie("token")}`,
                }
            }


            const res = await axios.post(currentTimeURL, body, options);


            const videoUrl = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/assets/upload/course_videos/${lesson.lesson.course_id}/${lesson.lesson.video_link}#t=${res.data.videoCurrentTime}`;
            setVideoUrl(videoUrl);
        }

    };

    if(isClient){
        return (
            <div className="course-lessons" style={{display: "flex", flexDirection: "row"}}>
                {/*    20 % width*/}
                {/*    80 % width*/}

                <div className="course-lessons__left shadow-lg flex flex-col" style={{width: "20%", backgroundColor: `${colorMode === "light" ? "#f5f5f5" : "#1a202c"}` , height: "100vh" , borderRight: `${colorMode === "light" ? "1px solid #e2e8f0" : "1px solid #2d3748"}`}}>
                    {courseLessons?.map((lesson) => {
                        const lesson_ = lesson.lesson;
                        return (
                            <div key={lesson_._id} className="course-lessons__left__lesson" style={{padding: "1rem", cursor: "pointer", backgroundColor: `${activeLesson.lesson._id === lesson_._id ? "#edf2f7" : ""}`, color: `${activeLesson.lesson._id === lesson_._id ? "#3182ce" : ""}`}} onClick={() => changeLesson(lesson)}>
                                {lesson_.name}
                            </div>
                        );
                    })}
                </div>
                <div className="course-lessons__right py-4" style={{width: "80%", backgroundColor: `${colorMode === "light" ? "#f5f5f5" : "#1a202c"}` , height: "100vh"}}>
                    <div className="course-lessons__right__video" style={{width: "100%", height: "80%"}}>
                        <video src={videoUrl} width="100%" height="100%" className={'max-h-full'} controls autoPlay  onTimeUpdate={async (e) => {
                            const currentTime = e.target.currentTime;
                            // console.log(currentTime);
                            // for every 5 seconds
                            const time = Math.floor(currentTime);
                            // console video length
                            if((time % 5 === 0 && time !== 0) ||  time === Math.floor(e.target.duration)){
                                const videoCurrentTime = currentTime;
                                const lesson_id = activeLesson.lesson._id;
                                const course_id = activeLesson.lesson.course_id;
                                const user_id = activeLesson.user_id;
                                const data = {
                                    video_current_time: videoCurrentTime,
                                    lesson_id,
                                    course_id,
                                    user_id,
                                    video_duration: e.target.duration
                                }

                                const headers = {
                                    headers: {
                                        Authorization: `Bearer ${getCookie("token")}`,
                                    }
                                }

                                await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/course/update-video-current-time`, data, headers);
                            }
                        } }/>
                    </div>
                    <div className="course-lessons__right__description" style={{width: "100%", height: "20%"}}>
                        <div className="course-lessons__right__description__title" style={{fontSize: "1.5rem", fontWeight: "bold", padding: "1rem"}}>
                            {activeLesson.lesson.name}
                        </div>
                        <div className="course-lessons__right__description__content" style={{padding: "1rem"}}>
                            {activeLesson.lesson.description}
                        </div>
                    </div>
                </div>

            </div>
        )
    }else{
        return 'Loading...';
    }
};

export default CourseLessons;


export const getServerSideProps = async ({req, res,query}) => {
    const cookie = getCookie("token", {
        req,
        res,
    });
    const role_id = getCookie("role_id", {
        req,
        res,
    });


    const course_id = query.course_id[0];

    if (cookie !== undefined && role_id == "1") {
        return {
            redirect: {
                destination: "/",
                permanent: false,
            }
        }
    }

    if (cookie !== undefined && role_id == "2") {
        const url = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/course/enrolled-course-lessons`;
        const data = {
            course_id: course_id
        }
        const headers = {
            headers: {
                Authorization: `Bearer ${cookie}`,
            }
        }

        const courseLessons = await axios.post(url,data,headers);

        if(courseLessons.data.status === "success"){
            return {
                props: {
                    role_id,
                    course_id,
                    courseLessons: courseLessons.data.courseLessons
                }
            }
        }else{
            return {
                redirect: {
                    destination: "/",
                    permanent: false,
                }
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

import useFetch from "@/hooks/useFetch";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BeatLoader } from "react-spinners";
import { UAParser } from "ua-parser-js";

const RedirectTo = () => {
    const { url } = useParams();
    const { loading, data, fn: getUrlData } = useFetch({ method: "POST", endpoint: `/update` });
    const [reqData, setReqData] = useState(null);

    const parser = new UAParser();

    const getInfo = async () => {
        try {
            const response = await fetch("https://ipapi.co/json");
            const data = await response.json();
            const { city, country_name: country } = data;
            return { city, country };
        } catch (err) {

            console.error("Error fetching IP info:", err);
            return { city: "rate-limit", country: "rate-limit" };
        }
    };
    console.clear();
    useEffect(() => {
        const fetchData = async () => {
            const { city, country } = await getInfo();
            const res = parser.getResult();
            const device = res.device.type || "desktop";
            let requestData = {};
            if (city != "rate-limit" && country != "rate-limit") {
                requestData = {
                    urlID: url,
                    device,
                    city,
                    country
                };
            } else {
                requestData = {
                    urlID: url,
                    device,
                }
            }

            setReqData(requestData);

            getUrlData({
                data: JSON.stringify(requestData)
            });
        };

        fetchData();
    }, [url]);

    useEffect(() => {
        if (data && data?.success) {
            const rurl = data?.data?.data?.originalUrl;
            if (rurl) {
                window.location.replace(rurl)   ;
            }
        }
    }, [data]);

    if (loading || !reqData) {

        // return <BarLoader className="w-full h-full" color="#36d7b7" />;
        return <BeatLoader />
    }

    return null;
};

export default RedirectTo;

import useFetch from "@/hooks/useFetch";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { BarLoader } from "react-spinners";
import { UAParser } from "ua-parser-js";

const RedirectTo = () => {
    const { url } = useParams();
    const {  data, fn: getUrlData } = useFetch({ method: "POST", endpoint: `/update` });


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



         return <BarLoader className="w-full h-full" width={"100%"} color="#36d7b7" />
   
};

export default RedirectTo;

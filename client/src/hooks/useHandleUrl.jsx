import { useUrlContext } from "@/context/UrlContext";
import useFetch from "./useFetch";

const useHandleUrl = () => {

    const { triggerToast } = useUrlContext();
    const { fn: deleteUrlFn, data } = useFetch({ method: 'DELETE', endpoint: 'delete' });
    const copyUrl = (url) => {
        navigator.clipboard.writeText(url);
        triggerToast({
            message: "URL copied to clipboard",
            type: "info",
        })
    }
    const deleteUrl = async (url) => {
        try {
            await deleteUrlFn({ data: JSON.stringify({ urlID: url._id }) })
            console.log({data});
            if (data) {
                if (data.success) {
                    triggerToast({
                        message: "URL deleted successfully",
                        type: "success",
                    })  
                    return true;
                }
            }
        } catch (err) {
            triggerToast({
                message: err.message,
                type: "error",
            })
            console.error("Error deleting url: ", err.message);
        }
    }

    const downloadImage = (url) => {
        const qrData = url.qrData.qrData
        const link = document.createElement("a");
        const fileName = url.title;
        link.href = qrData;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }


    return {
        copyUrl,
        deleteUrl,
        downloadImage,
    }
}

export default useHandleUrl

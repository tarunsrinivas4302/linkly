import { Ban, CircleAlert,  CircleCheck, CircleX, InfoIcon } from "lucide-react";
import { useState } from "react";

/* eslint-disable react/prop-types */
const Toast = ({ type = "info", message }) => {

    const [showNotification, setShowNotification] = useState(true);


    const variants = {
        info : {
            backgroundColor : "#2196f3",
            color : "#fff",
        },
        success : {
            backgroundColor : "#4caf50",
            color : "#fff",
        },
        error : {
            backgroundColor : "#f44336",
            color : "#fff",
        },
        warning : {
            backgroundColor : "#ff9800",
            color : "#fff",
        }
    }

    const icons = {
        info: <InfoIcon className="" />,
        success: <CircleCheck  className=""/>,
        error: <Ban className="" />,
        warning: <CircleAlert className="" />
    }

    const onClose = () => {
        setShowNotification(false);
    }

    if (!showNotification) {
        return '';
    }

    return (
        <div className={`flex items-center mx-4 my-4 text-white shadow-md px-4 py-4 rounded-lg`} style={variants[type]}>
            <span className="inline-block pr-3">{icons[type]}</span>
            {message}
            <CircleX onClick={() => onClose()}  className="text-white ml-3"/>
        </div>
    )
}

export default Toast

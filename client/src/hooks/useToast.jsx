
import { useState, useCallback } from "react";
import Toast from "@/components/ui/toast";

const useToast = (position = "top-right") => {
    const [notifications, setNotifications] = useState([]);

    const centertop = {
        position: "fixed",
        top: "20px",
        left: "50%",
        transform: "translateX(-50%)",  // Ensures the element is perfectly centered horizontally
        width: "100%",                 // Takes up 100% of the viewport width initially
        maxWidth: "max-content",              // Sets a reasonable max width for responsiveness (adjust as needed)
        padding: "0 16px",              // Adds padding for smaller screens to avoid content touching edges
        boxSizing: "border-box",        // Ensures padding is included in the total width
        transition: "transform 0.3s ease",
    };
    
    const styles = {
        "top-right": {
            position: "fixed",
            top: "20px",
            right: "20px",
        },
        "top-left": {
            position: "fixed",
            top: "20px",
            left: "20px",
        },
        "bottom-right": {
            position: "fixed",
            bottom: "20px",
            right: "20px",
        },
        "bottom-left": {
            position: "fixed",
            bottom: "20px",
            left: "20px",
        },
        "top-center": centertop,
        "center-top": centertop,
    };

    const triggerToast = useCallback((notificationProps) => {
        const id = new Date().getTime(); // Unique ID for each notification
        const newNotification = { ...notificationProps, id };

        // Add the new notification to the state
        setNotifications((prevNotifications) => [...prevNotifications, newNotification]);

        // Remove the notification after the specified duration
        setTimeout(() => {
            setNotifications((prevNotifications) =>
                prevNotifications.filter((notification) => notification.id !== id)
            );
        }, notificationProps.duration || 3 * 1000);
    }, []);

    // Render the Toast component if there are notifications
    const ToastComponent = notifications.length ? (
        <div style={styles[position]} >
            {notifications.map((notification) => (
                <Toast key={notification.id} {...notification} />
            ))}
        </div>
    ) : null;

    return { ToastComponent, triggerToast };
};

export default useToast;

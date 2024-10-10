/* eslint-disable react/prop-types */
import * as React from "react";

import { cn } from "@/lib/utils"


const Input  =React.forwardRef(
    ({ className , type , ...props }, ref) => {
        return (
            <input
                ref={ref}
                className={cn("appearance-none block w-full px-3 py-2 text-sm text-body-fg bg-body-bg border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ", className)}
                type={type}
                {...props}
            />
        )
    }
)

Input.displayName = "Input";
export {Input}
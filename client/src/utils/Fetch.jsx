import axios from "axios";


export const getToken = () => {
    const token = getCookie("token") ?? localStorage.getItem("token");
    return token || null;
}

const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}




const api = (props) => {
    const { endpoint, method, data, headers, params, options } = props;
    const token = getToken();
    const mainHeaders = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
    }
    const mainoptions = options
    const axiosInstance = axios.create({
        method: "GET",
        baseURL: import.meta.env.VITE_API_URL,
        headers: { ...mainHeaders, ...headers },
        withCredentials: mainoptions?.withCredentials || false
    });


    axiosInstance.interceptors.response.use(
        (response) => {
            return response.data;
        },
        (error) => {
            return error?.response?.data || error.message
        }
    );

    return axiosInstance({
        url: endpoint,
        method: method,
        data: data || {},
        params: params || "",
        headers: headers,
    });
};

/**
 * 
 * @param {Object} req :: { endpoint, method, data, headers, params }
 * @returns {data ( or ) error }
 */
export const Fetch = async (req) => {
    const { endpoint, method, data, headers, params } = req;
    let options;
    const credentialsPassedArray = ['/auth/login', '/auth/logout'];
    if (credentialsPassedArray.includes(endpoint)) {
        options = { withCredentials: true }
    }



    try {
        const response = await api({
            endpoint,
            method,
            data,
            params,
            headers,
            options
        });
        if (response.success) {
            return Promise.resolve(response);
        }
        else {
            return Promise.reject(response);
        }


    } catch (e) {
        Promise.reject(e.message);
    }
};


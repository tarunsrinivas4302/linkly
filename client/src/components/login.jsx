import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import ErrorMsg from './error';
import { Button } from './ui/button';
import { BeatLoader } from 'react-spinners';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useUrlContext } from '@/context/UrlContext';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import useFetch from '@/hooks/useFetch';
import { Form } from './ui/form';

const Login = () => {
    // Define the form schema
    const formSchema = z.object({
        email: z.string().email({ message: "Invalid email address" }),
        password: z.string().min(6, { message: "Password must be at least 6 characters" }).max(16, { message: "Password cannot exceed 16 characters" })
    });

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const longLink = searchParams.get('createNew') || '';

    const { user, isAuthenticated, error, fetchUser, triggerToast } = useUrlContext();
    console.log(user, isAuthenticated);
    const reqData = {
        endpoint: '/auth/login',
        method: 'POST',
    }
    const { loading, data, fn: loginUser, error: loginerror } = useFetch({ ...reqData, options: "withCredentials : true" });


    useEffect(() => {
        if (user && error == null && !isAuthenticated) {
            fetchUser();
            navigate(`/dashboard/?createNew=${longLink}`);
        }
    }, [user, error, isAuthenticated]);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: ""
        },
    });


    const onSubmit = async (values) => {
        try {
            await loginUser({ data: JSON.stringify(values) });  // Wait for the login to complete
        } catch (err) {
            triggerToast({
                message: err.message,
                type: 'error',
            });
            console.error("error: ", err.message);
        }
    };

    // Use useEffect to check when data changes
    useEffect(() => {

        if (data || loginerror) {
            console.log({ data })
            if (data?.success) {
                const delay = 2000;
                triggerToast({
                    message: 'Login Successful',
                    type: 'success',
                    delay
                });
                setTimeout(() => {
                    navigate(`/dashboard/?createNew=${longLink}`);
                }, delay)
            } else {
                triggerToast({
                    message: loginerror || data?.message || 'Login Failed',
                    type: 'error',
                });
            }
        }
    }, [data, loginerror]);


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <Card className="w-full bg-background2 text-foreground2 border-2">
                    <CardHeader>
                        <CardTitle className="mb-4 text-xl">Login</CardTitle>
                        <CardDescription className="text-md mb-3 text-foreground2">
                            Please Login to Your Account If You Already Have One
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-2.5">
                        {/* Email field */}
                        <div className="space-y-1">
                            <Input
                                type="email"
                                {...form.register("email")}
                                className="border-b-2 px-4 text-lg py-3"
                                placeholder="john@gmail.com"
                                autoFocus
                            />
                            {form.formState.errors.email && <ErrorMsg message={form.formState.errors.email.message} />}
                        </div>

                        {/* Password field */}
                        <div className="space-y-1">
                            <Input
                                type="password"
                                {...form.register("password")}
                                className="border-b-2 px-4 text-lg py-3"
                                placeholder="Enter Your Password"
                            />
                            {form.formState.errors.password && <ErrorMsg message={form.formState.errors.password.message} />}
                        </div>
                    </CardContent>

                    <CardFooter>
                        <Button type="submit" className="my-3 mx-2 px-6 font-semibold text-md  py-6" variant="gradient">
                            {loading ? <BeatLoader size={10} color="#36d7b7" /> : "Login"}
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </Form>
    );
};

export default Login;

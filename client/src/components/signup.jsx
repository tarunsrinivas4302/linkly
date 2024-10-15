import { Form } from "./ui/form"
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { BeatLoader } from 'react-spinners';
import { useForm } from "react-hook-form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import ErrorMsg from "./error";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { useUrlContext } from "@/context/UrlContext";
import useFetch from "@/hooks/useFetch";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";


const Signup = () => {
  const [isVisible, setIsVisible] = useState(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const longLink = searchParams.get('createNew') || '';

  const [loginData, setLoginData] = useState({ email: '', password: '' });

  const reqData = {
    endpoint: "/auth/save",
    method: "POST",
  }
  const { loading, data, fn: signupUser, error: signuperror } = useFetch({ ...reqData });
  const { triggerToast } = useUrlContext();

  const loginreqData = { endpoint: '/auth/login', method: 'POST' }
  const { data: logindata, error: loginerror, fn: loginuser } = useFetch({ ...loginreqData, withCredentials: true });

  const formSchema = z.object({
    uname: z.string().min(4, { message: "UserName Must be More than 4 characters" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }).max(16, { message: "Password cannot exceed 16 characters" }),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      uname: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values) => {
    console.log(values);
    await signupUser({ data: JSON.stringify(values) })
    form.reset();
    setLoginData({ email: values.email, password: values.password });
  }

  const onLoginSubmit = async (values) => {
    await loginuser({ data: JSON.stringify(values) });
  }

  useEffect(() => {
    if (logindata) {
      if (logindata?.success) {
        navigate(`/dashboard?createNew=${longLink}`)
      } else {
        triggerToast({
          message: loginerror || data?.message || 'Login Failed',
          type: 'error',
        });
      }
    }
  }, [logindata])

  useEffect(() => {
    if (data || signuperror) {
      if (data?.success) {
        triggerToast({
          message: 'Sign In Successful',
          type: 'success',
        });
        onLoginSubmit(loginData);
      } else {
        triggerToast({
          message: signuperror || data?.message || 'Signup Failed',
          type: 'error',
        });
      }
    }
  }, [data, signuperror])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="w-full bg-body-bg text-body-fg">
          <CardHeader className="">
            <CardTitle className="mb-4 text-xl">Register</CardTitle>
            <CardDescription className="text-md  text-body-fg">
              Please Create An Account To Proceed With Your Short Url Journey...
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-0.5 ">

            <div className="space-y-1">
              <Input
                type="text"
                {...form.register("uname")}
                className="border-b-2  px-4 text-lg py-3"
                placeholder="John"
                autoFocus
              />
              {form.formState.errors.uname && <ErrorMsg message={form.formState.errors.uname.message} />}
            </div>

            {/* Email field */}
            <div className="space-y-0.5">
              <Input
                type="email"
                {...form.register("email")}
                className="border-b-2  px-4 text-lg py-3"
                placeholder="john@gmail.com"
              />
              {form.formState.errors.email && <ErrorMsg message={form.formState.errors.email.message} />}
            </div>

            {/* Password field */}
            <div className="space-y-0.5 relative">
              <Input
                type="password"
                {...form.register("password")}
                className="border-b-2  px-4 text-lg py-3"
                placeholder="Enter Your Password"
              />
              {isVisible ? <Eye onClick={() => setIsVisible(!isVisible)} className='cursor-pointer  inline absolute  right-4 bottom-3.5 text-white' /> : <EyeOff className='cursor-pointer inline absolute right-4 bottom-3.5 text-white' onClick={() => setIsVisible(!isVisible)} />}
              {form.formState.errors.password && <ErrorMsg message={form.formState.errors.password.message} />}
              {form.formState.errors.password && <ErrorMsg message={form.formState.errors.password.message} />}
            </div>
          </CardContent>

          <CardFooter>
            <Button type="submit" className="my-2.5 mx-2 px-6 font-semibold text-md  py-6" variant="gradient">
              {loading ? <BeatLoader size={10} color="#36d7b7" /> : "Register"}
            </Button>
          </CardFooter>


        </Card>
      </form>
    </Form>
  )
}

export default Signup

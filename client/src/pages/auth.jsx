import Login from "@/components/login"
import { useUrlContext } from "@/context/UrlContext"
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Signup from "@/components/signup";
const Auth = () => {

  const navigate = useNavigate();
  const { user, isAuthenticated, error } = useUrlContext();

  const [searchParams] = useSearchParams();
  const longLink = searchParams.get('createNew') || '';
  useEffect(() => {
    if (isAuthenticated) {
      navigate(`/dashboard/?createNew=${longLink}`);
    }
  }, [user, error, isAuthenticated]);

  console.log({user, error, isAuthenticated});
  return (
    <Tabs defaultValue="login" className="lg:w-1/3 sm:w-2/3 mt-32  mx-auto" >
      <TabsList className="mb-0 py-[25px] px-[6px] w-full bg-[#bfbebe3e]" >
        <TabsTrigger value="login" className="text-xl px-1 py-1 mx-2 w-1/2">Login</TabsTrigger>
        <TabsTrigger value="signup" className="text-xl px-1 py-1 mx-2 w-1/2">Register</TabsTrigger>
      </TabsList>
      <TabsContent value="login"><Login /></TabsContent>
      <TabsContent value="signup"><Signup /></TabsContent>
    </Tabs>
  )
}

export default Auth

import useFetch from "@/hooks/useFetch";

import { Link, useNavigate } from "react-router-dom"
import { DotLoader } from "react-spinners";
import { Button } from "./ui/button";
import { LinkIcon, LogOut } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useUrlContext } from "@/context/UrlContext";
import { useEffect } from "react";


const Header = () => {

  const navigate = useNavigate();


  const options = {
    endpoint: '/auth/logout',
    method: 'POST',
  }
  let { user , fetchUser } = useUrlContext();
  const { data: logOutData, loading, fn: logoutUser } = useFetch({ ...options });

  const handleLogout = async () => {
    console.clear();
    await logoutUser();
    await fetchUser();
  }
  useEffect(() => {
    if (logOutData?.success || logOutData?.data?.success) {
      navigate('/auth');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [logOutData])

  console.log({ user });
  return (
    <>
      <nav className="py-4 flex justify-between items-center">
        <p><Link to='/' className="text-balance text-3xl gradient-heading ">Linkly</Link><sup className="gradient-heading text-xs -top-3 left-1">&reg;</sup></p>

        <div className="flex gap-4">
          {!user ? (
            <Button onClick={() => navigate("/auth")} variant="gradient_op" className="rounded-3xl px-5 py-5">Login</Button>
          ) : (
            <DropdownMenu>

              {/* Triggers the DropDown */}
              <DropdownMenuTrigger className="w-10 rounded-full overflow-hidden">
                <Avatar>
                  <AvatarFallback className="uppercase focus-visible:outline-0 bg-destructive">
                    <span className="focus-visible::outline-0 text-stone-200">{user?.userName.toString().toUpperCase().slice(0, 2)}</span>
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="py-5">
                   <DropdownMenuItem onSelect={() => navigate("/dashboard")} className="cursor-pointer focus-visible:outline-0">
                  <LinkIcon className="inline mr-2 h-4 w-4" />
                      My Links
                  </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLogout();
                  }}
                  className="text-red-400 focus-visible:outline-0 cursor-pointer"
                >
                  <LogOut className="mr-2 inline-block h-4 w-4" />
                  <span className="h-4 focus:border-collapse w-max">Logout</span>
                </DropdownMenuItem>

              </DropdownMenuContent>

            </DropdownMenu>
          )}
        </div>
      </nav>
      {loading && <DotLoader className="mb-4" width={"100%"} color="#36d7b7" />}
    </>
  );
};


export default Header

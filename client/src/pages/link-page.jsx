import Chart from "@/components/chart";
import ErrorMsg from "@/components/error";
import useFetch from "@/hooks/useFetch";
import useHandleUrl from "@/hooks/useHandleUrl";
import { CopyIcon, DownloadIcon, TrashIcon } from "lucide-react";
import { useEffect } from "react";
import { QRCode } from "react-qrcode-logo";
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { BarLoader } from "react-spinners";
import { LinkIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const LinkPage = () => {

  const [searchParams] = useSearchParams();

  const navigate = useNavigate();
  
  const urlID = searchParams.get("url");

  const { loading, error, data, fn: getSingleUrl } = useFetch({ method: "POST", endpoint: "/getSingleUrl" });

  const { copyUrl, downloadImage, deleteUrl } = useHandleUrl();



  useEffect(() => {
    getSingleUrl({
      data: JSON.stringify({ urlID }),
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleDelete = (url) => {
    if(deleteUrl(url)) navigate('/dashboard')
  }

  if (loading) return <BarLoader className="w-full h-full"/>

  if (error) return <ErrorMsg message={error.message} />

  if (data?.data) {
    return (<div className="flex lg:flex-row md:flex-row lg:w-full md:w-full w-full max-sm:flex-col space-y-2 mt-6 sm:flex-col">
      <div className="w-1/2 max-sm:w-full flex flex-col md:mx-auto max-sm:mx-auto sm:w-full md:w-1/2 lg:w-1/2">
        <h1 className="font-bold text-4xl ml-5 mb-5">{data?.data.title}</h1>
        <Link to={`/${data?.data._id}`}
          className="text-xl font-bold hover:underline ml-4 mb-2 inline-block text-blue-600"
          onClick={(e) => e.stopPropagation()} >{data?.data.shortUrl}</Link>
        <p className="text-md font-normal mb-3 cursor-pointer"><LinkIcon className="inline-block ml-1 mr-2" />{data?.data.originalUrl}</p>

        <QRCode value={data?.data.shortUrl} size={320} />
        <p className="my-3 mx-3">Created At : {data?.data?.createdAt}</p>
        <div className="w-[300px] flex space-x-4 mx-2 my-4">
          <CopyIcon className="inline-block w-1/3 cursor-pointer" onClick={() => copyUrl(data?.data.shortUrl)} />
          <DownloadIcon className="inline-block w-1/3 cursor-pointer " onClick={() => downloadImage(data?.data)} />
          <TrashIcon className="inline-block cursor-pointer w-1/3 " onClick={() => handleDelete(data?.data)} />
        </div>

      </div>
      <Card className="w-1/2 rounded-sm max-sm:w-full flex flex-col md:mx-auto max-sm:mx-auto sm:w-full md:w-1/2 lg:w-1/2  h-full bg-body-bg text-body-fg my-2 space-y-0">
        <CardHeader className="text-4xl font-bold  border-b-1">
          <CardTitle className="border-b pb-5 ">Stats</CardTitle>
        </CardHeader>
        <Card className="bg-body-bg text-body-fg border-0 my-0">
          <CardHeader className="my-0 space-y-0">
            <CardTitle>Total Clicks</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{data?.data.clicks}</p>
          </CardContent>
        </Card>

        <Card className="bg-body-bg text-body-fg w-full">
          <Chart  />
        </Card>


      </Card>
    </div>
    )
  }

}

export default LinkPage

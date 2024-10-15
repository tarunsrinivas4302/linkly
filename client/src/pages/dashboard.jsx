import { lazy, Suspense, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import useFetch from "@/hooks/useFetch"
import useHandleUrl from "@/hooks/useHandleUrl"
import { CopyIcon, DownloadIcon, Filter, TrashIcon } from "lucide-react"
import { QRCode } from "react-qrcode-logo"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { BarLoader } from "react-spinners"

const CreateLink = lazy(() => import("@/components/create-link"));
const ErrorMsg = lazy(() => import("@/components/error"));

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [trigger, setTrigger] = useState(0);
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || 1;
  const { loading, error, data, fn: getUrls } = useFetch({ method: "GET", endpoint: `/getUrls?page=${page}` });
  const navigate = useNavigate();
  const { copyUrl, downloadImage, deleteUrl } = useHandleUrl();

  useEffect(() => {
    getUrls();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger]);

  const handleRedirect = (e, url) => {
    e.stopPropagation();
    navigate(url);
  }

  let total_clicks = 0;

  if (data?.data) {
    total_clicks = data?.data.allUrls?.reduce((acc, curr) => acc + curr.clicks, 0);
  }

  const handleCopy = (url) => {
    copyUrl(url);
  }

  const handleDownload = (url) => {
    downloadImage(url);
  }

  const handleDelete = (url) => {
    setTrigger(Math.random() * 1000);
    deleteUrl(url);
  }

  return (
    <div className="flex flex-col gap-8">
      {loading && <BarLoader className="w-full h-full" />}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-body-bg text-body-fg">
          <CardHeader>
            <CardTitle>Links Created</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{data?.data.pageInfo?.totalCount}</p>
          </CardContent>
        </Card>
        <Card className="bg-body-bg text-body-fg">
          <CardHeader>
            <CardTitle>Total Clicks</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{total_clicks}</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between">
        <h1 className="text-4xl font-extrabold">My Links</h1>
        <Suspense fallback={<BarLoader className="w-full h-full" />}>
          <CreateLink setTrigger={setTrigger} />
        </Suspense>
      </div>

      <div className="relative">
        <Input
          type="text"
          className="h-10 w-full px-6 py-3 rounded-md border-2"
          placeholder="Filter Links..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Filter className="absolute top-2 right-2 p-1" />
      </div>

      <Suspense fallback={<BarLoader className="w-full h-full" />}>
        {error && <ErrorMsg message={error.message} />}
      </Suspense>

      {data?.data?.allUrls ? (
        data?.data.allUrls
          .filter(url => (url.title.toLowerCase() || url.shortUrl.toLowerCase() || url.originalUrl.toLowerCase()).includes(searchQuery.toLowerCase()))
          .map(url => (
            <Card key={url._id} className="bg-body-bg text-body-fg relative overflow-hidden">
              <CardContent
                className="p-4 flex gap-3 w-full max-sm:flex-col max-sm:gap-2"
                onClick={(e) => handleRedirect(e, `/link/?url=${url._id}`)}
              >
                <QRCode value={url.shortUrl} className="max-sm:w-4/5" />

                <div className="w-full flex flex-col overflow-hidden">
                  <p className="text-2xl font-bold mt-2 break-words">
                    {url.title}
                  </p>

                  <Link
                    to={`/${url._id}`}
                    className="text-xl font-bold hover:underline my-2 block text-blue-600 truncate"
                    onClick={(e) => e.stopPropagation()} // Prevent bubbling
                  >
                    {url.shortUrl}
                  </Link>

                  <p
                    className="gap-1 hover:underline cursor-pointer text-lg p-1 break-words truncate overflow-hidden max-h-12"
                    title={url.originalUrl} // Add tooltip for long text
                  >
                    {url.originalUrl}
                  </p>
                </div>
              </CardContent>

              <div className="flex gap-2">
                <CopyIcon className="absolute top-2 right-24 cursor-pointer" onClick={() => handleCopy(url.shortUrl)} />
                <DownloadIcon className="absolute top-2 cursor-pointer right-12" onClick={() => handleDownload(url)} />
                <TrashIcon className="absolute top-2 cursor-pointer right-2" onClick={() => handleDelete(url)} />
              </div>
            </Card>

          ))
      ) : (
        <p className="text-center text-xl">No links found.</p>
      )}
    </div>
  );
};

export default Dashboard;

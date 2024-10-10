/* eslint-disable react/prop-types */
import { useUrlContext } from "@/context/UrlContext"
import useFetch from "@/hooks/useFetch";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useSearchParams } from "react-router-dom";
import { BarLoader } from "react-spinners";
import { z } from "zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import ErrorMsg from "./error";
import { Form } from "./ui/form";
import { useEffect  , useState } from "react";
import { QRCode } from "react-qrcode-logo";


const CreateLink = ({ setTrigger = () => { } }) => {
    const [isOpen, setIsOpen] = useState(false);  
    const [searchParams, setSearchParams] = useSearchParams();
    const longLink = searchParams.get("createNew");

    const { triggerToast } = useUrlContext();
    const { data,loading , error, fn: createShortUrl } = useFetch({ method: "POST", endpoint: "shorten" });



    useEffect(() => {
        if (longLink) {
            setIsOpen(true);
        }
    }, [longLink]);

    useEffect(() => {
        if (data?.success) {
            triggerToast({
                type: 'success',
                message: data?.message || 'Link Created Successfully',
                delay: 2000,
            });
            form.reset();
            setSearchParams({});
            setTrigger(Math.random() * 1000);
            setIsOpen(false);
        } else if (error) {
            triggerToast(
            {
                message: error || "An Error Occurred",
                type: "info",
                delay: 2000,
            } , "bottom-right");
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, error, setSearchParams]);

    const originalUrl = z.string().url({ message: "Original Url Can't be Empty .." }).refine((url) => {
        return url.startsWith("http://") || url.startsWith("https://");
    }, { message: "Must provide a valid URL starting with http:// or https://" });

    const formSchema = z.object({
        title: z.string().min(3, { message: "Title Can't be Empty" }),
        originalUrl,
        shortCode: z.string(),
    });

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            originalUrl: longLink || "",
            shortCode: ""
        },
    });

    const handleFormClose = () => {
        form.reset();
        setIsOpen(false); 
    };

    const onSubmit = async (values) => {
        try {
            await createShortUrl({ data: JSON.stringify(values) });
        } catch (err) {
            triggerToast({
                message: err.message,
                type: 'error',
            });
            form.reset();
        }
    };

    if (loading) {
        return <BarLoader className="w-full h-full" />;
    }
    return (
        <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
            <DialogTrigger asChild>
                <Button variant="destructive">Create New Link</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-1/2 bg-body-bg text-body-fg">
                <DialogHeader>
                    <DialogTitle className="font-bold text-2xl">Create New</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <QRCode value={longLink || "http://localhost:5173"} size={250} />
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="mb-3.5">
                            <Input
                                id="title"
                                placeholder="Short Link's Title"
                                {...form.register("title")}
                                className="border-2 px-3.5 text-lg py-2.5 w-full"
                                type="text"
                                autoFocus
                            />
                            {form.formState.errors?.title && <ErrorMsg message={form.formState.errors.title.message} />}
                        </div>
                        <div className="mb-3.5">
                            <Input
                                id="originalUrl"
                                placeholder="Enter your Loooong URL"
                                {...form.register("originalUrl")}
                                className="border-2 px-3.5 text-lg py-2.5 w-full mb-3.5"
                                type="url"
                            />
                            {form.formState.errors?.originalUrl && <ErrorMsg message={form.formState.errors.originalUrl.message} />}
                        </div>
                        <div>
                            <Input
                                id="shortCode"
                                placeholder="Enter a custom short code (optional)"
                                {...form.register("shortCode")}
                                className="border-2 px-3.5 text-lg py-2.5 w-full mb-3.5"
                            />
                            {form.formState.errors?.shortCode && <ErrorMsg message={form.formState.errors.shortCode?.message} />}
                        </div>
                        <DialogFooter>
                            <div>
                                <Button type="submit" variant="primary" className="mx-2" onClick={() => setTrigger(Math.random() * 1000)}>
                                    Create Link
                                </Button>
                                <DialogClose type="button" onClick={handleFormClose} className="bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 rounded-md px-4 font-bold py-1.5">
                                    Close
                                </DialogClose>
                            </div>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateLink;

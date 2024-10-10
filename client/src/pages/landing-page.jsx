import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "lucide-react";
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion"

const LandingPage = () => {
	const [longurl, setLongUrl] = useState("")

	const navigate = useNavigate();


	const handleSubmit = (e) => {
		e.preventDefault();
		if (longurl) {
			navigate(`/auth?createNew=${longurl}`)
		}
	}


	return (
		<div className="w-full flex flex-col items-center mt-6">
			<h2 className="gradient-heading text-3xl ">Shorten Your Loooong Links :)</h2>

			<p className="text-body-fg font-medium"> Linkly is an Efficent and easy-to-use URL shortening service that streamines your online experience </p>
			<form onSubmit={handleSubmit} className="sm:h-14 relative  flex flex-col sm:flex-row w-full md:w-2/4 gap-2">
				<Link className="absolute top-14 left-3" />
				<Input
					type="url"
					placeholder="Enter Loooong Url .."
					onChange={e => setLongUrl(e.target.value)}
					className="h-full flex-1 py-4 border-2 mt-10 w-full pl-11 rounded-[2rem]"
					autoFocus
				/>
				<Button type="submit" className="absolute right-0.5 top-[43.5px] py-[25.2px] w-32 hover:bg-[#144ee3]  rounded-3xl bg-[#144EE3] border-[#144EE3] shadow-[10px 9px 22px rgba(20, 78, 227, 0.38);]">Shorten Now</Button>

			</form>

			<img className="w-full mb-20 h-full block mt-28" src="./main-1.jpg" />

			<Accordion type="multiple" collapsible className="w-full md:px-11 mb-20">
				<AccordionItem value="item-1">
					<AccordionTrigger>
						How does the Linkly URL shortener works?
					</AccordionTrigger>
					<AccordionContent>
						When you enter a long URL, our system generates a shorter version of
						that URL. This shortened URL redirects to the original long URL when
						accessed.
					</AccordionContent>
				</AccordionItem>
				<AccordionItem value="item-2">
					<AccordionTrigger>
						Do I need an account to use the app?
					</AccordionTrigger>
					<AccordionContent>
						Yes. Creating an account allows you to manage your URLs, view
						analytics, and customize your short URLs.
					</AccordionContent>
				</AccordionItem>
				<AccordionItem value="item-3">
					<AccordionTrigger>
						Is this App Provides QR Scanner
					</AccordionTrigger>
					<AccordionContent>
						Yes , It is Providing QR Code to Scan Your Url
					</AccordionContent>
				</AccordionItem>
				<AccordionItem value="item-4">
					<AccordionTrigger>
						What analytics are available for my shortened URLs?
					</AccordionTrigger>
					<AccordionContent>
						You can view the number of clicks, geolocation data of the clicks
						and device types (mobile/desktop) for each of your shortened URLs.
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</div>
	)
}

export default LandingPage


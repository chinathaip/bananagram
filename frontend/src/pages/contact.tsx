import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

export default function ContactPage() {
	const [issue, setIssue] = useState("")
	const [description, setDescription] = useState("")
	return (
		<div className="flex min-h-screen w-full items-start justify-center pt-8">
			<Card className="w-[350px]">
				<CardHeader>
					<CardTitle>Contact Us</CardTitle>
					<CardDescription>Please Tell Us How We Can Help You Today</CardDescription>
				</CardHeader>
				<CardContent>
					<form>
						<div className="grid w-full items-center gap-4">
							<div className="flex flex-col space-y-1.5">
								<Label htmlFor="your issue">Your Issue</Label>
								<Select onValueChange={(selectedValue)=>{
											setIssue(selectedValue);
										}
									}> 
									<SelectTrigger id="your issue">
										<SelectValue placeholder="Select" />
									</SelectTrigger>
									<SelectContent position="popper">
										<SelectItem value="Account">Account</SelectItem>
										<SelectItem value="Technical Issue">Technical Issue</SelectItem>
										<SelectItem value="other">Other</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div className="flex flex-col space-y-1.5">
								<Label htmlFor="name">Please describe your issue</Label>
								<Textarea onChange={e => setDescription(e.target.value)} placeholder="Describe the issue you are experiencing" />
							</div>
						</div>
					</form>
				</CardContent>
				<CardFooter className="flex justify-between">
					<Button onClick={()=>{
						window.open(`mailto:2009170008@students.stamford.edu?subject=${issue}&body=${description}`);
					}}>Submit</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
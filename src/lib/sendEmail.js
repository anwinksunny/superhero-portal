import { send } from "@emailjs/browser";

export default async function sendGrievanceEmail(data) {
  const serviceID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
  const templateID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

  const payload = {
    name: data.name ?? "Unknown",
    age: data.age ?? "",
    location: data.location ?? "",
    email: data.email ?? "",
    problem: data.problem ?? "",
    submittedAt: new Date().toLocaleString(),
  };

  return send(serviceID, templateID, payload, { publicKey });
}
export default async function sendGrievanceEmail(data) {
  const serviceID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
  const templateID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

  if (!serviceID || !templateID || !publicKey) {
    throw new Error(
      "EmailJS is not configured. Set NEXT_PUBLIC_EMAILJS_SERVICE_ID, " +
        "NEXT_PUBLIC_EMAILJS_TEMPLATE_ID and NEXT_PUBLIC_EMAILJS_PUBLIC_KEY in .env.local."
    );
  }

  const payload = {
    name: data.name ?? "Unknown",
    age: data.age ?? "",
    location: data.location ?? "",
    email: data.email ?? "",
    problem: data.problem ?? "",
    submittedAt: new Date().toLocaleString(),
  };

  // EmailJS is only needed after the visitor completes the form. Loading it
  // here keeps its SDK out of the chat's first-open JavaScript chunk.
  const { send } = await import("@emailjs/browser");
  return send(serviceID, templateID, payload, { publicKey });
}

import React, { useState } from "react";
import { Send } from "lucide-react";
import emailjs from "@emailjs/browser";

const SERVICE_ID = "service_7v28fk4";
const TEMPLATE_ID = "template_86fla5t";
const PUBLIC_KEY = "4Uct-3XbjVdkMuIr5";

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setStatus(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // basic client-side validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatus({ type: "error", text: "Please fill in all fields." });
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,      // important: template should use {{from_email}}
        message: formData.message,
        time: new Date().toLocaleString(), // optional but helpful in the email
      };

      await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);

      setStatus({ type: "success", text: "Message sent successfully!" });
      setFormData({ name: "", email: "", message: "" });

      // auto-clear success message after a short time
      setTimeout(() => setStatus(null), 4500);
    } catch (err) {
      console.error("EmailJS Error:", err);
      setStatus({ type: "error", text: "Failed to send message. Try again later." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-emerald-100 p-8 rounded-xl w-full">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Send Us a Message</h2>

      <form className="space-y-5" onSubmit={handleSubmit}>
        {/* Name */}
        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-800">Your Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-800">Your Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-800">Message</label>
          <textarea
            rows="5"
            name="message"
            placeholder="Type your message..."
            value={formData.message}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-2 w-full bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-all duration-200 font-semibold shadow-md"
        >
          <Send className="w-4 h-4" />
          {loading ? "Sending..." : "Send Message"}
        </button>

        {/* Status Messages */}
        {status && (
          <p className={`text-center font-medium ${status.type === "success" ? "text-emerald-700" : "text-red-600"}`}>
            {status.text}
          </p>
        )}
      </form>

      
    </div>
  );
};

export default Contact;

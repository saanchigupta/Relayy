import React, { useState } from "react";
import Navbar from "../Navbar";
import Header from "../components/Header";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  {
    question: "What is RELAYY?",
    answer:
      "RELAYY is a localized e-commerce platform built for students of a specific institution to buy and sell pre-owned items. The goal is to reduce waste by giving used items a second life — instead of discarding them or buying new ones unnecessarily.",
  },
  {
    question: "Who can use RELAYY?",
    answer:
      "Only verified students from the same institution can use RELAYY. This ensures that all buyers and sellers belong to the same trusted community.",
  },
  {
    question: "How do I list an item for sale?",
    answer:
      "Simply log in with your student credentials, go to the “Sell” section, fill out the item details (title, price, description, photos), and publish your listing. Your item will instantly appear to other students on the platform.",
  },
  {
    question: "How can I contact a seller?",
    answer:
      "Each listing includes a “Chat Now” option. You can chat or message the seller directly through the in-app communication system or the contact details provided.",
  },
  {
    question: "Is there any transaction or service fee?",
    answer:
      "No, RELAYY does not charge any transaction fees. The platform simply connects students to exchange items directly. Payments can be made in person or via any preferred method agreed upon by both parties.",
  },
  {
    question: "How does RELAYY promote sustainability?",
    answer:
      "RELAYY encourages students to reuse, recycle, and reduce waste by enabling the exchange of pre-owned items. Every item reused means fewer resources consumed and less waste generated.",
  },
  {
    question: "What types of items can I sell?",
    answer:
      "You can list almost any student-relevant item — books, electronics, lab equipment, furniture, stationery, or even club merchandise — as long as it complies with your institution’s guidelines.",
  },
  {
    question: "How does RELAYY ensure safety and trust between users?",
    answer:
      "All users are verified through their institution email before creating an account. This ensures that only genuine students from your college or university can interact, reducing the chances of scams or fake listings.",
  },
  {
    question: "Can I edit or remove my listing after posting it?",
    answer:
      "Yes, you can easily manage your listings from your profile dashboard. You can edit details, change photos, mark an item as sold, or delete it anytime.",
  },
  {
    question: "What should I do after buying or selling an item?",
    answer:
      "Once the exchange is complete, both users can mark the transaction as successful. This helps maintain a reliable record and improves the platform’s trust score for active users.",
  },
];

function Faqs() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      <Navbar />
      <Header title="FAQs" />

      <section className="max-w-5xl mx-auto py-16 px-6 text-gray-700 ">
        <h2 className="text-3xl font-semibold mb-10 text-purple-800 text-center">
          Frequently Asked Questions
        </h2>

        <div className="space-y-5">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-xl p-5 shadow-sm bg-white hover:shadow-md transition-all duration-300"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="flex justify-between items-center w-full text-left"
              >
                <h3 className="text-lg font-semibold text-purple-700">
                  {index + 1}. {faq.question}
                </h3>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-purple-700" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-purple-700" />
                )}
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index ? "max-h-48 mt-3" : "max-h-0"
                }`}
              >
                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Subtext */}
        <p className="text-center text-gray-500 mt-16 text-sm">
          Can’t find what you’re looking for?{" "}
          <a
            href="/contact"
            className="text-purple-700 hover:underline font-medium"
          >
            Contact us here.
          </a>
        </p>
      </section>
    </>
  );
}

export default Faqs;

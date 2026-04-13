import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

// The data is the same as your snippet
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

/**
 * FIXED: This is now a component, not a full page.
 * CREATIVE UPDATE: Switched to Emerald theme and a 2-column grid layout.
 */
function Faqs() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    // Switched font and text colors to match theme
    <section className="font-poppins w-full">
      {/* Centered header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900">
          Frequently Asked Questions
        </h2>
        <p className="text-lg text-gray-600 mt-2 max-w-2xl mx-auto">
          Answers to your most common questions about buying and selling on
          Relayy.
        </p>
      </div>

      {/* Creative Update: Changed to a 2-column grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className={`border rounded-xl bg-white transition-all duration-300 ${
                isOpen
                  ? "shadow-lg border-emerald-200" // Highlight when open
                  : "shadow-sm border-gray-200"
              }`}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="flex justify-between items-center w-full text-left p-5"
              >
                <h3 className="text-md font-semibold text-gray-900">
                  {faq.question}
                </h3>
                {isOpen ? (
                  <ChevronUp className="w-5 h-5 text-emerald-700 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-emerald-700 flex-shrink-0" />
                )}
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isOpen ? "max-h-96" : "max-h-0"
                }`}
              >
                <p className="text-gray-600 leading-relaxed text-sm p-5 pt-0">
                  {faq.answer}
                </p>
              </div>
            </div>
          );
        })}

      </div>
    </section>
  );
}

export default Faqs;


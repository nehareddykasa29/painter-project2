import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import './FAQ.css';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "How do I get a free estimate?",
      answer: "Getting a free estimate is easy! You can either fill out our online quote form, call us at (123) 456-7890, or schedule an appointment through our website. We'll visit your property at a convenient time to assess the project and provide you with a detailed, no-obligation estimate."
    },
    {
      question: "What types of paint do you use?",
      answer: "We use only premium quality paints from trusted brands like Sherwin-Williams, Benjamin Moore, and Behr. We select the appropriate paint type based on your project needs - whether it's interior, exterior, high-traffic areas, or specialty surfaces. All our paints are low-VOC and environmentally friendly."
    },
    {
      question: "How long does a typical painting project take?",
      answer: "Project timelines vary depending on the scope of work. A single room typically takes 1-2 days, while a whole house interior can take 3-7 days. Exterior painting usually takes 2-5 days depending on the size and condition of the home. We'll provide you with a detailed timeline during your estimate."
    },
    {
      question: "Do you provide a warranty on your work?",
      answer: "Yes! We stand behind our work with a comprehensive 2-year limited workmanship warranty. This covers any peeling, cracking, or other application defects. We also provide full manufacturer warranties on all paint and materials used."
    },
    {
      question: "What preparation work is included?",
      answer: "Our standard preparation includes washing surfaces, scraping loose paint, filling holes and cracks, sanding rough areas, and priming when necessary. We also protect your furniture and floors with drop cloths and plastic sheeting. Any additional prep work needed will be discussed during your estimate."
    },
    {
      question: "Are you licensed and insured?",
      answer: "Absolutely! We are fully licensed, bonded, and insured. Our insurance covers both liability and workers' compensation, so you're protected throughout the entire project. We're happy to provide proof of insurance upon request."
    },
    {
      question: "Can you help me choose colors?",
      answer: "Yes! We offer professional color consultation services. Our experts can help you select the perfect colors that complement your space, lighting, and personal style. We can provide color samples and even paint small test areas to help you make the best decision."
    },
    {
      question: "Do you work in all weather conditions?",
      answer: "For exterior painting, we need appropriate weather conditions - temperatures between 50-85°F with low humidity and no rain. We monitor weather forecasts closely and will reschedule if conditions aren't suitable. Interior painting can be done year-round regardless of weather."
    },
    {
      question: "What's included in your cleanup?",
      answer: "Complete cleanup is included in every project. We remove all drop cloths, clean up paint drips, dispose of materials properly, and leave your space clean and ready to enjoy. We also do a final walkthrough with you to ensure everything meets your expectations."
    },
    {
      question: "How do I prepare my home for painting?",
      answer: "We'll provide you with a detailed preparation checklist before we start. Generally, you'll need to remove or cover personal items, clear wall decorations, and move furniture away from walls. For exterior work, we ask that you trim bushes and remove items from around the house perimeter."
    },
    {
      question: "Do you offer financing options?",
      answer: "Yes, we offer flexible financing options to help make your painting project more affordable. We work with several financing partners to provide competitive rates and terms. Contact us to learn more about available financing options for your project."
    },
    {
      question: "What if I'm not satisfied with the work?",
      answer: "Your satisfaction is our top priority. If you're not completely happy with any aspect of our work, we'll make it right at no additional cost. We conduct a thorough final inspection with you and address any concerns immediately. Our warranty also covers any future issues."
    }
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="faq-container">
      <div className="faq-header">
        <h2>Frequently Asked Questions</h2>
        <p>Get answers to common questions about our painting services</p>
      </div>
      
      <div className="faq-list">
        {faqs.map((faq, index) => (
          <motion.div
            key={index}
            className="faq-item"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <button
              className={`faq-question ${activeIndex === index ? 'active' : ''}`}
              onClick={() => toggleFAQ(index)}
              aria-expanded={activeIndex === index}
            >
              <span>{faq.question}</span>
              <motion.div
                className="faq-icon"
                animate={{ rotate: activeIndex === index ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <FaChevronDown />
              </motion.div>
            </button>
            
            <AnimatePresence>
              {activeIndex === index && (
                <motion.div
                  className="faq-answer"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  <div className="faq-answer-content">
                    <p>{faq.answer}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
      
      <div className="faq-footer">
        <h3>Still have questions?</h3>
        <p>Can't find the answer you're looking for? Our team is here to help!</p>
        <div className="faq-contact-buttons">
          <a href="tel:+1234567890" className="btn btn-primary">
            Call Us Now
          </a>
          <a href="/contact" className="btn btn-outline">
            Send a Message
          </a>
        </div>
      </div>
    </div>
  );
};

export default FAQ; 
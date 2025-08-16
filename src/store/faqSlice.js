import { createSlice } from "@reduxjs/toolkit";

const faqSlice = createSlice({
  name: "faq",
  initialState: {
    faqs: [
      {
        id: 1,
        question: "How do I get a free estimate?",
        answer: "Getting a free estimate is easy! You can either fill out our online quote form, call us at (123) 456-7890, or schedule an appointment through our website. We'll visit your property at a convenient time to assess the project and provide you with a detailed, no-obligation estimate."
      },
      {
        id: 2,
        question: "What types of paint do you use?",
        answer: "We use only premium quality paints from trusted brands like Sherwin-Williams, Benjamin Moore, and Behr. We select the appropriate paint type based on your project needs - whether it's interior, exterior, high-traffic areas, or specialty surfaces. All our paints are low-VOC and environmentally friendly."
      },
      {
        id: 3,
        question: "How long does a typical painting project take?",
        answer: "Project timelines vary depending on the scope of work. A single room typically takes 1-2 days, while a whole house interior can take 3-7 days. Exterior painting usually takes 2-5 days depending on the size and condition of the home. We'll provide you with a detailed timeline during your estimate."
      },
      {
        id: 4,
        question: "Do you provide a warranty on your work?",
        answer: "Yes! We stand behind our work with a comprehensive 2-year limited workmanship warranty. This covers any peeling, cracking, or other application defects. We also provide full manufacturer warranties on all paint and materials used."
      },
      {
        id: 5,
        question: "What preparation work is included?",
        answer: "Our standard preparation includes washing surfaces, scraping loose paint, filling holes and cracks, sanding rough areas, and priming when necessary. We also protect your furniture and floors with drop cloths and plastic sheeting. Any additional prep work needed will be discussed during your estimate."
      },
      {
        id: 6,
        question: "Are you licensed and insured?",
        answer: "Absolutely! We are fully licensed, bonded, and insured. Our insurance covers both liability and workers' compensation, so you're protected throughout the entire project. We're happy to provide proof of insurance upon request."
      },
      {
        id: 7,
        question: "Can you help me choose colors?",
        answer: "Yes! We offer professional color consultation services. Our experts can help you select the perfect colors that complement your space, lighting, and personal style. We can provide color samples and even paint small test areas to help you make the best decision."
      },
      {
        id: 8,
        question: "Do you work in all weather conditions?",
        answer: "For exterior painting, we need appropriate weather conditions - temperatures between 50-85°F with low humidity and no rain. We monitor weather forecasts closely and will reschedule if conditions aren't suitable. Interior painting can be done year-round regardless of weather."
      },
      {
        id: 9,
        question: "What's included in your cleanup?",
        answer: "Complete cleanup is included in every project. We remove all drop cloths, clean up paint drips, dispose of materials properly, and leave your space clean and ready to enjoy. We also do a final walkthrough with you to ensure everything meets your expectations."
      },
      {
        id: 10,
        question: "How do I prepare my home for painting?",
        answer: "We'll provide you with a detailed preparation checklist before we start. Generally, you'll need to remove or cover personal items, clear wall decorations, and move furniture away from walls. For exterior work, we ask that you trim bushes and remove items from around the house perimeter."
      },
      {
        id: 11,
        question: "Do you offer financing options?",
        answer: "Yes, we offer flexible financing options to help make your painting project more affordable. We work with several financing partners to provide competitive rates and terms. Contact us to learn more about available financing options for your project."
      },
      {
        id: 12,
        question: "What if I'm not satisfied with the work?",
        answer: "Your satisfaction is our top priority. If you're not completely happy with any aspect of our work, we'll make it right at no additional cost. We conduct a thorough final inspection with you and address any concerns immediately. Our warranty also covers any future issues."
      }
    ],
    showAddModal: false,
    showEditModal: false,
    editingFaq: null
  },
  reducers: {
    addFaq: (state, action) => {
      const newFaq = {
        id: Date.now(),
        question: action.payload.question,
        answer: action.payload.answer
      };
      state.faqs.push(newFaq);
    },
    updateFaq: (state, action) => {
      const { id, question, answer } = action.payload;
      const faqIndex = state.faqs.findIndex(faq => faq.id === id);
      if (faqIndex !== -1) {
        state.faqs[faqIndex] = { id, question, answer };
      }
    },
    deleteFaq: (state, action) => {
      const faqId = action.payload;
      state.faqs = state.faqs.filter(faq => faq.id !== faqId);
    },
    toggleAddModal: (state) => {
      state.showAddModal = !state.showAddModal;
    },
    toggleEditModal: (state) => {
      state.showEditModal = !state.showEditModal;
    },
    setEditingFaq: (state, action) => {
      state.editingFaq = action.payload;
    }
  }
});

export const { 
  addFaq, 
  updateFaq, 
  deleteFaq, 
  toggleAddModal, 
  toggleEditModal, 
  setEditingFaq 
} = faqSlice.actions;

export default faqSlice.reducer;


// mainSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedComponent: 'chatbot',
  selectedQuizDifficulty: '',
  selectedPaper: null,
  isChatOpen: false,
  isMobile: window.innerWidth <= 768,
  selectedYear: '',
};

const mainSlice = createSlice({
  name: 'main',
  initialState,
  reducers: {
    setSelectedComponent(state, action) {
      state.selectedComponent = action.payload;
    },
    setSelectedQuizDifficulty(state, action) {
      state.selectedQuizDifficulty = action.payload;
    },
    setSelectedPaper(state, action) {
      state.selectedPaper = action.payload;
    },
    toggleChat(state) {
      state.isChatOpen = !state.isChatOpen;
    },
    setIsMobile(state, action) {
      state.isMobile = action.payload;
    },
    setSelectedYear(state, action) {
      state.selectedYear = action.payload;
    },
  },
});

export const {
  setSelectedComponent,
  setSelectedQuizDifficulty,
  setSelectedPaper,
  toggleChat,
  setIsMobile,
  setSelectedYear,
} = mainSlice.actions;

export default mainSlice.reducer;

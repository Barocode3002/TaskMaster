// todoStyle.tsx

// Main layout styles
export const screenBg = "min-h-screen bg-gradient-to-br from-red-50 to-pink-100 p-4";
export const mainContainer = "max-w-4xl mx-auto";
export const card = "bg-white rounded-2xl shadow-xl p-8";

// Header styles
export const headerRow = "flex justify-between items-center mb-8";
export const headerTitle = "text-3xl font-bold text-gray-900";
export const headerStats = "text-gray-600 mt-1 flex items-center gap-2";
export const resetButton = "text-sm text-red-600 hover:text-red-700 underline flex items-center gap-1 transition-colors duration-200";

// Add todo input styles
export const addInputRow = "flex gap-3 mb-8";
export const addInput = "flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-lg transition-all duration-200";
export const addButton = "bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2 font-medium transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100";

// Filter tabs styles
export const filterTabsRow = "flex gap-2 mb-6";
export const filterTabActive = "px-4 py-2 rounded-lg font-medium transition-all duration-300 bg-red-600 text-white transform scale-105";
export const filterTabInactive = "px-4 py-2 rounded-lg font-medium transition-all duration-300 bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105";
export const filterTabActiveCount = "ml-1 bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs animate-pulse";
export const filterTabCompletedCount = "ml-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs";

// Todo list styles
export const todoList = "space-y-3";
export const todoItemCompleted = "group flex items-center gap-4 p-4 rounded-lg border transition-all duration-300 hover:shadow-lg bg-green-50 border-green-200 animate-fade-in opacity-75 hover:opacity-100";
export const todoItemActive = "group flex items-center gap-4 p-4 rounded-lg border transition-all duration-300 hover:shadow-lg bg-gray-50 border-gray-200 hover:bg-gray-100 animate-fade-in transform hover:scale-[1.02]";

// Todo item element styles
export const todoToggleCompleted = "flex-shrink-0 transition-all duration-200 text-green-600 hover:text-green-700 hover:scale-110";
export const todoToggleActive = "flex-shrink-0 transition-all duration-200 text-gray-400 hover:text-red-600 hover:scale-110";
export const todoTextCompleted = "text-lg line-through text-green-800 transition-all duration-300";
export const todoTextActive = "text-lg text-gray-900 transition-all duration-200";
export const todoMeta = "text-xs text-gray-500 mt-1 opacity-70";
export const deleteButton = "opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 p-2 transition-all duration-300 hover:scale-110 hover:bg-red-50 rounded";

// Edit mode styles
export const editInput = "flex-1 px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 transition-all duration-200";
export const editButton = "p-1 transition-all duration-200 hover:scale-110";

// Footer styles
export const footerActions = "mt-8 pt-6 border-t border-gray-200 flex justify-between items-center animate-fade-in";
export const footerText = "text-gray-600";
export const footerClearButton = "text-red-600 hover:text-red-700 font-medium transition-all duration-200 hover:scale-105";

// Utility styles
export const storageInfo = "mt-4 text-center";

// Animation utilities (Tailwind keyframes must be added in tailwind.config.js)
export const swipeDownCompleted = "animate-swipe-down";
export const swipeUpActive = "animate-swipe-up";
export const fadeOut = "animate-fade-out";
export const fadeIn = "animate-fade-in";

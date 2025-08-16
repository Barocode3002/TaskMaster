// Main Todo Item Styles
export const todoContainer = "relative overflow-hidden bg-white rounded-lg transition-all duration-200 ease-in-out dark:bg-stone-700";
export const todoItemContainer = "relative overflow-hidden bg-white rounded-lg transition-all duration-200 ease-in-out dark:bg-stone-700";
export const todoCompleted = "bg-gray-50 opacity-75 dark:bg-stone-600";
export const todoItemCompleted = "bg-gray-50 opacity-75 dark:bg-stone-600";
export const todoActive = "hover:shadow-sm dark:bg-stone-700";
export const todoItemActive = "hover:shadow-sm dark:bg-stone-700";
export const todoSwiped = "transform -translate-x-20 sm:-translate-x-24";
export const todoContent = "flex items-center gap-3 p-3 min-h-[50px]";
export const todoContentSwiped = "pr-20 sm:pr-24";
export const todoText = "flex-1 min-w-0 cursor-pointer";
export const todoTextCompleted = "line-through text-gray-500 dark:text-stone-400";
export const todoTextActive = "text-gray-900 dark:text-stone-200";
export const todoDate = "text-xs text-gray-400 dark:text-stone-400";

// Toggle Button Styles
export const toggleButton = "flex-shrink-0 p-1 rounded-full transition-colors duration-200";
export const toggleButtonCompleted = "text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-200";
export const toggleButtonActive = "text-gray-400 hover:text-gray-600 dark:text-stone-400 dark:hover:text-stone-200";

// Desktop Action Button Styles
export const desktopEditButton = "hidden sm:flex p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors duration-200 dark:text-stone-400 dark:hover:text-stone-200";
export const desktopDeleteButton = "hidden sm:flex p-2 text-gray-400 hover:text-red-600 rounded-lg transition-colors duration-200 dark:text-stone-400 dark:hover:text-red-400";

// Mobile Swipe Action Styles
export const actionButtons = "absolute right-0 top-0 bottom-0 flex items-center gap-1 px-2 sm:px-3 bg-gradient-to-l from-red-500 to-orange-500 text-white font-medium transform transition-transform duration-200";
export const actionButtonsVisible = "translate-x-0";
export const actionButtonsHidden = "translate-x-full";
export const swipeActionContainer = "absolute right-0 top-0 bottom-0 flex items-center gap-1 px-2 sm:px-3 bg-gradient-to-l from-red-500 to-orange-500 text-white font-medium transform transition-transform duration-200";
export const swipeActionVisible = "translate-x-0";
export const swipeActionHidden = "translate-x-full";
export const swipeActionButton = "p-2 text-white hover:bg-black hover:bg-opacity-20 rounded transition-colors";

// Edit Mode Styles
export const editContainer = "flex items-center gap-2 flex-1";
export const editInput = "flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white text-gray-900 dark:bg-stone-600 dark:border-stone-500 dark:text-stone-200 dark:focus:ring-stone-400";
export const editSaveButton = "p-2 text-gray-600 hover:text-gray-700 rounded-lg transition-colors duration-200 dark:text-stone-400 dark:hover:text-stone-200";
export const editCancelButton = "p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors duration-200 dark:text-stone-400 dark:hover:text-stone-200";

// Animation Classes
export const fadeOutAnimation = "animate-fade-out opacity-0";
export const scaleAnimation = "animate-subtle-scale";
export const swipeTransform = "transform -translate-x-20 sm:-translate-x-24";

// Responsive Text Classes
export const hiddenOnSmall = "hidden sm:inline";
export const visibleOnSmall = "sm:hidden";

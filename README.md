# 📝 Advanced Todo List

A modern, feature-rich todo list application built with React, TypeScript, and Tailwind CSS. Experience smooth animations, persistent storage, and an intuitive user interface designed for productivity.

## ✨ Features

### Core Functionality
- **✅ Task Management** - Create, edit, complete, and delete todos
- **🔄 Smart Animations** - Smooth swipe animations when completing/uncompleting tasks
- **💾 Persistent Storage** - All data automatically saved to localStorage
- **🗂️ Smart Filtering** - View all, active, or completed tasks
- **📊 Progress Tracking** - Real-time statistics and completion counts

### User Experience
- **👤 Personalized Experience** - Custom user name input and greeting
- **✏️ Inline Editing** - Click to edit tasks directly in place
- **🗑️ Recently Deleted** - Restore accidentally deleted todos
- **📱 Responsive Design** - Works seamlessly on desktop and mobile
- **🎨 Modern UI** - Beautiful gradient backgrounds and smooth transitions

### Technical Features
- **⚡ Fast Performance** - Built with Vite for lightning-fast development
- **🔒 Type Safety** - Full TypeScript implementation
- **🎯 Accessibility** - ARIA labels and keyboard navigation support
- **🧹 Clean Architecture** - Modular component structure with custom hooks

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Barocode/TaskMaster.git
   cd todolistadv
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 🛠️ Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality checks

## 🏗️ Project Structure

```
src/
├── components/           # React components
│   ├── styles/          # Component-specific styles
│   ├── Footer.tsx       # App footer component
│   ├── NameInputUI.tsx  # User name input screen
│   ├── NavBarUI.tsx     # Navigation bar with restore functionality
│   └── TodoUI.tsx       # Main todo list interface
├── utils/               # Utility functions
│   ├── types.ts         # TypeScript type definitions
│   ├── todoStorage.ts   # Local storage management
│   └── recentlyDeletedStorage.ts # Recently deleted todos
├── App.tsx              # Main app component
└── main.tsx            # Application entry point
```

## 🎨 Tech Stack

- **Frontend Framework:** React 19.1.1
- **Language:** TypeScript 5.8.3
- **Styling:** Tailwind CSS 4.1.11
- **Icons:** Lucide React 0.539.0
- **Build Tool:** Vite 7.1.2
- **Code Quality:** ESLint with TypeScript support

## 🎯 Key Components

### TodoUI
The main todo interface featuring:
- Task creation and management
- Smooth toggle animations
- Filtering and search capabilities
- Inline editing functionality

### NavBarUI
Navigation component with:
- Recently deleted todos restoration
- Clean, minimal design
- Responsive layout

### Storage System
Robust data persistence:
- Automatic saving to localStorage
- Error handling and recovery
- Recently deleted items tracking

## 🔧 Configuration

### Tailwind CSS
Custom animations and utilities configured in `tailwind.config.js`:
- Swipe animations for task completion
- Fade transitions for smooth UX
- Custom color schemes and spacing

### TypeScript
Strict type checking enabled with:
- Custom type definitions for todos and app state
- Interface definitions for component props
- Comprehensive error handling

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

The `dist/` folder will contain the optimized production build ready for deployment.

### Deployment Options
- **Netlify** - Drag and drop the `dist/` folder
- **Vercel** - Connect your Git repository
- **GitHub Pages** - Use GitHub Actions for automated deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built with [Vite](https://vitejs.dev/) for fast development
- Icons provided by [Lucide React](https://lucide.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Animations inspired by modern mobile todo applications

---

**Made with ❤️ for productivity enthusiasts**

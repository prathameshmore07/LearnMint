// course catalog data with real youtube channel names
const courses = [
    // javascript essentials
    {
        id: 1,
        title: "JavaScript Essentials",
        duration: "1 Week",
        price: 499,
        rating: 4.8,
        tag: "Development",
        description: "Build a strong foundation in JavaScript from scratch. This course covers variables, functions, DOM manipulation, and modern ES6+ features through hands-on examples and real-world projects.",
        image: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&q=80&w=600",
        lessons: [
            { id: 1, title: "Introduction to JavaScript", video: "https://www.youtube.com/embed/PkZNo7MFNFg", instructor: "Beau Carnes" },
            { id: 2, title: "Variables & Data Types", video: "https://www.youtube.com/embed/jS4aFq5-91M", instructor: "freeCodeCamp.org" },
            { id: 3, title: "Functions & Scope", video: "https://www.youtube.com/embed/xUI5Tsl2JpY", instructor: "Net Ninja" },
            { id: 4, title: "ES6+ Modern Features", video: "https://www.youtube.com/embed/nZ1DMMsyVyI", instructor: "freeCodeCamp.org" }
        ]
    },
    // ui design systems
    {
        id: 2,
        title: "UI Design Systems",
        duration: "2 Weeks",
        price: 599,
        rating: 4.9,
        tag: "Design",
        description: "Learn the principles behind professional UI design systems. From color theory and typography to Figma prototyping and component libraries — everything you need to design like a pro.",
        image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=600",
        lessons: [
            { id: 1, title: "Design Fundamentals", video: "https://www.youtube.com/embed/YqQx75OPRa0", instructor: "LearnFree" },
            { id: 2, title: "Color & Typography", video: "https://www.youtube.com/embed/QkCVrNoqcBU", instructor: "The Futur Academy" },
            { id: 3, title: "Prototyping in Figma", video: "https://www.youtube.com/embed/FTFaQWZBqQ8", instructor: "AJ&Smart" },
            { id: 4, title: "Component Libraries", video: "https://www.youtube.com/embed/c9Wg6Cb_YlU", instructor: "freeCodeCamp.org" },
            { id: 5, title: "Responsive Design", video: "https://www.youtube.com/embed/srvUrASNj0s", instructor: "freeCodeCamp.org" }
        ]
    },
    // modern html5
    {
        id: 3,
        title: "Modern HTML5 Flow",
        duration: "1 Week",
        price: 299,
        rating: 4.7,
        tag: "Development",
        description: "Go beyond basic HTML and master semantic markup, accessible forms, modern HTML5 APIs, and SEO fundamentals. Perfect for developers who want to write clean, standards-compliant code.",
        image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=600",
        lessons: [
            { id: 1, title: "Semantic HTML", video: "https://www.youtube.com/embed/UB1O30fR-EE", instructor: "Traversy Media" },
            { id: 2, title: "Forms & Validation", video: "https://www.youtube.com/embed/fNcJuPIZ2WE", instructor: "Web Dev Simplified" },
            { id: 3, title: "HTML5 APIs", video: "https://www.youtube.com/embed/hdI2bqOjy3c", instructor: "Traversy Media" },
            { id: 4, title: "Accessibility Basics", video: "https://www.youtube.com/embed/e2nkq3h1P68", instructor: "freeCodeCamp.org" },
            { id: 5, title: "SEO Fundamentals", video: "https://www.youtube.com/embed/MYE6T_gd7H0", instructor: "Simplilearn" }
        ]
    },
    // python for beginners
    {
        id: 4,
        title: "Python for Beginners",
        duration: "2 Weeks",
        price: 699,
        rating: 4.9,
        tag: "Development",
        description: "Start your programming journey with Python — the world's most beginner-friendly language. Cover variables, control flow, functions, modules, and file handling through practical exercises.",
        image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&q=80&w=600",
        lessons: [
            { id: 1, title: "Getting Started with Python", video: "https://www.youtube.com/embed/rfscVS0vtbw", instructor: "freeCodeCamp.org" },
            { id: 2, title: "Variables & Data Types", video: "https://www.youtube.com/embed/khKv-8q7YmY", instructor: "Corey Schafer" },
            { id: 3, title: "Control Flow & Loops", video: "https://www.youtube.com/embed/6iF8Xb7Z3wQ", instructor: "Corey Schafer" },
            { id: 4, title: "Functions & Modules", video: "https://www.youtube.com/embed/9Os0o3wzS_I", instructor: "Corey Schafer" },
            { id: 5, title: "Working with Files", video: "https://www.youtube.com/embed/Uh2ebFW8OYM", instructor: "Corey Schafer" }
        ]
    },
    // react.js crash course
    {
        id: 5,
        title: "React.js Crash Course",
        duration: "2 Weeks",
        price: 799,
        rating: 4.8,
        tag: "Development",
        description: "Dive into React.js with a project-driven crash course. Learn components, JSX, props, state management, and React Hooks by building a real mini-project from start to finish.",
        image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=600",
        lessons: [
            { id: 1, title: "React Introduction & Setup", video: "https://www.youtube.com/embed/w7ejDZ8SWv8", instructor: "Traversy Media" },
            { id: 2, title: "Components & JSX", video: "https://www.youtube.com/embed/Ke90Tje7VS0", instructor: "Programming with Mosh" },
            { id: 3, title: "Props & State", video: "https://www.youtube.com/embed/4UZrsTqkcW4", instructor: "Coding Addict" },
            { id: 4, title: "Hooks – useState & useEffect", video: "https://www.youtube.com/embed/O6P86uwfdR0", instructor: "Web Dev Simplified" },
            { id: 5, title: "Building a Mini Project", video: "https://www.youtube.com/embed/b9eMGE7QtTk", instructor: "JavaScript Mastery" }
        ]
    },
    // css masterclass
    {
        id: 6,
        title: "CSS Masterclass",
        duration: "1 Week",
        price: 399,
        rating: 4.7,
        tag: "Design",
        description: "Take your CSS skills to the next level. Master selectors, Flexbox, CSS Grid, animations, transitions, and modern techniques that professionals use to build stunning, responsive interfaces.",
        image: "https://images.unsplash.com/photo-1523437113738-bbd3cc89fb19?auto=format&fit=crop&q=80&w=600",
        lessons: [
            { id: 1, title: "CSS Selectors Deep Dive", video: "https://www.youtube.com/embed/1PnVor36_40", instructor: "Web Dev Simplified" },
            { id: 2, title: "Flexbox Layout", video: "https://www.youtube.com/embed/JJSoEo8JSnc", instructor: "Traversy Media" },
            { id: 3, title: "CSS Grid Mastery", video: "https://www.youtube.com/embed/jV8B24rSN5o", instructor: "Traversy Media" },
            { id: 4, title: "Animations & Transitions", video: "https://www.youtube.com/embed/zHUpx90NerM", instructor: "Traversy Media" },
            { id: 5, title: "Modern CSS Techniques", video: "https://www.youtube.com/embed/OXGznpKZ_sA", instructor: "freeCodeCamp.org" }
        ]
    }
];

// export courses globally
if (typeof window !== 'undefined') {
    window.courses = courses;
}

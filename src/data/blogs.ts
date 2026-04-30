export interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  publishDate: string;
  category: string;
  tags: string[];
  featuredImage: string;
  readTime: string;
}

export const categories = [
  { name: "Technology", slug: "technology", icon: "💻", count: 12 },
  { name: "Education", slug: "education", icon: "📚", count: 8 },
  { name: "Career Guidance", slug: "career-guidance", icon: "🎯", count: 6 },
  { name: "Programming", slug: "programming", icon: "⚡", count: 15 },
  { name: "AI & Future Tech", slug: "ai-future-tech", icon: "🤖", count: 10 },
  { name: "Motivation", slug: "motivation", icon: "🔥", count: 7 },
];

export const blogs: Blog[] = [
  {
    id: "1",
    title: "The Future of Artificial Intelligence in Education",
    slug: "future-of-ai-in-education",
    excerpt: "Exploring how AI is revolutionizing the way we learn and teach, from personalized learning paths to intelligent tutoring systems.",
    content: `Artificial Intelligence is transforming education in unprecedented ways. From personalized learning experiences to automated grading systems, AI is reshaping how knowledge is delivered and absorbed.

## Personalized Learning Paths

One of the most exciting applications of AI in education is the ability to create personalized learning paths for each student. By analyzing learning patterns, strengths, and weaknesses, AI can tailor educational content to individual needs.

## Intelligent Tutoring Systems

AI-powered tutoring systems can provide one-on-one attention to students, answering questions and explaining concepts in real-time. These systems use natural language processing to understand student queries and provide relevant responses.

## The Road Ahead

As AI continues to evolve, we can expect even more innovative applications in education. Virtual reality classrooms, AI-generated content, and predictive analytics for student success are just a few possibilities on the horizon.`,
    author: "Rahul Sharma",
    publishDate: "2024-03-15",
    category: "AI & Future Tech",
    tags: ["AI", "Education", "Technology", "Future"],
    featuredImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
    readTime: "5 min read",
  },
  {
    id: "2",
    title: "Complete Guide to Learning Web Development in 2024",
    slug: "complete-guide-web-development-2024",
    excerpt: "A comprehensive roadmap for aspiring web developers covering HTML, CSS, JavaScript, React, and modern frameworks.",
    content: `Web development continues to be one of the most in-demand skills in the tech industry. Whether you're a complete beginner or looking to update your skills, this guide will help you navigate the web development landscape in 2024.

## Start with the Fundamentals

Every web developer needs a solid foundation in HTML, CSS, and JavaScript. These three technologies form the backbone of the web and are essential for building any website or web application.

## Choose Your Path

Once you have the fundamentals down, you'll need to choose between frontend, backend, or full-stack development. Each path has its own set of tools and frameworks to learn.

## Modern Frameworks

React, Vue, and Angular dominate the frontend landscape, while Node.js, Python, and Go are popular choices for backend development.`,
    author: "Priya Patel",
    publishDate: "2024-03-10",
    category: "Programming",
    tags: ["Web Development", "React", "JavaScript", "Career"],
    featuredImage: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80",
    readTime: "8 min read",
  },
  {
    id: "3",
    title: "Top Career Opportunities After Engineering in India",
    slug: "career-opportunities-after-engineering",
    excerpt: "Discover the most promising career paths for engineering graduates in India's rapidly evolving job market.",
    content: `The engineering landscape in India is evolving rapidly, offering graduates a wide range of career opportunities beyond traditional paths.

## Software Development

The IT sector continues to be the largest employer of engineering graduates. Companies like TCS, Infosys, and startups offer competitive packages.

## Data Science & Analytics

With the data revolution, data scientists are in high demand. Engineering graduates with strong analytical skills can thrive in this field.

## Entrepreneurship

India's startup ecosystem is booming, and many engineering graduates are choosing to build their own companies.`,
    author: "Amit Kumar",
    publishDate: "2024-03-08",
    category: "Career Guidance",
    tags: ["Career", "Engineering", "India", "Jobs"],
    featuredImage: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80",
    readTime: "6 min read",
  },
  {
    id: "4",
    title: "Understanding React Hooks: A Deep Dive",
    slug: "understanding-react-hooks-deep-dive",
    excerpt: "Master React Hooks with practical examples and best practices for building modern React applications.",
    content: `React Hooks revolutionized how we write React components. In this deep dive, we'll explore the most important hooks and how to use them effectively.

## useState

The useState hook lets you add state to functional components. It returns a pair: the current state value and a function to update it.

## useEffect

useEffect lets you perform side effects in components. It serves the same purpose as componentDidMount, componentDidUpdate, and componentWillUnmount combined.

## Custom Hooks

Creating custom hooks allows you to extract component logic into reusable functions.`,
    author: "Sneha Gupta",
    publishDate: "2024-03-05",
    category: "Programming",
    tags: ["React", "JavaScript", "Hooks", "Frontend"],
    featuredImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80",
    readTime: "7 min read",
  },
  {
    id: "5",
    title: "How to Stay Motivated During Competitive Exam Preparation",
    slug: "stay-motivated-competitive-exam-preparation",
    excerpt: "Practical tips and strategies to maintain your motivation and focus during long months of competitive exam preparation.",
    content: `Preparing for competitive exams like JEE, NEET, or UPSC requires months of dedicated preparation. Staying motivated throughout this journey is often the biggest challenge.

## Set Clear Goals

Break your preparation into smaller, manageable goals. Celebrate small victories along the way.

## Create a Study Schedule

A well-structured study plan helps you stay on track and reduces anxiety about covering the syllabus.

## Take Care of Your Health

Physical health directly impacts mental performance. Regular exercise, proper sleep, and a balanced diet are non-negotiable.`,
    author: "Dr. Meera Joshi",
    publishDate: "2024-03-01",
    category: "Motivation",
    tags: ["Motivation", "Exams", "Study Tips", "Students"],
    featuredImage: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80",
    readTime: "4 min read",
  },
  {
    id: "6",
    title: "The Impact of 5G Technology on Digital India",
    slug: "impact-5g-technology-digital-india",
    excerpt: "How 5G technology is set to transform India's digital landscape, from smart cities to telemedicine.",
    content: `5G technology promises to revolutionize connectivity in India, enabling new possibilities in healthcare, education, agriculture, and entertainment.

## What is 5G?

5G is the fifth generation of mobile network technology, offering significantly faster speeds, lower latency, and the ability to connect more devices simultaneously.

## Smart Cities

5G will enable smart city initiatives across India, from intelligent traffic management to connected public services.

## Healthcare Revolution

Telemedicine and remote surgeries powered by 5G will bring quality healthcare to rural India.`,
    author: "Vikram Singh",
    publishDate: "2024-02-28",
    category: "Technology",
    tags: ["5G", "Technology", "Digital India", "Innovation"],
    featuredImage: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80",
    readTime: "5 min read",
  },
];

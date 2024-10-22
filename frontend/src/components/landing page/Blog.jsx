import React, { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css'; // Import AOS styles
import './Blog.css';
import Navbar from './Navbar';
import Footer from './Footer'; // Ensure this is available

const allPosts = [
  {
    id: 1,
    title: 'Transforming Education with Technology',
    content: 'Discover how technology is reshaping education and empowering students to take control of their learning journey. From online resources to AI-powered tools, explore the impact of digital solutions in modern classrooms.',
    date: '2024-10-01',
    image: '/src/assets/images/Edu with Tech.jpg',
    category: 'Technology', // Simplified category
    video: '',
    user: { name: 'Kishore', avatar: '/src/assets/images/profile2.jpg' },
  },
  {
    id: 2,
    title: 'The Benefits of Self-Learning in the Digital Age',
    content: 'Explore the advantages of self-learning through online platforms. With access to a wealth of resources and personalized learning paths, students can learn at their own pace and according to their interests.',
    date: '2024-09-15',
    image: '/src/assets/images/self.jpg',
    category: 'Learning', // Simplified category
    video: '',
    user: { name: 'Shalini', avatar: '/src/assets/images/profile.jpg' },
  },
  {
    id: 3,
    title: 'Gamification in Education: Engaging Students Effectively',
    content: 'Learn how gamification can enhance learning experiences and keep students motivated. By incorporating game mechanics into education, we can make learning fun and engaging while promoting retention and understanding.',
    date: '2024-08-20',
    image: '/src/assets/images/game.jpg',
    category: 'Gamification', // Simplified category
    video: '',
    user: { name: 'Dilaxshi', avatar: '/src/assets/images/profile4.jpg' },
  },
  {
    id: 4,
    title: 'AI and Its Role in Personalized Learning',
    content: 'Discover how artificial intelligence is being utilized to create personalized learning experiences. AI can analyze student performance and tailor content to meet individual needs, ensuring that every learner can thrive.',
    date: '2024-07-15',
    image: '/src/assets/images/personalised.jpg',
    category: 'AI', // Simplified category
    video: '',
    user: { name: 'Ajintha', avatar: '/src/assets/images/profile1.jpg' },
  },
  {
    id: 5,
    title: 'The Future of Online Education',
    content: 'Examine the trends shaping the future of online education. With advancements in technology and evolving educational needs, the landscape of learning is continuously changing, opening up new opportunities for students and educators alike.',
    date: '2024-06-10',
    image: '/src/assets/images/future.jpg',
    category: 'Learning', // Simplified category
    video: '',
    user: { name: 'Shalini', avatar: '/src/assets/images/profile.jpg' },
  },
  // Add more posts as needed
];


const Blog = () => {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const postsPerPage = 3; // Set the number of posts to display per page
  const [filterCategory, setFilterCategory] = useState('All'); // State to track the selected category

  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    AOS.init({ duration: 1000 }); // Initialize AOS with 1000ms animation duration
  }, []);

  // Add a new useEffect to handle window resize for responsiveness
  useEffect(() => {
    const handleResize = () => {
      // Logic to handle responsive design can be added here
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(prevDarkMode => !prevDarkMode);
  };

  // Filter posts based on category
  const filteredPosts = filterCategory === 'All'
    ? allPosts
    : allPosts.filter(post => post.category === filterCategory);

  // Get current posts based on pagination
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  // Change page
  const pagi = (pageNumber) => setCurrentPage(pageNumber);

  // Calculate the total number of pages
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);


  return (
    <>
      <Navbar toggleDarkMode={toggleDarkMode} />
      <section className="area">
        <ul className="circles">
          {Array(10).fill().map((_, i) => <li key={i}></li>)}
        </ul>
        <div className="context">
          <div className="blog-header" data-aos="fade-down">
            <h2 className="blog-title">Our Blog</h2>
            <p className="blog-subtitle">Insights and trends in education technology</p>
          </div>

          <div className="blog-content">
            <div className="filters" data-aos="fade-up" data-aos-delay="200">
              {['All', 'Technology', 'Learning', 'Gamification', 'AI'].map(category => (
                <button
                  key={category}
                  onClick={() => {
                    setFilterCategory(category);
                    setCurrentPage(1); // Reset to first page on category change
                  }}
                  className={filterCategory === category ? 'active' : ''} // Add active class if category is selected
                >
                  {category}
                </button>
              ))}
            </div>
            <div className="blog-posts">
              {currentPosts.map(post => (
                <div key={post.id} className="blog-post" data-aos="fade-up">
                <img src={post.image} alt={post.title} className="blog-image" />
                <div className="post-details">
                  <div className="user-info">
                    <img src={post.user.avatar} alt={post.user.name} className="user-avatar" />
                    <span className="user-name">{post.user.name}</span>
                    <p className="post-date">{post.date}</p>
                  </div>
                  <h3>{post.title}</h3>
                  <p>{post.content}</p>
                </div>

              </div>
              
              ))}
            </div>
          </div>

          {/* Pagination controls */}
          <div className="pagi">
            <button
              onClick={() => pagi(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Previous page"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => pagi(index + 1)}
                className={currentPage === index + 1 ? 'active' : ''} // Highlight active page
                aria-label={`Go to page ${index + 1}`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => pagi(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label="Next page"
            >
              Next
            </button>
          </div>

          <Footer /> {/* Ensure you have this component ready */}
        </div>
      </section>
    </>
  );
};

export default Blog;

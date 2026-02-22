import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { collection, getDocs, orderBy, query, limit } from 'firebase/firestore';
import { db } from '../../firebase';
import { Calendar, Clock, ArrowRight, Tag } from 'lucide-react';
import { BlogSkeleton } from '../LoadingSkeleton/LoadingSkeleton';
import './Blog.css';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const q = query(collection(db, 'blog'), orderBy('createdAt', 'desc'), limit(3));
      const querySnapshot = await getDocs(q);
      const postData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPosts(postData);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <BlogSkeleton />;
  }

  return (
    <section className="blog">
      <div className="blog-container">
        <motion.div
          className="blog-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="section-title gradient-text">Latest Insights</h2>
          <p className="section-subtitle">
            Tips, tutorials, and behind-the-scenes stories from our photography journey
          </p>
        </motion.div>

        <div className="blog-grid">
          {posts.length > 0 ? (
            posts.map((post, index) => (
              <motion.article
                key={post.id}
                className="blog-card"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
              >
                <div className="blog-image">
                  <img src={post.image} alt={post.title} />
                  <div className="blog-category">
                    <Tag size={14} />
                    {post.category}
                  </div>
                </div>
                
                <div className="blog-content">
                  <div className="blog-meta">
                    <span className="blog-date">
                      <Calendar size={14} />
                      {post.createdAt?.toDate().toLocaleDateString()}
                    </span>
                    <span className="blog-read-time">
                      <Clock size={14} />
                      {post.readTime}
                    </span>
                  </div>
                  
                  <h3 className="blog-title">{post.title}</h3>
                  <p className="blog-excerpt">{post.excerpt}</p>
                  
                  <button className="blog-read-more">
                    Read More
                    <ArrowRight size={16} />
                  </button>
                </div>
              </motion.article>
            ))
          ) : (
            <div className="empty-blog">
              <h3>Blog Coming Soon</h3>
              <p>Articles will be added through the admin panel</p>
            </div>
          )}
        </div>

        <motion.div
          className="blog-cta"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <button className="btn-primary">View All Posts</button>
        </motion.div>
      </div>
    </section>
  );
};

export default Blog;
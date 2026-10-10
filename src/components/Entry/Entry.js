import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, ArrowRight, Camera, Video, Star } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import './Entry.css';

const Entry = () => {
  const location = useLocation();
  const [stats, setStats] = useState({ projects: 0, videos: 0, experience: 5 });
  const [heroImage, setHeroImage] = useState('');
  const [workImages, setWorkImages] = useState([]);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const [gallerySnap, videosSnap, heroSnap] = await Promise.all([
          getDocs(collection(db, 'gallery')),
          getDocs(collection(db, 'videos')),
          getDocs(collection(db, 'hero'))
        ]);
        const galleryImages = gallerySnap.docs.map((image) => {
          const data = image.data();
          return {
            id: image.id,
            title: data.title || 'Selected work',
            category: data.category || 'Photography',
            imageUrl: data.url || data.imageUrl || data.src
          };
        }).filter((image) => image.imageUrl);

        setStats({
          projects: gallerySnap.size,
          videos: videosSnap.size,
          experience: 5
        });
        setWorkImages(galleryImages.slice(0, 3));
        setHeroImage(
          heroSnap.empty
            ? galleryImages[0]?.imageUrl || ''
            : heroSnap.docs[0].data().imageUrl || galleryImages[0]?.imageUrl || ''
        );
      } catch (error) {
        console.error('Error fetching portfolio content:', error);
      }
    };

    fetchPortfolio();
  }, []);

  useEffect(() => {
    const sectionId = location.state?.scrollTo;
    if (!sectionId) return;

    window.requestAnimationFrame(() => {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    });
  }, [location.state]);

  const scrollToWork = () => {
    document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="one-page-portfolio">
      <section className="editorial-section intro-section" id="top">
        <motion.div
          className="editorial-copy intro-copy"
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          <span className="eyebrow">Cape Town · Photography & Film</span>
          <h1>DANTE<span>KILLSTORM</span></h1>
          <p className="intro-lead">Visual stories with grit, texture, and soul.</p>
          <p>
            I capture the feeling behind the moment—from intimate portraits to
            weddings, events, and films made to stay with you.
          </p>
          <div className="intro-stats" aria-label="Portfolio statistics">
            <span><Camera size={17} /> {stats.projects}+ projects</span>
            <span><Video size={17} /> {stats.videos}+ films</span>
            <span><Star size={17} /> {stats.experience} years</span>
          </div>
          <button className="text-link" onClick={scrollToWork}>
            Explore selected work <ArrowDown size={16} />
          </button>
        </motion.div>

        <motion.div
          className="editorial-visual intro-visual"
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          {heroImage ? (
            <img src={heroImage} alt="DANTEKILLSTORM selected photography" />
          ) : (
            <div className="visual-placeholder"><Camera size={36} /></div>
          )}
          <span className="visual-caption">01 / The way I see it</span>
        </motion.div>
      </section>

      <section className="work-section" id="work">
        <div className="section-kicker">
          <span>Selected work</span>
          <span>02 — 04</span>
        </div>
        {workImages.length > 0 ? workImages.map((image, index) => (
          <motion.article
            className={`editorial-section work-row ${index % 2 ? 'reverse' : ''}`}
            key={image.id}
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55 }}
          >
            <div className="editorial-visual work-visual">
              <img src={image.imageUrl} alt={image.title} loading="lazy" />
              <span className="visual-caption">{String(index + 2).padStart(2, '0')} / {image.category}</span>
            </div>
            <div className="editorial-copy work-copy">
              <span className="eyebrow">{image.category}</span>
              <h2>{image.title}</h2>
              <p>
                Honest moments, framed with intention. Every image is part of a
                story shaped by real people, real places, and the energy in between.
              </p>
              <Link className="text-link" to="/portfolio">
                View the full gallery <ArrowRight size={16} />
              </Link>
            </div>
          </motion.article>
        )) : (
          <article className="editorial-section work-row">
            <div className="editorial-visual work-visual">
              <div className="visual-placeholder"><Camera size={36} /></div>
              <span className="visual-caption">Selected work</span>
            </div>
            <div className="editorial-copy work-copy">
              <span className="eyebrow">The portfolio</span>
              <h2>Made to feel something.</h2>
              <p>New work is on the way. Get in touch to talk about your next shoot.</p>
              <Link className="text-link" to="/portfolio">
                Explore the gallery <ArrowRight size={16} />
              </Link>
            </div>
          </article>
        )}
      </section>

      <section className="editorial-section about-row" id="about">
        <div className="editorial-copy">
          <span className="eyebrow">A little about me</span>
          <h2>Independent by nature. Intentional by design.</h2>
          <p>
            Five years in, my visual language was forged in the streets with the
            Broke Boys Collective. That experience taught me that you don’t need
            a budget to make art—you need vision, timing, and the hunger to catch
            the shot everyone else misses.
          </p>
          <p>
            I bring that same energy to weddings, events, and portrait sessions:
            not just recording what it looks like, but capturing what it feels like.
          </p>
        </div>
        <div className="editorial-visual about-visual">
          {heroImage ? (
            <img src={heroImage} alt="Behind the lens with DANTEKILLSTORM" loading="lazy" />
          ) : (
            <div className="visual-placeholder"><Camera size={36} /></div>
          )}
          <span className="visual-caption">05 / Behind the lens</span>
        </div>
      </section>

      <section className="editorial-section contact-row" id="contact">
        <div className="contact-mark">
          <span>Let’s make</span>
          <span>something</span>
          <span>real.</span>
        </div>
        <div className="editorial-copy contact-copy">
          <span className="eyebrow">Have a story in mind?</span>
          <h2>Let’s create together.</h2>
          <p>Tell me what you’re planning and we’ll shape it into something worth remembering.</p>
          <Link to="/booking" className="text-link">
            Book a session <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Entry;

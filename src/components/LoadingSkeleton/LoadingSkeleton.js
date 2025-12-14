import React from 'react';
import './LoadingSkeleton.css';

export const GallerySkeleton = () => (
  <div className="gallery-skeleton">
    <div className="skeleton-header">
      <div className="skeleton-title"></div>
      <div className="skeleton-subtitle"></div>
    </div>
    <div className="skeleton-filters">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="skeleton-filter"></div>
      ))}
    </div>
    <div className="skeleton-grid">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="skeleton-card">
          <div className="skeleton-image"></div>
          <div className="skeleton-content">
            <div className="skeleton-text"></div>
            <div className="skeleton-text short"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const VideoSkeleton = () => (
  <div className="video-skeleton">
    <div className="skeleton-header">
      <div className="skeleton-title"></div>
      <div className="skeleton-subtitle"></div>
    </div>
    <div className="skeleton-grid">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="skeleton-video-card">
          <div className="skeleton-video-thumbnail"></div>
          <div className="skeleton-content">
            <div className="skeleton-text"></div>
            <div className="skeleton-text short"></div>
            <div className="skeleton-buttons">
              <div className="skeleton-button"></div>
              <div className="skeleton-button"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const BlogSkeleton = () => (
  <div className="blog-skeleton">
    <div className="skeleton-header">
      <div className="skeleton-title"></div>
      <div className="skeleton-subtitle"></div>
    </div>
    <div className="skeleton-grid">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="skeleton-blog-card">
          <div className="skeleton-blog-image"></div>
          <div className="skeleton-content">
            <div className="skeleton-meta">
              <div className="skeleton-text tiny"></div>
              <div className="skeleton-text tiny"></div>
            </div>
            <div className="skeleton-text"></div>
            <div className="skeleton-text short"></div>
            <div className="skeleton-text medium"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);
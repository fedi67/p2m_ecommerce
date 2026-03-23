import React from 'react';

const BackgroundSlideshow = ({ currentSlide, slidesData }) => (
  <div className="slide-container">
    {slidesData.map((slide, index) => (
      <div
        key={slide.id}
        className={`bg-slide ${index === currentSlide ? 'active' : ''}`}
        style={{
          backgroundImage: `url(${slide.image})`
        }}
      ></div>
    ))}
    <div className="overlay-home"></div>
  </div>
);

export default BackgroundSlideshow;

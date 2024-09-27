import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './Carousel.css';

const ImageCarousel = () => {
  return (
    <Carousel autoPlay infiniteLoop showThumbs={false} showStatus={false}>
      <div>
        <img src="src/assets/i.png" alt="Slide 1" />
      </div>
      <div>
        <img src="src/assets/ii.png" alt="Slide 2" />
      </div>
      <div>
        <img src="src/assets/iii.png" alt="Slide 3" />
      </div>
    </Carousel>
  );
};

export default ImageCarousel;

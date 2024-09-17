import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './Carousel.css';

const ImageCarousel = () => {
  return (
    <Carousel autoPlay infiniteLoop showThumbs={false} showStatus={false}>
      <div>
        <img src="src/components/landing page/images/slide1.png" alt="Slide 1" />
      </div>
      <div>
        <img src="src/components/landing page/images/slide2.png" alt="Slide 2" />
      </div>
      <div>
        <img src="src/components/landing page/images/slide3.png" alt="Slide 3" />
      </div>
    </Carousel>
  );
};

export default ImageCarousel;

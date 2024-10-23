import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './Carousel.css';
import slide1 from '../../assets/images/slide1.jpeg'
import slide2 from '../../assets/images/slide2.jpeg'
import slide3 from '../../assets/images/slide3.jpeg'

const ImageCarousel = () => {
  return (
    <Carousel autoPlay infiniteLoop showThumbs={false} showStatus={false}>
      <div>
        <img src={slide1} alt="Slide 1" />
      </div>
      <div>
        <img src={slide2} alt="Slide 2" />
      </div>
      <div>
        <img src={slide3} alt="Slide 3" />
      </div>
    </Carousel>
  );
};

export default ImageCarousel;

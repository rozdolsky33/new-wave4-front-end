import React from "react";
import {Carousel} from "react-bootstrap";

export default function CarouselPhotos() {
  let photos = [
    "./assets/imgs/NW_main_cover_0.jpg"
  ];
  return (
    <div className="carousel-photo-block">
      <Carousel controls={false} indicators={false}>
        {photos.map((photo, key) => {
          return (<Carousel.Item key={key} className="h-100 float-none">
            <div style={{backgroundImage: `url(${photo})`}} className="photo-view-background"></div>
            <img className="photo-view"
                 src={photo}
                 alt={key + " slide"}/>
          </Carousel.Item>);
        })}
      </Carousel>
    </div>
  );
}

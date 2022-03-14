import useEmblaCarousel from "embla-carousel-react";
import Image from 'next/image';
import React, { useCallback, useEffect, useState } from "react";
import ReactMarkdown from 'react-markdown';
import { DotButton, NextButton, PrevButton } from "../EmblaCarouselButtons";
import PageSection from '../PageSection';

const ProjectGallery = ({ images, caption }) => {

  let maxHeight = images.map(i => i.thumbnails.large.height).sort().reverse()[0]

  const [viewportRef, embla] = useEmblaCarousel({ skipSnaps: false });
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);

  const scrollPrev = useCallback(() => embla && embla.scrollPrev(), [embla]);
  const scrollNext = useCallback(() => embla && embla.scrollNext(), [embla]);
  const scrollTo = useCallback((index) => embla && embla.scrollTo(index), [
    embla
  ]);

  const onSelect = useCallback(() => {
    if (!embla) return;
    setSelectedIndex(embla.selectedScrollSnap());
    setPrevBtnEnabled(embla.canScrollPrev());
    setNextBtnEnabled(embla.canScrollNext());
  }, [embla, setSelectedIndex]);

  useEffect(() => {
    if (!embla) return;
    onSelect();
    setScrollSnaps(embla.scrollSnapList());
    embla.on("select", onSelect);
  }, [embla, setScrollSnaps, onSelect]);

  return (
    <PageSection title={`What does it look like?`} className='row-span-2 col-span-1 md:col-span-2 pb-4' padding={false}>
      <div className="embla">
        <div className="embla__viewport" ref={viewportRef}>
          <div className="embla__container">
            {images.map((img, index) => (
              <div className="embla__slide" key={index}>
                <Image
                  className="embla__slide__img mx-auto"
                  src={img.thumbnails.large.url}
                  height={img.thumbnails.large.height/2}
                  width={img.thumbnails.large.width/2}
                  alt="A cool cat."
                />
              </div>
            ))}
          </div>
        </div>
        <PrevButton onClick={scrollPrev} enabled={prevBtnEnabled} />
        <NextButton onClick={scrollNext} enabled={nextBtnEnabled} />
      </div>
      <div className="embla__dots">
        {scrollSnaps.map((_, index) => (
          <DotButton
            key={index}
            selected={index === selectedIndex}
            onClick={() => scrollTo(index)}
          />
        ))}
      </div>
      <ReactMarkdown className="mt-4 max-w-lg mx-auto text-center px-6 md:px-0">
        {caption.split("\n")[selectedIndex] ? caption.split("\n")[selectedIndex] : caption}
      </ReactMarkdown>
    </PageSection>
  );
};

export default ProjectGallery;
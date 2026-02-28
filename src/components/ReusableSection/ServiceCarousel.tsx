import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectCoverflow, Pagination, Navigation } from 'swiper/modules';

// Core Swiper styles are still required
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const ServiceCarousel = () => {
  const slides = [
    { id: 1, title: 'Newsletter', img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600', btnText: 'Sign Up' },
    { id: 2, title: 'Events', img: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=600', btnText: 'Learn More' },
    { id: 3, title: 'Podcasts', img: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=600', btnText: 'Listen Now' },
    { id: 4, title: 'Research', img: 'https://images.unsplash.com/photo-1532187875605-2fe358511423?auto=format&fit=crop&q=80&w=600', btnText: 'View More' },
  ];

  return (
    <section className="bg-primary py-20 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <Swiper
          effect={'coverflow'}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={'auto'}
          loop={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 100,
            modifier: 2.5,
            slideShadows: false,
          }}
          pagination={{ 
            clickable: true,
            bulletClass: 'swiper-pagination-bullet !bg-cyan-400 !opacity-50',
            bulletActiveClass: '!opacity-100 !w-8 !rounded-full transition-all'
          }}
          navigation={{
            nextEl: '.swiper-button-next-custom',
            prevEl: '.swiper-button-prev-custom',
          }}
          modules={[Autoplay, EffectCoverflow, Pagination, Navigation]}
          /* The classes below handle the slide scaling/opacity transitions 
             without needing a separate CSS file.
          */
          className="relative !pb-16 [&_.swiper-slide]:transition-all [&_.swiper-slide]:duration-500 [&_.swiper-slide]:opacity-40 [&_.swiper-slide-active]:opacity-100 [&_.swiper-slide-active]:scale-110"
        >
          {slides.map((slide) => (
            <SwiperSlide 
              key={slide.id} 
              className="!w-[300px] !h-[420px] rounded-2xl overflow-hidden shadow-2xl bg-gray-800"
            >
              <div className="relative w-full h-full">
                <img 
                  src={slide.img} 
                  alt={slide.title} 
                  className="w-full h-full object-cover"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-8">
                  <h3 className="text-white text-3xl font-bold tracking-tight mb-4">
                    {slide.title}
                  </h3>
                  <button className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 px-8 rounded-md transition-all active:scale-95 w-max">
                    {slide.btnText}
                  </button>
                </div>
              </div>
            </SwiperSlide>
          ))}

          {/* Custom Navigation Buttons (Tailwind Styled) */}
          <div className="swiper-button-prev-custom absolute left-4 top-1/2 -translate-y-1/2 z-10 cursor-pointer bg-cyan-400 p-3 rounded shadow-lg hover:bg-cyan-300 transition-colors hidden md:block">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="white" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </div>
          <div className="swiper-button-next-custom absolute right-4 top-1/2 -translate-y-1/2 z-10 cursor-pointer bg-cyan-400 p-3 rounded shadow-lg hover:bg-cyan-300 transition-colors hidden md:block">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="white" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </div>
        </Swiper>
      </div>
    </section>
  );
};

export default ServiceCarousel;
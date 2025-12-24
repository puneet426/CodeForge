import React from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// =========================================
// DATA: Upcoming & Past Events
// =========================================
const upcomingEvents = [
  {
    id: 1,
    title: "Freshers' Induction 2026",
    icon: "✨",
    date: "Jan 13, 2026",
    venue: "NIAMT Auditorium",
    description: "Calling all 1st Years! Join us for the grand unveiling of Code Forge. Meet the mentors, explore our 5 domains, and start your tech journey.",
    image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
    link: "#"
  },
  {
    id: 2,
    title: "Web Dev: Zero to Hero (Week 1)",
    icon: "💻",
    date: "Jan 17, 2026",
    venue: "Lecture Hall 1",
    description: "The first session of our weekly Full-Stack Development series. We start with HTML5 structure and modern CSS Grid layouts.",
    image: "https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-4.0.3&auto=format&fit=crop&w=1664&q=80",
    link: "#"
  },
  {
    id: 3,
    title: "AI/ML: Python for Data Science",
    icon: "🤖",
    date: "Jan 18, 2026",
    venue: "Lecture Hall 1",
    description: "Kickstarting the AI track! Hands-on workshop on Python libraries (NumPy, Pandas) essential for building intelligent systems.",
    image: "https://images.unsplash.com/photo-1555255707-c07966088b7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1632&q=80",
    link: "#"
  },
  {
    id: 4,
    title: "Cybersec: Linux & Networking",
    icon: "🔒",
    date: "Jan 24, 2026",
    venue: "Lecture Hall 1",
    description: "Week 1 of the Ethical Hacking roadmap. Learn to navigate the Kali Linux terminal and understand network protocols.",
    image: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
    link: "#"
  },
  {
    id: 5,
    title: "IoT: Arduino Basics",
    icon: "🔌",
    date: "Jan 25, 2026",
    venue: "Electronics Lab",
    description: "First step into hardware automation. Learn to interface sensors and actuators with Arduino microcontrollers.",
    image: "https://images.unsplash.com/photo-1553406830-ef2513450d76?ixlib=rb-4.0.3&auto=format&fit=crop&w=1632&q=80",
    link: "#"
  }
];

const pastEvents = [
  {
    id: 1,
    title: "rTIME-2025",
    date: "December 2025",
    image: "https://res.cloudinary.com/dp7clwitm/image/upload/v1766561082/Untitled_design_18_xt1stb.png"
  },
  {
    id: 2,
    title: "Workshop on C Programming",
    date: "November 2025",
    image: "https://res.cloudinary.com/dp7clwitm/image/upload/v1766561582/Untitled_design_19_qsgpvx.png"
  },
  {
    id: 3,
    title: "5-Day Cyber Security Workshop",
    date: " Oct 2025",
    image: "https://res.cloudinary.com/dp7clwitm/image/upload/v1766563498/code_forge_website_designs_qwiknb.png"
  },
  {
    id: 4,
    title: "SIH-2025",
    date: "Oct 2025",
    image: "https://res.cloudinary.com/dp7clwitm/image/upload/v1766564063/Internal_SIH_OCT_2025_Landscape_1_tlrtgn.png"
  },
  {
    id: 5,
    title: "TECH TALK",
    date: "July 2025",
    image: "https://res.cloudinary.com/dp7clwitm/image/upload/v1766582739/code_forge_website_designs_1_nftss4.png"
  },
  {
    id: 6,
    title: "TECH TALK",
    date: "April 2025",
    image: "https://media.licdn.com/dms/image/v2/D4D22AQH_bmmpqsc6CA/feedshare-shrink_2048_1536/B4DZY.PIs6HsAo-/0/1744801032002?e=1768435200&v=beta&t=SJqgZ7uEaTTNi_EZK6l-QyaDPyoR28nUVpY7VGmQXrc"
  },
  {
    id: 7,
    title: "Kartavya Tech Event x <Code/Forge>",
    date: "March 2025",
    image: "https://media.licdn.com/dms/image/v2/D4E22AQHlCWDGXKDipA/feedshare-shrink_800/B4EZVyZD8EHMAo-/0/1741380928441?e=1768435200&v=beta&t=VgbfLCgRRoeL2GQhPOVxldnfIZxppXoZcl4ngiyP5kc"
  },
  {
    id: 8,
    title: "TECH TALK",
    date: "Feb 2025",
    image: "https://media.licdn.com/dms/image/v2/D4D22AQGzhf1Psrsx2A/feedshare-shrink_2048_1536/B4DZUdSYYyHwA0-/0/1739953116487?e=1768435200&v=beta&t=YfU19Do_mPYU4nt_bDVHyJCCSBoNVO1dw7bDAghxyH4"
  }
];

// =========================================
// SLIDER SETTINGS
// =========================================
const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 2,
  slidesToScroll: 2,
  autoplay: true,
  autoplaySpeed: 4000,
  cssEase: "ease-in-out",
  arrows: false,
  responsive: [
    {
      breakpoint: 1024, // Tablet: Show 1 slide
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      }
    },
    {
      breakpoint: 640, // Mobile: Show 1 slide, adjusted scrolling
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        dots: true, // Keep dots for navigation since arrows are hidden
        autoplaySpeed: 3000 // Slightly faster scroll on mobile
      }
    }
  ],
  appendDots: dots => (
    <div style={{ bottom: "-40px" }}>
      <ul className="m-0 p-0 flex justify-center items-center"> {dots} </ul>
    </div>
  ),
  customPaging: i => (
    <div className="w-2 h-2 md:w-3 md:h-3 mx-1 rounded-full bg-gray-600 hover:bg-forge-yellow transition-colors cursor-pointer slick-active:bg-forge-yellow"></div>
  )
};

// =========================================
// COMPONENT: Single Upcoming Event Card
// =========================================
const UpcomingEventCard = ({ event }) => {
  return (
    <div className="p-2 md:p-4 h-full">
      <div className="flex flex-col lg:flex-row h-full border border-white/10 bg-black/40 rounded-xl md:rounded-2xl overflow-hidden backdrop-blur-sm hover:border-forge-yellow/50 transition-all hover:shadow-[0_0_15px_rgba(255,215,0,0.15)] group">
        
        {/* Image Section */}
        <div className="w-full lg:w-2/5 h-48 sm:h-56 lg:h-auto relative overflow-hidden flex-shrink-0">
          <img src={event.image} alt={event.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent lg:bg-gradient-to-r"></div>
        </div>

        {/* Content Section */}
        <div className="w-full lg:w-3/5 p-5 md:p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-lg md:text-xl font-bold text-white mb-2 flex items-start">
              <span className="mr-2 text-xl md:text-2xl">{event.icon}</span>
              {event.title}
            </h3>
            <div className="flex flex-wrap text-xs md:text-sm text-forge-yellow font-mono mb-3 gap-x-4 gap-y-1">
              <p>📅 {event.date}</p>
              <p>📍 {event.venue}</p>
            </div>
            <p className="text-gray-300 text-xs md:text-sm leading-relaxed mb-4 line-clamp-3">
              {event.description}
            </p>
          </div>
          <a href={event.link} className="inline-block text-center px-4 md:px-6 py-2 text-xs md:text-sm font-bold text-black bg-forge-yellow rounded hover:bg-orange-400 transition-colors font-mono shadow-[0_0_10px_rgba(255,215,0,0.3)]">
            Register Now
          </a>
        </div>
      </div>
    </div>
  );
};

// =========================================
// COMPONENT: Single Past Event Gallery Card
// =========================================
const GalleryCard = ({ event }) => {
  return (
    <div className="p-2 md:p-4 h-full">
      <div className="relative h-56 md:h-64 border border-white/10 bg-black/40 rounded-xl md:rounded-2xl overflow-hidden group hover:border-forge-yellow/50 transition-all">
        <img src={event.image} alt={event.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 translate-y-2 group-hover:translate-y-0 transition-transform">
          <h3 className="text-base md:text-lg font-bold text-white mb-1 leading-tight">{event.title}</h3>
          <p className="text-forge-yellow font-mono text-xs md:text-sm">{event.date}</p>
        </div>
      </div>
    </div>
  );
};

// =========================================
// MAIN COMPONENT: Events Section
// =========================================
const EventsSection = () => {
  return (
    <section className="py-12 md:py-20 px-4 md:px-12 bg-forge-dark bg-dot-pattern font-mono overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* 1. Upcoming Events Slider */}
        <div className="mb-16 md:mb-24">
          <h2 className="text-2xl md:text-4xl font-black text-white mb-8 md:mb-12 pb-2 md:pb-4 border-b-2 border-forge-yellow inline-block">
            Upcoming Events
          </h2>
          {/* Using negative margins to counteract the padding in the cards for perfect alignment */}
          <div className="-mx-2 md:-mx-4">
            <Slider {...sliderSettings}>
              {upcomingEvents.map(event => (
                <UpcomingEventCard key={event.id} event={event} />
              ))}
            </Slider>
          </div>
        </div>

        {/* 2. Past Events Gallery Slider */}
        <div>
          <h2 className="text-2xl md:text-4xl font-black text-white mb-8 md:mb-12 pb-2 md:pb-4 border-b-2 border-forge-yellow inline-block">
            Past Event Gallery
          </h2>
          <div className="-mx-2 md:-mx-4 pb-8 md:pb-12">
            <Slider {...sliderSettings}>
              {pastEvents.map(event => (
                <GalleryCard key={event.id} event={event} />
              ))}
            </Slider>
          </div>
        </div>

      </div>
    </section>
  );
};

export default EventsSection;
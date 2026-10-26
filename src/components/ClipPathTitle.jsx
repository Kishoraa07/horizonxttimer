import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const ClipPathTitle = ({ 
  title, 
  color = 'text-[var(--color-text-primary)]', 
  bg = 'bg-[var(--color-bg-dark)]', 
  className = '', 
  borderColor = 'border-[var(--color-crimson)]'
}) => {
  const titleRef = useRef(null);

  useGSAP(() => {
    gsap.fromTo(titleRef.current,
      {
        clipPath: 'polygon(50% 0, 50% 0, 50% 100%, 50% 100%)',
      },
      {
        clipPath: 'polygon(0% 0%, 100% 0, 100% 100%, 0% 100%)',
        duration: 1.5,
        ease: 'power4.inOut',
        scrollTrigger: {
          trigger: titleRef.current,
          start: 'top 80%',
        }
      }
    );
  }, []);

  return (
    <div className={`relative flex-center py-12 ${bg} ${className}`}>
      <h2 
        ref={titleRef}
        className={`general-title ${color} text-center px-4 ${borderColor} border-b-4`}
        style={{ clipPath: 'polygon(50% 0, 50% 0, 50% 100%, 50% 100%)' }}
      >
        {title}
      </h2>
    </div>
  );
};

export default ClipPathTitle;
import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const Story = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start']
  });

  const textY = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const image1Y = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const image2Y = useTransform(scrollYProgress, [0, 1], [-50, 50]);

  return (
    <section 
      id="story"
      ref={sectionRef}
      className="relative py-32 md:py-48 bg-[#F9F8F6] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Asymmetric Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 items-center">
          
          {/* Left Column - Image 1 */}
          <motion.div 
            style={{ y: image1Y }}
            className="md:col-span-5 relative h-[60vh] md:h-[80vh] w-full mt-12 md:mt-0"
          >
            <img 
              src="https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=2070&auto=format&fit=crop" 
              alt="Our journey begins"
              className="w-full h-full object-cover shadow-2xl"
            />
            {/* Decorative Element */}
            <div className="absolute -bottom-8 -left-8 w-48 h-48 border border-emerald-900/20 rounded-full hidden md:block" />
          </motion.div>

          {/* Right Column - Text & Image 2 */}
          <div className="md:col-span-7 flex flex-col justify-center relative">
            
            <motion.div 
              style={{ y: textY }}
              className="relative z-20 bg-[#F9F8F6] p-8 md:p-12 -ml-0 md:-ml-24 shadow-xl border border-stone-100"
            >
              <h2 className="text-xs tracking-[0.3em] uppercase text-emerald-800 mb-6 font-bold">
                The Beginning
              </h2>
              <p className="text-4xl md:text-6xl font-serif text-stone-900 leading-tight mb-8">
                Every love story is beautiful, but ours is our favorite.
              </p>
              <div className="space-y-6 text-stone-600 text-lg leading-relaxed font-light">
                <p>
                  It started with a simple conversation and grew into a lifetime of shared dreams. 
                  Through the seasons of life, we found our anchor in each other.
                </p>
                <p>
                  Now, we are thrilled to invite you to witness the next chapter of our journey. 
                  A celebration of love, family, and the beautiful adventure that awaits.
                </p>
              </div>
            </motion.div>

            {/* Floating Image 2 */}
            <motion.div 
              style={{ y: image2Y }}
              className="absolute -bottom-48 right-0 w-2/3 h-[40vh] hidden md:block z-0 opacity-80"
            >
              <img 
                src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2069&auto=format&fit=crop" 
                alt="Details"
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
            </motion.div>
            
          </div>
        </div>
      </div>
    </section>
  );
};

export default Story;

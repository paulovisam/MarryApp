import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { MapPin, Calendar, Clock } from 'lucide-react';

const Details = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start']
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);

  return (
    <section 
      id="details"
      ref={sectionRef}
      className="relative min-h-screen py-32 md:py-48 bg-stone-900 overflow-hidden flex items-center"
    >
      {/* Background Parallax */}
      <motion.div 
        style={{ y: bgY }}
        className="absolute inset-0 z-0 opacity-20"
      >
        <img 
          src="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070&auto=format&fit=crop" 
          alt="Venue"
          className="w-full h-full object-cover grayscale"
        />
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 w-full">
        <div className="flex flex-col items-center text-center text-[#F9F8F6] mb-24">
          <h2 className="text-sm tracking-[0.4em] uppercase text-emerald-400 mb-8 font-bold">
            The Celebration
          </h2>
          <p className="text-5xl md:text-7xl font-serif leading-tight max-w-4xl">
            Join us for an evening of love, laughter, and happily ever after.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8 mt-24">
          
          {/* Detail Item 1 */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="flex flex-col items-center text-center group"
          >
            <div className="w-16 h-16 rounded-full border border-emerald-500/30 flex items-center justify-center mb-8 group-hover:bg-emerald-900/50 transition-colors duration-500">
              <Calendar className="w-6 h-6 text-emerald-400" strokeWidth={1.5} />
            </div>
            <h3 className="text-2xl font-serif text-[#F9F8F6] mb-4">The Date</h3>
            <p className="text-stone-400 font-light tracking-wide text-lg">
              Saturday, October 24th<br />
              Two Thousand Twenty-Six
            </p>
          </motion.div>

          {/* Detail Item 2 */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col items-center text-center group"
          >
            <div className="w-16 h-16 rounded-full border border-emerald-500/30 flex items-center justify-center mb-8 group-hover:bg-emerald-900/50 transition-colors duration-500">
              <Clock className="w-6 h-6 text-emerald-400" strokeWidth={1.5} />
            </div>
            <h3 className="text-2xl font-serif text-[#F9F8F6] mb-4">The Time</h3>
            <p className="text-stone-400 font-light tracking-wide text-lg">
              Ceremony begins at 4:00 PM<br />
              Reception to follow
            </p>
          </motion.div>

          {/* Detail Item 3 */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-col items-center text-center group"
          >
            <div className="w-16 h-16 rounded-full border border-emerald-500/30 flex items-center justify-center mb-8 group-hover:bg-emerald-900/50 transition-colors duration-500">
              <MapPin className="w-6 h-6 text-emerald-400" strokeWidth={1.5} />
            </div>
            <h3 className="text-2xl font-serif text-[#F9F8F6] mb-4">The Venue</h3>
            <p className="text-stone-400 font-light tracking-wide text-lg">
              The Grand Estate<br />
              123 Wedding Lane, City
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Details;

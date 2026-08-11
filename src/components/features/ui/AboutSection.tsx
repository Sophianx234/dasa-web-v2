"use client";
import React from "react";
import { motion } from "framer-motion";
import AboutParagraph from "./AboutParagraph";
import SVGLite from "./SVGLite";

// Abstracted content with beautiful images assigned to each chapter
const aboutContent = [
  {
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop",
    bgColor: "bg-[#33312e]",
    isDark: true,
    numFont: "font-chewy",
    title: "Where The Story Began .",
    content: "The Dagbon Students Association (DaSA), University of Ghana branch is a vibrant community that brings together students from Dagbon and beyond to celebrate our rich heritage, foster unity, and empower academic and personal growth. This association serves as a proud platform for celebrating the rich cultural heritage, values, and traditions of Dagbon while fostering a sense of unity, leadership, and academic excellence among members.",
  },
  {
    image: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=2049&auto=format&fit=crop",
    bgColor: "bg-[#fef4e9]",
    numFont: "font-lobster",
    title: "Commitment to Building a Welcoming Environment.",
    content: "DaSA is committed to building a welcoming environment where students can connect, share ideas, create lifelong friendships, and access meaningful opportunities. Through a range of initiatives, including academic workshops, leadership development programs, cultural festivals, networking events, and social impact projects, we empower our members both within and beyond the university setting.",
  },
  {
    image: "https://images.unsplash.com/photo-1593113580332-628d5259a4bb?q=80&w=2070&auto=format&fit=crop",
    bgColor: "bg-[#33312e]",
    isDark: true,
    numFont: "font-quicksand text-4xl font-black",
    title: "Commitment Beyond Campus Life.",
    content: "Beyond campus life, DaSA is deeply committed to making Dagbon a better place. We actively reach out to underserved communities across Dagbon, striving to uplift lives through insightful initiatives, educational support, empowerment programs, and community-driven development projects. We believe in giving back, bridging gaps, and building a stronger future for our people.",
  },
  {
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop",
    bgColor: "bg-[#fef4e9]",
    numFont: "font-chewy",
    title: "Prioritizing Personal Growth and Well-being.",
    content: "We also prioritize the personal growth and well-being of our community, promoting mentorship, innovation, entrepreneurship, and civic responsibility. By embracing diversity and inclusivity, DaSA encourages members from all backgrounds to participate, contribute, and thrive.",
  },
  {
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop",
    bgColor: "bg-[#33312e]",
    isDark: true,
    numFont: "font-lobster",
    title: "Our Vision for Dagbon’s Future.",
    content: "Our vision is to see a prosperous, united Dagbon where students lead the way in education, innovation, and community transformation. We dream of a future where every student from Dagbon is empowered to achieve their fullest potential, give back to society, and contribute meaningfully to building a vibrant, thriving Dagbon for generations to come.",
  }
];

function AboutSection() {

  return (
    <section className="w-full bg-[#fef4e9]/30 relative">
      
      {/* Decorative background element */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-white to-transparent pointer-events-none"></div>

      <div className="w-full px-6 md:px-12 py-24 md:py-32 relative z-10">
        <div className="max-w-5xl lg:max-w-6xl mx-auto">

          {/* === HEADER === */}
          <header className="mb-16  md:mb-24 ">
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="text-4xl text-center lg:text-7xl font-extrabold text-[#33312e] tracking-tighter leading-[1.05] font-rethink"
            >
              About the Dagbon <br className="hidden md:block" />
              <span className="text-dasadeep/60">Students Association.</span>
            </motion.h1>
          </header>

          {/* === STACKING CARDS LIST === */}
          <div className="w-full max-w-7xl mx-auto pb-[50vh]">
            <div className="flex flex-col gap-[80vh] relative w-full z-20">
              {aboutContent.map((item, index) => (
                <AboutParagraph 
                  key={index}
                  index={index}
                  title={item.title}
                  content={item.content}
                  image={item.image}
                  bgColor={item.bgColor}
                  numFont={item.numFont}
                  isDark={item.isDark}
                  total={aboutContent.length}
                />
              ))}
            </div>
          </div>

          {/* === FOOTER DECORATION === */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="flex justify-center mt-20 pt-10 border-t border-gray-200/60"
          >
            <div className="opacity-50 sm:hidden block hover:opacity-100 transition-opacity duration-300">
               <SVGLite type="sticks" />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

export default AboutSection;

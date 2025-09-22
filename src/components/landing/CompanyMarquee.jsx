"use client"

import React from "react"
import { motion } from "framer-motion"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"

const companies = [
  { id: 1, name: "Company 1", path: "/companies/company1.svg" },
  { id: 2, name: "Company 2", path: "/companies/company2.svg" },
  { id: 3, name: "Company 3", path: "/companies/company3.webp" },
  { id: 4, name: "Company 4", path: "/companies/company4.svg" },
  { id: 5, name: "Company 5", path: "/companies/company5.webp" },
  { id: 6, name: "Company 6", path: "/companies/company6.png" },
]

const CompanyCarousel = () => {
  return (
    <div className="relative mt-6 w-full border-t border-zinc-800 bg-black/20 py-8 overflow-hidden">
      <Carousel className="w-full max-w-7xl mx-auto">
        <CarouselContent className="flex gap-16 items-center">
          <motion.div
            className="flex  min-w-max"
            animate={{ x: ["0%", "-100%"] }}
            transition={{
              repeat: Infinity,
              duration: 30,
              ease: "linear",
            }}
          >
            {[...companies, ...companies].map(({ id, name, path }, index) => (
              <CarouselItem
                key={index}
                className="basis-1/3 sm:basis-1/4 md:basis-1/6 flex justify-center"
              >
                <img
                  src={path}
                  alt={name}
                  className="h-9 sm:h-14 w-auto object-contain opacity-80 hover:opacity-100 transition"
                />
              </CarouselItem>
            ))}
          </motion.div>
        </CarouselContent>
      </Carousel>
    </div>
  )
}

export default CompanyCarousel

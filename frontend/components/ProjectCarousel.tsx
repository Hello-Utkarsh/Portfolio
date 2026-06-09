import * as React from "react"
// import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

export function ProjectCarousel() {
  return (
    <Carousel className="w-full h-full!">
      <CarouselContent className="h-full! w-full">
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index} className="h-full!">
            <div className="p-1 bg-white w-full h-full">
              hello
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}

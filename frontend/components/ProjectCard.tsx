"use client";
import { ThemeConfig } from "@/lib/definition";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useRef } from "react";

export default function ProjectCard({ theme, selected, name, description, img }: { theme: ThemeConfig, selected: 'dark' | 'light', name: string, description: string, img: string }) {
  const video = useRef<HTMLVideoElement>(null)
  return (
    <div className="max-w-xs w-full h-full ">
      <div
        className={cn(
          "group w-full cursor-pointer relative card rounded-xl shadow-xl mx-auto flex flex-col justify-end items-start border border-transparent dark:border-neutral-800 h-full",
        )}
      >
        <img width={100} height={100} src={img} className="absolute top-0 w-full h-full rounded-xl p-0.5" alt="project banner" />
        <div className={cn(theme[selected].bgColor,"relative p-1 lg:p-2")} style={{ backgroundColor: theme[selected].bgColor }}>
          <p className={cn(theme[selected].typography.subHeading, "text-black relative")} style={{ color: theme[selected].socialIcnClr }}>
            {name}
          </p>
          <p className={cn(theme[selected].typography.descPara, "mt-1 line-clamp-3")} style={{ color: theme[selected].secondaryText }}>{description}</p>
        </div>
      </div>
    </div>
  );
}

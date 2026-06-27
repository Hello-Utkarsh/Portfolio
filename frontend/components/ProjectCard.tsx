"use client";
import { ThemeConfig } from "@/lib/definition";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useRef } from "react";

export default function ProjectCard({ theme, selected }: { theme: ThemeConfig, selected: 'dark' | 'light' }) {
  const video = useRef<HTMLVideoElement>(null)
  return (
    <div className="max-w-xs w-full h-full ">
      <div
        className={cn(
          "group w-full cursor-pointer relative card rounded-xl shadow-xl mx-auto flex flex-col justify-end items-start border border-transparent dark:border-neutral-800 h-full",
        )}
      >
        <img width={100} height={100} src={"/autodocs-banner.png"} className="absolute top-0 w-full h-full" alt="project banner" />
        <div className="relative backdrop-blur-lg p-1 lg:p-2 bg-gray-400/10">
          <p className={cn(theme[selected].typography.subHeading, "text-black relative")}>
            AutoDocs
          </p>
          <p className={cn(theme[selected].typography.descPara, "mt-1 line-clamp-3")} style={{ color: theme[selected].secondaryText }}>Helps to document all your learning and automate the task of posting it to different platforms </p>
        </div>
      </div>
    </div>
  );
}

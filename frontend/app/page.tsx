'use client'
import { cn } from "@/lib/utils";
import { DotPattern } from "@/components/ui/dot-pattern";
import Image from "next/image";
import { ArrowRight } from 'lucide-react';
import { useState } from "react";
import { FiMoon, FiSun } from "react-icons/fi";
import { AnimatePresence, motion } from 'motion/react'
import ProjectCard from '@/components/ProjectCard'
import dynamic from "next/dynamic";
import Blog from "@/components/Blog";
import Project from "@/components/Project";
import Link from "next/link";
import { EmailIcon, ExpressIcon, GithubIcon, GitIcon, JavascriptIcon, LinkedinIcon, MongoDBIcon, NextIcon, NodeIcon, PostgresIcon, PrismaIcon, PythonIcon, ReactIcon, StackIcon, TailwindIcon, TwitterIcon, TypescriptIcon } from "@/components/Icons";

const TOGGLE_CLASSES =
  "text-sm font-medium flex items-center gap-2 px-3 md:pl-3 md:pr-3.5 py-3 md:py-1.5 transition-colors relative z-10";

const theme = {
  light: { patternbgColor: "#DCDFE2", bgColor: "#D9DCE0", titleTxt: "#484E5B", secondaryText: "#6C7789", secondaryClr: "#7B62F9", socialIcnBg: "#A0A8B1", socialIcnClr: "#212121", techIcn: "black" },
  dark: { patternbgColor: "black", bgColor: "#101010", titleTxt: "white", secondaryText: "#99a1af", secondaryClr: "#ACA0E6", socialIcnBg: "#212121", socialIcnClr: "#D2D6DA", techIcn: "white" }
}

const GitHubCalendarSafe = dynamic(() => import('@/components/GithubCalendar'), { ssr: false });

export default function page() {

  const [page, setPage] = useState<'home' | 'project' | 'blog'>('blog')
  const [selected, setSelected] = useState<"dark" | "light">("dark");

  return (
    <div className="relative flex h-screen w-screen flex-col items-center justify-center overflow-hidden rounded-lg border font-mono" style={{ backgroundColor: theme[selected].patternbgColor }}>
      <Home selected={selected} setSelected={setSelected} page={page} setPage={setPage} />
      <Project selected={selected} page={page} setPage={setPage} theme={theme} />
      <Blog selected={selected} page={page} setPage={setPage} theme={theme} />
      <DotPattern
        className={cn(
          "h-full w-full mask-[radial-gradient(1000px_circle_at_center,white,transparent)]",
        )}
      />
      <div>
      </div>
    </div>
  );
}

function Home({ selected, setSelected, page, setPage }: { selected: 'dark' | 'light', setSelected: React.Dispatch<React.SetStateAction<'dark' | 'light'>>, page: string, setPage: React.Dispatch<React.SetStateAction<'home' | 'project' | 'blog'>> }) {

  return (
    <AnimatePresence mode="wait"> {page === 'home' && (
      <motion.div
        initial={{ opacity: 0, scale: 2 }}
        animate={{ opacity: 1, scale: 1, transition: { type: "tween", ease: "easeOut", duration: 1, delay: 0.5 } }}
        exit={{ opacity: 0, scale: 0.9, y: -40, x: 40 }}
        transition={{ duration: 1 }}
        className="h-9/12 rounded-xl grid grid-rows-5 w-8/12 z-10 text-white p-2 gap-3 absolute top-[12.5%] shadow-[0px_4px_16px_rgba(107,114,128,0.3),0px_8px_24px_rgba(107,114,128,0.3),0px_16px_56px_rgba(107,114,128,0.3)]" style={{ backgroundColor: theme[selected].bgColor }}>
        <div className="grid grid-cols-5 gap-3 row-span-3">
          <div className="grid col-span-4 grid-rows-2 gap-3">
            <div className="grid grid-cols-4 gap-3">
              <div className="col-span-2 rounded-xl border-2 border-[#212121] flex flex-col justify-center items-center text-start px-6">
                <p className="text-lg font-semibold w-full" style={{ color: theme[selected].titleTxt }}>Hi, I'm Echo</p>
                <p className="text-[13px] mt-1 font-light w-full" style={{ color: theme[selected].secondaryText }}>Full-stack developer building backend systems, developer tools, and AI-powered applications while exploring scalable software architecture.</p>
              </div>
              <div className="col-span-1 rounded-xl border-2 border-[#212121] flex justify-center items-center">
                <span className="flex flex-col items-center">
                  <Image height={60} width={60} alt="project-icon" className="rounded-full px-2 py-2 bg-[#222222]" src={'/school-bag.png'}></Image>
                  <p className="text-sm mt-1">My Past Works</p>
                </span>
              </div>
              <div className="col-span-1 rounded-xl border-2 border-[#212121] overflow-hidden">
                <ProjectCard />
              </div>
            </div>
            <div className="grid grid-cols-4 gap-3">
              <div className="col-span-1 rounded-xl grid grid-cols-2 border-2 px-2 py-2 gap-2 border-[#212121]">
                <Link href={"https://github.com/Hello-Utkarsh"} target="_blank" className="h-full w-full">
                  <GithubIcon theme={theme} selected={selected} />
                </Link>
                <Link href={"https://mail.google.com/mail/?view=cm&fs=1&to=pateluttkarsh697@gmail.com"} target="_blank" className="h-full w-full">
                  <EmailIcon theme={theme} selected={selected} />
                </Link>
                <Link href={"https://github.com/Hello-Utkarsh"} target="_blank" className="h-full w-full">
                  <LinkedinIcon theme={theme} selected={selected} />
                </Link>
                <Link href={"https://github.com/Hello-Utkarsh"} target="_blank" className="h-full w-full">
                  <TwitterIcon theme={theme} selected={selected} />
                </Link>
              </div>
              <div className="col-span-1 rounded-xl border-2 border-[#212121] flex flex-col justify-start px-4 py-4">
                <div className="">
                  <p className="text-sm font-semibold flex gap-2 justify-center" style={{ color: theme[selected].secondaryClr }}>
                    <StackIcon theme={theme} selected={selected} />
                    Tech Arsenal</p>
                </div>
                <div className="grid grid-cols-5 gap-2 mt-4">
                  <ExpressIcon theme={theme} selected={selected} />
                  <MongoDBIcon />
                  <NodeIcon />
                  <ReactIcon />
                  <NextIcon theme={theme} selected={selected} />
                  <PythonIcon />
                  <GitIcon />
                  <PostgresIcon theme={theme} selected={selected} />
                  <PrismaIcon theme={theme} selected={selected} />
                  <TailwindIcon />
                  <TypescriptIcon />
                  <JavascriptIcon />
                </div>
              </div>
              <div className="col-span-1 rounded-xl border-2 border-[#212121] overflow-hidden">
                <ProjectCard />
              </div>
              <div className="col-span-1 rounded-xl border-2 border-[#212121] flex flex-col justify-center items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40" color={theme[selected].secondaryClr} fill="none" className="rounded-full px-2 py-2 bg-[#212121]">
                  <path fill={theme[selected].secondaryClr} d="M14.399,3.112 L16.162,6.665 C16.215,6.775 16.342,6.93 16.532,7.072 C16.722,7.213 16.909,7.291 17.031,7.312 L20.221,7.846 C21.373,8.04 22.339,8.604 22.652,9.588 C22.965,10.571 22.506,11.592 21.678,12.422 L21.677,12.422 L19.199,14.921 C19.101,15.02 18.991,15.206 18.922,15.449 C18.853,15.691 18.847,15.911 18.878,16.053 L18.879,16.055 L19.588,19.145 C19.882,20.432 19.784,21.707 18.877,22.374 C17.967,23.043 16.723,22.747 15.592,22.074 L12.603,20.289 C12.477,20.214 12.261,20.153 12.001,20.153 C11.743,20.153 11.523,20.213 11.389,20.291 L11.387,20.292 L8.403,22.073 C7.274,22.749 6.032,23.04 5.121,22.37 C4.214,21.703 4.112,20.43 4.407,19.145 L5.116,16.055 L5.116,16.053 C5.147,15.911 5.141,15.691 5.073,15.449 C5.004,15.206 4.894,15.02 4.796,14.921 L2.316,12.421 C1.493,11.591 1.035,10.57 1.346,9.589 C1.658,8.605 2.621,8.04 3.774,7.846 L6.961,7.312 L6.962,7.312 C7.079,7.292 7.263,7.215 7.452,7.073 C7.643,6.931 7.77,6.775 7.823,6.665 L7.826,6.66 L9.586,3.111 L9.586,3.11 C10.119,2.041 10.948,1.25 11.996,1.25 C13.045,1.25 13.872,2.043 14.399,3.112 Z" />

                  <path fill="currentColor" d="M14.399,3.112 L16.162,6.665 C16.215,6.775 16.342,6.93 16.532,7.072 C16.722,7.213 16.909,7.291 17.031,7.312 L20.221,7.846 C21.373,8.04 22.339,8.604 22.652,9.588 C22.965,10.571 22.506,11.592 21.678,12.422 L21.677,12.422 L19.199,14.921 C19.101,15.02 18.991,15.206 18.922,15.449 C18.853,15.691 18.847,15.911 18.878,16.053 L18.879,16.055 L19.588,19.145 C19.882,20.432 19.784,21.707 18.877,22.374 C17.967,23.043 16.723,22.747 15.592,22.074 L12.603,20.289 C12.477,20.214 12.261,20.153 12.001,20.153 C11.743,20.153 11.523,20.213 11.389,20.291 L11.387,20.292 L8.403,22.073 C7.274,22.749 6.032,23.04 5.121,22.37 C4.214,21.703 4.112,20.43 4.407,19.145 L5.116,16.055 L5.116,16.053 C5.147,15.911 5.141,15.691 5.073,15.449 C5.004,15.206 4.894,15.02 4.796,14.921 L2.316,12.421 C1.493,11.591 1.035,10.57 1.346,9.589 C1.658,8.605 2.621,8.04 3.774,7.846 L6.961,7.312 L6.962,7.312 C7.079,7.292 7.263,7.215 7.452,7.073 C7.643,6.931 7.77,6.775 7.823,6.665 L7.826,6.66 L9.586,3.111 L9.586,3.11 C10.119,2.041 10.948,1.25 11.996,1.25 C13.045,1.25 13.872,2.043 14.399,3.112 Z M10.929,3.779 L9.171,7.324 C8.984,7.706 8.672,8.034 8.351,8.274 C8.028,8.515 7.628,8.72 7.214,8.791 L7.212,8.791 L4.023,9.325 C3.136,9.474 2.844,9.826 2.776,10.042 C2.707,10.261 2.744,10.722 3.381,11.364 L5.861,13.865 C6.182,14.189 6.397,14.622 6.516,15.04 C6.634,15.458 6.679,15.938 6.58,16.38 L6.579,16.385 L5.869,19.48 C5.604,20.635 5.872,21.06 6.01,21.162 C6.144,21.261 6.622,21.391 7.633,20.786 L10.628,18.998 C11.044,18.754 11.543,18.653 12.001,18.653 C12.458,18.653 12.957,18.754 13.372,19.001 L16.361,20.785 L16.361,20.785 L16.361,20.785 C17.38,21.392 17.857,21.263 17.989,21.166 C18.124,21.066 18.391,20.643 18.125,19.48 L17.414,16.38 C17.316,15.938 17.36,15.458 17.479,15.04 C17.597,14.622 17.812,14.189 18.134,13.865 L20.614,11.364 L20.616,11.363 C21.257,10.721 21.292,10.26 21.223,10.043 C21.154,9.827 20.86,9.475 19.972,9.325 L16.783,8.791 C16.365,8.721 15.962,8.517 15.637,8.275 C15.313,8.034 15.001,7.706 14.814,7.324 L13.054,3.776 C12.632,2.92 12.204,2.75 11.996,2.75 C11.787,2.75 11.356,2.922 10.929,3.779 Z"></path>
                </svg>
                <p className="text-base font-semibold leading-5" style={{ color: theme[selected].titleTxt }}>More of<br />My Work</p>
                <button onClick={() => setPage('project')} className="text-black px-4 py-1 rounded-xl cursor-pointer" style={{ backgroundColor: theme[selected].secondaryClr }}>View More</button>
              </div>
            </div>
          </div>
          <div className="col-span-1 grid grid-rows-5 gap-3">
            <div className="row-span-2 rounded-xl border-2 border-[#212121] overflow-hidden flex justify-center items-center px-2">
              <GitHubCalendarSafe />
            </div>
            <div className="row-span-2 rounded-xl border-2 border-[#212121] p-2 flex justify-center items-center">
              Resume
            </div>
            <div className="row-span-1 rounded-xl border-2 border-[#212121] flex justify-center items-center overflow-hidden">
              <div
                className={`grid h-full w-full place-content-center px-4 transition-colors ${selected === "light" ? "bg-[#A0A8B1]" : "bg-[#212121]"
                  }`}
              >
                <SliderToggle selected={selected} setSelected={setSelected} />
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-5 gap-3 row-span-2">
          <div className="col-span-3 relative rounded-xl border-2 border-[#212121] py-4 flex flex-col justify-between">
            <div className="flex px-5 gap-6 h-full w-full">
              <div className="w-fit flex flex-col justify-between">
                <span className="">
                  <p className="text-xs font-semibold" style={{ color: theme[selected].secondaryText }}>Showcase</p>
                  <p className="font-semibold text-lg" style={{ color: theme[selected].titleTxt }}>Blogs</p>
                </span>
                <button onClick={() => setPage('blog')} className="bg-[#212121] w-fit rounded-full px-1 py-1 mt-1 -rotate-35 self-start flex hover:scale-125 transition hover:-rotate-45 cursor-pointer"><ArrowRight /></button>
              </div>
              <div className="grid grid-cols-2 w-full gap-4">
                <BlogCard imgSrc="/blog-banner.png" title="Exploring Database Pooling, Caching & Scaling" />
                <BlogCard imgSrc="/blog-banner.png" title="Exploring Database Pooling, Caching & Scaling" />
              </div>
            </div>
          </div>
          <div className="col-span-2 rounded-xl border-2 border-[#212121] px-5 py-4 flex flex-col justify-center">
            <p className="text-xs" style={{ color: theme[selected].titleTxt }}>Say Hello👋</p>
            <p className="mt-4 font-semibold text-lg" style={{ color: theme[selected].titleTxt }}>Let Work Together</p>
            <p className="text-[13px] mt-1 text-gray-400" style={{ color: theme[selected].secondaryText }}>Lets create something unique together! I'm excited to collaborate</p>
            <button className="bg-[#212121] w-fit rounded-full px-2 py-2 mt-2 -rotate-35 self-end flex hover:scale-125 transition hover:-rotate-45 cursor-pointer"><ArrowRight /></button>
          </div>
        </div>
      </motion.div>)
    }
    </AnimatePresence >
  )
}

const BlogCard = ({ imgSrc, title }: any) => {
  return (
    <div className="h-full w-full flex flex-col rounded-xl overflow-hidden border border-gray-500">
      <Image height={100} width={100} alt="blog banner" src={imgSrc} className="w-full" />
      <p className="text-[13px] tracking-tighter px-3 text-pretty flex items-center justify-center h-full">{title}</p>
    </div>
  )
}

const SliderToggle = ({ selected, setSelected }: any) => {
  return (
    <div className="relative flex w-fit items-center gap-2 rounded-full">
      <button
        className={`${TOGGLE_CLASSES} ${selected === "light" ? "text-white" : "text-slate-300"
          }`}
        onClick={() => {
          setSelected("light");
        }}
      >
        <FiMoon className="relative size-6 z-10 text-lg md:text-sm" />
      </button>
      <button
        className={`${TOGGLE_CLASSES} ${selected === "dark" ? "text-white" : "text-slate-800"
          }`}
        onClick={() => {
          setSelected("dark");
        }}
      >
        <FiSun className="relative size-6 z-10 text-lg md:text-sm" />
      </button>
      <div
        className={`absolute inset-0 z-0 flex ${selected === "dark" ? "justify-end" : "justify-start"
          }`}
      >
        <motion.span
          layout
          transition={{ type: "spring", damping: 15, stiffness: 250 }}
          className="h-full w-1/2 rounded-full bg-linear-to-r from-violet-600 to-indigo-600"
        />
      </div>
    </div>
  );
};
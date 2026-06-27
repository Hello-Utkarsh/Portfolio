import { ArrowLeft } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import ProjectCarousel from "./ui/carousel";
import { ThemeConfig } from "@/lib/definition";

export default function Project({ selected, page, setPage, theme }: { selected: 'dark' | 'light', page: string, setPage: React.Dispatch<React.SetStateAction<'home' | 'project' | 'blog'>>, theme: ThemeConfig }) {
  return (
    <AnimatePresence mode="wait"> {page === 'project' && (
      <motion.div
        initial={{ opacity: 0, scale: 2 }}
        animate={{ opacity: 1, scale: 1, transition: { type: "tween", ease: "easeOut", duration: 1, delay: 0.5 } }}
        exit={{ opacity: 0, scale: 0.9, y: -40, x: 40 }}
        transition={{ duration: 1 }} className="h-11/12 w-11/12 lg:h-9/12 lg:w-8/12 absolute hidden landscape:block z-10 top-1/24 lg:top-[12.5%] p-2 rounded-xl shadow-[0px_4px_16px_rgba(107,114,128,0.3),0px_8px_24px_rgba(107,114,128,0.3),0px_16px_56px_rgba(107,114,128,0.3)]" style={{ backgroundColor: theme[selected].bgColor }}>
        <button onClick={() => setPage('home')} className="bg-[#212121] z-20 absolute top-0 w-fit rounded-full p-1 mt-3.5 ml-1.5 self-start flex hover:scale-125 transition hover:rotate-45 cursor-pointer" >
          <ArrowLeft color="white" />
        </button>
        <ProjectCarousel theme={theme} selected={selected} />
      </motion.div>)}
    </AnimatePresence>
  )
}
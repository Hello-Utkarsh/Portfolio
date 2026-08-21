import { BlogConfig, ThemeConfig } from "@/lib/definition";
import { ArrowLeft, Dot } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { data } from "motion/react-client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Blog({ selected, page, setPage, theme }: { selected: 'dark' | 'light', page: string, setPage: React.Dispatch<React.SetStateAction<'home' | 'project' | 'blog'>>, theme: ThemeConfig }) {
    const [blogs, setBlogs] = useState<BlogConfig[]>([])

    useEffect(() => {
        async function loadSnippet() {
            try {
                const res = await fetch(`/api/blogpreview`);
                const data = await res.json();
                setBlogs(data)
            } catch (err) {
                console.log(err)
            }
        }

        loadSnippet();
    }, []);

    return (
        <AnimatePresence mode="wait"> {page === 'blog' && (
            <motion.div
                initial={{ opacity: 0, scale: 2 }}
                animate={{ opacity: 1, scale: 1, transition: { type: "tween", ease: "easeOut", duration: 1, delay: 0.5 } }}
                exit={{ opacity: 0, scale: 0.9, y: -40, x: 40 }}
                transition={{ duration: 1 }}
                className="portrait:min-h-160 portrait:w-[95vh] portrait:top-[97.5%] portrait:translate-x-[5%] portrait:left-0 portrait:origin-top-left portrait:-rotate-90 absolute h-11/12 w-11/12 lg:h-9/12 lg:w-8/12 grid z-10 top-1/24 lg:top-[12.5%] p-2 rounded-xl shadow-[0px_4px_16px_rgba(107,114,128,0.3),0px_8px_24px_rgba(107,114,128,0.3),0px_16px_56px_rgba(107,114,128,0.3)]" style={{ backgroundColor: theme[selected].bgColor }}>
                <button onClick={() => setPage('home')} className="bg-[#212121] z-20 absolute top-0 w-fit rounded-full p-1 mt-3.5 ml-1.5 self-start flex hover:scale-125 transition hover:rotate-45 cursor-pointer" >
                    <ArrowLeft color="white" />
                </button>
                <div className="overflow-y-auto h-full px-12 py-6">
                    <p className="text-xl min-[724px]:text-2xl lg:text-4xl" style={{ color: theme[selected].titleTxt }}>Blog</p>
                    <p className="w-6/12 mt-2 text-xs min-[724px]:text-sm font-medium" style={{ color: theme[selected].secondaryText }}>Notes on software, backend engineering, and things I'm currently exploring.</p>
                    <BlogBanner theme={theme} selected={selected} title={blogs[0]?.title} description={blogs[0]?.description} tags={blogs[0]?.tags} date={blogs[0]?.date} />
                    <p className="text-gray-500 text-sm font-medium min-[724px]:text-base mt-8">More Posts</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                        {blogs?.slice(1).map((blog) => {
                            console.log(blog.path)
                            return (
                                <BlogCard key={blog.path} path={blog.path} theme={theme} selected={selected} title={blog.title} description={blog.description} tags={blog.tags} date={blog.date} />

                            )
                        })}
                    </div>
                </div>
            </motion.div>)}
        </AnimatePresence>
    )
}

function BlogCard({ title, description, tags, date, theme, selected, path }: { title: string, description: string, tags: string, date: string, theme: ThemeConfig, selected: 'light' | 'dark', path: string }) {
    return (
        <Link href={`blog/${path}`}>
            <div className="h-fit border border-gray-700 rounded-lg cursor-pointer">
                <div className="w-full h-40 bg-gray-400 rounded-lg"></div>
                <div className="p-4 w-full h-full">
                    <span className="flex gap-2 flex-wrap">
                        {tags?.split(",").map((tag) => {
                            return (
                                <p className="bg-gray-700 text-white rounded-lg px-1.5 py-0.5 lg:px-2 lg:py-1 text-xs h-fit w-fit">{tag}</p>

                            )
                        })}
                    </span>
                    <h2 className="line-clamp-2 text-white text-[13px] lg:text-sm mt-2 font-semibold" style={{ color: theme[selected].titleTxt }}>{title}</h2>
                    <p className="text-gray-500 mt-1 md:mt-2 line-clamp-3 text-xs lg:text-sm font-medium" style={{ color: theme[selected].secondaryText }}>{description}</p>
                    <p className="text-gray-500 text-xs mt-1.5 md:mt-3" style={{ color: theme[selected].secondaryText }}>{date}</p>
                </div>
            </div>
        </Link>
    )
}

function BlogBanner({ title, description, tags, date, theme, selected }: { title: string, description: string, tags: string, date: string, theme: ThemeConfig, selected: 'light' | 'dark' }) {
    return (
        <div className="rounded-xl flex gap-6 mt-4 cursor-pointer" style={{ backgroundColor: theme[selected].socialIcnBg }}>
            <div className="bg-gray-700 rounded-2xl w-10/12"></div>
            <div className="flex flex-col w-fit gap-2 py-4">
                <span className="flex gap-2 flex-wrap">
                    {tags?.split(",").map((tag) => {
                        return (
                            <p className="bg-gray-700 text-white rounded-lg px-1.5 py-0.5 lg:px-2 lg:py-1 text-xs h-fit w-fit">{tag}</p>

                        )
                    })}
                </span>
                <span>
                    <h1 className="text-lg min-[724px]:text-xl lg:text-3xl text-white mt-2 line-clamp-2" style={{ color: theme[selected].socialIcnClr }}>{title}</h1>
                    <p className="text-gray-500 mt-2 line-clamp-4 md:line-clamp-6 lg:line-clamp-8 text-[13px] min-[724px]:text-sm lg:text-base" style={{ color: theme[selected].titleTxt }}>{description}</p>
                </span>
                <span className="text-white flex items-center" style={{ color: theme[selected].titleTxt }}>
                    <div className="h-8 rounded-full aspect-square bg-gray-500"></div>
                    <p className="ml-1 text-[13px] min-[724px]:text-sm lg:text-base">Echo</p>
                    <Dot />
                    <p className="text-[13px] min-[724px]:text-sm lg:text-base">{date}</p>
                </span>
            </div>
        </div>
    )
}
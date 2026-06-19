import { BlogConfig, ThemeConfig } from "@/lib/definition";
import { ArrowLeft, Dot } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { data } from "motion/react-client";
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
                className="h-9/12 w-8/12 absolute z-10 top-[12.5%] p-2 rounded-xl shadow-[0px_4px_16px_rgba(107,114,128,0.3),0px_8px_24px_rgba(107,114,128,0.3),0px_16px_56px_rgba(107,114,128,0.3)]" style={{ backgroundColor: theme[selected].bgColor }}>
                <button onClick={() => setPage('home')} className="bg-[#212121] z-20 absolute top-0 w-fit rounded-full p-1 mt-3.5 ml-1.5 self-start flex hover:scale-125 transition hover:rotate-45 cursor-pointer" >
                    <ArrowLeft color="white" />
                </button>
                <div className="overflow-y-auto h-full px-12 py-6">
                    <p className="text-4xl text-white">Blog</p>
                    <h2 className="text-gray-500 w-6/12 mt-2 text-sm">Notes on software, backend engineering, and things I'm currently exploring.</h2>
                    <BlogBanner title={blogs[0]?.title} description={blogs[0]?.description} tags={blogs[0]?.tags} date={blogs[0]?.date} />
                    <p className="text-gray-500 text-base mt-8">More Posts</p>
                    <div className="grid grid-cols-3 gap-4 mt-2">
                        {blogs.slice(1).map((blog) => {
                            return (
                                <BlogCard title={blog.title} description={blog.description} tags={blog.tags} date={blog.date} />

                            )
                        })}
                    </div>
                </div>
            </motion.div>)}
        </AnimatePresence>
    )
}

function BlogCard({ title, description, tags, date }: { title: string, description: string, tags: string, date: string }) {
    return (
        <div className="h-fit border border-gray-700 rounded-lg cursor-pointer">
            <div className="w-full h-40 bg-gray-400 rounded-lg"></div>
            <div className="p-4 w-full h-full">
                <span className="flex gap-2 flex-wrap">
                    {tags.split(",").map((tag) => {
                        return (
                            <p className="bg-gray-700 text-white rounded-lg px-2 py-1 text-xs h-fit w-fit">{tag}</p>

                        )
                    })}
                </span>
                <h2 className="line-clamp-2 text-white text-sm mt-2">{title}</h2>
                <p className="text-gray-500 mt-2 line-clamp-3 text-sm">{description}</p>
                <p className="text-gray-500 text-xs mt-3">{date}</p>
            </div>
        </div>
    )
}

function BlogBanner({ title, description, tags, date }: { title: string, description: string, tags: string, date: string }) {
    return (
        <div className="bg-gray-800 rounded-xl flex gap-6 mt-4 cursor-pointer">
            <div className="bg-gray-700 rounded-2xl w-10/12"></div>
            <div className="flex flex-col w-fit gap-2 py-4">
                <span className="flex gap-2 flex-wrap">
                    {tags.split(",").map((tag) => {
                        return (
                            <p className="bg-gray-700 text-white rounded-lg px-2 py-1 text-xs h-fit w-fit">{tag}</p>

                        )
                    })}
                </span>
                <span>
                    <h1 className="text-3xl text-white mt-2 line-clamp-2">{title}</h1>
                    <p className="text-gray-500 mt-2 line-clamp-8">{description}</p>
                </span>
                <span className="text-white flex items-center">
                    <div className="h-8 rounded-full aspect-square bg-gray-500"></div>
                    <p className="ml-1">Echo</p>
                    <Dot />
                    <p>{date}</p>
                </span>
            </div>
        </div>
    )
}
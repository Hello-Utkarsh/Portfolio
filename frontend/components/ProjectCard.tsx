"use client";
import { cn } from "@/lib/utils";

export default function ProjectCard() {
  return (
    <div className="max-w-xs w-full h-full overflow-hidden">
      <div
        className={cn(
          "group w-full cursor-pointer overflow-hidden relative card rounded-md shadow-xl mx-auto flex flex-col p-2 justify-end items-start border border-transparent dark:border-neutral-800 h-full",
          "bg-[url(https://images.unsplash.com/photo-1476842634003-7dcca8f832de?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1650&q=80)] bg-cover",
          // // Preload hover image by setting it in a pseudo-element
          // "before:bg-[url(https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExNWlodTF3MjJ3NnJiY3Rlc2J0ZmE0c28yeWoxc3gxY2VtZzA5ejF1NSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/syEfLvksYQnmM/giphy.gif)] before:fixed before:inset-0 before:opacity-0 before:z-[-1]",
          "hover:bg-[url(https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExNWlodTF3MjJ3NnJiY3Rlc2J0ZmE0c28yeWoxc3gxY2VtZzA5ejF1NSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/syEfLvksYQnmM/giphy.gif)]",
          "hover:after:content-[''] hover:after:absolute hover:after:inset-0 hover:after:bg-black hover:after:opacity-50",
          "transition-all duration-500"
        )}
      >
        <div className="text relative z-50 group-hover:opacity-0 group-hover:translate-y-1 transition duration-300">
          <p className="font-semi text-xl md:text-sm text-gray-50 relative">
            AutoDocs
          </p>
          <p className="text-xs mt-1 line-clamp-3">Helps to document all your learning and automate the task of posting it to different platforms </p>
        </div>
      </div>
    </div>
  );
}

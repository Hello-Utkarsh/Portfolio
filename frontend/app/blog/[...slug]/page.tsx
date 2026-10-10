import { MarkdownAsync } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypePrettyCode from 'rehype-pretty-code';
import "katex/dist/katex.min.css";
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, BookOpen, ExternalLink, ChevronRight, Share2 } from 'lucide-react';
import { DotPattern } from '@/components/ui/dot-pattern';
import { cn } from '@/lib/utils';
import { EmailIcon, GithubIcon, LinkedinIcon, TwitterIcon } from '@/components/Icons';

export default async function BlogPage({ params }: { params: Promise<{ slug: string[] | string }> }) {
    const { slug } = await params;
    const slugSegments = Array.isArray(slug) ? slug : [slug];
    const decodedSegments = slugSegments.map(s => decodeURIComponent(s));
    const filePath = decodedSegments.join('/');
    const category = decodedSegments[0] || 'Engineering';

    let rawContent = '';
    let isError = false;

    try {
        const res = await fetch(`https://raw.githubusercontent.com/Hello-Utkarsh/Blogs/main/${filePath}`, {
            next: { revalidate: 3600 }
        });
        if (!res.ok) {
            isError = true;
        } else {
            rawContent = await res.text();
        }
    } catch {
        isError = true;
    }

    if (isError || !rawContent) {
        return (
            <div className="min-h-screen w-full bg-[#101010] text-white font-mono flex flex-col justify-center items-center px-4 relative overflow-hidden">
                <DotPattern className="h-full w-full mask-[radial-gradient(1000px_circle_at_center,white,transparent)] pointer-events-none absolute inset-0 -z-0 opacity-40" />
                <div className="relative z-10 max-w-md w-full bg-[#151518] border border-neutral-800 rounded-2xl p-8 text-center shadow-2xl">
                    <p className="text-violet-400 text-sm font-semibold mb-2">404 • POST NOT FOUND</p>
                    <h1 className="text-2xl font-bold mb-3 text-white">Blog Post Missing</h1>
                    <p className="text-neutral-400 text-xs sm:text-sm mb-6 leading-relaxed">
                        We couldn&apos;t load the requested post from the repository. It may have been moved or renamed.
                    </p>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-xl transition shadow-lg"
                    >
                        <ArrowLeft className="size-4" />
                        Return to Portfolio
                    </Link>
                </div>
            </div>
        );
    }

    // Extract frontmatter metadata if present
    let title = decodedSegments[decodedSegments.length - 1].replace(/\.md$/, '');
    let date = '';
    let tags: string[] = [];

    const metadataMatch = rawContent.match(/<!--([\s\S]*?)-->/);
    if (metadataMatch) {
        const metadataString = metadataMatch[1].trim();
        const lines = metadataString.split('\n');
        for (const line of lines) {
            const [key, ...values] = line.split(':');
            const val = values.join(':').trim();
            if (key.trim().toLowerCase() === 'title' && val) title = val;
            if (key.trim().toLowerCase() === 'date' && val) date = val;
            if (key.trim().toLowerCase() === 'tags' && val) {
                tags = val.split(',').map(t => t.trim()).filter(Boolean);
            }
        }
    }

    // Format post content
    const blogContent = rawContent
        .replace(/<!--[\s\S]*?-->/, '')
        .replace(/\\n/g, '\n')
        .trim();

    const wordCount = blogContent.split(/\s+/).filter(Boolean).length;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));

    // Formatted date string
    let formattedDate = date;
    if (date) {
        try {
            const d = new Date(date);
            if (!isNaN(d.getTime())) {
                formattedDate = d.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                });
            }
        } catch {
            formattedDate = date;
        }
    }

    const githubFileUrl = `https://github.com/Hello-Utkarsh/Blogs/blob/main/${filePath}`;

    return (
        <div className="min-h-screen w-full bg-[#101010] text-neutral-200 font-mono relative selection:bg-violet-600/30 selection:text-violet-200">
            {/* Ambient dot pattern background */}
            <div className="fixed inset-0 pointer-events-none -z-0">
                <DotPattern className="h-full w-full mask-[radial-gradient(1200px_circle_at_center,white,transparent)] opacity-40" />
            </div>

            {/* Navigation Bar */}
            <header className="sticky top-0 z-30 w-full bg-[#101010]/80 backdrop-blur-md border-b border-neutral-800/80">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-neutral-300 hover:text-white transition group py-1.5 px-3 rounded-lg hover:bg-neutral-800/50"
                    >
                        <span className="p-1 rounded-full bg-[#212121] group-hover:scale-110 group-hover:-translate-x-0.5 transition">
                            <ArrowLeft className="size-3.5 text-white" />
                        </span>
                        <span>Back to Portfolio</span>
                    </Link>

                    {/* Breadcrumbs */}
                    <div className="hidden md:flex items-center gap-1.5 text-xs text-neutral-400 font-mono">
                        <Link href="/" className="hover:text-white transition">Home</Link>
                        <ChevronRight className="size-3 text-neutral-600" />
                        <span className="text-violet-400">{category}</span>
                        <ChevronRight className="size-3 text-neutral-600" />
                        <span className="text-neutral-300 truncate max-w-[200px]">{title}</span>
                    </div>

                    <a
                        href={githubFileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-800 px-3 py-1.5 rounded-lg"
                    >
                        <GithubIcon fillColor="currentColor" />
                        <span className="hidden sm:inline">View Source</span>
                        <ExternalLink className="size-3 text-neutral-500" />
                    </a>
                </div>
            </header>

            {/* Main Article Container */}
            <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                <article className="bg-[#141417]/95 border border-neutral-800/90 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.6)] p-5 sm:p-8 md:p-12 overflow-hidden">
                    {/* Header / Hero */}
                    <header className="border-b border-neutral-800 pb-8 mb-8">
                        {/* Tags */}
                        {tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                                {tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="bg-violet-500/10 text-violet-300 border border-violet-500/30 px-2.5 py-1 rounded-full text-xs font-mono font-medium"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Title */}
                        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-mono tracking-tight text-white leading-tight">
                            {title}
                        </h1>

                        {/* Metadata Strip */}
                        <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-6 pt-6 border-t border-neutral-800/60 text-xs sm:text-sm text-neutral-400">
                            {/* Author */}
                            <div className="flex items-center gap-2">
                                <div className="size-7 rounded-full bg-linear-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-inner">
                                    U
                                </div>
                                <span className="text-neutral-200 font-medium">Utkarsh</span>
                            </div>

                            {/* Date */}
                            {formattedDate && (
                                <div className="flex items-center gap-1.5">
                                    <Calendar className="size-3.5 text-violet-400" />
                                    <span>{formattedDate}</span>
                                </div>
                            )}

                            {/* Reading Time */}
                            <div className="flex items-center gap-1.5">
                                <Clock className="size-3.5 text-violet-400" />
                                <span>{readingTime} min read</span>
                            </div>

                            {/* Category badge */}
                            <div className="flex items-center gap-1.5">
                                <BookOpen className="size-3.5 text-violet-400" />
                                <span>{category}</span>
                            </div>
                        </div>
                    </header>

                    {/* Blog Content */}
                    <div className="prose prose-invert prose-neutral max-w-none prose-headings:font-mono prose-headings:tracking-tight prose-headings:text-white prose-p:text-neutral-300 prose-p:leading-relaxed prose-p:text-sm sm:prose-p:text-base prose-strong:text-white prose-code:text-violet-300 prose-code:bg-neutral-800/80 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs sm:prose-code:text-sm prose-code:before:content-none prose-code:after:content-none prose-pre:bg-[#0c0c0e] prose-pre:border prose-pre:border-neutral-800 prose-pre:rounded-xl prose-blockquote:border-l-violet-500 prose-blockquote:text-neutral-300 prose-blockquote:bg-violet-950/20 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg prose-a:text-violet-400 prose-a:underline prose-a:underline-offset-4 hover:prose-a:text-violet-300 prose-img:rounded-xl prose-img:border prose-img:border-neutral-800 prose-table:border-collapse prose-th:border prose-th:border-neutral-800 prose-th:p-2 prose-th:bg-neutral-900 prose-td:border prose-td:border-neutral-800 prose-td:p-2">
                        <MarkdownAsync
                            remarkPlugins={[remarkGfm, remarkMath]}
                            rehypePlugins={[rehypeKatex, rehypePrettyCode]}
                            components={{
                                h1: ({ node, ...props }) => (
                                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold font-mono text-white mt-8 mb-4 pb-2 border-b border-neutral-800" {...props} />
                                ),
                                h2: ({ node, ...props }) => (
                                    <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold font-mono text-white mt-8 mb-3 pt-2" {...props} />
                                ),
                                h3: ({ node, ...props }) => (
                                    <h3 className="text-base sm:text-lg lg:text-xl font-semibold font-mono text-violet-300 mt-6 mb-2" {...props} />
                                ),
                                p: ({ node, ...props }) => (
                                    <p className="text-neutral-300 leading-relaxed text-sm sm:text-base my-4" {...props} />
                                ),
                                ul: ({ node, ...props }) => (
                                    <ul className="list-disc list-inside space-y-2 text-neutral-300 my-4 pl-2 text-sm sm:text-base" {...props} />
                                ),
                                ol: ({ node, ...props }) => (
                                    <ol className="list-decimal list-inside space-y-2 text-neutral-300 my-4 pl-2 text-sm sm:text-base" {...props} />
                                ),
                                li: ({ node, ...props }) => (
                                    <li className="text-neutral-300 text-sm sm:text-base leading-relaxed" {...props} />
                                ),
                                blockquote: ({ node, ...props }) => (
                                    <blockquote className="border-l-4 border-violet-500 bg-violet-950/20 px-4 py-3 my-5 rounded-r-lg text-neutral-300 italic text-sm sm:text-base" {...props} />
                                ),
                                table: ({ node, ...props }) => (
                                    <div className="overflow-x-auto my-6 rounded-xl border border-neutral-800">
                                        <table className="w-full text-left text-xs sm:text-sm text-neutral-300" {...props} />
                                    </div>
                                ),
                                th: ({ node, ...props }) => (
                                    <th className="bg-neutral-900 px-4 py-2.5 font-semibold text-white border-b border-neutral-800" {...props} />
                                ),
                                td: ({ node, ...props }) => (
                                    <td className="px-4 py-2.5 border-b border-neutral-800/60" {...props} />
                                ),
                                a: ({ node, ...props }) => (
                                    <a className="text-violet-400 hover:text-violet-300 underline underline-offset-4 transition font-medium" target="_blank" rel="noopener noreferrer" {...props} />
                                ),
                                code: ({ node, className, children, ...props }: any) => {
                                    const isCodeBlock = className && className.includes('language-');
                                    if (!isCodeBlock) {
                                        return (
                                            <code className="bg-neutral-800/90 text-violet-300 px-1.5 py-0.5 rounded text-xs sm:text-sm font-mono border border-neutral-700/60" {...props}>
                                                {children}
                                            </code>
                                        );
                                    }
                                    return (
                                        <code className={className} {...props}>
                                            {children}
                                        </code>
                                    );
                                }
                            }}
                        >
                            {blogContent}
                        </MarkdownAsync>
                    </div>

                    {/* Post Bottom Bio & Links */}
                    <div className="mt-12 pt-8 border-t border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                        <div className="flex items-center gap-3">
                            <div className="size-10 rounded-full bg-linear-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                                U
                            </div>
                            <div>
                                <p className="text-white text-sm font-semibold">Utkarsh</p>
                                <p className="text-neutral-400 text-xs">Full-Stack Developer • Backend & AI</p>
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="flex items-center gap-2">
                            <a
                                href="https://github.com/Hello-Utkarsh"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="size-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-300 hover:text-white hover:border-violet-500/50 transition"
                                title="GitHub"
                            >
                                <GithubIcon fillColor="currentColor" />
                            </a>
                            <a
                                href="https://mail.google.com/mail/?view=cm&fs=1&to=pateluttkarsh697@gmail.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="size-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-300 hover:text-white hover:border-violet-500/50 transition"
                                title="Email"
                            >
                                <EmailIcon fillColor="currentColor" />
                            </a>
                            <a
                                href="https://github.com/Hello-Utkarsh"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="size-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-300 hover:text-white hover:border-violet-500/50 transition"
                                title="LinkedIn"
                            >
                                <LinkedinIcon fillColor="currentColor" />
                            </a>
                            <a
                                href="https://github.com/Hello-Utkarsh"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="size-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-300 hover:text-white hover:border-violet-500/50 transition"
                                title="Twitter"
                            >
                                <TwitterIcon fillColor="currentColor" />
                            </a>
                        </div>
                    </div>

                    {/* Back to top & back to home buttons */}
                    <div className="mt-8 pt-6 border-t border-neutral-800/60 flex items-center justify-between">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-xs sm:text-sm text-neutral-400 hover:text-white transition group"
                        >
                            <ArrowLeft className="size-3.5 group-hover:-translate-x-1 transition" />
                            <span>Return to Portfolio</span>
                        </Link>

                        <a
                            href={githubFileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-violet-300 transition"
                        >
                            <span>Suggest an edit on GitHub</span>
                            <ExternalLink className="size-3" />
                        </a>
                    </div>
                </article>
            </main>
        </div>
    );
}

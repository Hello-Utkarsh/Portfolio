import { MarkdownAsync } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypePrettyCode from 'rehype-pretty-code'
import "github-markdown-css/github-markdown.css";
import "katex/dist/katex.min.css";

export default async function page({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    const res = await fetch(`https://raw.githubusercontent.com/Hello-Utkarsh/Blogs/main/${slug[0]}/${slug[1]}`);
    const blogContent = await res.text().then(
        content => { return content.replace(/\\n/g, '\n').replace(/<!--[\s\S]*?-->/, "").trim() }
    )

    return (
        <div>
            <article className="markdown-body p-8">
                <MarkdownAsync
                    remarkPlugins={[remarkGfm, remarkMath]}
                    rehypePlugins={[rehypeKatex, rehypePrettyCode]}
                >
                    {blogContent}
                </MarkdownAsync>
            </article>
        </div>
    )
}

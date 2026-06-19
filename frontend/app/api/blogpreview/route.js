import { NextResponse } from 'next/server';

export async function GET(request) {

    try {
        const response = await fetch('https://api.github.com/repos/Hello-Utkarsh/Blogs/git/trees/main?recursive=1');

        if (!response.ok) {
            return NextResponse.json({ error: 'Folder not found on GitHub' }, { status: response.status });
        }
        const folders = await response.json()
        const blogs = folders.tree.filter(item =>
            item.type === "blob" &&
            item.path.endsWith(".md"));

        const blogDesc = await Promise.all(blogs.map(async (blog) => {
            const res = await fetch(`https://raw.githubusercontent.com/Hello-Utkarsh/Blogs/main/${blog.path}`,
                {
                    headers: {
                        Range: 'bytes=0-500'
                    }
                }
            )
            const blogData = await res.text()
            const metadataMatch = blogData.match(/<!--([\s\S]*?)-->/);
            const metadataString = metadataMatch[1].trim();
            const desc = blogData.replace(metadataString, "").replace(/<!--[\s\S]*?-->/, "").trim();
            const metadata = Object.fromEntries(
                metadataString
                    .split('\n')
                    .map(line => {
                        const [key, ...value] = line.split(':');
                        return [
                            key.trim(),
                            value.join(':').trim()
                        ];
                    })
            );

            // console.log(blog.path, blogDesc)
            return { ...blog, description: desc, ...metadata }
        }))
        console.log(blogDesc.sort((a, b) => b.date.localeCompare(a.date)))
        return NextResponse.json(blogDesc);
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

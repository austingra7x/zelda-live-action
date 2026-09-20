
import { defineCollection, z } from 'astro:content';
const news = defineCollection({ type: 'content', schema: z.object({ title: z.string(), date: z.string(), category: z.string(), excerpt: z.string(), thumb: z.string(), color: z.string() }) });
const videos = defineCollection({ type: 'content', schema: z.object({ title: z.string(), desc: z.string(), dur: z.string(), date: z.string(), cat: z.string(), color: z.string(), featured: z.boolean().optional() }) });
const pictures = defineCollection({ type: 'content', schema: z.object({ cap: z.string(), sub: z.string(), cat: z.string(), col: z.string(), icon: z.string(), image: z.string().optional() }) });
const cast = defineCollection({ type: 'content', schema: z.object({ name: z.string(), role: z.string(), bio: z.string(), color: z.string(), initials: z.string(), job: z.string().optional(), image: z.string().optional() }) });
export const collections = { news, videos, pictures, cast };

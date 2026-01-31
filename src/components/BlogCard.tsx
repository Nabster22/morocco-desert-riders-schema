import { Link } from "react-router-dom";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { BlogPost } from "@/lib/blog-api";
import { getTourImage } from "@/assets/tours";

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

const BlogCard = ({ post, featured = false }: BlogCardProps) => {
  // Use tour image system as fallback for blog images
  const displayImage = post.featured_image || getTourImage(post.title);
  
  // Estimate reading time (average 200 words per minute)
  const wordCount = post.content?.split(/\s+/).length || 0;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  if (featured) {
    return (
      <Link to={`/blog/${post.slug}`} className="group block">
        <article className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden">
          {/* Background Image */}
          <img
            src={displayImage}
            alt={post.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          
          {/* Content */}
          <div className="absolute inset-0 p-8 flex flex-col justify-end">
            <div className="flex items-center gap-4 text-white/70 text-sm mb-4">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span>{post.published_at ? format(new Date(post.published_at), 'MMM d, yyyy') : 'Draft'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>{readingTime} min read</span>
              </div>
            </div>
            
            <h2 className="font-display text-2xl md:text-4xl font-bold text-white mb-3 group-hover:text-terracotta transition-colors">
              {post.title}
            </h2>
            
            {post.excerpt && (
              <p className="text-white/80 text-base md:text-lg line-clamp-2 mb-4 max-w-2xl">
                {post.excerpt}
              </p>
            )}
            
            <span className="inline-flex items-center gap-2 text-terracotta font-medium group-hover:gap-3 transition-all">
              Read Article
              <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </article>
      </Link>
    );
  }

  return (
    <Link to={`/blog/${post.slug}`} className="group block">
      <article className="bg-card rounded-xl overflow-hidden border border-border hover:border-terracotta/30 transition-all duration-300 hover:shadow-xl hover:shadow-terracotta/5">
        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden">
          <img
            src={displayImage}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>
        
        {/* Content */}
        <div className="p-5">
          <div className="flex items-center gap-3 text-muted-foreground text-sm mb-3">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>{post.published_at ? format(new Date(post.published_at), 'MMM d, yyyy') : 'Draft'}</span>
            </div>
            <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{readingTime} min</span>
            </div>
          </div>
          
          <h3 className="font-display text-lg font-semibold text-card-foreground mb-2 line-clamp-2 group-hover:text-terracotta transition-colors">
            {post.title}
          </h3>
          
          {post.excerpt && (
            <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
              {post.excerpt}
            </p>
          )}
          
          <span className="inline-flex items-center gap-1.5 text-terracotta text-sm font-medium group-hover:gap-2.5 transition-all">
            Read more
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </article>
    </Link>
  );
};

export default BlogCard;

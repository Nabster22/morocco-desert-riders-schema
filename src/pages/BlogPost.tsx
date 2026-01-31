import { useParams, Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Calendar, Clock, ChevronLeft, Share2, ArrowRight, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogCard from "@/components/BlogCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useBlogPost, useFeaturedPosts } from "@/hooks/useBlogApi";
import { getTourImage } from "@/assets/tours";

const BlogPost = () => {
  const { t } = useTranslation();
  const { slug } = useParams();
  const navigate = useNavigate();
  
  const { data: post, isLoading, isError } = useBlogPost(slug || "");
  const { data: relatedData } = useFeaturedPosts(4);
  
  // Filter out current post from related
  const relatedPosts = relatedData?.data?.filter(p => p.slug !== slug).slice(0, 3) || [];

  // Calculate reading time
  const wordCount = post?.content?.split(/\s+/).length || 0;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  const displayImage = post?.featured_image || getTourImage(post?.title || "desert");

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post?.title,
          text: post?.excerpt || "",
          url: window.location.href,
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-20">
          <Skeleton className="w-full h-[60vh]" />
          <div className="container mx-auto px-4 py-12">
            <Skeleton className="h-10 w-3/4 mb-4" />
            <Skeleton className="h-6 w-1/2 mb-8" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-32 pb-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-display text-3xl font-bold text-foreground mb-4">
              {t("blog.notFound", "Article Not Found")}
            </h1>
            <p className="text-muted-foreground mb-8">
              {t("blog.notFoundMessage", "The article you're looking for doesn't exist or has been removed.")}
            </p>
            <Button onClick={() => navigate("/blog")} variant="outline">
              <ChevronLeft className="w-4 h-4 mr-2" />
              {t("blog.backToBlog", "Back to Blog")}
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`${post.title} | Morocco Desert Riders Blog`}</title>
        <meta name="description" content={post.excerpt || post.content.substring(0, 160)} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt || post.content.substring(0, 160)} />
        <meta property="og:image" content={displayImage} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        {/* Hero Image */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative h-[50vh] md:h-[60vh] pt-16"
        >
          <img
            src={displayImage}
            alt={post.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        </motion.div>

        {/* Article Content */}
        <article className="relative -mt-32 z-10">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-3xl mx-auto bg-card rounded-2xl shadow-xl p-6 md:p-10 border border-border"
            >
              {/* Back button */}
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
              >
                <ChevronLeft className="w-4 h-4" />
                {t("blog.backToBlog", "Back to Blog")}
              </Link>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4 text-muted-foreground text-sm mb-6">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {post.published_at ? format(new Date(post.published_at), 'MMMM d, yyyy') : 'Draft'}
                  </span>
                </div>
                <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  <span>{readingTime} min read</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-auto"
                  onClick={handleShare}
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>

              {/* Title */}
              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
                {post.title}
              </h1>

              {/* Excerpt */}
              {post.excerpt && (
                <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                  {post.excerpt}
                </p>
              )}

              {/* Content */}
              <div 
                className="prose prose-lg prose-neutral dark:prose-invert max-w-none
                  prose-headings:font-display prose-headings:font-bold
                  prose-a:text-terracotta prose-a:no-underline hover:prose-a:underline
                  prose-img:rounded-xl prose-img:shadow-lg"
                dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }}
              />

              {/* CTA */}
              <div className="mt-12 pt-8 border-t border-border">
                <div className="bg-gradient-to-r from-terracotta/10 to-sunset/10 rounded-xl p-6 text-center">
                  <h3 className="font-display text-xl font-bold text-foreground mb-2">
                    {t("blog.ctaTitle", "Ready for Your Desert Adventure?")}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {t("blog.ctaDescription", "Explore our curated tours and create unforgettable memories.")}
                  </p>
                  <Link to="/tours">
                    <Button variant="hero" className="shadow-lg shadow-terracotta/20">
                      {t("blog.exploreTours", "Explore Tours")}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="py-16">
            <div className="container mx-auto px-4">
              <h2 className="font-display text-2xl font-bold text-foreground mb-8 text-center">
                {t("blog.relatedArticles", "You Might Also Like")}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {relatedPosts.map((relatedPost, index) => (
                  <motion.div
                    key={relatedPost.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <BlogCard post={relatedPost} />
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        <Footer />
      </div>
    </>
  );
};

export default BlogPost;

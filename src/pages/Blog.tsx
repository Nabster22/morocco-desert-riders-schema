import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Search, Loader2, BookOpen, Sparkles } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogCard from "@/components/BlogCard";
import { Input } from "@/components/ui/input";
import { usePublishedPosts } from "@/hooks/useBlogApi";

const Blog = () => {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  
  const { data, isLoading } = usePublishedPosts({ search: search || undefined });
  const posts = data?.data || [];
  
  // Split into featured (first post) and rest
  const featuredPost = posts[0];
  const regularPosts = posts.slice(1);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="pt-24 pb-12 bg-gradient-to-b from-card to-background relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute top-20 right-10 w-64 h-64 bg-terracotta/5 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-0 left-10 w-48 h-48 bg-sunset/5 rounded-full blur-3xl"
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 10, repeat: Infinity }}
          />
        </div>

        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-terracotta/10 text-terracotta px-4 py-2 rounded-full text-sm font-medium mb-4"
            >
              <BookOpen className="w-4 h-4" />
              {t("blog.subtitle", "Stories & Insights")}
            </motion.div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
              {t("blog.title", "Desert Adventures Blog")}
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-8">
              {t("blog.description", "Discover travel tips, cultural insights, and inspiring stories from the Moroccan Sahara.")}
            </p>

            {/* Search */}
            <div className="max-w-md mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder={t("blog.searchPlaceholder", "Search articles...")}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-12 h-12 text-base rounded-full border-border/50 focus:border-terracotta"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Blog Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-terracotta" />
            </div>
          ) : posts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {search ? t("blog.noResults", "No articles found") : t("blog.comingSoon", "Coming Soon")}
              </h3>
              <p className="text-muted-foreground">
                {search 
                  ? t("blog.tryDifferentSearch", "Try a different search term") 
                  : t("blog.stayTuned", "We're working on exciting content. Stay tuned!")}
              </p>
            </motion.div>
          ) : (
            <div className="space-y-12">
              {/* Featured Post */}
              {featuredPost && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <BlogCard post={featuredPost} featured />
                </motion.div>
              )}

              {/* Regular Posts Grid */}
              {regularPosts.length > 0 && (
                <div>
                  <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                    {t("blog.latestArticles", "Latest Articles")}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {regularPosts.map((post, index) => (
                      <motion.div
                        key={post.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <BlogCard post={post} />
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;

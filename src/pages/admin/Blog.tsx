import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { format } from "date-fns";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  ExternalLink,
  Loader2,
  FileText,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/contexts/AuthContext";
import {
  useAllBlogPosts,
  useCreateBlogPost,
  useUpdateBlogPost,
  useDeleteBlogPost,
} from "@/hooks/useBlogApi";
import { blogAPI, BlogPost } from "@/lib/blog-api";
import { Link } from "react-router-dom";

const AdminBlog = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [postToDelete, setPostToDelete] = useState<BlogPost | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    featured_image: "",
    is_published: false,
  });

  const { data, isLoading } = useAllBlogPosts({ search: searchQuery || undefined });
  const createMutation = useCreateBlogPost();
  const updateMutation = useUpdateBlogPost();
  const deleteMutation = useDeleteBlogPost();

  const posts = data?.data || [];

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      featured_image: "",
      is_published: false,
    });
    setEditingPost(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || "",
      content: post.content,
      featured_image: post.featured_image || "",
      is_published: post.is_published,
    });
    setIsDialogOpen(true);
  };

  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: editingPost ? prev.slug : blogAPI.generateSlug(title),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const postData = {
      ...formData,
      author_id: user?.id || "",
      published_at: formData.is_published ? new Date().toISOString() : null,
    };

    if (editingPost) {
      await updateMutation.mutateAsync({ id: editingPost.id, data: postData });
    } else {
      await createMutation.mutateAsync(postData);
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = async () => {
    if (postToDelete) {
      await deleteMutation.mutateAsync(postToDelete.id);
      setIsDeleteDialogOpen(false);
      setPostToDelete(null);
    }
  };

  const togglePublish = async (post: BlogPost) => {
    await updateMutation.mutateAsync({
      id: post.id,
      data: {
        is_published: !post.is_published,
        published_at: !post.is_published ? new Date().toISOString() : null,
      },
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground">
                {t("admin.blog.title", "Blog Management")}
              </h1>
              <p className="text-muted-foreground mt-1">
                {t("admin.blog.subtitle", "Create and manage blog articles")}
              </p>
            </div>
            <Button onClick={openCreateDialog} className="gap-2">
              <Plus className="w-4 h-4" />
              {t("admin.blog.newPost", "New Article")}
            </Button>
          </div>

          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("admin.blog.search", "Search articles...")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Table */}
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-terracotta" />
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-20">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {t("admin.blog.noPosts", "No articles yet")}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {t("admin.blog.createFirst", "Create your first blog article")}
                </p>
                <Button onClick={openCreateDialog} variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  {t("admin.blog.newPost", "New Article")}
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("admin.blog.titleColumn", "Title")}</TableHead>
                    <TableHead>{t("admin.blog.status", "Status")}</TableHead>
                    <TableHead>{t("admin.blog.date", "Date")}</TableHead>
                    <TableHead>{t("admin.blog.views", "Views")}</TableHead>
                    <TableHead className="text-right">{t("admin.blog.actions", "Actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {posts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell>
                        <div className="font-medium">{post.title}</div>
                        <div className="text-sm text-muted-foreground">/blog/{post.slug}</div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={post.is_published ? "default" : "secondary"}
                          className={post.is_published ? "bg-green-500/10 text-green-600 hover:bg-green-500/20" : ""}
                        >
                          {post.is_published ? "Published" : "Draft"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {post.published_at
                          ? format(new Date(post.published_at), "MMM d, yyyy")
                          : format(new Date(post.created_at), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{post.view_count}</TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => togglePublish(post)}
                            title={post.is_published ? "Unpublish" : "Publish"}
                          >
                            {post.is_published ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                          {post.is_published && (
                            <Button variant="ghost" size="icon" asChild>
                              <Link to={`/blog/${post.slug}`} target="_blank">
                                <ExternalLink className="h-4 w-4" />
                              </Link>
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditDialog(post)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => {
                              setPostToDelete(post);
                              setIsDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </motion.div>
      </main>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              {editingPost
                ? t("admin.blog.editPost", "Edit Article")
                : t("admin.blog.createPost", "Create Article")}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">{t("admin.blog.form.title", "Title")} *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="slug">{t("admin.blog.form.slug", "URL Slug")} *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">/blog/{formData.slug || "..."}</p>
              </div>

              <div>
                <Label htmlFor="excerpt">{t("admin.blog.form.excerpt", "Excerpt")}</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData((prev) => ({ ...prev, excerpt: e.target.value }))}
                  rows={2}
                  placeholder="Brief summary of the article..."
                />
              </div>

              <div>
                <Label htmlFor="content">{t("admin.blog.form.content", "Content")} *</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
                  rows={10}
                  required
                  placeholder="Write your article content here..."
                />
              </div>

              <div>
                <Label htmlFor="featured_image">{t("admin.blog.form.image", "Featured Image URL")}</Label>
                <Input
                  id="featured_image"
                  type="url"
                  value={formData.featured_image}
                  onChange={(e) => setFormData((prev) => ({ ...prev, featured_image: e.target.value }))}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="flex items-center gap-3">
                <Switch
                  id="is_published"
                  checked={formData.is_published}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, is_published: checked }))
                  }
                />
                <Label htmlFor="is_published" className="cursor-pointer">
                  {t("admin.blog.form.publish", "Publish immediately")}
                </Label>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                {t("common.cancel", "Cancel")}
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {(createMutation.isPending || updateMutation.isPending) && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                {editingPost
                  ? t("common.save", "Save Changes")
                  : t("admin.blog.form.create", "Create Article")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("admin.blog.deleteTitle", "Delete Article")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t(
                "admin.blog.deleteDescription",
                "Are you sure you want to delete this article? This action cannot be undone."
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel", "Cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {t("common.delete", "Delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Footer />
    </div>
  );
};

export default AdminBlog;

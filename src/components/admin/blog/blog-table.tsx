"use client";

import { deleteBlogPost } from "@/app/actions/blog.actions";
import { AdminListingPanel } from "@/components/admin/listing/admin-listing-panel";
import { AdminTableActions } from "@/components/admin/listing/admin-table-actions";
import { Badge } from "@/components/ui/badge";
import {
  ADMIN_BLOG_PAGE,
  BLOG_POST_STATUS,
  BLOG_POST_STATUS_LABELS,
} from "@/constants/blog.constants";
import type { BlogPostStatusValue } from "@/constants/blog.constants";
import { blogPostPath } from "@/lib/seo/blog-paths";
import type { AdminBlogPostRow } from "@/types/blog.types";
import { ExternalLink, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "@/lib/toast";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const statusVariant: Record<
  BlogPostStatusValue,
  "default" | "secondary" | "outline"
> = {
  PUBLISHED: "default",
  DRAFT: "secondary",
  ARCHIVED: "outline",
};

type BlogTableProps = {
  posts: AdminBlogPostRow[];
};

export function BlogTable({ posts }: BlogTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [pendingDelete, setPendingDelete] = useState<AdminBlogPostRow | null>(
    null,
  );

  const handleDelete = () => {
    if (!pendingDelete) return;
    startTransition(async () => {
      const result = await deleteBlogPost({ postId: pendingDelete.id });
      if (result.ok) {
        toast.success("Artículo eliminado");
        setPendingDelete(null);
        router.refresh();
        return;
      }
      toast.error(result.error);
    });
  };

  return (
    <>
      <AdminListingPanel
        title="Artículos"
        description="Gestiona borradores, publicaciones y SEO"
      >
        <Table>
          <TableHeader>
            <TableRow className="border-foreground/20 hover:bg-transparent">
              <TableHead className="font-mono text-[10px] uppercase">
                Título
              </TableHead>
              <TableHead className="font-mono text-[10px] uppercase">
                Estado
              </TableHead>
              <TableHead className="hidden font-mono text-[10px] uppercase md:table-cell">
                Categoría
              </TableHead>
              <TableHead className="hidden font-mono text-[10px] uppercase lg:table-cell">
                Actualizado
              </TableHead>
              <TableHead className="w-[120px] font-mono text-[10px] uppercase">
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((post) => (
              <TableRow key={post.id} className="border-foreground/15">
                <TableCell>
                  <div className="min-w-0">
                    <Link
                      href={`/admin/blog/${post.id}`}
                      className="font-semibold hover:text-primary hover:underline"
                    >
                      {post.title}
                    </Link>
                    <p className="font-mono text-[10px] text-muted-foreground truncate">
                      /{post.slug}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={statusVariant[post.status]}>
                    {BLOG_POST_STATUS_LABELS[post.status]}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                  {post.category?.name ?? "—"}
                </TableCell>
                <TableCell className="hidden lg:table-cell font-mono text-xs text-muted-foreground">
                  {new Date(post.updatedAt).toLocaleDateString("es")}
                </TableCell>
                <TableCell>
                  <AdminTableActions
                    actions={[
                      {
                        id: "edit",
                        label: "Editar",
                        icon: <Pencil className="size-4" />,
                        href: `/admin/blog/${post.id}`,
                      },
                      ...(post.status === BLOG_POST_STATUS.PUBLISHED
                        ? [
                            {
                              id: "view",
                              label: "Ver público",
                              icon: <ExternalLink className="size-4" />,
                              href: blogPostPath(post.slug),
                              external: true,
                            },
                          ]
                        : []),
                      {
                        id: "delete",
                        label: "Eliminar",
                        icon: <Trash2 className="size-4" />,
                        onClick: () => setPendingDelete(post),
                        destructive: true,
                      },
                    ]}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </AdminListingPanel>

      <AlertDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => !open && setPendingDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{ADMIN_BLOG_PAGE.deleteTitle}</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingDelete
                ? ADMIN_BLOG_PAGE.deleteDescription(pendingDelete.title)
                : null}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              disabled={isPending}
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

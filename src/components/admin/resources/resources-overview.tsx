"use client";

import { deleteResource } from "@/app/actions/resources.actions";
import { ResourcesCards } from "@/components/admin/resources/resources-cards";
import { ResourcesEmptyState } from "@/components/admin/resources/resources-empty-state";
import { ResourcesPageHeader } from "@/components/admin/resources/resources-page-header";
import { ResourcesPaginationBar } from "@/components/admin/resources/resources-pagination";
import { ResourcesStatsGrid } from "@/components/admin/resources/resources-stats-grid";
import { ResourcesTable } from "@/components/admin/resources/resources-table";
import { ResourcesToolbar } from "@/components/admin/resources/resources-toolbar";
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
import { ADMIN_LISTING_VIEW } from "@/constants/admin-listing.constants";
import {
  ADMIN_RESOURCES_FILTER_ALL,
  ADMIN_RESOURCES_PAGE,
} from "@/constants/resources-admin.constants";
import { useAdminListingParams } from "@/hooks/use-admin-listing-params";
import { toast } from "@/lib/toast";
import type {
  AdminResourceRow,
  AdminResourcesPageData,
} from "@/types/resources-admin.types";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

type ResourcesOverviewProps = {
  data: AdminResourcesPageData;
};

export function ResourcesOverview({ data }: ResourcesOverviewProps) {
  const router = useRouter();
  const { viewMode, clearParams } = useAdminListingParams();
  const [isPending, startTransition] = useTransition();
  const [pendingDelete, setPendingDelete] = useState<AdminResourceRow | null>(
    null,
  );

  const hasFilters =
    data.filters.q.length > 0 ||
    data.filters.status !== ADMIN_RESOURCES_FILTER_ALL ||
    data.filters.categorySlug !== ADMIN_RESOURCES_FILTER_ALL;

  const handleDelete = () => {
    if (!pendingDelete) return;
    startTransition(async () => {
      const result = await deleteResource({
        resourceId: pendingDelete.id,
      });
      if (result.ok) {
        toast.success("Recurso eliminado");
        setPendingDelete(null);
        router.refresh();
        return;
      }
      toast.error(result.error);
    });
  };

  return (
    <div className="space-y-0">
      <ResourcesPageHeader kind={data.filters.kind} />
      <ResourcesStatsGrid stats={data.stats} />
      <ResourcesToolbar
        filters={data.filters}
        pagination={data.pagination}
        categories={data.categories}
      />
      {data.pagination.totalCount === 0 ? (
        <ResourcesEmptyState
          kind={data.filters.kind}
          hasFilters={hasFilters}
          onClearFilters={
            hasFilters
              ? () => clearParams(["q", "status", "categoria", "page"])
              : undefined
          }
        />
      ) : (
        <>
          {viewMode === ADMIN_LISTING_VIEW.TABLE ? (
            <ResourcesTable
              resources={data.resources}
              onDeleteClick={setPendingDelete}
            />
          ) : (
            <ResourcesCards
              resources={data.resources}
              onDeleteClick={setPendingDelete}
            />
          )}
          <div>
            <ResourcesPaginationBar pagination={data.pagination} />
          </div>
        </>
      )}

      <AlertDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => !open && setPendingDelete(null)}
      >
        <AlertDialogContent className="border-2 border-foreground bg-card shadow-[6px_6px_0px_0px_var(--foreground)]">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {ADMIN_RESOURCES_PAGE.deleteTitle}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {pendingDelete
                ? ADMIN_RESOURCES_PAGE.deleteDescription(pendingDelete.title)
                : null}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-0">
            <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              disabled={isPending}
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
            >
              {isPending ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

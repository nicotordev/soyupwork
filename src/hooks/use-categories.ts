import { getPaginatedCategories } from "@/app/actions/categories.actions";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

type CategoryListItem = {
  id: string;
  slug: string;
  name: string;
  icon: string | null;
  position: number;
};

type UseCategoriesResult = {
  categories: CategoryListItem[];
  isLoading: boolean;
  isError: boolean;
  isFetching: boolean;
  refetch: ReturnType<typeof useQuery>["refetch"];
  pagination: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    setPage: (page: number) => void;
    setPageSize: (size: number) => void;
    nextPage: () => void;
    prevPage: () => void;
    canNextPage: boolean;
    canPrevPage: boolean;
  };
};

export default function useCategories(): UseCategoriesResult {
  const searchParams = useSearchParams();
  const router = useRouter();

  const getInitial = (key: string, fallback: string) =>
    parseInt(searchParams.get(key) ?? fallback, 10);

  const [page, setPageState] = useState(() => getInitial("page", "1"));
  const [pageSize, setPageSizeState] = useState(() =>
    getInitial("pageSize", "10"),
  );

  const lastSearchParams = useRef({ page, pageSize });

  useEffect(() => {
    const newPage = getInitial("page", "1");
    const newPageSize = getInitial("pageSize", "10");
    if (newPage !== lastSearchParams.current.page) setPageState(newPage);
    if (newPageSize !== lastSearchParams.current.pageSize)
      setPageSizeState(newPageSize);
    lastSearchParams.current = { page: newPage, pageSize: newPageSize };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const setUrlParam = useCallback(
    (key: string, value: number) => {
      const params = new URLSearchParams(Array.from(searchParams.entries()));
      params.set(key, value.toString());
      router.replace(`?${params.toString()}`);
    },
    [router, searchParams],
  );

  const setPage = useCallback(
    (p: number) => {
      setPageState(p);
      setUrlParam("page", p);
    },
    [setUrlParam],
  );

  const setPageSize = useCallback(
    (size: number) => {
      setPageSizeState(size);
      setUrlParam("pageSize", size);
      setPageState(1);
      setUrlParam("page", 1);
    },
    [setUrlParam],
  );

  const categoriesQuery = useQuery({
    queryKey: ["categories", page, pageSize],
    queryFn: ({ queryKey }) =>
      getPaginatedCategories(Number(queryKey[1]), Number(queryKey[2])),
    staleTime: 60_000,
  });

  const totalCount = categoriesQuery.data?.total ?? 0;
  const totalPages =
    pageSize > 0 ? Math.max(1, Math.ceil(totalCount / pageSize)) : 1;

  const canNextPage = page < totalPages;
  const canPrevPage = page > 1;

  const nextPage = useCallback(() => {
    if (canNextPage) setPage(page + 1);
  }, [canNextPage, setPage, page]);

  const prevPage = useCallback(() => {
    if (canPrevPage) setPage(page - 1);
  }, [canPrevPage, setPage, page]);

  return {
    categories: categoriesQuery.data?.categories ?? [],
    isLoading: categoriesQuery.isLoading,
    isError: categoriesQuery.isError,
    isFetching: categoriesQuery.isFetching,
    refetch: categoriesQuery.refetch,
    pagination: {
      page,
      pageSize,
      totalCount,
      totalPages,
      setPage,
      setPageSize,
      nextPage,
      prevPage,
      canNextPage,
      canPrevPage,
    },
  };
}

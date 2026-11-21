import { Pagination as PaginationInfo } from "@/types/api";

interface PaginationProps {
  info: PaginationInfo | null;
  onPage: (page: number) => void;
}

export function Pagination({ info, onPage }: PaginationProps) {
  if (!info || info.total_pages <= 1) return null;

  const btn =
    "rounded-md border border-ink/25 px-3 py-1.5 text-sm font-medium text-ink hover:bg-white disabled:opacity-40 disabled:hover:bg-transparent";

  return (
    <nav aria-label="Pagination" className="mt-5 flex items-center justify-between text-sm text-pencil">
      <span>
        Page {info.page} of {info.total_pages}, {info.total} in total
      </span>
      <span className="flex gap-2">
        <button className={btn} disabled={info.page <= 1} onClick={() => onPage(info.page - 1)}>
          Previous
        </button>
        <button
          className={btn}
          disabled={info.page >= info.total_pages}
          onClick={() => onPage(info.page + 1)}
        >
          Next
        </button>
      </span>
    </nav>
  );
}

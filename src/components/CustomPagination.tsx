import type { PaginatedQueryDto } from "@/types/paginated.types"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "./ui/pagination"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"

interface CustomPaginationProps {
  goPrev: () => void
  isFirstPage: boolean
  totalPages: number
  pagination: PaginatedQueryDto
  goToPage: (page: number) => void
  goNext: () => void
  isLastPage: boolean
}

export const CustomPagination = ({ goPrev, isFirstPage, totalPages, pagination, goToPage, goNext, isLastPage }: CustomPaginationProps) => {
  return (
    <Pagination>
      <PaginationPrevious
        onClick={goPrev}
        className={isFirstPage ? "pointer-events-none opacity-50" : "cursor-pointer"}
        aria-disabled={isFirstPage}
        tabIndex={isFirstPage ? -1 : 0}
      />
      <PaginationContent>
        {totalPages <= 5 ? (
          Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <PaginationItem key={p}>
              <PaginationLink
                isActive={pagination.page === p}
                onClick={() => goToPage(p)}
                className="cursor-pointer"
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          ))
        ) : (
          <>
            <PaginationItem>
              <PaginationLink
                isActive={pagination.page === 1}
                onClick={() => goToPage(1)}
                className="cursor-pointer"
              >
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink
                isActive={pagination.page === 2}
                onClick={() => goToPage(2)}
                className="cursor-pointer"
              >
                2
              </PaginationLink>
            </PaginationItem>

            <PaginationItem>
              <Popover>
                <PopoverTrigger asChild>
                  <PaginationEllipsis className="cursor-pointer" />
                </PopoverTrigger>
                <PopoverContent className="flex flex-col gap-2 max-h-60 overflow-y-auto w-[75px]">
                  {Array.from({ length: totalPages - 4 }, (_, i) => i + 3).map((p) => (
                    <PaginationLink
                      key={p}
                      isActive={pagination.page === p}
                      onClick={() => goToPage(p)}
                      className="cursor-pointer"
                    >
                      {p}
                    </PaginationLink>
                  ))}
                </PopoverContent>
              </Popover>
            </PaginationItem>

            <PaginationItem>
              <PaginationLink
                isActive={pagination.page === totalPages - 1}
                onClick={() => goToPage(totalPages - 1)}
                className="cursor-pointer"
              >
                {totalPages - 1}
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink
                isActive={pagination.page === totalPages}
                onClick={() => goToPage(totalPages)}
                className="cursor-pointer"
              >
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          </>
        )}
      </PaginationContent>
      <PaginationNext
        onClick={goNext}
        className={isLastPage ? "pointer-events-none opacity-50" : "cursor-pointer"}
        aria-disabled={isLastPage}
        tabIndex={isLastPage ? -1 : 0}
      />
    </Pagination>
  )
}
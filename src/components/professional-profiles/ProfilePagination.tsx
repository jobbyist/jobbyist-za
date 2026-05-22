import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

interface ProfilePaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
}

export const ProfilePagination = ({ currentPage, totalPages, baseUrl }: ProfilePaginationProps) => {
  const getPageUrl = (page: number) => {
    if (page === 1) return baseUrl;
    return `${baseUrl}/page/${page}`;
  };

  const renderPageNumbers = () => {
    const pages: (number | string)[] = [];
    
    // Always show first page
    pages.push(1);
    
    // Calculate range around current page
    const rangeStart = Math.max(2, currentPage - 1);
    const rangeEnd = Math.min(totalPages - 1, currentPage + 1);
    
    // Add ellipsis after first page if needed
    if (rangeStart > 2) {
      pages.push('...');
    }
    
    // Add pages around current
    for (let i = rangeStart; i <= rangeEnd; i++) {
      pages.push(i);
    }
    
    // Add ellipsis before last page if needed
    if (rangeEnd < totalPages - 1) {
      pages.push('...');
    }
    
    // Always show last page if there's more than one page
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    
    return pages;
  };

  return (
    <nav 
      className="flex items-center justify-center gap-2 flex-wrap"
      role="navigation"
      aria-label="Pagination"
    >
      {/* Previous Button */}
      {currentPage > 1 ? (
        <Link to={getPageUrl(currentPage - 1)}>
          <Button
            variant="outline"
            size="sm"
            className="gap-1"
            aria-label="Go to previous page"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
        </Link>
      ) : (
        <Button
          variant="outline"
          size="sm"
          className="gap-1"
          disabled
          aria-label="Previous page (unavailable)"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
      )}

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {renderPageNumbers().map((page, index) => {
          if (page === '...') {
            return (
              <span 
                key={`ellipsis-${index}`} 
                className="px-3 py-1 text-slate-400"
                aria-hidden="true"
              >
                ...
              </span>
            );
          }

          const pageNumber = page as number;
          const isActive = pageNumber === currentPage;

          return (
            <Link 
              key={pageNumber} 
              to={getPageUrl(pageNumber)}
              aria-label={`Go to page ${pageNumber}`}
              aria-current={isActive ? "page" : undefined}
            >
              <Button
                variant={isActive ? "default" : "outline"}
                size="sm"
                className={isActive ? "bg-gradient-to-r from-primary to-purple-600" : ""}
              >
                {pageNumber}
              </Button>
            </Link>
          );
        })}
      </div>

      {/* Next Button */}
      {currentPage < totalPages ? (
        <Link to={getPageUrl(currentPage + 1)}>
          <Button
            variant="outline"
            size="sm"
            className="gap-1"
            aria-label="Go to next page"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </Link>
      ) : (
        <Button
          variant="outline"
          size="sm"
          className="gap-1"
          disabled
          aria-label="Next page (unavailable)"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </nav>
  );
};

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const PageNav = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = [];
  // This logic is basic, just shows '...' for many pages
  // You can make it more complex if needed.
  
  // Logic to show a limited number of pages (e.g., current ± 2)
  let startPage = Math.max(1, currentPage - 1);
  let endPage = Math.min(totalPages, currentPage + 1);

  if (currentPage === 1 && totalPages > 2) endPage = 3;
  if (currentPage === totalPages && totalPages > 2) startPage = totalPages - 2;

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  const PageButton = ({ page, active, children }) => (
    <button
      onClick={() => onPageChange(page)}
      className={`w-10 h-10 flex items-center justify-center rounded-lg font-semibold
        ${active 
          ? 'bg-emerald-700 text-white' 
          : 'bg-white text-gray-700 hover:bg-gray-100'
        }`}
    >
      {children}
    </button>
  );

  return (
    <nav className="flex justify-center items-center gap-2">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-10 h-10 flex items-center justify-center rounded-lg bg-white text-gray-700
                   hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft size={20} />
      </button>

      {/* First Page */}
      {startPage > 1 && (
        <>
          <PageButton page={1}>1</PageButton>
          <span className="text-gray-500">...</span>
        </>
      )}

      {/* Page Numbers */}
      {pageNumbers.map(number => (
        <PageButton key={number} page={number} active={currentPage === number}>
          {number}
        </PageButton>
      ))}
      
      {/* Last Page */}
      {endPage < totalPages && (
        <>
          <span className="text-gray-500">...</span>
          <PageButton page={totalPages}>{totalPages}</PageButton>
        </>
      )}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-10 h-10 flex items-center justify-center rounded-lg bg-white text-gray-700
                   hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronRight size={20} />
      </button>
    </nav>
  );
};

export default PageNav;
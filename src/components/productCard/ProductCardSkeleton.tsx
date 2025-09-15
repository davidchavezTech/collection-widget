const ProductCardSkeleton = () => {
    return (
      <div className="tw:group tw:mb-4 tw:animate-pulse">
        {/* Image placeholder */}
        <div className="tw:relative tw:aspect-[2/3] tw:overflow-hidden tw:mb-1 tw:bg-stone-300" />
  
        {/* Text placeholders */}
        <div className="tw:p-2 tw:text-center tw:space-y-2">
          <div className="tw:h-3 tw:w-1/3 tw:mx-auto tw:bg-stone-300 tw:rounded" />
          <div className="tw:h-4 tw:w-2/3 tw:mx-auto tw:bg-stone-300 tw:rounded" />
          <div className="tw:h-3 tw:w-1/4 tw:mx-auto tw:bg-stone-300 tw:rounded" />
        </div>
      </div>
    );
  };
  
  export default ProductCardSkeleton;
  
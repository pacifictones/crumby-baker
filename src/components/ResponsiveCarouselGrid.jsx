import React from "react";

function ResponsiveCarouselGrid({ items, renderItem, className = "" }) {
  return (
    <div
      className={`
        // Mobile:
            flex flex-nowrap gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide 
        // sm and md:
            sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible   
        // lg and up: 
            lg:grid-cols-4  lg:gap-8 lg:justify-center
            
        // all
            py-4 px-2 mx-auto    
            ${className}
            `}
    >
      {items.map((item, index) => (
        <div
          key={item.id || index}
          className="flex-shrink-0 w-full snap-start sm:w-full  "
        >
          {renderItem(item)}
        </div>
      ))}
    </div>
  );
}

export default ResponsiveCarouselGrid;

import React from "react";

function ResponsiveCarouselGrid({ items, renderItem, className = "" }) {
  return (
    <div
      className={`
            flex flex-nowrap gap-4 py-4 px-2 overflow-x-auto snap-x snap-mandatory lg:overflow-visible lg:grid lg:grid-cols-3 lg:gap-6 ${className}
            `}
    >
      {items.map((item, index) => (
        <div
          key={item.id || index}
          className="flex-shrink-0 w-72 snap-start lg:w-auto"
        >
          {renderItem(item)}
        </div>
      ))}
    </div>
  );
}

export default ResponsiveCarouselGrid;

"use client";

export default function LayoutThumbnail({ layout }) {
  const photoAreaHeight = 1 - layout.footer;

  return (
    <div
      className="relative w-full bg-plum rounded-[3px] overflow-hidden"
      style={{ aspectRatio: layout.aspect }}
    >
      {layout.cells.map((cell, i) => (
        <div
          key={i}
          className="absolute bg-white"
          style={{
            left: `${(cell.x + 0.06) * 100}%`,
            top: `${cell.y * photoAreaHeight * 100 + 6}%`,
            width: `${(cell.w - 0.12) * 100}%`,
            height: `${cell.h * photoAreaHeight * 100 - (layout.count > 1 ? 4 : 12)}%`,
          }}
        />
      ))}
    </div>
  );
}

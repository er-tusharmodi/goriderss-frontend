export default function GalleryPanel() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 3 }).map((_, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={i} src="https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"
             className="rounded-xl border border-border object-cover w-full aspect-square" alt="gallery"/>
      ))}
    </div>
  );
}

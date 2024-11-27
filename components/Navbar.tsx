import Link from "next/link";
import Image from "next/image";

const navIcons = [
  { id: 1, src: "/svgs/search.svg", alt: "search" },
  { id: 2, src: "/svgs/black-heart.svg", alt: "heart" },
  { id: 3, src: "/svgs/user.svg", alt: "user" },
];

const Navbar = () => {
  return (
    <header className="w-full border-b-4 border-color3 bg-color1 text-offwhite">
      <nav className="flex justify-between items-center px-1 md:py-3">
        <Link href="/" className="flex items-center gap-1">
          <h1 className="text-3xl font-bold ml-10">
            Track
            <span className="text-3xl font-bold text-primary-green">Tag</span>
          </h1>
        </Link>
        <div className="flex items-center  gap-10 ml-20 mr-10">
          {navIcons.map((icon) => (
            <Image
              key={icon.id}
              src={icon.src}
              alt={icon.alt}
              width={28}
              height={28}
            />
          ))}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;

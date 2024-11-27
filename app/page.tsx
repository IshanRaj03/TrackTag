import Homebanner from "@/components/Homebanner";
import ProductCard from "@/components/ProductCard";
import SearchBar from "@/components/SearchBar";
import { getAllProducts } from "@/lib/actions";

const Home = async () => {
  const allProducts = await getAllProducts();
  const displayedProducts = allProducts.slice(0, 5);

  return (
    <>
      <section className="px-6 md:px-20 py-22">
        <div className="flex max-xl:flex-col gap-16">
          <div className="flex flex-col justify-center">
            <h1 className="text-5xl leading-[72px] font-bold tracking-[-1.2px] text-gray-900">
              Track the Best Deals in Real Time with
              <br />
              <span className="text-color1 text-6xl"> TrackTag</span>
            </h1>
            <p className="mt-4 ml-2">
              Whether you’re looking to save on your next big purchase or stay
              updated on price trends, TrackTag has you covered
            </p>
            <SearchBar />
          </div>
          <Homebanner />
        </div>
      </section>
      <section className="flex flex-col gap-10 px-6 md:px-20 py-24">
        <h2 className="text-secondary text-[32px] font-semibold">Trending</h2>
        <div className="flex flex-wrap gap-x-8 gap-y-16">
          {displayedProducts?.map((product) => (
            <div className="" key={product.id}>
              <ProductCard key={product.id} product={product}></ProductCard>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default Home;

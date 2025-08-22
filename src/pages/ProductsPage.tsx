import { Search, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import BottomNavigation from "@/components/BottomNavigation";
import ProductCard from "@/components/ProductCard";
import { Link } from "react-router-dom";
import honeyImage from "@/assets/honey-jar.jpg";

const ProductsPage = () => {
  const products = [
    {
      id: "1",
      name: "Honey",
      price: 8,
      image: honeyImage,
      unit: "jar"
    },
    {
      id: "2",
      name: "Organic Pasta",
      price: 4,
      image: "/api/placeholder/300/300",
      unit: "pack"
    },
    {
      id: "3",
      name: "Fresh Tomatoes",
      price: 3,
      image: "/api/placeholder/300/300",
      unit: "lb"
    },
    {
      id: "4",
      name: "Olive Oil",
      price: 12,
      image: "/api/placeholder/300/300",
      unit: "bottle"
    }
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-card shadow-card border-b border-border">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <Link to="/">
              <Button variant="ghost" size="sm" className="p-2">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-semibold text-foreground">Products</h1>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input 
              placeholder="Search products..." 
              className="pl-10 bg-background border-input"
            />
          </div>
        </div>
      </header>

      <main className="px-4 py-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
};

export default ProductsPage;
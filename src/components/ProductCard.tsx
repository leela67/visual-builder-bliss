import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  unit?: string;
}

const ProductCard = ({ id, name, price, image, unit }: ProductCardProps) => {
  return (
    <Card className="overflow-hidden bg-card shadow-card">
      <div className="aspect-square overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-card-foreground mb-1">{name}</h3>
        <p className="text-lg font-bold text-primary mb-2">
          ${price}{unit && <span className="text-sm font-normal text-muted-foreground">/{unit}</span>}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{name}</span>
          <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
            Add
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Spinner from "./Spinner";
import './Loading.css';

export default function ProductPage() {
  const { category, productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProduct() {
      try {
        const res = await fetch(`http://localhost:5000/api/products/${productId}`);
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error("Błąd pobierania produktu:", err);
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [productId]);

  if (loading) {
    
    return (
<div className="ladowanie">
    <><h2>Ładowanie...</h2> <Spinner /></>
    </div>
);
  }
    if (!product) {
  return (
    <div className="ladowanie">
    <>
      <h2>Produkt nie istnieje, zrobcie backend, wyświetla:</h2>
      <p>{productId}</p>
    </>
    </div>
  );
}


  return (
    <div>
      <h1>{product.label}</h1>
      <p>Kategoria: {category}</p>
      <p>Opis: {product.description}</p>
      <p>Cena: {product.price} zł</p>
    </div>
  );
}

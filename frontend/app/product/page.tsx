import ProductApi from "../../components/productApi";
import ProductRTKQuery from "../../components/productRTKQuery";

export default function ProductPage() {
  return (
    <main>
      <h1>Product API </h1>

      <section>
        <ProductApi />
      </section>

      <hr />

      <section>
        <ProductRTKQuery />
      </section>
    </main>
  );
}
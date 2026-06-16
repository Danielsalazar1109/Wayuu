import { redirect } from "next/navigation";

export const metadata = {
  title: "Products",
};

export default function ProductsPage() {
  redirect("/#productos");
}

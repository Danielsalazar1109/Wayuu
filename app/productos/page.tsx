import { redirect } from "next/navigation";

export const metadata = {
  title: "Productos",
};

export default function ProductsPage() {
  redirect("/#productos");
}

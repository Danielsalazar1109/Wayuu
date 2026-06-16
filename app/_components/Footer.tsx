import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/40">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-12 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-md">
          <p className="text-base font-semibold tracking-tight">Wayuu</p>
          <p className="mt-2 text-sm text-foreground/70">
            E-commerce template for Wayuu bags. Colombian craftsmanship,
            contemporary design, and a simple checkout.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-10">
          <div>
            <p className="text-sm font-semibold">Explore</p>
            <ul className="mt-3 space-y-2 text-sm text-foreground/70">
              <li>
                <Link href="/#productos" className="hover:text-foreground">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/#historia" className="hover:text-foreground">
                  Story
                </Link>
              </li>
              <li>
                <Link href="/carrito" className="hover:text-foreground">
                  Cart
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold">Info</p>
            <ul className="mt-3 space-y-2 text-sm text-foreground/70">
              <li>Shipping (demo)</li>
              <li>Payments (demo)</li>
              <li>Support: hola@wayuu.com</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto w-full max-w-6xl px-6 py-6 text-xs text-foreground/70">
          © {new Date().getFullYear()} Wayuu. Built to showcase a template.
        </div>
      </div>
    </footer>
  );
}

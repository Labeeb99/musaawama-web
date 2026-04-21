import Link from "next/link";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
};

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-8">
      <ol className="flex flex-wrap items-center gap-2 text-sm text-neutral-500">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-2">
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="transition hover:text-neutral-900"
                >
                  {item.label}
                </Link>
              ) : (
                <span className={isLast ? "font-medium text-neutral-900" : ""}>
                  {item.label}
                </span>
              )}

              {!isLast && <span className="text-neutral-400">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

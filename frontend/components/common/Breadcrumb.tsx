import { Fragment } from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import Container from "@/components/layout/Container";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <div className="bg-white">
      <Container>
        <nav
          className="flex items-center gap-1.5 text-sm py-3 text-gray-500"
          aria-label="Breadcrumb"
        >
          <Link
            href="/"
            className="flex items-center gap-1 hover:text-(--color-primary) transition-colors shrink-0"
          >
            <Home className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Home</span>
          </Link>

          {items.map((item, index) => (
            <Fragment key={index}>
              <ChevronRight className="h-3.5 w-3.5 text-gray-300 shrink-0" aria-hidden="true" />
              {item.href ? (
                <Link
                  href={item.href}
                  className="hover:text-(--color-primary) transition-colors truncate"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-(--color-secondary) font-medium truncate">
                  {item.label}
                </span>
              )}
            </Fragment>
          ))}
        </nav>
      </Container>
    </div>
  );
}

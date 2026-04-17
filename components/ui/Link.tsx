import NextLink, { LinkProps as NextLinkProps } from "next/link";
import { cn } from "@/lib/utils";

interface LinkProps extends NextLinkProps {
  className?: string;
  children: React.ReactNode;
}

export default function Link({ className, children, ...props }: LinkProps) {
  return (
    <NextLink className={cn("transition-opacity hover:opacity-70", className)} {...props}>
      {children}
    </NextLink>
  );
}

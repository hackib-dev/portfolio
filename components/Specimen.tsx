import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

type SpecimenProps<T extends ElementType> = {
  as?: T;
  /** Component name shown by the seam. Never a file path: the repository is private. */
  name: string;
  /** Feature area the component belongs to, e.g. "Index" or "Case study". */
  layer: string;
  children?: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children">;

/**
 * Marks a server-rendered region for the seam. It adds data attributes only: no client
 * JavaScript. Client components register themselves with useSpecimen instead, which is how
 * the seam can tell, at runtime, which regions were hydrated.
 */
export function Specimen<T extends ElementType = "div">({ as, name, layer, children, ...rest }: SpecimenProps<T>) {
  const Tag = (as ?? "div") as ElementType;
  return (
    <Tag data-specimen={name} data-specimen-layer={layer} {...rest}>
      {children}
    </Tag>
  );
}

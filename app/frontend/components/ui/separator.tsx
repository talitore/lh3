import * as React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";

import { cn } from "@/lib/utils";

/**
 * Renders a styled horizontal or vertical separator line.
 *
 * The separator adapts its orientation and styling based on the provided props and can be used to visually divide content sections.
 *
 * @param className - Additional CSS classes to apply to the separator
 * @param orientation - The direction of the separator, either "horizontal" or "vertical" (defaults to "horizontal")
 * @param decorative - Whether the separator is decorative and should be hidden from assistive technologies (defaults to true)
 */
function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator"
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
        className,
      )}
      {...props}
    />
  );
}

export { Separator };

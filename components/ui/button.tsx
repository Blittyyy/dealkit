import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-[10px] font-medium transition-[color,background-color,border-color,box-shadow,transform] duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/25 focus-visible:ring-offset-0 disabled:pointer-events-none disabled:opacity-50 h-11 px-5 text-sm",
  {
    variants: {
      variant: {
        default:
          "bg-brand text-white hover:bg-brand/90 shadow-sm",
        outline:
          "border border-border-soft/80 bg-transparent text-primary hover:bg-[#E6E8EC]/30 hover:text-primary shadow-[0_1px_2px_rgba(15,23,42,0.04)]",
        secondary:
          "bg-[#E6E8EC]/50 text-primary hover:bg-[#E6E8EC]/80",
        ghost: "hover:bg-[#E6E8EC]/50 hover:text-primary",
        link: "text-brand underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-5",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-8 text-base",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };

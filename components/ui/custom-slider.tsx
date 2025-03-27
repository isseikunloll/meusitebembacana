"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

interface CustomSliderProps extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  thumbClassName?: string
}

const CustomSlider = React.forwardRef<React.ElementRef<typeof SliderPrimitive.Root>, CustomSliderProps>(
  ({ className, thumbClassName, ...props }, ref) => (
    <SliderPrimitive.Root
      ref={ref}
      className={cn("relative flex w-full touch-none select-none items-center", className)}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-1 w-full grow overflow-hidden rounded-full bg-gray-700">
        <SliderPrimitive.Range className="absolute h-full bg-white" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb
        className={cn(
          "block h-3.5 w-3.5 rounded-full border border-gray-800 bg-white ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          thumbClassName,
        )}
      />
    </SliderPrimitive.Root>
  ),
)
CustomSlider.displayName = SliderPrimitive.Root.displayName

export { CustomSlider }


import * as React from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '../../lib/utils';

export const AgeSelector = () => {
  return (
    <SelectPrimitive.Root defaultValue="all">
      <SelectPrimitive.Trigger className="flex items-center justify-between gap-3 bg-[var(--color-freesia)] text-black font-fredoka font-medium py-2 px-5 rounded-full shadow-sm hover:shadow-md hover:border-black border-2 border-transparent transition-all outline-none cursor-pointer min-w-[140px]">
        <div className="flex items-center gap-2">
          <span className="opacity-80 font-medium font-fredoka">Age:</span>
          <SelectPrimitive.Value />
        </div>
        <SelectPrimitive.Icon>
          <ChevronDown className="h-4 w-4" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>

      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          className="overflow-hidden bg-white rounded-2xl shadow-xl border-2 border-[var(--color-freesia)] z-[100] animate-in fade-in zoom-in-95"
          position="popper"
          sideOffset={5}
        >
          <SelectPrimitive.ScrollUpButton className="flex items-center justify-center h-[25px] bg-white text-black cursor-default">
            <ChevronUp className="h-4 w-4" />
          </SelectPrimitive.ScrollUpButton>

          <SelectPrimitive.Viewport className="p-1">
            <AgeItem value="all">All Ages</AgeItem>
            <div className="h-[1px] bg-[var(--color-yellow)] my-1 mx-2" />
            <AgeItem value="3">3 Years</AgeItem>
            <AgeItem value="4">4 Years</AgeItem>
            <AgeItem value="5">5 Years</AgeItem>
            <AgeItem value="6">6 Years</AgeItem>
          </SelectPrimitive.Viewport>

          <SelectPrimitive.ScrollDownButton className="flex items-center justify-center h-[25px] bg-white text-black cursor-default">
            <ChevronDown className="h-4 w-4" />
          </SelectPrimitive.ScrollDownButton>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
};

const AgeItem = React.forwardRef<HTMLDivElement, SelectPrimitive.SelectItemProps>(
  ({ children, className, ...props }, forwardedRef) => {
    return (
      <SelectPrimitive.Item
        className={cn(
          'relative flex items-center px-8 py-2 text-sm font-medium font-fredoka text-black rounded-xl cursor-default select-none outline-none',
          'focus:bg-[var(--color-yellow)] focus:text-black data-[state=checked]:bg-[var(--color-neon-green)]/30',
          className
        )}
        {...props}
        ref={forwardedRef}
      >
        <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
        <SelectPrimitive.ItemIndicator className="absolute left-2 flex items-center justify-center">
          <Check className="h-4 w-4 text-[var(--color-kelly-green)]" />
        </SelectPrimitive.ItemIndicator>
      </SelectPrimitive.Item>
    );
  }
);

AgeItem.displayName = 'AgeItem';

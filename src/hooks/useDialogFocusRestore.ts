import { useEffect, useRef } from "react";

export const useDialogFocusRestore = (open: boolean) => {
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (open) {
      triggerRef.current = document.activeElement as HTMLElement | null;
      return;
    }

    triggerRef.current?.focus();
  }, [open]);
};

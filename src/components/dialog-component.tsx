"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button, ButtonProps } from "./ui/button";
import { createPortal } from "react-dom";
import { cn } from "@lib/utils";
import * as Portal from "@radix-ui/react-portal";
import { Cross2Icon } from "@radix-ui/react-icons";

interface DialogContextProps {
  open: boolean;
  handleOpen: () => void;
}

const DialogContext = createContext<DialogContextProps>({
  open: false,
  handleOpen: () => {},
});

interface DialogContextProvidorProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?(open: boolean): void;
}

function DialogComponent({
  children,
  open,
  onOpenChange,
}: DialogContextProvidorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const isDialogOpen = open !== undefined ? open : isOpen;

  useEffect(() => {
    const body = document.querySelector("body");
    if (window !== undefined && body) {
      if (isDialogOpen) {
        body.style.overflow = "hidden";
      } else {
        body.style.overflow = "visible";
      }
    }
  }, [isDialogOpen]);

  const handleOpenChange = () => {
    setIsOpen((is) => !is);
    if (open) {
      onOpenChange?.(open);
    }
  };

  return (
    <DialogContext.Provider
      value={{ open: isDialogOpen, handleOpen: handleOpenChange }}
    >
      {children}
    </DialogContext.Provider>
  );
}

interface DialogOverlayProps {
  className?: string;
}

const DialogTrigger = React.forwardRef<
  React.ElementRef<"button">,
  React.ComponentPropsWithoutRef<"button">
>(({ children, onClick, ...props }, ref) => {
  const { handleOpen } = useContext(DialogContext);
  return (
    <button
      onClick={(e) => {
        onClick?.(e);
        handleOpen();
      }}
      {...props}
      ref={ref}
    >
      {children}
    </button>
  );
});

const DialogClose = React.forwardRef<
  React.ElementRef<"button">,
  React.ComponentPropsWithoutRef<"button">
>(({ children, onClick, ...props }, ref) => {
  const { handleOpen } = useContext(DialogContext);
  return (
    <button
      onClick={(e) => {
        onClick?.(e);
        handleOpen();
      }}
      {...props}
      ref={ref}
    >
      {children}
    </button>
  );
});

const DialogHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        "flex flex-col space-y-1.5 text-center sm:text-left",
        className
      )}
      {...props}
    />
  );
};

interface DialogContentProps {
  children?: React.ReactNode;
  className?: string;
}

const DialogOverlay = React.forwardRef<HTMLDivElement, DialogOverlayProps>(
  ({ className, ...props }, ref) => {
    const { open, handleOpen } = useContext(DialogContext);
    return (
      <motion.div
        onClick={handleOpen}
        variants={{
          open: { opacity: 1, visibility: "visible" },
          close: { opacity: 0, visibility: "hidden" },
        }}
        initial={open ? "open" : "close"}
        animate={open ? "open" : "close"}
        exit={open ? "open" : "close"}
        transition={{ duration: 0.15 }}
        className={cn(
          "fixed inset-0 z-50 bg-black/80",
          className
          // { block: open },
          // { hidden: !open }
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(
  ({ children, className }, externalRef) => {
    const { open } = useContext(DialogContext);

    const internalRef = useRef<HTMLDivElement>(null);
    const ref = externalRef || internalRef;

    useEffect(() => {
      if (open && ref && "current" in ref && ref.current) {
        ref.current.scrollTo(0, 0); // Scroll to the top when the dialog opens
      }
    }, [open, ref]);

    return (
      <Portal.Root>
        {/* <AnimatePresence mode="popLayout">
          {open && ( */}
        <>
          <DialogOverlay />
          <motion.div
            ref={ref}
            variants={{
              open: {
                translateX: "-50%",
                translateY: "-50%",
                scale: 1,
                opacity: 1,
                visibility: "visible",
                transition: {
                  duration: 0.14,
                },
              },
              close: {
                translateX: "-50%",
                translateY: "-45%",
                scale: 0.9,
                opacity: 0,
                visibility: "hidden",
                transition: { duration: 0.05 },
              },
            }}
            initial={open ? "open" : "close"}
            animate={open ? "open" : "close"}
            transition={{ type: "spring" }}
            exit={open ? "open" : "close"}
            className={cn(
              "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg  sm:rounded-lg",
              className
            )}
          >
            {children}
            <DialogComponent.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <Cross2Icon className="h-4 w-4" />
              {/* <span className="sr-only">Close</span> */}
            </DialogComponent.Close>
          </motion.div>
        </>
        {/* )}
        </AnimatePresence>
        , */}
      </Portal.Root>
    );
  }
);

const DialogTitle = React.forwardRef<
  React.ElementRef<"h1">,
  React.ComponentPropsWithoutRef<"h1">
>(({ className, ...props }, ref) => {
  return (
    <h1
      ref={ref}
      className={cn(
        "text-lg font-semibold leading-none tracking-tight",
        className
      )}
      {...props}
    />
  );
});

const DialogDescription = React.forwardRef<
  React.ElementRef<"h2">,
  React.ComponentPropsWithoutRef<"h2">
>(({ className, ...props }, ref) => {
  return (
    <h2
      ref={ref}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
});

const DialogFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end  gap-2 ",
      className
    )}
    {...props}
  />
);

// Attach subcomponents to the main DialogComponent

DialogComponent.Trigger = DialogTrigger;
DialogComponent.Close = DialogClose;
DialogComponent.Overlay = DialogOverlay;
DialogComponent.Header = DialogHeader;
DialogComponent.Title = DialogTitle;
DialogComponent.Description = DialogDescription;
DialogComponent.Content = DialogContent;
DialogComponent.Footer = DialogFooter;

// Use type assertion to extend the DialogComponent
// type DialogCompoundComponent = React.FC<DialogContextProvidorProps> & {
//   Trigger: typeof DialogTrigger;
//   Overlay: typeof DialogOverlay;
//   Header: typeof DialogHeader;
//   Content: typeof DialogContent;
//   Footer: typeof DialogFooter;
// };

// const Dialog: DialogCompoundComponent =
//   DialogComponent as DialogCompoundComponent;

export default DialogComponent;

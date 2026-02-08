import Link from "next/link";
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Logo from "@../public/autozone-logo.svg";
import Image from "next/image";
import { cn } from "@lib/utils";

const PRODUCTS_LINKS: { url: string; name: string }[] = [
  { url: "", name: "Body Parts" },
  { url: "", name: "Brake System" },
  { url: "", name: "Batteries" },
  { url: "", name: "Tools" },
];
const HELP_LINKS: { url: string; name: string }[] = [
  { url: "", name: "Contact Us" },
  { url: "", name: "My Account" },
  { url: "", name: "Return Policies" },
];

const Footer = ({ className }: { className?: string }) => {
  return (
    <footer
      className={cn(
        " w-full   mt-44  justify-center p-5  flex-col-reverse  sm:flex-row flex  gap-x-20  gap-y-5 pb-10",
        className,
      )}
    >
      <section className="  w-full sm:hidden">
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger className=" font-semibold text-lg">
              PRODUCTS
            </AccordionTrigger>
            <AccordionContent>
              <ul className=" space-y-3">
                {PRODUCTS_LINKS.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={`${link.url}`}
                      className=" text-muted-foreground hover:text-primary transition-colors duration-300"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger className=" font-semibold text-lg">
              HELP
            </AccordionTrigger>
            <AccordionContent>
              <ul className=" space-y-3">
                {HELP_LINKS.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={`${link.url}`}
                      className=" text-muted-foreground hover:text-primary transition-colors duration-300"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      <section className="hidden  sm:flex w-fit shrink-0 gap-16">
        <div>
          <h3 className=" font-semibold mb-5">PRODUCTS</h3>
          <ul className=" space-y-3">
            {PRODUCTS_LINKS.map((link, index) => (
              <li key={index}>
                <Link
                  href={`${link.url}`}
                  className=" text-muted-foreground hover:text-primary transition-colors duration-300"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className=" font-semibold mb-5">HELP</h3>
          <ul className=" space-y-3">
            {HELP_LINKS.map((link, index) => (
              <li key={index}>
                <Link
                  href={`${link.url}`}
                  className=" text-muted-foreground hover:text-primary transition-colors duration-300"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <div className="  flex-1 max-w-[400px] ">
        <Image src={Logo} alt="Logo" className="   w-full" />
      </div>
    </footer>
  );
};

export default Footer;

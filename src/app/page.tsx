import Header from "@/components/home/header";
import BackgroundImage from "@../public/Top-15-Best-Sports-Cars-Power-Luxury-and-Design-Ferrari-812-Superfast.jpeg";
import Image from "next/image";
import LinkBoxs from "@components/home/link-boxs";
import { Button } from "@components/ui/button";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function Home() {
  return (
    <main className=" h-[100dvh] relative">
      <Header />
      <Image
        src={BackgroundImage}
        alt="asa"
        className=" absolute inset-0 w-full -z-[1] object-cover h-full"
      />
      <div className="  absolute md:left-10 md:bottom-10 left-4 bottom-12 max-w-[100%] md:max-w-[50%] min-w-[250px] space-y-2">
        <div className=" flex  items-center gap-4  font-semibold  text-4xl md:text-5xl lg:text-6xl pr-1">
          <h1>
            Treat your car, <br /> Contact us now{" "}
          </h1>
          <Button className=" group" asChild variant="secondary" size="icon">
            <Link href="/">
              <ArrowUpRight
                size={20}
                className=" 
                
                 transition-transform
                group-hover:translate-x-2 group-hover:-translate-y-2"
              />
            </Link>
          </Button>
        </div>
        <p className=" text-xs  text-muted-foreground pr-2">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore
          harum, nam amet eveniet ipsam ea facere accusantium repellat, natus
          maiores hic? At eaque debitis consectetur quibusdam magni voluptates
          vitae enim?
        </p>
      </div>

      <LinkBoxs />
    </main>
  );
}

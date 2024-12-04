"use client";

import * as React from "react";
import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart, TooltipProps } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Service } from "@lib/types";
import { formatCurrency } from "@lib/client-helpers";
import { cn } from "@lib/utils";
import { useRouter } from "next/navigation";

const chartData = [
  { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 287, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
  { browser: "other", visitors: 190, fill: "var(--color-other)" },
];

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "hsl(var(--chart-1))",
  },
  safari: {
    label: "Safari",
    color: "hsl(var(--chart-2))",
  },
  firefox: {
    label: "Firefox",
    color: "hsl(var(--chart-3))",
  },
  edge: {
    label: "Edge",
    color: "hsl(var(--chart-4))",
  },

  other: {
    label: "Other",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

const colors = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "var(--dashboard-orange)",
];

interface Props {
  salesData: Service[][];
  date: (string | Date | undefined)[];
  description: string;
}
export function SoldProductsPie({ salesData, date, description }: Props) {
  const router = useRouter();
  const flatData = salesData.flat();
  const products = flatData.map((item) => item.productsToSell).flat();

  const productIds = Array.from(new Set(products.map((pro) => pro.product.id)));

  const productsPie = React.useMemo(() => {
    return productIds
      .map((id, index) => {
        const pro = products.find((item) => item.product.id === id);
        return products
          .filter((pro) => pro.product.id === id)
          .reduce(
            (acc, currItem) => {
              acc.totalCount += currItem.count;
              acc.totalDiscount += currItem.discount * currItem.count;
              acc.totalPriceAfterDiscount += currItem.totalPriceAfterDiscount;
              return acc;
            },
            {
              id: id,
              productName: pro?.product.name,
              pricePerUnit: pro?.pricePerUnit,
              totalCount: 0,
              totalDiscount: 0,
              fill: colors[index],
              totalPriceAfterDiscount: 0,
            }
          );
      })
      .sort((a, b) => b.totalPriceAfterDiscount - a.totalPriceAfterDiscount);
  }, [flatData]);

  // If there is more than 6 items we want to grop the rest into the others group.
  const productMoreThanSix = React.useMemo(() => {
    if (productsPie.length > 6) {
      const firstSix = productsPie.slice(0, 6).map((item, index) => {
        return { ...item, fill: colors[index] };
      });
      const fromSix = productsPie.slice(6);

      const theTotalsFromSix = fromSix.reduce(
        (acc, currItem) => {
          acc.totalCount += currItem.totalCount;
          acc.totalDiscount += currItem.totalDiscount;
          acc.totalPriceAfterDiscount += currItem.totalPriceAfterDiscount;

          return acc;
        },
        {
          productName: "Other",
          pricePerUnit: 0,
          totalCount: 0,
          totalDiscount: 0,
          totalPriceAfterDiscount: 0,
        }
      );
      return [...firstSix, theTotalsFromSix];
    } else return [];
  }, [productsPie]);

  const productsSoldData = productMoreThanSix.length
    ? productMoreThanSix
    : productsPie;

  const totalUnits = React.useMemo(() => {
    return productsSoldData.reduce((acc, curr) => acc + curr.totalCount, 0);
  }, [productsSoldData]);
  // const config : any = {
  //   soldProducts: {
  //     label: "Sold Products",
  //   },
  // };

  // productsSoldData.forEach((pro,index) => {
  //   const label = pro.productName || `pro${index}`;

  //   config[label] = {
  //      label: label,
  //   color: colors[index]
  //   };
  // });

  return (
    <Card className="flex flex-col  w-full  ">
      <CardHeader className="items-center pb-0">
        <CardTitle>Products Sold</CardTitle>
        <CardDescription>
          {`${date[0]}`} - {`${date[1]}`}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip cursor={false} content={<ProductSoldTooltip />} />
            <Pie
              onClick={(e) => {
                const data = e.payload;
                if (data.id) router.push(`products/${data.id}`);
              }}
              data={productsSoldData}
              dataKey="totalPriceAfterDiscount"
              nameKey="productName"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalUnits.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Units
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        {/* <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div> */}
        <div className="leading-none text-muted-foreground">
          Showing total products sold {description}
        </div>
      </CardFooter>
    </Card>
  );
}

interface ProductSoldPayload {
  id: number;
  productName?: string;
  pricePerUnit: number;
  totalCount: number;
  totalDiscount: number;
  fill?: string;
  totalPriceAfterDiscount: number;
  [key: string]: any;
}
interface ChartTooltipContentProps extends TooltipProps<number, string> {
  payload?: { payload: ProductSoldPayload }[];
  label?: string;
}
const ProductSoldTooltip: React.FC<ChartTooltipContentProps> = ({
  payload,
  label,
}) => {
  if (!payload || payload.length === 0) return null;
  const data = payload[0].payload;
  return (
    <div className=" grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl">
      {" "}
      <div className=" flex items-center gap-1">
        <div
          className={cn(
            `shrink-0 rounded-[2px] border-[--color-border]  h-2.5 w-2.5`
          )}
          style={{ backgroundColor: `${data.fill} ` }}
        />

        <p className="font-medium">{`${data.productName}`}</p>
      </div>{" "}
      {data.productName !== "Other" && (
        <div
          className={cn(
            "flex flex-1 gap-1 justify-between leading-none items-center"
          )}
        >
          <div className="grid gap-1.5">
            <span className="text-muted-foreground">Price per unit:</span>
          </div>

          <span className="font-mono font-medium tabular-nums text-foreground">
            {formatCurrency(data.pricePerUnit)}
          </span>
        </div>
      )}
      <div
        className={cn(
          "flex flex-1 gap-1 justify-between leading-none items-center"
        )}
      >
        <span className="text-muted-foreground">Total count:</span>

        <span className="font-mono font-medium tabular-nums text-foreground">
          {data.totalCount} units
        </span>
      </div>
      <div
        className={cn(
          "flex flex-1 gap-1 justify-between leading-none items-center"
        )}
      >
        <span className="text-muted-foreground">Total Discount:</span>

        <span className="font-mono font-medium tabular-nums text-foreground">
          {formatCurrency(data.totalDiscount)}
        </span>
      </div>
      <div
        className={cn(
          "flex flex-1 gap-1 justify-between leading-none items-center"
        )}
      >
        <span className="text-muted-foreground">Net:</span>

        <span className="font-mono font-medium tabular-nums text-foreground">
          {formatCurrency(data.totalPriceAfterDiscount)}
        </span>
      </div>
    </div>
  );
};

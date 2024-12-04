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
export function ServicePie({ salesData, date, description }: Props) {
  const router = useRouter();
  const flatData = salesData.flat();
  const services = flatData.map((item) => item.serviceFees).flat();
  const productIds = Array.from(
    new Set(services.map((serv) => serv.categoryId))
  );

  const servicePie = React.useMemo(() => {
    return productIds
      .map((id, index) => {
        const ser = services.find((item) => item.categoryId === id);
        return services
          .filter((serv) => serv.categoryId === id)
          .reduce(
            (acc, currItem, index, arr) => {
              acc.totalCount = arr.length;
              acc.totalDiscount += currItem.discount;
              acc.totalPrice += currItem.price;
              acc.totalPriceAfterDiscount += currItem.totalPriceAfterDiscount;
              return acc;
            },
            {
              id: id,
              name: id,
              totalPrice: 0,
              totalCount: 0,
              totalDiscount: 0,
              fill: colors[index],
              totalPriceAfterDiscount: 0,
            }
          );
      })
      .sort((a, b) => b.totalPriceAfterDiscount - a.totalPriceAfterDiscount);
  }, [flatData]);

  console.log(servicePie, "SERVICE PIE DATA");
  const servicesMoreThanSix = React.useMemo(() => {
    if (servicePie.length > 6) {
      const firstSix = servicePie.slice(0, 6).map((item, index) => {
        return { ...item, fill: colors[index] };
      });
      const fromSix = servicePie.slice(6);

      const theTotalsFromSix = fromSix.reduce(
        (acc, currItem) => {
          acc.totalCount += currItem.totalCount;
          acc.totalPrice += currItem.totalPrice;
          acc.totalDiscount += currItem.totalDiscount;
          acc.totalPriceAfterDiscount += currItem.totalPriceAfterDiscount;

          return acc;
        },
        {
          name: "Other",
          totalPrice: 0,
          totalCount: 0,
          totalDiscount: 0,
          totalPriceAfterDiscount: 0,
        }
      );
      return [...firstSix, theTotalsFromSix];
    } else return [];
  }, [servicePie]);

  const servicesPreformed = servicesMoreThanSix.length
    ? servicesMoreThanSix
    : servicePie;

  const totalUnits = React.useMemo(() => {
    return servicesPreformed.reduce((acc, curr) => acc + curr.totalCount, 0);
  }, [servicesPreformed]);

  return (
    <Card className="flex flex-col   w-full">
      <CardHeader className="items-center pb-0">
        <CardTitle>Services Preformed</CardTitle>
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
            <ChartTooltip cursor={false} content={<ServicesTooltip />} />
            <Pie
              data={servicesPreformed}
              dataKey="totalPriceAfterDiscount"
              nameKey="id"
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
                          Services
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
          Showing total services preformed {description}
        </div>
      </CardFooter>
    </Card>
  );
}

interface ServicesPayload {
  id: number;
  name?: string;
  totalPrice: number;
  totalCount: number;
  totalDiscount: number;
  fill?: string;
  totalPriceAfterDiscount: number;
  [key: string]: any;
}
interface ChartTooltipContentProps extends TooltipProps<number, string> {
  payload?: { payload: ServicesPayload }[];
  label?: string;
}
const ServicesTooltip: React.FC<ChartTooltipContentProps> = ({
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

        <p className="font-medium">{`${data.name}`}</p>
      </div>{" "}
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
        <div className="grid gap-1.5">
          <span className="text-muted-foreground">Total price:</span>
        </div>

        <span className="font-mono font-medium tabular-nums text-foreground">
          {formatCurrency(data.totalPrice)}
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

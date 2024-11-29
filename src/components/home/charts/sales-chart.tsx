"use client";

import { TrendingUp } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  TooltipProps,
  XAxis,
  YAxis,
} from "recharts";
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
import useRevenueCharts from "@lib/queries/useRevenueCharts";
import Spinner from "@components/Spinner";
import ErrorMessage from "@components/error-message";
import { Service } from "@lib/types";
import { isBefore, parseISO } from "date-fns";
import { cn } from "@lib/utils";
import { formatCurrency } from "@lib/client-helpers";

const chartConfig = {
  desktop: { label: "Desktop", color: "hsl(var(--chart-1))" },
  mobile: { label: "Mobile", color: "hsl(var(--chart-2))" },
} satisfies ChartConfig;
const SalesCharts = () => {
  const { data, isLoading, error } = useRevenueCharts();

  const allServices: Service[] = data || [];

  // Extract unique years
  const years = Array.from(
    new Set(allServices.map((item) => item.date.split("-")[0]))
  );

  const salesData = years
    .map((year) => {
      return allServices
        .filter((items) => items.date.startsWith(year)) // Get all the services made in each year.
        .reduce(
          (acc, currItem) => {
            // Get the totals of sold products for each year
            const soldProductsData = currItem.productsToSell.reduce(
              (soldAcc, currSold) => {
                soldAcc.totalPrice += currSold.pricePerUnit * currSold.count;
                soldAcc.totalDiscounts += currSold.discount;
                soldAcc.totalPriceAfterDiscount +=
                  currSold.totalPriceAfterDiscount;
                return soldAcc;
              },
              { totalPrice: 0, totalDiscounts: 0, totalPriceAfterDiscount: 0 }
            );

            // Get the totals of the services for each year
            const servicesProvided = currItem.serviceFees.reduce(
              (serAcc, currService) => {
                serAcc.totalPrice += currService.price;
                serAcc.totalDiscount += currService.discount;
                serAcc.totalPriceAfterDiscount +=
                  currService.totalPriceAfterDiscount;
                return serAcc;
              },
              { totalPrice: 0, totalDiscount: 0, totalPriceAfterDiscount: 0 }
            );

            acc.totalProductSold += soldProductsData.totalPrice;
            acc.totalServices += servicesProvided.totalPrice;
            acc.totalDiscount +=
              soldProductsData.totalDiscounts + servicesProvided.totalDiscount;
            acc.totalPriceAfterDiscount +=
              soldProductsData.totalPriceAfterDiscount +
              servicesProvided.totalPriceAfterDiscount;
            return acc;
          },
          {
            year: year,
            totalProductSold: 0,
            totalServices: 0,
            totalDiscount: 0,
            totalPriceAfterDiscount: 0,
          }
        );
    })
    .sort((a, b) => (isBefore(parseISO(a.year), parseISO(b.year)) ? -1 : 1));

  console.log(salesData, "ASADA");
  if (isLoading) return <Spinner />;
  if (error) return <ErrorMessage>{error}</ErrorMessage>;

  return (
    <Card className="mt-7 sm:mx-5">
      <CardHeader>
        <CardTitle>Revenue</CardTitle>
        <CardDescription>Showing total revenues for each year.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[50vh] w-full">
          <AreaChart
            accessibilityLayer
            data={salesData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="year"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 4)}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.toLocaleString()}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContentCustom />}
            />
            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>

            <Area
              dataKey="totalDiscount"
              type="monotone"
              fill="url(#fillMobile)"
              fillOpacity={0.4}
              stroke="var(--color-mobile)"
              stackId="a"
            />

            <Area
              dataKey="totalPriceAfterDiscount"
              type="monotone"
              fill="url(#fillDesktop)"
              fillOpacity={0.4}
              stroke="var(--color-desktop)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              January - June 2024
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default SalesCharts;

interface CustomPayload {
  totalProductSold: number;
  totalServices: number;
  totalDiscount: number;
  totalPriceAfterDiscount: number;
  [key: string]: any;
}
interface ChartTooltipContentProps extends TooltipProps<number, string> {
  payload?: { payload: CustomPayload }[];
  label?: string;
}
const ChartTooltipContentCustom: React.FC<ChartTooltipContentProps> = ({
  payload,
  label,
}) => {
  if (!payload || payload.length === 0) return null;
  const data = payload[0].payload;
  return (
    <div className=" grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl">
      {" "}
      <p className="font-medium">{`${label}`}</p>{" "}
      <div
        className={cn(
          "flex flex-1 gap-1 justify-between leading-none items-center"
        )}
      >
        <div className="grid gap-1.5">
          <span className="text-muted-foreground">Total Product Sold:</span>
        </div>

        <span className="font-mono font-medium tabular-nums text-foreground">
          {formatCurrency(data.totalProductSold)}
        </span>
      </div>
      <div
        className={cn(
          "flex flex-1 gap-1 justify-between leading-none items-center"
        )}
      >
        <div className="grid gap-1.5">
          <span className="text-muted-foreground">Total Services:</span>
        </div>

        <span className="font-mono font-medium tabular-nums text-foreground">
          {formatCurrency(data.totalServices)}
        </span>
      </div>
      <div
        className={cn(
          "flex flex-1 gap-1 justify-between leading-none items-center"
        )}
      >
        <div className=" flex items-center gap-1">
          <div
            className={cn(
              "shrink-0 rounded-[2px] border-[--color-border] bg-[hsl(var(--chart-2))] h-2.5 w-2.5"
            )}
          />
          <span className="text-muted-foreground">Total Discount:</span>
        </div>

        <span className="font-mono font-medium tabular-nums text-foreground">
          {formatCurrency(data.totalDiscount)}
        </span>
      </div>
      <div
        className={cn(
          "flex flex-1 gap-1 justify-between leading-none items-center"
        )}
      >
        <div className=" flex items-center gap-1">
          <div
            className={cn(
              "shrink-0 rounded-[2px] border-[--color-border] bg-[hsl(var(--chart-1))] h-2.5 w-2.5"
            )}
          />
          <span className="text-muted-foreground">Net:</span>
        </div>

        <span className="font-mono font-medium tabular-nums text-foreground">
          {formatCurrency(data.totalPriceAfterDiscount)}
        </span>
      </div>
    </div>
  );
};

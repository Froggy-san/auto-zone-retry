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
import {
  eachDayOfInterval,
  formatDate,
  isBefore,
  isSameDay,
  parseISO,
  subDays,
} from "date-fns";
import { cn } from "@lib/utils";
import { formatCurrency } from "@lib/client-helpers";
import FilterBar from "./filter-bar";
import { useMemo, useState } from "react";
import { SalesPie } from "./pie-chart";

type selected = "year" | "all" | string;

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const chartConfig = {
  desktop: { label: "Desktop", color: "hsl(var(--chart-1))" },
  mobile: { label: "Mobile", color: "hsl(var(--chart-2))" },
} satisfies ChartConfig;

const SalesCharts = () => {
  const [selected, setSelected] = useState<number | selected>("all");
  const currentYear = new Date().getFullYear();
  const dateFrom = `${currentYear}-1-1`;
  const dateTo = `${currentYear}-12-30`;

  // console.log(currentYear.getFullYear(), "YEAR");
  const { data, isLoading, error } = useRevenueCharts(
    selected === "year" ? { dateFrom, dateTo } : {}
  );

  const allServices: Service[] = data || [];

  let dates: string[] | Date[] = [];

  // Extract unique years
  if (selected === "all")
    dates = Array.from(
      new Set(allServices.map((item) => item.date.split("-")[0]))
    ).sort((a, b) => Number(a) - Number(b));

  if (selected === "year")
    dates = Array.from(
      new Set(allServices.map((item) => item.date.split("-")[1]))
    ).sort((a, b) => Number(a) - Number(b));

  if (typeof selected === "number") {
    dates = eachDayOfInterval({
      start: subDays(new Date(), selected - 1),
      end: new Date(),
    });
    // .map((date) => formatDate(date, "MMM dd"))
  }

  const dataByDate = !dates
    ? []
    : dates.map((date) =>
        allServices.filter((items) => {
          // Get all the services made in each year.
          if (selected === "all" && typeof date === "string")
            return items.date.startsWith(date);
          if (selected === "year") return items.date.split("-")[1] === date;
          return isSameDay(items.date, date);
        })
      );

  console.log(dataByDate, "DAAAAATA");

  const salesData = useMemo(() => {
    return dataByDate.map((item, index) =>
      item.reduce(
        (acc, currItem) => {
          // Get the totals of sold products for each date.
          const soldProductsData = currItem.productsToSell.reduce(
            (soldAcc, currSold) => {
              soldAcc.totalPrice += currSold.pricePerUnit * currSold.count;
              soldAcc.totalDiscounts += currSold.discount * currSold.count;
              soldAcc.totalPriceAfterDiscount +=
                currSold.totalPriceAfterDiscount;
              return soldAcc;
            },
            { totalPrice: 0, totalDiscounts: 0, totalPriceAfterDiscount: 0 }
          );

          // Get the totals of the services for each date.
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
          date:
            selected === "year"
              ? months[Number(dates[index]) - 1]
              : typeof selected === "number"
              ? formatDate(dates[index], "MMM dd")
              : dates[index],
          totalProductSold: 0,
          totalServices: 0,
          totalDiscount: 0,
          totalPriceAfterDiscount: 0,
        }
      )
    );
  }, [selected, dataByDate]);
  // .filter((item) => item.totalPriceAfterDiscount > 0);
  // console.log(salesData, "Sales data");
  if (isLoading) return <Spinner />;
  if (error) return <ErrorMessage>{error}</ErrorMessage>;

  return (
    <div className=" space-y-7 sm:mx-5">
      <FilterBar selected={selected} setSelected={setSelected} />
      <Card className=" ">
        <CardHeader>
          <CardTitle>Revenue</CardTitle>
          <CardDescription>
            {selected === "all" && "Showing total revenue for each year."}
            {selected === "year" &&
              `Showing total revenue for the year '${currentYear}'.`}
            {selected === 90 && `Showing total revenue for last 90 days.`}
            {selected === 30 && `Showing total revenue for last 30 days.`}
            {selected === 7 && `Showing total revenue for last 7 days.`}
          </CardDescription>
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
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => {
                  return value;
                }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.toLocaleString()}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContentCustom selected={selected} />}
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
                Trending up by 5.2% this month{" "}
                <TrendingUp className="h-4 w-4" />
              </div>
              <div className="flex items-center gap-2 leading-none text-muted-foreground">
                {`${salesData.at(0)?.date}`} - {`${salesData.at(-1)?.date}`}
              </div>
            </div>
          </div>
        </CardFooter>
      </Card>

      <SalesPie salesData={dataByDate} />
    </div>
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
  selected: number | selected;
  payload?: { payload: CustomPayload }[];
  label?: string;
}
const ChartTooltipContentCustom: React.FC<ChartTooltipContentProps> = ({
  selected,
  payload,
  label,
}) => {
  if (!payload || payload.length === 0) return null;
  const data = payload[0].payload;
  return (
    <div className=" grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl">
      {" "}
      <p className="font-medium">{
        // `${
        //   selected === "year" ? months[Number(label) - 1] : label
        // }`
        `${label}`
      }</p>{" "}
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

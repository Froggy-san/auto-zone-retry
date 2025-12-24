"use client";

import useInfiniteTicketHistory from "@lib/queries/tickets/useInfiniteTicketHistory";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { useInView } from "react-intersection-observer";
import TicketHistory from "./ticket-history";
import ErrorMessage from "@components/error-message";
import {
  Client,
  Message,
  TicketCategory,
  TicketHistory as TicketHistoryType,
  TicketPriority,
  TicketStatus,
} from "@lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import Spinner from "@components/Spinner";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Input } from "@components/ui/input";
import {
  ArrowDownNarrowWide,
  ArrowUpWideNarrow,
  CalendarClock,
  CalendarDays,
  CalendarIcon,
  ListTree,
  PersonStanding,
} from "lucide-react";
import { Button } from "@components/ui/button";
import { PiPerson } from "react-icons/pi";
import useDebounce from "@hooks/use-debounce";
import InfiniteClientsList from "@components/infinite-clients-list";
import { cn } from "@lib/utils";
import { formatDate } from "date-fns";
import { Calendar } from "@components/ui/calendar";
import { DateRange } from "react-day-picker";
import TicketCategoryList from "@components/ticket-category-list";

interface Props {
  selectedMessage?: Message | undefined;
  ticketStatuses: TicketStatus[];
  ticketCategory: TicketCategory[];
  ticketPriorities: TicketPriority[];
}
type SearchType = "actor_id" | "ticket_id.client_id";
const SELECT_ITEMS: { label: string; value: SearchType }[] = [
  { label: "Actor", value: "actor_id" },
  { label: "Ticket", value: "ticket_id.client_id" },
];
const TicketHistoryList = ({
  ticketPriorities,
  ticketStatuses,
  selectedMessage,
  ticketCategory,
}: Props) => {
  const [searchterm, setSearchTerm] = React.useState("");
  const [type, setType] = React.useState<SearchType>("ticket_id.client_id");
  const [selectedClient, setSelectedClient] = React.useState<null | Client>(
    null
  );
  const [category, setCategory] = React.useState<TicketCategory | null>(null);
  const [date, setDate] = React.useState<DateRange | undefined>(undefined);
  const [sortBy, setSortBy] = React.useState<"asc" | "desc" | string>("desc");
  const debouncedValue = useDebounce(searchterm, 500);

  const {
    data,
    error,
    fetchNextPage,
    isFetchingNextPage,
    isFetching,
    hasNextPage,
  } = useInfiniteTicketHistory({
    searchterm: { term: debouncedValue, type },
    clientId: selectedClient?.id,
    dateFrom: date?.from,
    dateTo: date?.to,
    ticketCategory_id: category?.id,
    sort: sortBy,
  });
  // dashboard/tickets?ticket=41
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { ref, inView } = useInView({
    // 👈 This is the key setting to isolate the observer instance
    // root: null,
    // You might also want to combine this with:
    // triggerOnce: true,
    // threshold: 0,
  });

  const handleViewDetails = useCallback(
    (ticketId: number, messageId?: number) => {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set("ticket", String(ticketId));
      if (messageId) newSearchParams.set("messageId", `${messageId}`);
      router.push(`${pathname}?${newSearchParams.toString()}`, {
        scroll: false,
      });
    },
    [router, searchParams, pathname]
  );
  const selectHistory = useCallback(
    (ticketId: number, historyId: number) => {
      console.log("WWWWW");
      const params = new URLSearchParams(searchParams);

      params.set("ticket", String(ticketId));
      params.set("historyId", `${historyId}`);
      router.push(`${pathname}?${params.toString()}`, {
        scroll: false,
      });
    },
    [router, searchParams, pathname]
  );

  useEffect(() => {
    if (!isFetchingNextPage && hasNextPage) fetchNextPage();
  }, [inView]);

  const ticketHistories: TicketHistoryType[] = useMemo(() => {
    return data ? data?.pages.flatMap((item) => item.items) : [];
  }, [data]);

  if (error) return <ErrorMessage>{`${error}`}</ErrorMessage>;

  return (
    <>
      <Filters
        searhchterm={searchterm}
        setSearchterm={setSearchTerm}
        ticketStatuses={ticketStatuses}
        ticketPriorities={ticketPriorities}
        ticketCategories={ticketCategory}
        setCategory={setCategory}
        selectedCategory={category}
        setSortBy={setSortBy}
        sortBy={sortBy}
        selectItems={SELECT_ITEMS}
        type={type}
        setType={setType}
        selectedClient={selectedClient}
        setSelectedClient={setSelectedClient}
        date={date}
        setDate={setDate}
      />
      {isFetching && ticketHistories.length === 0 ? (
        <div className=" flex justify-center h-[1px]  pt-20">
          <Spinner size={40} />
        </div>
      ) : (
        <ul className=" grid items-start  grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4 gap-5">
          {ticketHistories.map((ticketHistory) => (
            <TicketHistory
              key={ticketHistory.id}
              selectHistory={selectHistory}
              selectedMessage={selectedMessage}
              handleViewDetails={handleViewDetails}
              ticketStatuses={ticketStatuses}
              ticketPriorities={ticketPriorities}
              ticketHistory={ticketHistory}
            />
          ))}
        </ul>
      )}

      <div ref={ref} className=" mt-20 overflow-hidden  ">
        {isFetchingNextPage ? (
          <Spinner size={30} className="    static" />
        ) : !isFetchingNextPage &&
          !isFetching &&
          ticketHistories.length === 0 ? (
          <p className=" text-center text-muted-foreground  ">
            No ticket history found.
          </p>
        ) : null}
      </div>
    </>
  );
};

export default React.memo(TicketHistoryList);

interface FiltersProps {
  searhchterm: string;
  selectItems?: { label: string; value: SearchType }[];
  type: SearchType;
  selectedClient?: Client | null;
  date?: DateRange;
  ticketStatuses: TicketStatus[];
  ticketPriorities: TicketPriority[];
  ticketCategories: TicketCategory[];
  selectedCategory?: TicketCategory | null;
  sortBy: "asc" | "desc" | string;
  setSortBy: (sort: "asc" | "desc" | string) => void;
  setCategory: (category: TicketCategory | null) => void;
  setSearchterm: (term: string) => void;
  setType: (type: SearchType) => void;
  setSelectedClient?: (client: Client | null) => void;
  setDate?: (date: DateRange | undefined) => void;
}

function Filters({
  searhchterm,
  setSearchterm,
  selectItems,
  type,
  setType,
  selectedClient,
  ticketCategories,
  setCategory,
  selectedCategory,
  ticketPriorities,
  ticketStatuses,
  sortBy,
  setSortBy,
  setSelectedClient,
  date,
  setDate,
}: FiltersProps) {
  const [isClientOpen, setClientOpen] = React.useState(false);
  const [isDateOpen, setDateOpen] = React.useState(false);
  const [isCategoryOpen, setCategoryOpen] = React.useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const categoryInputRef = useRef<HTMLInputElement>(null);
  const clientInputRef = useRef<HTMLInputElement>(null);
  const isThereSelectedClient = selectedClient !== null;
  useEffect(() => {
    if (isClientOpen) {
      if (clientInputRef) {
        setTimeout(() => {
          clientInputRef.current?.focus();
        }, 100);
      }
    }
    if (isCategoryOpen) {
      if (categoryInputRef) {
        setTimeout(() => {
          categoryInputRef.current?.focus();
        }, 100);
      }
    }
  }, [isClientOpen, isCategoryOpen]);
  return (
    <div className="  flex items-center justify-between w-[95%] gap-3 px-5 py-1.5  mx-auto rounded-full  border border-border/70 shadow-md ">
      {" "}
      <HoverCard
        open={isClientOpen}
        onOpenChange={setClientOpen}
        openDelay={100}
        closeDelay={200}
      >
        <HoverCardTrigger>
          <Button
            variant="outline"
            onClick={() => setClientOpen(true)}
            className={cn(" p-1 w-7 h-7", isThereSelectedClient && "bg-accent")}
          >
            <PiPerson className=" w-5 h-5" />
          </Button>
        </HoverCardTrigger>
        <HoverCardContent className="   sm:w-80">
          <InfiniteClientsList
            ref={clientInputRef}
            setOpen={setClientOpen}
            selectedClient={selectedClient}
            onVlaueChange={setSelectedClient}
          />
        </HoverCardContent>
      </HoverCard>
      <HoverCard openDelay={100} closeDelay={200}>
        <HoverCardTrigger asChild>
          <Button variant="outline" className=" p-1 w-7 h-7">
            <CalendarDays className=" w-5 h-5" />
          </Button>
        </HoverCardTrigger>
        <HoverCardContent
          className="w-auto p-0 max-h-[50vh] overflow-y-auto"
          align="start"
        >
          <Calendar
            className=" !text-xs"
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
          <div className=" px-4 py-2 text-center">
            {date?.from ? (
              date.to ? (
                <>
                  {formatDate(date.from, "LLL dd, y")} -{" "}
                  {formatDate(date.to, "LLL dd, y")}
                </>
              ) : (
                formatDate(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </div>
        </HoverCardContent>
      </HoverCard>
      <HoverCard
        open={isCategoryOpen}
        onOpenChange={setCategoryOpen}
        openDelay={100}
        closeDelay={200}
      >
        <HoverCardTrigger>
          <Button
            variant="outline"
            className={cn(" p-1 w-7 h-7", isThereSelectedClient && "bg-accent")}
          >
            <ListTree className=" w-5 h-5" />
          </Button>
        </HoverCardTrigger>
        <HoverCardContent className="   sm:w-80">
          <TicketCategoryList
            onSelect={setCategory}
            setOpen={setCategoryOpen}
            value={selectedCategory}
            ticketCategories={ticketCategories}
            ref={categoryInputRef}
          />
        </HoverCardContent>
      </HoverCard>
      <div className=" h-7 relative flex-1 flex items-center  border border-input rounded-full transition-all focus-within:ring-1 ring-ring  ">
        <Input
          ref={inputRef}
          value={searhchterm}
          onChange={(e) => setSearchterm(e.target.value)}
          placeholder="Search history...."
          className=" w-full h-full pr-0 border-none focus:!ring-0"
        />
        <Select
          value={type}
          onValueChange={(type) => {
            setType(type as SearchType);
            if (inputRef.current)
              setTimeout(() => {
                if (inputRef.current) inputRef.current.focus();
              }, 100);
          }}
        >
          <SelectTrigger className=" w-fit gap-1 text-xs mr-1   border-none h-[80%] ">
            <SelectValue placeholder="Seach by" />
          </SelectTrigger>
          <SelectContent>
            {selectItems?.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button
        variant="outline"
        size="sm"
        className=" gap-1 text-xs  h-7"
        onClick={() => {
          setSortBy(sortBy === "asc" ? "desc" : "asc");
        }}
      >
        {" "}
        {sortBy === "desc" || !sortBy ? (
          <>
            <span>Desc</span>
            <ArrowDownNarrowWide className=" w-4 h-4" />
          </>
        ) : (
          <>
            <span>Asc</span> <ArrowUpWideNarrow className=" h-4 w-4" />
          </>
        )}{" "}
      </Button>
    </div>
  );
}

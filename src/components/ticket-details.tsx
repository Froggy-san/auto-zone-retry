import {
  Message,
  OptimisticAction,
  Ticket,
  TicketStatus as TicketStatusType,
  User,
} from "@lib/types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  useOptimistic,
} from "react";
import BackBtn from "./products/back-btn";
import { cn } from "@lib/utils";
import { Button } from "./ui/button";
import useTicketById from "@lib/queries/tickets/useTicketById";
import TicketTextField from "./ticket-text-field";
import { ArrowLeft, MailSearch } from "lucide-react";
import Spinner from "./Spinner";
import useMessages from "@lib/queries/tickets/useMessages";
import useCurrUser from "@lib/queries/useCurrUser";
import ErrorMessage from "./error-message";
import { format, formatDistance, formatDistanceToNow } from "date-fns";
import TicketStatus from "./ticket-status";
import useClientById from "@lib/queries/client/useClient";
import TicketMessage from "./ticket-message";
import { AnimatePresence } from "framer-motion";
import { Switch } from "./ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { editTicket } from "@lib/services/complaints";
import SuccessToastDescription, { ErorrToastDescription } from "./toast-items";
import { useToast } from "@hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

interface TicketDetailsProps {
  ticket?: Ticket;
  className?: string;
  ticketStatus: TicketStatusType[];
}

// Define the threshold for closing (e.g., if dragged down 80 pixels)
// Let's set the CLOSE_DRAG_THRESHOLD to a percentage of the travel distance (e.g., 50% of 90, which is 45)
const CLOSE_DRAG_THRESHOLD = 40; // 45% is half the travel distance
const OPEN_DRAG_THRESHOLD = 70;
const CLOSED_POSITION = 100;
const OPEN_POSITION = 0;

const TicketDetails = ({
  ticket,
  ticketStatus,
  className,
}: TicketDetailsProps) => {
  const [positionY, setPositionY] = useState(CLOSED_POSITION);
  const [isDragging, setIsDragging] = useState(false);
  const [messageId, setMessageId] = useState<number | null>(null);
  const [isInternalOnly, setIsInternalOnly] = useState(false);
  const [isMessagesOnly, setIsMessagesOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const queryClient = useQueryClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const params = new URLSearchParams(searchParams);
  const { toast } = useToast();

  const open = searchParams.get("ticket") || undefined;

  const [statusId, setStatusId] = useState<number | undefined>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);
  const startYRef = useRef(0);
  const positionYRef = useRef(CLOSED_POSITION);

  // Get the Ticket's details.
  const {
    ticket: ticketData,
    error,
    isLoading: ticketByIdLoading,
  } = useTicketById(open);
  const {
    messages,
    error: messagesError,
    isMessagesLoading,
  } = useMessages(open);

  let filteredMessages = messages;

  if (isInternalOnly)
    filteredMessages = messages?.filter(
      (messages) => messages.is_internal_note
    );
  if (isMessagesOnly)
    filteredMessages = messages?.filter(
      (messages) => !messages.is_internal_note
    );

  const [optimisticMessages, dispatchOptimistic] = useOptimistic(
    filteredMessages || [],
    (
      currentOptimisticMessages: Message[],
      action: OptimisticAction
    ): Message[] => {
      switch (action.type) {
        case "add":
          // Add the new message, marked as pending
          return [
            ...currentOptimisticMessages,
            { ...action.message, status: "pending" },
          ];

        case "fail":
          // Find the message by its temporary ID and mark it as failed
          return currentOptimisticMessages.map((msg) =>
            msg.id === action.tempId
              ? { ...msg, status: "failed", error: action.error }
              : msg
          );

        case "succeed":
          // Find the message by temp ID and replace it with the real message
          return currentOptimisticMessages.map((msg) =>
            msg.id === action.tempId ? action.realMessage : msg
          );

        case "remove":
          // Manually remove a failed message
          return currentOptimisticMessages.filter(
            (msg) => msg.id !== action.tempId
          );

        default:
          return currentOptimisticMessages;
      }
    }
  );
  const selectedMessage = messages?.find((message) => message.id === messageId);
  const ticketViewed = ticketData?.[0];

  // Get the currently logged in user.
  const { user, isLoading: userLoading, error: userError } = useCurrUser();

  const isAdmin = user?.user?.user_metadata.role.toLowerCase() === "admin";
  // Get the client that issued the ticket.
  const {
    clientById,
    isLoading: isClientLoading,
    error: clientError,
  } = useClientById({
    id: user?.user?.id || "",
    getBy: "user_id",
  });

  const loading =
    isLoading ||
    userLoading ||
    isMessagesLoading ||
    isClientLoading ||
    ticketByIdLoading;
  const isError =
    !!messagesError?.message.length ||
    !!error?.message.length ||
    !!clientError?.message.length;

  useEffect(() => {
    setStatusId(ticketData?.[0].ticketStatus_id.id);
  }, [ticketData]);

  useEffect(() => {
    if (open) {
      setPositionY(OPEN_POSITION);
    } else {
      setPositionY(CLOSED_POSITION);
    }
  }, [open]);
  const handleStatusChange = useCallback(
    async (ticketStatus_id: number) => {
      try {
        if (!ticketData)
          throw new Error("Something went wrong, refresh the page.");

        setIsLoading(true);
        await editTicket({ id: ticketData[0].id, ticketStatus_id });
        // const { error } = await editTicketAction({
        //   id: ticketData[0].id,
        //   ticketStatus_id,
        // });
        if (error) throw new Error(error.message);
        queryClient.invalidateQueries(["ticketById", String(ticketData[0].id)]);
        toast({
          className: "bg-primary  text-primary-foreground",
          title: `Done.`,
          description: (
            <SuccessToastDescription message="Ticket status has been updated" />
          ),
        });
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Something went wrong.",
          description: <ErorrToastDescription error={error.message} />,
        });
      } finally {
        setIsLoading(false);
      }
    },
    [statusId, ticketData]
  );

  // 1. handleMouseMove: Uses functional update for smooth dragging (Dependency array is empty)
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!startYRef.current) return;

    const deltaY = e.clientY - startYRef.current;

    setPositionY((prevY) => {
      const newPosition = prevY + (deltaY / window.innerHeight) * 100;
      const clampedPosition = Math.max(
        OPEN_POSITION,
        Math.min(CLOSED_POSITION, newPosition)
      );

      // 💡 Update the ref here so handleMouseUp gets the latest value
      positionYRef.current = clampedPosition;

      return clampedPosition;
    });

    startYRef.current = e.clientY;
  }, []); // Dependency array remains empty
  // 2. handleMouseUp: Handles the snap decision and cleanup
  // Note: We MUST read the final positionY here to make the snap decision.
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);

    // Cleanup: Remove the global listeners
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);

    // 💡 FIX: Read the final position from the Ref instead of the stale state value
    const finalPositionY = positionYRef.current;

    // Re-evaluate the snap decision using the actual final position
    if (finalPositionY > CLOSE_DRAG_THRESHOLD) {
      // It was dragged past the threshold, snap closed.

      setPositionY(CLOSED_POSITION);

      // Ensure you have access to params, router, and pathname for this part to work
      // Note: I'm assuming you have access to these from the outer scope,
      // as they are not defined in the provided snippet.
      // If not, you may need to pass them or define them inside the component scope.
      setTimeout(() => {
        params.delete("ticket");
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
      }, 500);
    } else {
      // It was NOT dragged past the threshold, snap open.
      setPositionY(OPEN_POSITION);
    }

    startYRef.current = 0;
  }, [handleMouseMove, router, pathname, params]); // 💡 positionY is removed from dependencies!// positionY is required here for the final snap check.

  // 3. handleMouseDown: Starts the drag and attaches global listeners
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    startYRef.current = e.clientY;

    // Attach listeners to the global window
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    e.preventDefault();
  };

  const openDrawer = () => setPositionY(OPEN_POSITION);
  console.log(optimisticMessages, "MESSAGES");
  return (
    <div
      ref={containerRef}
      className={cn(
        "w-full h-full overflow-y-auto pb-32 fixed left-0 top-0 transition-all ease-out duration-700 bg-background border overflow-x-hidden   z-50",
        className
      )}
      style={{
        transform: `translateY(${positionY}%)`,
        // Disable transition during drag for smooth tracking
        transition: isDragging ? "none" : undefined,
      }}
    >
      <div
        className={cn(
          "h-10 w-full flex justify-center items-center cursor-grab ",
          isDragging ? "cursor-grabbing" : "cursor-grab"
        )}
        onMouseDown={handleMouseDown}
        onDragStart={(e) => e.preventDefault()}
      >
        <div className="w-10 h-1 bg-gray-300 rounded-full" />
      </div>

      <Button
        variant="secondary"
        size="sm"
        onClick={(e) => {
          setPositionY(CLOSED_POSITION);
          setTimeout(() => {
            router.back();
          }, 700);
        }}
        className={cn(" ml-4 group")}
      >
        <ArrowLeft className=" icon  w-4 h-4  sm:w-6 sm:h-6  group-hover:-translate-x-1 transition-all" />
      </Button>

      {/* {open && isLoading && <Spinner size={30} />} */}
      {open && loading ? (
        <Spinner size={30} />
      ) : isError ? (
        <>
          {error && (
            <p className=" text-lg text-muted-foreground w-full text-center">
              {error.message}
            </p>
          )}
          {messagesError && (
            <ErrorMessage>
              {" "}
              <p className=" text-center">{messagesError.message}</p>
            </ErrorMessage>
          )}

          {clientError && (
            <ErrorMessage>
              {" "}
              <p className=" text-center">{clientError.message}</p>
            </ErrorMessage>
          )}
        </>
      ) : !clientById || !clientById.length ? (
        <ErrorMessage>
          Something went wrong while getting the client&apos;s data.
        </ErrorMessage>
      ) : (
        <>
          <div className="p-4">
            <h2 className="text-xl font-bold">Ticket Details</h2>
          </div>

          <section className=" flex flex-col sm:flex-row   max-w-[1000px] mx-auto gap-10 mt-14 px-4   md:px-20  ">
            <div>
              <div className=" sm:sticky top-5">
                <div className=" space-y-6 mb-20 text-sm">
                  <div className=" space-y-2">
                    <p className=" text-muted-foreground ">TICKET ID</p>
                    <p className=" font-semibold">#{ticketData?.[0]?.id}</p>
                  </div>

                  <div className=" space-y-2">
                    <p className=" text-muted-foreground">CREATED AT</p>
                    <p className="  font-semibold">
                      {" "}
                      {ticketData?.[0] &&
                        format(
                          ticketData?.[0].created_at,
                          "MMMM d, yyyy h:mm aa"
                        )}
                    </p>
                  </div>

                  <div className=" space-y-2">
                    <p className=" text-muted-foreground text-nowrap">
                      LAST ACTIVITY
                    </p>
                    <p className="  font-semibold">
                      {" "}
                      {ticketData?.[0] &&
                        formatDistanceToNow(ticketData[0].updated_at) + ` ago`}
                    </p>
                  </div>

                  <div className=" space-y-2">
                    <p className=" text-muted-foreground">STATUS</p>
                    <p className=" ">
                      {ticketData?.[0] && (
                        <TicketStatus
                          ticketStatus={ticketData?.[0].ticketStatus_id}
                        />
                      )}
                    </p>
                  </div>
                </div>
                {isAdmin && (
                  <div className=" p-3  space-y-6 rounded-xl bg-accent/30 ">
                    <div className=" flex  gap-2">
                      <Switch
                        id="is-internal-only"
                        checked={isInternalOnly}
                        onCheckedChange={(value) => {
                          setIsInternalOnly(value);
                          setIsMessagesOnly(false);
                        }}
                      />{" "}
                      <label
                        htmlFor="is-internal-only"
                        className=" text-xs text-muted-foreground "
                      >
                        Internal messages only
                      </label>
                    </div>
                    <div className=" flex  gap-2">
                      <Switch
                        id="is-visible-only"
                        checked={isMessagesOnly}
                        onCheckedChange={(value) => {
                          setIsMessagesOnly(value);
                          setIsInternalOnly(false);
                        }}
                      />{" "}
                      <label
                        htmlFor="is-visible-only"
                        className=" text-xs text-muted-foreground "
                      >
                        Visible messages only
                      </label>
                    </div>

                    <Select
                      // key={statusId}
                      disabled={isLoading}
                      value={String(statusId) || undefined}
                      onValueChange={async (value) => {
                        setStatusId(Number(value));
                        await handleStatusChange(Number(value));
                      }}
                    >
                      <SelectTrigger className="w-full  h-fit gap-2">
                        <SelectValue placeholder="Ticket Status" />
                      </SelectTrigger>
                      <SelectContent>
                        {ticketStatus.length ? (
                          ticketStatus.map((status) => (
                            <SelectItem key={status.id} value={`${status.id}`}>
                              <TicketStatus
                                ticketStatus={status}
                                className=" text-wrap"
                              />
                            </SelectItem>
                          ))
                        ) : (
                          <p className=" text-muted-foreground text-center w-full">
                            No ticket status
                          </p>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </div>
            <div className=" w-full  ">
              <div className=" pb-5 border-b">
                <h2 className=" text-xl font-semibold mb-4">
                  {ticketData?.[0].subject}
                </h2>
                <p className=" text-sm"> {ticketData?.[0].description}</p>
              </div>
              {optimisticMessages && (
                <Messages
                  messages={optimisticMessages}
                  currentUser={user?.user}
                  isDragging={isDragging}
                />
              )}
              {/* <div className="  h-44  flex items-center justify-center border border-dashed rounded-xl">
             
                <div className=" flex items-center gap-2 flex-col text-muted-foreground">
                  <MailSearch className=" w-6 h-6 sm:w-10 sm:h-10" />
                  <span>No Messages found</span>
                </div>
              </div> */}

              {/* !// Make it so when there is no ticket the filed it self is disabled instead of just having it disappear completely. */}

              <TicketTextField
                key={open}
                open={open}
                dispatchOptimistic={dispatchOptimistic}
                containerRef={containerRef}
                currentUser={user?.user}
                clientById={clientById[0]}
                ticket={ticketData?.[0]}
                messageToEdit={selectedMessage}
                className={
                  !ticketViewed ||
                  ticketViewed.ticketStatus_id.name.toLowerCase() === "close"
                    ? "opacity-75 pointer-events-none"
                    : ""
                }
              />
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default TicketDetails;

function Messages({
  messages,
  currentUser,
  isDragging,
}: {
  messages: Message[];
  currentUser?: User | null;
  isDragging?: boolean;
}) {
  return (
    <div className=" mb-6">
      <AnimatePresence>
        {messages.map((message) => (
          <TicketMessage
            key={message.id}
            isDragging={isDragging}
            message={message}
            currentUser={currentUser}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
// ! OLD CODE

// import { Ticket } from "@lib/types";
// import { usePathname, useRouter, useSearchParams } from "next/navigation";

// import React, { useState, useRef, useCallback } from "react";
// import BackBtn from "./products/back-btn";
// import { cn } from "@lib/utils";
// import { Button } from "./ui/button";

// interface TicketDetailsProps { // Renamed from TicketDetails to avoid conflict with the component name
//   Ticket?: Ticket;
//   className?: string;
// }

// Define the threshold for closing (e.g., if dragged down 50 pixels)
// const CLOSE_DRAG_THRESHOLD = 80;
// // Define the fully closed position (which is 100% off-screen or similar)
// const CLOSED_POSITION = 90;
// // Define the fully open position
// const OPEN_POSITION = 0;

// const TicketDetails = ({ Ticket, className }: TicketDetailsProps) => {
//   const [positionY, setPositionY] = useState(CLOSED_POSITION); // Start closed
//   const [isDragging, setIsDragging] = useState(false);
//   const startYRef = useRef(0); // Use a ref to store the start Y position across renders

//   const router = useRouter();
//   // ... other unused hooks (pathname, searchParams, path) ...

//   const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
//     setIsDragging(true);
//     startYRef.current = e.clientY; // Store the initial Y position of the cursor/touch
//     e.currentTarget.style.transition = 'none'; // Disable transition during drag for smooth movement
//   }, []);

//   const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
//     if (!isDragging) return;

//     // Calculate the difference in Y position from the start
//     const deltaY = e.clientY - startYRef.current;

//     // Calculate the new percentage position
//     // deltaY is in pixels, we need to convert it to a percentage change for positionY
//     // A simple approximation: positionY + (deltaY / window.innerHeight * 100)
//     // A better approach is to directly set positionY based on the new cursor Y position relative to the screen,
//     // but for simple drawer movement, let's use the delta and the component's height.

//     // A simpler and more direct approach: just translate by the delta Y in pixels,
//     // but since the component uses transform: translateY(${positionY}%), we'll stick to percentage logic.

//     // For a smooth drag, let's update the percentage directly:
//     const newPosition = positionY + (deltaY / window.innerHeight) * 100;

//     // Keep the drawer's top position between the OPEN_POSITION and CLOSED_POSITION
//     // We only want to drag **down** from the open position (0%)
//     if (newPosition >= OPEN_POSITION && newPosition <= CLOSED_POSITION) {
//         setPositionY(newPosition);
//     }

//     // Update the starting Y position for the *next* move event
//     startYRef.current = e.clientY;
//   }, [isDragging, positionY]);

//   const handleMouseUp = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
//     if (!isDragging) return;
//     setIsDragging(false);
//     e.currentTarget.style.transition = ''; // Re-enable transition for the snap back/close

//     // Check if the drawer was dragged past the close threshold
//     if (positionY > CLOSE_DRAG_THRESHOLD) {
//       // Close the drawer if dragged far enough
//       setPositionY(CLOSED_POSITION);
//     } else {
//       // Snap back to the open position
//       setPositionY(OPEN_POSITION);
//     }
//   }, [isDragging, positionY]);

//   // A helper function to open the drawer
//   const openDrawer = () => setPositionY(OPEN_POSITION);

//   return (
//     <div
//       onMouseDown={handleMouseDown}
//       onMouseMove={handleMouseMove}
//       onMouseUp={handleMouseUp}
//       onMouseLeave={handleMouseUp} // Also handle mouse leaving the element while dragging
//       className={cn(
//         "w-full h-full fixed left-0 top-0 transition-all ease-out bg-background border-4 z-50",
//         className,
//         // Optional: Add a class to change the cursor when dragging is possible
//         isDragging ? 'cursor-grabbing' : 'cursor-grab'
//       )}
//       // Apply the current position state
//       style={{ transform: `translateY(${positionY}%)` }}
//     >
//       <div
//         // A draggable handle area at the top makes for a better UX
//         className="h-10 w-full flex justify-center items-center cursor-grab"
//         // Ensure dragging only affects the position and not selection
//         onDragStart={(e) => e.preventDefault()}
//       >
//         <div className="w-10 h-1 bg-gray-300 rounded-full" />
//       </div>

//       <BackBtn />
//       <Button onClick={openDrawer}> Open Drawer</Button>

//       {/* Drawer Content Goes Here */}
//       <div className="p-4">
//           <h2 className="text-xl font-bold">Ticket Details</h2>
//           <p>Ticket ID: {Ticket?.id}</p>
//           {/* ... more ticket details ... */}
//       </div>
//     </div>
//   );
// };

// export default TicketDetails;

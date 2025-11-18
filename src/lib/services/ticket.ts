import { SUPABASE_URL } from "@lib/constants";
import {
  Attachment,
  CreateAttachment,
  FileWithPreview,
  Message,
  MessageSchema,
  Ticket,
} from "@lib/types";
import { PostgrestError } from "@supabase/supabase-js";
import supabase from "@utils/supabase";
import { z } from "zod";
import { deleteImageFromBucket } from "./helper-services";

interface GetTicketByIdProps {
  id: string;
}

export async function getTicketById(
  id: string
): Promise<{ ticket: Ticket[] | null; error: PostgrestError | null }> {
  const { data: ticket, error } = await supabase
    .from("tickets")
    .select(
      "*,ticketStatus_id(*),ticketPriority_id(*),ticketCategory_id(*),client_id(*)"
    )
    .eq("id", id);

  return { ticket, error };
}
export async function getMessages(
  id: string
): Promise<{ messages: Message[] | null; error: PostgrestError | null }> {
  const { data: messages, error } = await supabase
    .from("messages")
    .select("*,attachments(*),client:client_id(*)")
    .eq("ticket_id", id)
    .order("created_at", { ascending: true });

  return { messages, error };
}

type BucketPromiseType = Promise<
  | {
      data: {
        id: string;
        path: string;
        fullPath: string;
      };
      error: null;
    }
  | {
      data: null;
      error: {
        message: string;
        statusCode?: number | null;
        error?: string | null;
        details?: any | null;
      };
    }
>;

interface Create {
  data: z.infer<typeof MessageSchema>;
  files: FileWithPreview[];
}
export async function createMessage({
  data,
  files,
}: Create): Promise<Message | null> {
  // throw new Error(`Testing failed creation`);
  const { data: message, error } = await supabase
    .from("messages")
    .insert([data])
    .select();

  if (error) throw new Error(error.message);

  if (!message)
    throw new Error("Something went wrong while creating a message");

  const senderId = message[0].senderId;
  const message_id = message[0].id;
  const ticket_id = data.ticket_id;
  const client_id = data.client_id;

  let attachments: Attachment[] = [];

  // https://umkyoinqpknmedkowqva.supabase.co/storage/v1/object/public/attachments/G4OrcuxWsAA8iDj.jpeg
  if (files.length) {
    const bucketPromises: BucketPromiseType[] = [];
    const attachmentsData: Omit<CreateAttachment, "file">[] = [];

    // 1. Extract the data needed from teh attachments data.
    files.forEach((file) => {
      const file_name = file.name;
      const file_type = file.type;

      // Make sure that no file has the same name in the bucket.
      const nameInBucket = `${crypto.randomUUID()}-${file.name}`.replace(
        /\//g,
        ""
      );
      const file_url = `${SUPABASE_URL}/storage/v1/object/public/attachments/${nameInBucket}`;

      // Push all the file data for the attachment bucket.
      bucketPromises.push(
        supabase.storage.from("attachments").upload(nameInBucket, file, {
          cacheControl: "3600",
          upsert: false, // Prevent overwriting if UUID collision somehow happens
        })
      );

      // Push the data needed for the attachments table.
      attachmentsData.push({
        ticket_id,
        message_id,
        file_url,
        file_name,
        file_type,
        client_id,
        uploaded_by: senderId,
      });
    });

    // 2. Upload all files to the bucket.
    console.log("BEFORE  result");
    const results = await Promise.allSettled(bucketPromises);
    console.log("After results");
    // 3.  Make sure that there were no errors while uploading the files to the backend.
    results.forEach((result, index) => {
      if (result.status === "rejected") {
        console.error(`File upload at index ${index} failed:`, result.reason);
      } else {
        // result.status is 'fulfilled'
        console.log(
          `File at index ${index} uploaded successfully:`,
          result.value.data
        );
      }
    });

    // 4. Upload all attachment data for each file to attachment Table.
    const { data: returnedAttchments, error: attachmentsError } = await supabase
      .from("attachments")
      .insert(attachmentsData)
      .select();

    // 5. If an error occurred while uploading the attachment data throw an error.
    if (attachmentsError) throw new Error(attachmentsError.message);
    attachments = returnedAttchments;
  }

  return { ...message[0], attachments };
}

interface Edit {
  id: number;
  ticket_id?: number;
  senderId?: string;
  senderType?: string;
  client_id?: number;
  content?: string;
  is_internal_note?: boolean;
}
export async function editMessages(data: Edit) {
  const { error } = await supabase
    .from("messages")
    .update({ ...data })
    .eq("id", data.id);

  if (error) throw new Error(error.message);
}

export async function deleteMessage(message: Message) {
  if (message.attachments.length) {
    const imagePaths: string[] = [];
    const attachmentIds: number[] = [];
    message.attachments.forEach((attachment) => {
      imagePaths.push(attachment.file_url);
      attachmentIds.push(attachment.id);
    });

    const { error: bucketError } = await deleteImageFromBucket({
      imagePaths,
      bucketName: "attachments",
    });

    if (bucketError) throw new Error(bucketError.message);

    const { error } = await supabase
      .from("attachments")
      .delete()
      .in("id", attachmentIds);

    if (error) {
      console.log(error.message);
      throw new Error(error.message);
    }
  }

  const { error } = await supabase
    .from("messages")
    .delete()
    .eq("id", message.id);

  if (error) {
    console.log(error.message);
    throw new Error(error.message);
  }
}

export async function deleteAttachment(attachment: Attachment) {
  const { error: bucketError } = await deleteImageFromBucket({
    bucketName: "attachments",
    imagePaths: [attachment.file_url],
  });
  if (bucketError) throw new Error(bucketError.message);

  const { error } = await supabase
    .from("attachments")
    .delete()
    .eq("id", attachment.id);

  if (error) throw new Error(error.message);
}

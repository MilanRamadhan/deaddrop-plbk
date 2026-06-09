import Message from "@/models/Message";
import { connectDB } from "@/lib/db/mongodb";

export async function createMessage(data: Record<string, unknown>) {
  await connectDB();

  return Message.create(data);
}

export async function getMessages() {
  await connectDB();

  return Message.find()
    .sort({
      createdAt: -1,
    })
    .lean();
}

export async function getMessageById(id: string) {
  await connectDB();

  return Message.findById(id);
}

export async function deleteMessage(id: string) {
  await connectDB();

  return Message.findByIdAndDelete(id);
}

export async function updateMessageStatus(id: string, status: string) {
  await connectDB();

  return Message.findByIdAndUpdate(
    id,
    {
      status,
    },
    {
      new: true,
    },
  );
}

export async function destroyMessage(id: string) {
  await connectDB();

  return Message.findByIdAndUpdate(
    id,
    {
      status: "destroyed",
      cipherText: null,
      iv: null,
      salt: null,
      destroyedAt: new Date(),
    },
    {
      new: true,
    },
  );
}

import { api } from "../client";

export type TicketType = "order" | "product" | "payment" | "design" | "other";

export interface CreateTicketPayload {
  fullname: string;
  phone: string;
  ticket_type: TicketType;
  subject: string;
  message: string;
}

export const ticketsApi = {
  create: (payload: CreateTicketPayload) =>
    api.post("/tickets/", payload, { auth: true }),
};

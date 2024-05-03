import { Document, Model, Schema, model } from "mongoose";
import { Order } from "./order.model";
import { OrderStatus } from "@mohammadyahyaq-learning/common";

// interface that represents that type of Ticket.build() parameter
interface TicketAttrs {
  title: string;
  price: number;
}

// interface that represents the Ticket model where we will add all the statics methods
interface TicketModel extends Model<TicketDoc> {
  build: (attrs: TicketAttrs) => TicketDoc;
}

// interface that represents the Ticket document (after the Ticket created)
export interface TicketDoc extends Document {
  title: string;
  price: number;
  isReserved(): Promise<boolean>;
}

const ticketSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket(attrs);
};
// we need to use function keyword to use this keyword
ticketSchema.methods.isReserved = async function () {
  const existingOrder = await Order.findOne({
    ticket: this,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete,
      ],
    },
  });

  return Boolean(existingOrder);
};

const Ticket = model<TicketDoc, TicketModel>("Ticket", ticketSchema);

export { Ticket };

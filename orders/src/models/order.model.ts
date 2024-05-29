import { OrderStatus } from "@mohammadyahyaq-learning/common";
import { Document, Model, Schema, model } from "mongoose";
import { TicketDoc } from "./ticket.model";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

// interface that represents that type of Ticket.build() parameter
interface OrderAttrs {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc;
}

// interface that represents the Ticket model where we will add all the statics methods
interface OrderModel extends Model<OrderDoc> {
  build: (attrs: OrderAttrs) => OrderDoc;
}

// interface that represents the Ticket document (after the Ticket created)
interface OrderDoc extends Document {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc;
  version: number;
  createdAt: string;
  updatedAt: string;
}

const orderSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
    },
    expiresAt: {
      type: Schema.Types.Date,
    },
    ticket: {
      type: Schema.Types.ObjectId,
      ref: "Ticket",
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

orderSchema.set("versionKey", "version");
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order(attrs);
};

const Order = model<OrderDoc, OrderModel>("Order", orderSchema);

export { Order };

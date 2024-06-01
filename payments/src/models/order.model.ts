import { OrderStatus } from "@mohammadyahyaq-learning/common";
import { Document, Model, Schema, model } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

// interface that represents that type of Ticket.build() parameter
interface OrderAttrs {
  id: string;
  status: OrderStatus;
  userId: string;
  price: number;
  version: number;
}

// interface that represents the Ticket model where we will add all the statics methods
interface OrderModel extends Model<OrderDoc> {
  build: (attrs: OrderAttrs) => OrderDoc;
}

// interface that represents the Ticket document (after the Ticket created)
interface OrderDoc extends Document {
  status: OrderStatus;
  userId: string;
  price: number;
  version: number;
}

const orderSchema = new Schema(
  {
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
    },
    userId: {
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

orderSchema.set("versionKey", "version");
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order(attrs);
};

const Order = model<OrderDoc, OrderModel>("Order", orderSchema);

export { Order };

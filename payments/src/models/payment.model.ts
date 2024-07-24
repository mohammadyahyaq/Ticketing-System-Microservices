import { Document, model, Model, Schema } from "mongoose";

// interface that represents that type of Ticket.build() parameter
interface PaymentAttrs {
  orderId: string;
  stripeId: string;
}

// interface that represents the Ticket model where we will add all the statics methods
interface PaymentModel extends Model<PaymentDoc> {
  build: (attrs: PaymentAttrs) => PaymentDoc;
}

// interface that represents the Ticket document (after the Ticket created)
interface PaymentDoc extends Document {
  orderId: string;
  stripeId: string;
  createdAt: string;
  updatedAt: string;
}

const paymentSchema = new Schema(
  {
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    stripeId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

paymentSchema.statics.build = (attrs: PaymentAttrs) => {
  return new Payment(attrs);
};

const Payment = model<PaymentDoc, PaymentModel>("Payment", paymentSchema);

export { Payment };

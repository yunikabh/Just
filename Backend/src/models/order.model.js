import mongoose from "mongoose";



const purchaseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // Reference to the user who made the purchase
    },
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true, // Reference to the purchased book
    },
    // bookName: {
    //   type: mongoose.Schema.Types.bookName,
    //  ref:"Book",
    //   required: true,
    // },
    quantity: {
      type: Number,
      required: true,
      default: 1, // Quantity of books purchased
    },
    totalPrice: {
      type: Number,
      required: true, // Total price for the purchase
    },
    paymentMethod: {
      type: String,
      enum: ["Credit Card", "PayPal", "Cash on Delivery"],
      required: true, // Payment method used
    },
    paymentStatus: {
      type: String,
      enum: ["Paid", "Pending", "Failed"],
      default: "Pending", // Status of the payment
    },
    shippingAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
    },
    purchaseDate: {
      type: Date,
      default: Date.now, // Date and time of the purchase
    },
    deliveryStatus: {
      type: String,
      enum: ["Pending", "Shipped", "Out for Delivery", "Delivered", "Cancelled"],
      default: "Pending", // Current status of delivery
    },
    notes: {
      type: String,
      default: "", // Additional notes or instructions from the buyer
    },
  },
  { timestamps: true }
);

const Purchase = mongoose.model("Purchase", purchaseSchema);

export default Purchase;

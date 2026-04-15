import mongoose from "mongoose";



const checkoutSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    },
    contents: {
        type: [{
            book: {type: mongoose.Schema.Types.ObjectId, 
                ref: 'Book'
            },
            quantity: { type: Number,
                default: 1,
                min: 1
            },
            price: {
                type: Number,
                required: true
            }
    }],
        required: true,
        default: []
    },
    address: {
        type: String,
        
    },
    paymentMethod: {
        type: String,
    }
}, {timestamps: true});


checkoutSchema.virtual("subtotal").get(function () {
  const subtotal = this.contents.reduce((total, item) => {
    return total + item.quantity * item.price;
  }, 0);

  return Number(subtotal.toFixed(2));
});

checkoutSchema.virtual("taxAmount").get(function () {
  const tax = this.subtotal * 0.13;
  return Number(tax.toFixed(2));
});

checkoutSchema.virtual("totalPrice").get(function () {
  const total = this.subtotal + this.taxAmount;
  return Number(total.toFixed(2));
});

checkoutSchema.set("toJSON", { virtuals: true });
checkoutSchema.set("toObject", { virtuals: true });


export const Checkout = mongoose.model("Checkout", checkoutSchema);
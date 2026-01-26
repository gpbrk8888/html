```javascript
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true,
        unique: true,
        default: () => `ORD${Date.now()}${Math.floor(Math.random() * 1000)}`
    },
    customerName: {
        type: String,
        required: true,
        trim: true
    },
    phoneNumber: {
        type: String,
        required: true,
        match: [/^[0-9]{9,10}$/, 'कृपया सही फोन नम्बर दिनुहोस्']
    },
    email: {
        type: String,
        lowercase: true,
        trim: true
    },
    province: {
        type: String,
        required: true
    },
    district: {
        type: String,
        required: true
    },
    municipality: {
        type: String,
        required: true
    },
    wardNumber: {
        type: Number,
        min: 1,
        max: 35
    },
    streetAddress: {
        type: String
    },
    products: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        },
        nepaliName: String,
        englishName: String,
        type: {
            type: String,
            enum: ['fresh', 'dried', 'powder', 'beans', 'ground', 'juice', 'other']
        },
        quantity: {
            type: Number,
            required: true,
            min: 0.1
        },
        unit: {
            type: String,
            default: 'kg'
        },
        price: {
            type: Number,
            required: true,
            min: 0
        },
        subtotal: {
            type: Number,
            required: true
        }
    }],
    subtotal: {
        type: Number,
        required: true,
        min: 0
    },
    deliveryCharge: {
        type: Number,
        default: 0
    },
    discount: {
        type: Number,
        default: 0
    },
    tax: {
        type: Number,
        default: 0
    },
    totalAmount: {
        type: Number,
        required: true,
        min: 0
    },
    deliveryMethod: {
        type: String,
        enum: ['pickup', 'delivery'],
        required: true
    },
    pickupPoint: {
        name: String,
        address: String,
        timing: String
    },
    deliveryDate: {
        type: Date
    },
    deliveryTime: {
        type: String,
        enum: ['morning', 'afternoon', 'evening']
    },
    paymentMethod: {
        type: String,
        enum: ['cash_on_delivery', 'esewa', 'khalti', 'bank_transfer'],
        default: 'cash_on_delivery'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'refunded'],
        default: 'pending'
    },
    orderStatus: {
        type: String,
        enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    notes: {
        type: String,
        maxlength: 500
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update timestamp on save
orderSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Calculate total before saving
orderSchema.pre('save', function(next) {
    // Calculate subtotal from products
    this.subtotal = this.products.reduce((sum, product) => {
        return sum + product.subtotal;
    }, 0);
    
    // Calculate total amount
    this.totalAmount = this.subtotal + this.deliveryCharge + this.tax - this.discount;
    
    next();
});

// Generate nepali price string
orderSchema.virtual('nepaliPrice').get(function() {
    return `रु ${this.totalAmount.toLocaleString('ne-NP')}`;
});

// Method to get order summary
orderSchema.methods.getSummary = function() {
    return {
        orderId: this.orderId,
        customerName: this.customerName,
        totalItems: this.products.length,
        totalAmount: this.totalAmount,
        nepaliAmount: this.nepaliPrice,
        status: this.orderStatus,
        deliveryMethod: this.deliveryMethod
    };
};

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
```

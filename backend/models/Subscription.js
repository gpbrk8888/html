```javascript
const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
    subscriptionId: {
        type: String,
        required: true,
        unique: true,
        default: () => `SUB${Date.now().toString().slice(-8)}`
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    plan: {
        type: String,
        enum: ['weekly', 'biweekly', 'monthly'],
        required: true
    },
    boxType: {
        type: String,
        enum: ['small', 'medium', 'large', 'premium'],
        required: true
    },
    boxContents: {
        vegetables: {
            type: [String],
            default: ['seasonal']
        },
        fruits: {
            type: [String],
            default: []
        },
        spices: {
            type: [String],
            default: []
        },
        // Allow customer preferences
        preferences: {
            exclude: [String],
            favorites: [String],
            allergies: [String]
        }
    },
    deliveryAddress: {
        province: String,
        district: String,
        municipality: String,
        wardNumber: Number,
        streetAddress: String,
        landmark: String
    },
    deliverySchedule: {
        frequency: {
            type: String,
            enum: ['weekly', 'fortnightly', 'monthly'],
            default: 'weekly'
        },
        deliveryDay: {
            type: String,
            enum: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
            default: 'saturday'
        },
        deliveryTime: {
            type: String,
            enum: ['morning', 'afternoon', 'evening'],
            default: 'morning'
        },
        startDate: {
            type: Date,
            required: true
        },
        endDate: Date,
        pauseUntil: Date
    },
    pricing: {
        basePrice: {
            type: Number,
            required: true
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
        totalPrice: {
            type: Number,
            required: true
        },
        billingCycle: {
            type: String,
            enum: ['weekly', 'monthly', 'quarterly'],
            default: 'monthly'
        }
    },
    payment: {
        method: {
            type: String,
            enum: ['esewa', 'khalti', 'bank_transfer', 'cash_on_delivery'],
            default: 'cash_on_delivery'
        },
        status: {
            type: String,
            enum: ['pending', 'paid', 'failed', 'refunded'],
            default: 'pending'
        },
        lastPaymentDate: Date,
        nextPaymentDate: Date
    },
    status: {
        type: String,
        enum: ['active', 'paused', 'cancelled', 'completed'],
        default: 'active'
    },
    deliveries: [{
        deliveryId: String,
        date: Date,
        contents: [{
            item: String,
            quantity: Number,
            unit: String
        }],
        status: {
            type: String,
            enum: ['scheduled', 'packed', 'out_for_delivery', 'delivered', 'missed'],
            default: 'scheduled'
        },
        deliveredAt: Date,
        receivedBy: String,
        notes: String
    }],
    upcomingDelivery: {
        date: Date,
        estimatedContents: [String],
        status: {
            type: String,
            enum: ['preparing', 'ready', 'scheduled'],
            default: 'scheduled'
        }
    },
    preferences: {
        recipeIncluded: {
            type: Boolean,
            default: true
        },
        storageTips: {
            type: Boolean,
            default: true
        },
        newsletter: {
            type: Boolean,
            default: true
        }
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

// Update timestamp
subscriptionSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    
    // Calculate next delivery date
    if (this.isNew) {
        this.calculateNextDelivery();
    }
    
    next();
});

// Calculate next delivery date
subscriptionSchema.methods.calculateNextDelivery = function() {
    const startDate = this.deliverySchedule.startDate;
    const deliveryDay = this.deliverySchedule.deliveryDay;
    
    if (!startDate || !deliveryDay) return;
    
    const dayMap = {
        'sunday': 0, 'monday': 1, 'tuesday': 2, 'wednesday': 3,
        'thursday': 4, 'friday': 5, 'saturday': 6
    };
    
    const targetDay = dayMap[deliveryDay];
    const today = new Date();
    let nextDate = new Date(startDate);
    
    // Find next occurrence of the delivery day
    while (nextDate < today || nextDate.getDay() !== targetDay) {
        nextDate.setDate(nextDate.getDate() + 1);
    }
    
    // Adjust for frequency
    if (this.deliverySchedule.frequency === 'fortnightly') {
        nextDate.setDate(nextDate.getDate() + 14);
    } else if (this.deliverySchedule.frequency === 'monthly') {
        nextDate.setMonth(nextDate.getMonth() + 1);
    }
    
    this.upcomingDelivery = {
        date: nextDate,
        estimatedContents: this.boxContents.vegetables,
        status: 'scheduled'
    };
};

// Generate seasonal box contents
subscriptionSchema.methods.generateSeasonalContents = function() {
    const month = new Date().getMonth();
    const seasonalVeggies = {
        0: ['पालुङ्गो', 'मुला', 'गाजर'], // January
        1: ['मेथी', 'तोरी', 'फूलकोबी'],  // February
        2: ['टमाटर', 'ककडी', 'बोडी'],    // March
        3: ['भिन्डी', 'लौका', 'केराउ'],   // April
        4: ['गोलभेडा', 'करेला', 'प्याज'], // May
        5: ['अकबरे', 'बन्दा', 'मटर'],     // June
        6: ['साग', 'चोया', 'मुला'],       // July
        7: ['पालुङ्गो', 'तोरी', 'गाजर'],  // August
        8: ['टमाटर', 'ककडी', 'भिन्डी'],   // September
        9: ['आलु', 'रडिस', 'फूलकोबी'],    // October
        10: ['मेथी', 'प्याज', 'लसुन'],    // November
        11: ['पालुङ्गो', 'मुला', 'गाजर']  // December
    };
    
    return seasonalVeggies[month] || ['seasonal vegetables'];
};

// Check if subscription is active
subscriptionSchema.methods.isActive = function() {
    return this.status === 'active' && 
           (!this.deliverySchedule.endDate || new Date() <= this.deliverySchedule.endDate);
};

// Virtual for nepali price display
subscriptionSchema.virtual('nepaliPrice').get(function() {
    return `रु ${this.pricing.totalPrice.toLocaleString('ne-NP')}`;
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

module.exports = Subscription;
```
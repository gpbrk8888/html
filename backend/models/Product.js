```javascript
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productCode: {
        type: String,
        required: true,
        unique: true
    },
    nepaliName: {
        type: String,
        required: true,
        trim: true
    },
    englishName: {
        type: String,
        required: true,
        trim: true
    },
    scientificName: {
        type: String
    },
    category: {
        type: String,
        enum: ['spices', 'coffee', 'fruits', 'vegetables', 'herbs', 'other'],
        required: true
    },
    subcategory: {
        type: String
    },
    description: {
        nepali: String,
        english: String
    },
    origin: {
        regions: [String],
        altitude: {
            min: Number,
            max: Number,
            unit: {
                type: String,
                default: 'meters'
            }
        }
    },
    season: {
        nepaliMonths: [String],
        englishMonths: [String],
        peakSeason: [String]
    },
    varieties: [{
        name: String,
        nepaliName: String,
        characteristics: String,
        pricePerKg: Number
    }],
    forms: [{
        type: {
            type: String,
            enum: ['fresh', 'dried', 'powder', 'whole', 'ground', 'juice', 'preserved']
        },
        nepaliName: String,
        pricePerKg: Number,
        pricePerUnit: Number,
        unit: {
            type: String,
            default: 'kg'
        },
        minOrder: {
            type: Number,
            default: 0.1
        },
        maxOrder: Number,
        shelfLife: String,
        storageInstructions: String
    }],
    nutritionalInfo: {
        calories: Number,
        protein: Number,
        carbs: Number,
        fiber: Number,
        vitamins: [String],
        minerals: [String]
    },
    healthBenefits: {
        nepali: [String],
        english: [String]
    },
    traditionalUses: [String],
    recipes: [{
        name: String,
        ingredients: [String],
        instructions: String,
        cookingTime: String
    }],
    farmingPractices: {
        organic: {
            type: Boolean,
            default: false
        },
        certification: String,
        sustainable: Boolean,
        waterConservation: Boolean
    },
    images: [{
        url: String,
        caption: String,
        type: {
            type: String,
            enum: ['fresh', 'dried', 'plantation', 'product', 'package']
        }
    }],
    stock: {
        available: {
            type: Boolean,
            default: true
        },
        quantity: Number,
        unit: {
            type: String,
            default: 'kg'
        },
        lastUpdated: Date
    },
    pricing: {
        basePrice: Number,
        seasonalPrices: [{
            month: String,
            multiplier: Number,
            price: Number
        }],
        bulkDiscounts: [{
            minQuantity: Number,
            discountPercent: Number
        }],
        wholesalePrice: Number
    },
    ratings: {
        average: {
            type: Number,
            min: 0,
            max: 5,
            default: 0
        },
        count: {
            type: Number,
            default: 0
        },
        reviews: [{
            userId: mongoose.Schema.Types.ObjectId,
            rating: Number,
            comment: String,
            date: {
                type: Date,
                default: Date.now
            }
        }]
    },
    tags: [String],
    featured: {
        type: Boolean,
        default: false
    },
    displayOrder: {
        type: Number,
        default: 0
    },
    meta: {
        views: {
            type: Number,
            default: 0
        },
        orders: {
            type: Number,
            default: 0
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

// Update timestamp
productSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    
    // Auto-generate product code if not provided
    if (!this.productCode) {
        const prefix = this.category.substring(0, 3).toUpperCase();
        this.productCode = `${prefix}${Date.now().toString().slice(-6)}`;
    }
    
    next();
});

// Calculate current price based on season
productSchema.methods.getCurrentPrice = function() {
    const now = new Date();
    const currentMonth = now.getMonth();
    const nepaliMonths = [
        'बैशाख', 'जेठ', 'असार', 'श्रावण', 
        'भदौ', 'असोज', 'कार्तिक', 'मंसिर', 
        'पुष', 'माघ', 'फागुन', 'चैत्र'
    ];
    
    const currentNepaliMonth = nepaliMonths[(currentMonth + 8) % 12];
    
    // Find seasonal price
    const seasonalPrice = this.pricing.seasonalPrices.find(
        price => price.month === currentNepaliMonth
    );
    
    if (seasonalPrice) {
        return {
            price: seasonalPrice.price,
            multiplier: seasonalPrice.multiplier,
            isSeasonal: true,
            month: currentNepaliMonth
        };
    }
    
    return {
        price: this.pricing.basePrice,
        multiplier: 1,
        isSeasonal: false,
        month: currentNepaliMonth
    };
};

// Check availability
productSchema.methods.checkAvailability = function(quantity = 1) {
    if (!this.stock.available) {
        return {
            available: false,
            message: 'Product currently unavailable'
        };
    }
    
    if (this.stock.quantity < quantity) {
        return {
            available: false,
            message: `Only ${this.stock.quantity} ${this.stock.unit} available`,
            availableQuantity: this.stock.quantity
        };
    }
    
    // Check season
    const currentPrice = this.getCurrentPrice();
    const inSeason = currentPrice.isSeasonal;
    
    return {
        available: true,
        message: inSeason ? 'In season' : 'Available',
        quantity: quantity,
        price: currentPrice.price * quantity,
        inSeason: inSeason,
        stock: this.stock.quantity
    };
};

// Virtual for nepali price display
productSchema.virtual('displayPrice').get(function() {
    const currentPrice = this.getCurrentPrice();
    return `रु ${currentPrice.price.toLocaleString('ne-NP')}/${this.forms[0]?.unit || 'kg'}`;
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
```
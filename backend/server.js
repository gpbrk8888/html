```javascript
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

// Import models
const Order = require('./models/Order');
const Product = require('./models/Product');
const Subscription = require('./models/Subscription');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/himalayan_harvest', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB database');
});

// ============ ROUTES ============

// Home route
app.get('/', (req, res) => {
    res.json({
        message: 'हिमालयन हार्वेस्ट ब्याकेन्ड API',
        version: '1.0.0',
        endpoints: {
            products: '/api/products',
            orders: '/api/orders',
            subscriptions: '/api/subscriptions'
        }
    });
});

// ============ PRODUCTS ============

// Get all products
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find({});
        res.json({
            success: true,
            count: products.length,
            products: products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching products',
            error: error.message
        });
    }
});

// Get single product
app.get('/api/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        
        res.json({
            success: true,
            product: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching product',
            error: error.message
        });
    }
});

// Get products by category
app.get('/api/products/category/:category', async (req, res) => {
    try {
        const products = await Product.find({ category: req.params.category });
        
        res.json({
            success: true,
            count: products.length,
            products: products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching products by category',
            error: error.message
        });
    }
});

// Get featured products
app.get('/api/products/featured/featured', async (req, res) => {
    try {
        const products = await Product.find({ featured: true }).limit(6);
        
        res.json({
            success: true,
            count: products.length,
            products: products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching featured products',
            error: error.message
        });
    }
});

// ============ ORDERS ============

// Create new order
app.post('/api/orders', async (req, res) => {
    try {
        const orderData = req.body;
        
        // Validate required fields
        if (!orderData.customerName || !orderData.phoneNumber || !orderData.products) {
            return res.status(400).json({
                success: false,
                message: 'कृपया आवश्यक जानकारी भर्नुहोस्'
            });
        }
        
        // Create new order
        const order = new Order(orderData);
        await order.save();
        
        res.status(201).json({
            success: true,
            message: 'आर्डर सफलतापूर्वक सिर्जना गरियो',
            orderId: order.orderId,
            order: order.getSummary()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating order',
            error: error.message
        });
    }
});

// Get all orders
app.get('/api/orders', async (req, res) => {
    try {
        const orders = await Order.find({}).sort({ createdAt: -1 });
        
        res.json({
            success: true,
            count: orders.length,
            orders: orders.map(order => order.getSummary())
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching orders',
            error: error.message
        });
    }
});

// Get single order
app.get('/api/orders/:id', async (req, res) => {
    try {
        const order = await Order.findOne({ orderId: req.params.id });
        
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }
        
        res.json({
            success: true,
            order: order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching order',
            error: error.message
        });
    }
});

// Update order status
app.patch('/api/orders/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        
        if (!status) {
            return res.status(400).json({
                success: false,
                message: 'Status is required'
            });
        }
        
        const order = await Order.findOneAndUpdate(
            { orderId: req.params.id },
            { orderStatus: status },
            { new: true }
        );
        
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Order status updated',
            order: order.getSummary()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating order status',
            error: error.message
        });
    }
});

// ============ SUBSCRIPTIONS ============

// Create new subscription
app.post('/api/subscriptions', async (req, res) => {
    try {
        const subscriptionData = req.body;
        
        // Set start date if not provided
        if (!subscriptionData.deliverySchedule?.startDate) {
            subscriptionData.deliverySchedule.startDate = new Date();
        }
        
        const subscription = new Subscription(subscriptionData);
        await subscription.save();
        
        res.status(201).json({
            success: true,
            message: 'सदस्यता सफलतापूर्वक सिर्जना गरियो',
            subscriptionId: subscription.subscriptionId,
            subscription: subscription
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating subscription',
            error: error.message
        });
    }
});

// Get all subscriptions
app.get('/api/subscriptions', async (req, res) => {
    try {
        const subscriptions = await Subscription.find({}).sort({ createdAt: -1 });
        
        res.json({
            success: true,
            count: subscriptions.length,
            subscriptions: subscriptions
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching subscriptions',
            error: error.message
        });
    }
});

// ============ UTILITY ENDPOINTS ============

// Get delivery cost
app.post('/api/calculate-delivery', (req, res) => {
    try {
        const { district, weight } = req.body;
        
        // Simple delivery calculation
        let baseCost = 100;
        
        if (district === 'काठमाडौँ' || district === 'ललितपुर' || district === 'भक्तपुर') {
            baseCost = 100;
        } else if (['कास्की', 'नवलपुर', 'चितवन'].includes(district)) {
            baseCost = 200;
        } else if (['झापा', 'इलाम', 'मोरङ'].includes(district)) {
            baseCost = 300;
        } else {
            baseCost = 500;
        }
        
        // Add weight charges
        let weightCharge = 0;
        if (weight > 5) {
            weightCharge = Math.ceil((weight - 5) / 5) * 20;
        }
        
        const total = baseCost + weightCharge;
        
        res.json({
            success: true,
            deliveryCost: total,
            nepaliCost: `रु ${total.toLocaleString('ne-NP')}`,
            breakdown: {
                base: baseCost,
                weightCharge: weightCharge
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error calculating delivery cost',
            error: error.message
        });
    }
});

// Check product availability
app.post('/api/check-availability', async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        
        const product = await Product.findById(productId);
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        
        const availability = product.checkAvailability(quantity);
        
        res.json({
            success: true,
            ...availability
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error checking availability',
            error: error.message
        });
    }
});

// Get seasonal products
app.get('/api/seasonal-products', async (req, res) => {
    try {
        const month = new Date().getMonth();
        const nepaliMonths = [
            'बैशाख', 'जेठ', 'असार', 'श्रावण', 
            'भदौ', 'असोज', 'कार्तिक', 'मंसिर', 
            'पुष', 'माघ', 'फागुन', 'चैत्र'
        ];
        
        const currentNepaliMonth = nepaliMonths[(month + 8) % 12];
        
        const seasonalProducts = await Product.find({
            'season.nepaliMonths': currentNepaliMonth
        });
        
        res.json({
            success: true,
            month: currentNepaliMonth,
            count: seasonalProducts.length,
            products: seasonalProducts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching seasonal products',
            error: error.message
        });
    }
});

// ============ ERROR HANDLING ============

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found'
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API URL: http://localhost:${PORT}`);
});

module.exports = app;
```

---
```javascript
// Calculate seasonal price for a product
export function calculateSeasonalPrice(product, month) {
    const basePrices = {
        'akabare': { fresh: 400, dried: 600, powder: 800 },
        'coffee': { light: 800, medium: 700, dark: 600 },
        'oranges': { a: 250, b: 200, c: 150 },
        'vegetables': { seasonal: 100, offSeason: 150 }
    };
    
    const seasonalMultipliers = {
        0: 1.2,  // January - winter
        1: 1.1,  // February
        2: 1.0,  // March
        3: 0.9,  // April
        4: 0.8,  // May
        5: 0.9,  // June
        6: 1.0,  // July
        7: 1.1,  // August
        8: 1.2,  // September
        9: 1.3,  // October
        10: 1.4, // November
        11: 1.3  // December
    };
    
    const currentMonth = month !== undefined ? month : new Date().getMonth();
    const multiplier = seasonalMultipliers[currentMonth] || 1.0;
    
    // Return base price for demo
    if (basePrices[product]) {
        return basePrices[product];
    }
    
    return { price: 100 * multiplier };
}

// Get harvest calendar
export function getHarvestCalendar() {
    return {
        'बैशाख-जेठ': ['ककडी', 'भिन्डी', 'बोडी'],
        'असार-श्रावण': ['काउली', 'टमाटर', 'बन्दा', 'अकबरे खुर्सानी'],
        'भदौ-असोज': ['लौका', 'करेला', 'प्याज', 'आलु'],
        'कार्तिक-मंसिर': ['मुला', 'गाजर', 'फूलकोबी'],
        'पुष-माघ': ['तोरी', 'मेथी', 'पालुङ्गो', 'सुन्तला'],
        'फागुन-चैत्र': ['टमाटर', 'ककडी', 'भिन्डी']
    };
}

// Check product availability
export function checkAvailability(product, location) {
    const availability = {
        'akabare': {
            regions: ['इलाम', 'झापा', 'पाँचथर'],
            months: [3, 4, 5, 6, 7], // June-October
            available: true
        },
        'coffee': {
            regions: ['गण्डकी', 'लुम्बिनी'],
            months: [9, 10, 11, 0, 1], // Oct-March
            available: true
        },
        'oranges': {
            regions: ['सिन्धुपाल्चोक', 'नुवाकोट', 'धादिङ'],
            months: [9, 10, 11, 0, 1, 2], // Oct-March
            available: true
        }
    };
    
    const productInfo = availability[product];
    
    if (!productInfo) {
        return { available: false, reason: 'Product not found' };
    }
    
    const currentMonth = new Date().getMonth();
    const isInSeason = productInfo.months.includes(currentMonth);
    const isInRegion = productInfo.regions.some(region => 
        location.toLowerCase().includes(region.toLowerCase())
    );
    
    return {
        available: productInfo.available && isInSeason,
        inSeason: isInSeason,
        inRegion: isInRegion,
        message: isInSeason ? 
            'Available for delivery' : 
            'Out of season, available from next harvest'
    };
}

// Calculate total for order
export function calculateOrderTotal(items) {
    let total = 0;
    let discount = 0;
    
    items.forEach(item => {
        total += item.price * item.quantity;
    });
    
    // Apply discounts
    if (total > 5000) {
        discount = total * 0.1; // 10% discount
    } else if (total > 2000) {
        discount = total * 0.05; // 5% discount
    }
    
    const subtotal = total - discount;
    const tax = subtotal * 0.13; // 13% VAT
    const grandTotal = subtotal + tax;
    
    return {
        subtotal: total,
        discount: discount,
        tax: tax,
        total: grandTotal,
        breakdown: {
            items: items.length,
            weight: items.reduce((sum, item) => sum + item.quantity, 0) + ' kg'
        }
    };
}

// Get product shelf life
export function getShelfLife(product, form) {
    const shelfLife = {
        'akabare': {
            'fresh': '7 दिन',
            'dried': '१ वर्ष',
            'powder': '६ महिना'
        },
        'coffee': {
            'beans': '१ वर्ष',
            'ground': '३ महिना'
        },
        'oranges': {
            'fresh': '१४ दिन',
            'juice': '३ दिन (शीतल)',
            'marmalade': '६ महिना'
        },
        'vegetables': {
            'leafy': '३ दिन',
            'root': '१५ दिन',
            'fruits': '७ दिन'
        }
    };
    
    return shelfLife[product]?.[form] || '१ सप्ताह';
}
```

```javascript
// Get delivery cost based on district
export function getDeliveryCost(district) {
    const deliveryCosts = {
        // Zone A: Kathmandu Valley
        'काठमाडौँ': 100,
        'ललितपुर': 100,
        'भक्तपुर': 100,
        
        // Zone B: Nearby districts
        'कास्की': 200,
        'नवलपुर': 200,
        'चितवन': 200,
        'मकवानपुर': 200,
        
        // Zone C: Eastern Terai
        'झापा': 300,
        'इलाम': 350,
        'मोरङ': 300,
        'सुनसरी': 300,
        
        // Zone D: Western Nepal
        'रुपन्देही': 400,
        'पाल्पा': 450,
        'गुल्मी': 500,
        
        // Default
        'default': 500
    };
    
    return deliveryCosts[district] || deliveryCosts['default'];
}

// Get delivery time based on zone
export function getDeliveryTime(zone) {
    const deliveryTimes = {
        'A': '१-२ दिन',
        'B': '३-४ दिन',
        'C': '४-५ दिन',
        'D': '५-७ दिन',
        'remote': '७-१० दिन'
    };
    
    const zoneMapping = {
        'काठमाडौँ': 'A',
        'ललितपुर': 'A',
        'भक्तपुर': 'A',
        'कास्की': 'B',
        'नवलपुर': 'B',
        'चितवन': 'B',
        'झापा': 'C',
        'मोरङ': 'C',
        'इलाम': 'C',
        'रुपन्देही': 'D',
        'पाल्पा': 'D'
    };
    
    const zoneCode = zoneMapping[zone] || 'remote';
    return deliveryTimes[zoneCode];
}

// Available pickup points
export function availablePickupPoints() {
    return [
        {
            id: 1,
            name: 'काठमाडौँ फार्मर्स मार्केट',
            address: 'सुंदरहरा, काठमाडौँ',
            timing: '९:०० AM - ६:०० PM',
            days: 'सोमबार - शनिबार'
        },
        {
            id: 2,
            name: 'भक्तपुर स्थानीय बजार',
            address: 'भक्तपुर दरबार क्षेत्र',
            timing: '८:०० AM - ५:०० PM',
            days: 'आइतबार बाहेक हरेक दिन'
        },
        {
            id: 3,
            name: 'ललितपुर सहकारी',
            address: 'पुलचोक, ललितपुर',
            timing: '१०:०० AM - ४:०० PM',
            days: 'मंगलबार, बुधबार, शुक्रबार'
        },
        {
            id: 4,
            name: 'पोखरा आर्गेनिक स्टोर',
            address: 'लेकसाइड, पोखरा',
            timing: '९:३० AM - ६:३० PM',
            days: 'हरेक दिन'
        }
    ];
}

// Calculate bulk order discount
export function calculateBulkDiscount(quantity) {
    if (quantity >= 100) {
        return { discount: 20, type: 'ठूलो मात्रा (20%)' };
    } else if (quantity >= 50) {
        return { discount: 15, type: 'मध्यम मात्रा (15%)' };
    } else if (quantity >= 20) {
        return { discount: 10, type: 'सानो मात्रा (10%)' };
    } else if (quantity >= 10) {
        return { discount: 5, type: 'प्रारम्भिक (5%)' };
    } else {
        return { discount: 0, type: 'कुनै छुट छैन' };
    }
}

// Check if delivery is available
export function isDeliveryAvailable(district) {
    const availableDistricts = [
        'काठमाडौँ', 'ललितपुर', 'भक्तपुर',
        'कास्की', 'नवलपुर', 'चितवन',
        'झापा', 'मोरङ', 'इलाम',
        'रुपन्देही', 'पाल्पा'
    ];
    
    return availableDistricts.includes(district);
}

// Get delivery schedule
export function getDeliverySchedule() {
    return {
        'सोमबार': ['काठमाडौँ', 'ललितपुर', 'भक्तपुर'],
        'मंगलबार': ['कास्की', 'नवलपुर'],
        'बुधबार': ['चितवन', 'मकवानपुर'],
        'बिहिबार': ['झापा', 'मोरङ'],
        'शुक्रबार': ['इलाम', 'पाँचथर'],
        'शनिबार': ['रुपन्देही', 'पाल्पा'],
        'आइतबार': 'कुनै डेलिभरी छैन'
    };
}

// Calculate shipping weight charges
export function calculateWeightCharges(weight) {
    const baseCharge = 50;
    let additionalCharge = 0;
    
    if (weight > 5) {
        additionalCharge = Math.ceil((weight - 5) / 5) * 20;
    }
    
    return baseCharge + additionalCharge;
}
```

---
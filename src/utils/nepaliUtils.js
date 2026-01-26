```javascript
// Convert price to Nepali format
export function convertToNepaliPrice(price) {
    if (typeof price !== 'number') {
        price = parseFloat(price);
    }
    return `रु ${price.toLocaleString('ne-NP')}`;
}

// Get Nepali season based on month
export function getNepaliSeason(month) {
    const seasons = {
        1: 'शिशिर',  // Winter
        2: 'बसन्त',  // Spring
        3: 'गृष्म',  // Summer
        4: 'वर्षा',  // Rainy
        5: 'शरद'    // Autumn
    };
    
    const monthSeason = {
        0: 1,  // January
        1: 1,  // February
        2: 2,  // March
        3: 2,  // April
        4: 3,  // May
        5: 4,  // June
        6: 4,  // July
        7: 4,  // August
        8: 5,  // September
        9: 5,  // October
        10: 1, // November
        11: 1  // December
    };
    
    const currentMonth = month || new Date().getMonth();
    return seasons[monthSeason[currentMonth]];
}

// Get Nepali months
export const NEPALI_MONTHS = [
    'बैशाख', 'जेठ', 'असार', 'श्रावण', 
    'भदौ', 'असोज', 'कार्तिक', 'मंसिर', 
    'पुष', 'माघ', 'फागुन', 'चैत्र'
];

// Get current Nepali month
export function getCurrentNepaliMonth() {
    const englishMonths = [
        'April', 'May', 'June', 'July', 'August', 'September',
        'October', 'November', 'December', 'January', 'February', 'March'
    ];
    
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    // Simple conversion (for basic use)
    let nepaliMonthIndex = (currentMonth + 8) % 12;
    
    return {
        month: NEPALI_MONTHS[nepaliMonthIndex],
        index: nepaliMonthIndex,
        year: currentYear + 57 // Convert to Nepali year (approx)
    };
}

// Get districts by province
export function getDistricts(provinceId) {
    const districts = {
        1: ['झापा', 'इलाम', 'पाँचथर', 'ताप्लेजुङ्ग', 'सङ्खुवासभा', 'धनकुटा', 'तेह्रथुम', 'मोरङ', 'सुनसरी', 'उदयपुर'],
        2: ['सप्तरी', 'सिराहा', 'धनुषा', 'महोत्तरी', 'सर्लाही', 'रौतहट', 'बारा', 'पर्सा'],
        3: ['काठमाडौँ', 'ललितपुर', 'भक्तपुर', 'धादिङ', 'नुवाकोट', 'सिन्धुपाल्चोक', 'रसुवा', 'दोलखा', 'सिन्धुली'],
        4: ['गोरखा', 'कास्की', 'लमजुङ', 'तनहुँ', 'स्याङ्जा', 'नवलपुर', 'पर्वत', 'बागलुङ'],
        5: ['रुपन्देही', 'कपिलवस्तु', 'पाल्पा', 'अर्घाखाँची', 'गुल्मी', 'नवलपरासी'],
        6: ['सुर्खेत', 'सल्यान', 'दैलेख', 'जाजरकोट', 'डोल्पा', 'जुम्ला'],
        7: ['कैलाली', 'डोटी', 'अछाम', 'बैतडी', 'दार्चुला', 'बझाङ']
    };
    
    return districts[provinceId] || [];
}

// Format Nepali phone number
export function formatNepaliPhone(number) {
    const cleaned = number.replace(/\D/g, '');
    
    if (cleaned.length === 10) {
        return `+977 ${cleaned.substring(0, 3)} ${cleaned.substring(3, 6)} ${cleaned.substring(6)}`;
    } else if (cleaned.length === 9) {
        return `+977 ${cleaned.substring(0, 2)} ${cleaned.substring(2, 5)} ${cleaned.substring(5)}`;
    }
    
    return number;
}

// Convert weight to Nepali units
export function convertToNepaliWeight(kg) {
    if (kg >= 40) {
        const mana = kg * 2.5; // 1 kg ≈ 2.5 mana
        return `${mana.toFixed(1)} मना`;
    } else if (kg >= 1) {
        return `${kg} किलो`;
    } else {
        const gram = kg * 1000;
        return `${gram} ग्राम`;
    }
}

// Simple Nepali date (basic implementation)
export function getSimpleNepaliDate() {
    const today = new Date();
    const nepaliDate = getCurrentNepaliMonth();
    
    return {
        day: today.getDate(),
        month: nepaliDate.month,
        year: nepaliDate.year,
        fullDate: `${today.getDate()} ${nepaliDate.month} ${nepaliDate.year}`
    };
}
```

const fs = require('fs');

const filePath = 'e:\\prototypes\\ArkLines\\src\\data\\skills\\characters_skills.json';

function migrateKey(key) {
    let newKey = key;

    // First, fix any previous 'uatb' error
    newKey = newKey.replace(/uatb/g, 'usp');
    newKey = newKey.replace(/Uatb/g, 'Usp');

    // Replace sp with atb (if not preceded by u/U)
    // Using negative lookbehind for safety if supported, or capturing group
    newKey = newKey.replace(/(^|_|[a-hj-tv-z])(sp)([A-Z]|_|$)/g, (match, p1, p2, p3) => p1 + 'atb' + p3);

    // Replace gauge with usp (case sensitive for first letter)
    newKey = newKey.replace(/(^|_|[a-z])(gauge)([A-Z]|_|$)/gi, (match, p1, p2, p3) => {
        let rep = 'usp';
        if (p2[0] === p2[0].toUpperCase()) rep = 'Usp';
        return p1 + rep + p3;
    });
    // Replace stagger with poise
    newKey = newKey.replace(/(^|_|[a-z])(stagger)([A-Z]|_|$)/gi, (match, p1, p2, p3) => {
        let rep = 'poise';
        if (p2[0] === p2[0].toUpperCase()) rep = 'Poise';
        return p1 + rep + p3;
    });
    return newKey;
}

function migrateObj(obj) {
    if (Array.isArray(obj)) {
        return obj.map(migrateObj);
    } else if (obj !== null && typeof obj === 'object') {
        const newObj = {};
        for (const [key, value] of Object.entries(obj)) {
            const newKey = migrateKey(key);
            let newVal = migrateObj(value);

            if (typeof newVal === 'string') {
                if (newVal.startsWith('dist/assets/') || newVal.startsWith('/icons/') || newVal.startsWith('/avatars/')) {
                    // Already migrated if starts with dist/assets/
                    if (!newVal.startsWith('dist/assets/')) {
                        if (newVal.startsWith('/icons/')) {
                            newVal = newVal.replace('/icons/', 'dist/assets/icons/');
                        } else if (newVal.startsWith('/avatars/')) {
                            newVal = newVal.replace('/avatars/', 'dist/assets/avatars/');
                        }
                    }
                }

                if (newVal === 'stagger') newVal = 'poise';
                if (newVal === 'gauge') newVal = 'usp';
                if (newVal === 'sp') newVal = 'atb';
                // Fix uatb in values too if any
                if (typeof newVal === 'string') {
                    newVal = newVal.replace(/uatb/g, 'usp');
                }
            }
            newObj[newKey] = newVal;
        }
        return newObj;
    } else if (typeof obj === 'string') {
        let newVal = obj;
        if (newVal === 'stagger') newVal = 'poise';
        if (newVal === 'gauge') newVal = 'usp';
        if (newVal === 'sp') newVal = 'atb';
        newVal = newVal.replace(/uatb/g, 'usp');
        return newVal;
    }
    return obj;
}

try {
    let rawData = fs.readFileSync(filePath, 'utf8');
    if (rawData.charCodeAt(0) === 0xFEFF) {
        rawData = rawData.slice(1);
    }
    const data = JSON.parse(rawData);
    const migratedData = migrateObj(data);
    fs.writeFileSync(filePath, JSON.stringify(migratedData, null, 2), 'utf8');
    console.log('Fixed migration completed successfully.');
} catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
}

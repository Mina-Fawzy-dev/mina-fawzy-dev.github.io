const translations = {
    ar: {
        title: 'حاسبة خصم المكتبة',
        enter_prices: 'أدخل الأسعار',
        prices_placeholder: 'أدخل السعر',
        calculate: 'حساب',
        clear: 'مسح الكل',
        backspace: '⌫',
        reset: 'إعادة ضبط',
        receipts: 'الإيصالات',
        about: 'عن المبرمج',
        percentage_label: 'نسبة الخصم %:',
        rounding_step: 'خطوة التقريب:',
        save_settings: 'حفظ',
        toggle_theme: '🌙',
        toggle_settings: 'إعدادات',
        original_price: 'السعر الأصلي',
        discount: 'الخصم',
        final_price: 'السعر النهائي',
        total_before: '🟡 الإجمالي قبل الخصم:',
        total_discount: '🟠 إجمالي الخصم:',
        total_after: '🟢 الإجمالي بعد الخصم:',
        sort_by: 'ترتيب حسب:',
        sort_date_asc: 'التاريخ (الأقدم)',
        sort_date_desc: 'التاريخ (الأحدث)',
        sort_total_asc: 'الإجمالي (تصاعدي)',
        sort_total_desc: 'الإجمالي (تنازلي)',
        sort_items_asc: 'عدد العناصر (تصاعدي)',
        sort_items_desc: 'عدد العناصر (تنازلي)',
        filter_date: 'تصفية حسب التاريخ:',
        filter_total_min: 'الإجمالي الأدنى:',
        filter_total_max: 'الإجمالي الأعلى:',
        error_invalid_prices: 'الرجاء إدخال أسعار صحيحة (أرقام فقط).',
        error_invalid_percentage: 'الرجاء إدخال نسبة خصم صحيحة (0-100).',
        error_invalid_rounding_step: 'الرجاء إدخال خطوة تقريب صحيحة (رقم أكبر من 0).',
        error_invalid_quantity: 'الرجاء إدخال كمية صحيحة (رقم أكبر من 0).',
        success_settings_saved: 'تم حفظ الإعدادات بنجاح!',
        quick_multiply: 'التكرار السريع',
        quantity_label: 'الكمية:',
        save_receipt: 'حفظ كإيصال جديد',
        export_receipt: 'تصدير الإيصال',
        about_content: 'تم تطوير هذا التطبيق بواسطة مينا فوزي، مبرمج شغوف بحلول بسيطة وفعالة لإدارة المكتبات الكبرى. تواصلوا معي عبر: github.com/mina-fawzy-dev',
        back: 'رجوع'
    },
    en: {
        title: 'Bookstore Discount Calculator',
        enter_prices: 'Enter Prices',
        prices_placeholder: 'Enter price',
        calculate: 'Calculate',
        clear: 'Clear All',
        backspace: '⌫',
        reset: 'Reset',
        receipts: 'Receipts',
        about: 'About the Developer',
        percentage_label: 'Discount Percentage %:',
        rounding_step: 'Rounding Step:',
        save_settings: 'Save',
        toggle_theme: '🌙',
        toggle_settings: 'Settings',
        original_price: 'Original Price',
        discount: 'Discount',
        final_price: 'Final Price',
        total_before: '🟡 Total Before Discount:',
        total_discount: '🟠 Total Discount:',
        total_after: '🟢 Total After Discount:',
        sort_by: 'Sort by:',
        sort_date_asc: 'Date (Oldest)',
        sort_date_desc: 'Date (Newest)',
        sort_total_asc: 'Total (Ascending)',
        sort_total_desc: 'Total (Descending)',
        sort_items_asc: 'Item Count (Ascending)',
        sort_items_desc: 'Item Count (Descending)',
        filter_date: 'Filter by Date:',
        filter_total_min: 'Min Total:',
        filter_total_max: 'Max Total:',
        error_invalid_prices: 'Please enter valid prices (numbers only).',
        error_invalid_percentage: 'Please enter a valid discount percentage (0-100).',
        error_invalid_rounding_step: 'Please enter a valid rounding step (number greater than 0).',
        error_invalid_quantity: 'Please enter a valid quantity (number greater than 0).',
        success_settings_saved: 'Settings saved successfully!',
        quick_multiply: 'Quick Multiply',
        quantity_label: 'Quantity:',
        save_receipt: 'Save as New Receipt',
        export_receipt: 'Export Receipt',
        about_content: 'This app was developed by Mina Fawzy, a passionate programmer creating simple, effective solutions for large bookstores. Contact me at: github.com/mina-fawzy-dev',
        back: 'Back'
    }
};

let currentView = 'calculator';
let language = localStorage.getItem('language') || 'ar';
let theme = localStorage.getItem('theme') || 'light';
let currentPrice = '';
let previousPrices = localStorage.getItem('previousPrices')?.split('\n') || [];
let percentage = Number(localStorage.getItem('percentage') || 10);
let roundingStep = Number(localStorage.getItem('roundingStep') || 5);
let results = JSON.parse(localStorage.getItem('results')) || { prices: [], discounts: [], final_prices: [] };
let totals = JSON.parse(localStorage.getItem('totals')) || { total_original: 0, total_discount: 0, total_final: 0 };
let receipts = JSON.parse(localStorage.getItem('receipts')) || [];
let selectedReceipt = null;
let quantity = 1;
let quickResults = null;
let version = '1.0.0';
let t = translations[language];

document.addEventListener('DOMContentLoaded', () => {
    applyLanguage();
    applyTheme();
    renderView();
    updatePreviousPrices();
    checkForUpdates();
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js').catch(err => console.error('Service Worker registration failed:', err));
    }
});

function applyLanguage() {
    t = translations[language];
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.getElementById('title').textContent = t.title;
    document.getElementById('current-price').placeholder = t.prices_placeholder;
    document.getElementById('previous-prices').textContent = previousPrices.length ? previousPrices.join('\n') : t.enter_prices;
    document.getElementById('toggle-theme').title = t.toggle_theme;
    document.getElementById('toggle-settings').textContent = t.toggle_settings;
    document.getElementById('percentage').previousElementSibling.textContent = t.percentage_label;
    document.getElementById('rounding-step').previousElementSibling.textContent = t.rounding_step;
    document.getElementById('save-settings').textContent = t.save_settings;
    document.getElementById('calculate').textContent = t.calculate;
    document.getElementById('clear').textContent = t.clear;
    document.getElementById('reset').textContent = t.reset;
    document.getElementById('backspace').textContent = t.backspace;
    document.getElementById('enter').textContent = t.enter_line;
    document.getElementById('show-receipts').textContent = t.receipts;
    document.getElementById('show-about').title = t.about;
    document.getElementById('toggle-language').textContent = language === 'ar' ? '🇬🇧' : '🇸🇦';
    saveData();
}

function applyTheme() {
    document.body.className = theme === 'light' ? '' : 'dark-mode';
    document.getElementById('toggle-theme').textContent = theme === 'light' ? '🌙' : '🌞';
    saveData();
}

function saveData() {
    localStorage.setItem('language', language);
    localStorage.setItem('theme', theme);
    localStorage.setItem('previousPrices', previousPrices.join('\n'));
    localStorage.setItem('percentage', percentage);
    localStorage.setItem('roundingStep', roundingStep);
    localStorage.setItem('results', JSON.stringify(results));
    localStorage.setItem('totals', JSON.stringify(totals));
    localStorage.setItem('receipts', JSON.stringify(receipts));
}

function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.remove('hidden');
    setTimeout(() => notification.classList.add('hidden'), 3000);
}

function showError(message) {
    const error = document.getElementById('error');
    error.textContent = message;
    error.classList.remove('hidden');
    setTimeout(() => error.classList.add('hidden'), 3000);
}

function updatePreviousPrices() {
    document.getElementById('previous-prices').textContent = previousPrices.length ? previousPrices.join('\n') : t.enter_prices;
}

function renderView() {
    document.querySelectorAll('.view').forEach(view => view.classList.add('hidden'));
    document.getElementById(`${currentView}-view`).classList.remove('hidden');
    if (currentView === 'calculator') {
        document.getElementById('results').classList.toggle('hidden', !results.prices.length);
        if (results.prices.length) {
            const tbody = document.getElementById('results-table').querySelector('tbody');
            tbody.innerHTML = results.prices.map((price, i) => `
                <tr>
                    <td>${price.toFixed(2)}</td>
                    <td>${results.discounts[i].toFixed(2)}</td>
                    <td>${results.final_prices[i].toFixed(2)}</td>
                </tr>
            `).join('');
            document.getElementById('total-before').textContent = `${t.total_before} ${totals.total_original.toFixed(2)}`;
            document.getElementById('total-discount').textContent = `${t.total_discount} ${totals.total_discount.toFixed(2)}`;
            document.getElementById('total-after').textContent = `${t.total_after} ${totals.total_final.toFixed(2)}`;
        }
    } else if (currentView === 'receipts') {
        renderReceipts();
    } else if (currentView === 'quick-multiply') {
        document.getElementById('multiply-results').classList.toggle('hidden', !quickResults);
        if (quickResults) {
            const tbody = document.getElementById('multiply-table').querySelector('tbody');
            tbody.innerHTML = quickResults.prices.map((price, i) => `
                <tr>
                    <td>${price.toFixed(2)}</td>
                    <td>${quickResults.discounts[i].toFixed(2)}</td>
                    <td>${quickResults.final_prices[i].toFixed(2)}</td>
                </tr>
            `).join('');
            document.getElementById('multiply-total-before').textContent = `${t.total_before} ${quickResults.total_original.toFixed(2)}`;
            document.getElementById('multiply-total-discount').textContent = `${t.total_discount} ${quickResults.total_discount.toFixed(2)}`;
            document.getElementById('multiply-total-after').textContent = `${t.total_after} ${quickResults.total_final.toFixed(2)}`;
        }
    }
}

function calculate() {
    const allPrices = [...previousPrices, ...(currentPrice && !isNaN(currentPrice) ? [currentPrice] : [])].filter(p => p && !isNaN(p) && p >= 0);

    if (!allPrices.length) {
        showError(t.error_invalid_prices);
        return;
    }

    const discounts = [];
    const final_prices = [];
    let total_original = 0;
    let total_discount = 0;
    let total_final = 0;

    allPrices.forEach(price => {
        price = Number(price);
        total_original += price;
        const discount = price * (percentage / 100);
        const discounted_price = price - discount;
        const rounded_price = Math.ceil(discounted_price / roundingStep) * roundingStep;
        discounts.push(discount);
        final_prices.push(rounded_price);
        total_discount += discount;
        total_final += rounded_price;
    });

    results = { prices: allPrices.map(Number), discounts, final_prices };
    totals = { total_original, total_discount, total_final };
    saveData();

    const newReceipt = {
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        total_original,
        total_final,
        item_count: allPrices.length,
        original_prices: allPrices.join(','),
        discounted_prices: final_prices.join(',')
    };
    receipts = [newReceipt, ...receipts.slice(0, 9)];
    saveData();
    showNotification(t.success_settings_saved);
    renderView();
}

function renderReceipts() {
    let filtered = [...receipts];
    const filterDate = document.getElementById('filter-date').value;
    const filterTotalMin = document.getElementById('filter-total-min').value;
    const filterTotalMax = document.getElementById('filter-total-max').value;
    const sortOption = document.getElementById('sort-by').value;

    if (filterDate) filtered = filtered.filter(r => r.date === filterDate);
    if (filterTotalMin) filtered = filtered.filter(r => r.total_final >= Number(filterTotalMin));
    if (filterTotalMax) filtered = filtered.filter(r => r.total_final <= Number(filterTotalMax));

    filtered.sort((a, b) => {
        if (sortOption === 'date_asc') return new Date(a.date) - new Date(b.date);
        if (sortOption === 'date_desc') return new Date(b.date) - new Date(a.date);
        if (sortOption === 'total_asc') return a.total_final - b.total_final;
        if (sortOption === 'total_desc') return b.total_final - a.total_final;
        if (sortOption === 'items_asc') return a.item_count - b.item_count;
        if (sortOption === 'items_desc') return b.item_count - a.item_count;
        return 0;
    });

    const tbody = document.getElementById('receipts-table').querySelector('tbody');
    tbody.innerHTML = filtered.map((receipt, index) => `
        <tr>
            <td>${receipt.date}</td>
            <td>${receipt.item_count}</td>
            <td>${receipt.total_original.toFixed(2)}</td>
            <td>${receipt.total_final.toFixed(2)}</td>
            <td><button class="action-button multiply-button" data-index="${index}">${t.quick_multiply}</button></td>
            <td><button class="action-button export-button" data-index="${index}">${t.export_receipt}</button></td>
        </tr>
    `).join('');
}

function handleQuickMultiply() {
    if (!quantity || isNaN(quantity) || quantity <= 0) {
        showError(t.error_invalid_quantity);
        return;
    }

    const original_prices = selectedReceipt.original_prices.split(',').map(Number);
    const discounted_prices = selectedReceipt.discounted_prices.split(',').map(Number);
    const quick_original = original_prices.reduce((sum, price) => sum + price * quantity, 0);
    const quick_final = discounted_prices.reduce((sum, price) => sum + price * quantity, 0);
    const quick_discount = quick_original - quick_final;

    quickResults = {
        prices: original_prices.map(price => price * quantity),
        discounts: original_prices.map((price, i) => (price - discounted_prices[i]) * quantity),
        final_prices: discounted_prices.map(price => price * quantity),
        total_original: quick_original,
        total_discount: quick_discount,
        total_final: quick_final,
        item_count: original_prices.length * quantity
    };
    saveData();
    renderView();
}

function handleExportReceipt(receipt) {
    const text = `
${t.title}
${t.date}: ${receipt.date}
${t.sort_items_asc}: ${receipt.item_count}
${t.total_before}: ${receipt.total_original.toFixed(2)}
${t.total_after}: ${receipt.total_final.toFixed(2)}
${t.original_price}: ${receipt.original_prices}
${t.final_price}: ${receipt.discounted_prices}
    `;
    navigator.clipboard.writeText(text.trim());
    showNotification(t.export_receipt);
}

function checkForUpdates() {
    if (navigator.onLine) {
        fetch('https://raw.githubusercontent.com/mina-fawzy-dev/bookstore-discount-calculator/main/version.json')
            .then(response => response.json())
            .then(data => {
                if (data.version !== version) {
                    const updateNotification = document.getElementById('update-notification');
                    updateNotification.classList.remove('hidden');
                    document.getElementById('update-link').href = 'https://mina-fawzy-dev.github.io/bookstore-discount-calculator/';
                }
            })
            .catch(() => console.log('Update check failed'));
    }
    setTimeout(checkForUpdates, 3600000); // Check every hour
}

// Event Listeners
document.getElementById('toggle-language').addEventListener('click', () => {
    language = language === 'ar' ? 'en' : 'ar';
    applyLanguage();
    renderView();
});

document.getElementById('toggle-theme').addEventListener('click', () => {
    theme = theme === 'light' ? 'dark' : 'light';
    applyTheme();
});

document.getElementById('toggle-settings').addEventListener('click', () => {
    document.getElementById('settings').classList.toggle('hidden');
});

document.getElementById('save-settings').addEventListener('click', () => {
    percentage = Number(document.getElementById('percentage').value);
    roundingStep = Number(document.getElementById('rounding-step').value);

    if (isNaN(percentage) || percentage < 0 || percentage > 100) {
        showError(t.error_invalid_percentage);
        return;
    }
    if (isNaN(roundingStep) || roundingStep <= 0) {
        showError(t.error_invalid_rounding_step);
        return;
    }
    document.getElementById('settings').classList.add('hidden');
    showNotification(t.success_settings_saved);
    saveData();
});

document.querySelectorAll('.keypad-button').forEach(button => {
    button.addEventListener('click', () => {
        const value = button.textContent;
        if (value === t.clear) {
            currentPrice = '';
            previousPrices = [];
            results = { prices: [], discounts: [], final_prices: [] };
            totals = { total_original: 0, total_discount: 0, total_final: 0 };
            document.getElementById('current-price').value = '';
            saveData();
            updatePreviousPrices();
            renderView();
        } else if (value === t.reset) {
            currentPrice = '';
            previousPrices = [];
            results = { prices: [], discounts: [], final_prices: [] };
            totals = { total_original: 0, total_discount: 0, total_final: 0 };
            receipts = [];
            percentage = 10;
            roundingStep = 5;
            document.getElementById('current-price').value = '';
            document.getElementById('percentage').value = percentage;
            document.getElementById('rounding-step').value = roundingStep;
            saveData();
            updatePreviousPrices();
            renderView();
            showNotification(t.success_settings_saved);
        } else if (value === t.backspace) {
            currentPrice = currentPrice.slice(0, -1);
            document.getElementById('current-price').value = currentPrice;
        } else if (value === t.enter_line) {
            if (currentPrice && !isNaN(currentPrice) && !currentPrice.includes('..')) {
                previousPrices.push(currentPrice);
                currentPrice = '';
                document.getElementById('current-price').value = '';
                saveData();
                updatePreviousPrices();
            }
        } else if (value === '.') {
            if (!currentPrice.includes('.') && currentPrice !== '') {
                currentPrice += value;
                document.getElementById('current-price').value = currentPrice;
            }
        } else {
            currentPrice += value;
            document.getElementById('current-price').value = currentPrice;
        }
    });
});

document.getElementById('calculate').addEventListener('click', calculate);

document.getElementById('show-receipts').addEventListener('click', () => {
    currentView = 'receipts';
    document.getElementById('settings').classList.add('hidden');
    renderView();
});

document.getElementById('back-to-calculator').addEventListener('click', () => {
    currentView = 'calculator';
    renderView();
});

document.getElementById('show-about').addEventListener('click', () => {
    currentView = 'about';
    renderView();
});

document.getElementById('back-to-calculator-from-about').addEventListener('click', () => {
    currentView = 'calculator';
    renderView();
});

document.getElementById('receipts-table').addEventListener('click', (e) => {
    if (e.target.classList.contains('multiply-button')) {
        selectedReceipt = receipts[Number(e.target.dataset.index)];
        currentView = 'quick-multiply';
        renderView();
    } else if (e.target.classList.contains('export-button')) {
        handleExportReceipt(receipts[Number(e.target.dataset.index)]);
    }
});

document.getElementById('calculate-multiply').addEventListener('click', () => {
    quantity = Number(document.getElementById('quantity').value);
    handleQuickMultiply();
});

document.getElementById('save-multiply-receipt').addEventListener('click', () => {
    if (!quickResults) return;
    const newReceipt = {
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        total_original: quickResults.total_original,
        total_final: quickResults.total_final,
        item_count: quickResults.item_count,
        original_prices: quickResults.prices.join(','),
        discounted_prices: quickResults.final_prices.join(',')
    };
    receipts = [newReceipt, ...receipts.slice(0, 9)];
    saveData();
    showNotification(t.success_settings_saved);
    currentView = 'receipts';
    quickResults = null;
    quantity = 1;
    document.getElementById('quantity').value = 1;
    renderView();
});

document.getElementById('back-to-receipts').addEventListener('click', () => {
    currentView = 'receipts';
    quickResults = null;
    quantity = 1;
    document.getElementById('quantity').value = 1;
    renderView();
});

document.getElementById('sort-by').addEventListener('change', renderReceipts);
document.getElementById('filter-date').addEventListener('input', renderReceipts);
document.getElementById('filter-total-min').addEventListener('input', renderReceipts);
document.getElementById('filter-total-max').addEventListener('input', renderReceipts);
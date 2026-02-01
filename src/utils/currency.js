// Currency conversion rates (you can update these or fetch from API)
const EXCHANGE_RATES = {
  USD: 1,
  EUR: 0.85,
  GBP: 0.73,
  ZAR: 18.50, // South African Rand
  CAD: 1.25,
  AUD: 1.35,
  JPY: 110,
  INR: 75,
  BRL: 5.2,
  MXN: 20
};

const CURRENCY_SYMBOLS = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  ZAR: 'R',
  CAD: 'C$',
  AUD: 'A$',
  JPY: '¥',
  INR: '₹',
  BRL: 'R$',
  MXN: '$'
};

// Detect user's currency based on location
export const detectUserCurrency = () => {
  try {
    // Try multiple detection methods
    let currency = 'USD';
    
    // Method 1: Check timezone
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (timezone.includes('Africa/Johannesburg') || timezone.includes('Africa/Cape_Town')) {
      return 'ZAR';
    }
    
    // Method 2: Check locale
    const locale = navigator.language || navigator.languages?.[0] || 'en-US';
    const region = locale.split('-')[1];
    
    const currencyMap = {
      'US': 'USD',
      'GB': 'GBP', 
      'ZA': 'ZAR',
      'DE': 'EUR',
      'FR': 'EUR',
      'ES': 'EUR',
      'IT': 'EUR',
      'NL': 'EUR',
      'CA': 'CAD',
      'AU': 'AUD',
      'JP': 'JPY',
      'IN': 'INR',
      'BR': 'BRL',
      'MX': 'MXN'
    };
    
    currency = currencyMap[region] || 'USD';
    
    // Method 3: Check for South African indicators
    if (locale.toLowerCase().includes('af') || 
        navigator.language?.toLowerCase().includes('af-za')) {
      return 'ZAR';
    }
    
    return currency;
  } catch (error) {
    return 'ZAR'; // Fallback to USD
  }
};

// Convert price from USD to target currency
export const convertPrice = (usdPrice, targetCurrency = 'USD') => {
  if (!EXCHANGE_RATES[targetCurrency]) return usdPrice;
  return Math.round(usdPrice * EXCHANGE_RATES[targetCurrency] * 100) / 100;
};

// Format price with currency symbol
export const formatPrice = (price, currency = 'USD') => {
  const symbol = CURRENCY_SYMBOLS[currency] || '$';
  const convertedPrice = convertPrice(price, currency);
  
  // Format based on currency
  if (currency === 'JPY') {
    return `${symbol}${Math.round(convertedPrice)}`;
  }
  
  return `${symbol}${convertedPrice.toFixed(2)}`;
};

// Get currency info
export const getCurrencyInfo = (currency = 'USD') => ({
  code: currency,
  symbol: CURRENCY_SYMBOLS[currency] || '$',
  rate: EXCHANGE_RATES[currency] || 1
});

// Get all available currencies for selector
export const getAvailableCurrencies = () => {
  return Object.keys(EXCHANGE_RATES).map(code => ({
    code,
    symbol: CURRENCY_SYMBOLS[code],
    name: {
      USD: 'US Dollar',
      EUR: 'Euro',
      GBP: 'British Pound',
      ZAR: 'South African Rand',
      CAD: 'Canadian Dollar',
      AUD: 'Australian Dollar',
      JPY: 'Japanese Yen',
      INR: 'Indian Rupee',
      BRL: 'Brazilian Real',
      MXN: 'Mexican Peso'
    }[code] || code
  }));
};
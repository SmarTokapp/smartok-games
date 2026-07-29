// i18n-loader.js

const SUPPORTED_LANGUAGES = ['en', 'es', 'zh', 'fr', 'de', 'pt', 'it', 'ja', 'ar', 'hi'];
const DEFAULT_LANGUAGE = 'en';

class I18nLoader {
    constructor() {
        this.currentLang = this.detectLanguage();
        this.translations = {};
    }

    detectLanguage() {
        try {
            // 1. Primary Check: URL Parameter (e.g., ?lang=ar)
            const urlParams = new URLSearchParams(window.location.search);
            const urlLang = urlParams.get('lang');
            
            if (urlLang && SUPPORTED_LANGUAGES.includes(urlLang)) {
                console.log(`[i18n] Language detected from URL parameter: ${urlLang}`);
                return urlLang;
            }

            // 2. Secondary Check: Native device/browser language
            const deviceLang = (navigator.language || navigator.userLanguage).split('-')[0];
            if (SUPPORTED_LANGUAGES.includes(deviceLang)) {
                console.log(`[i18n] Language detected from device natively: ${deviceLang}`);
                return deviceLang;
            }

            // 3. Absolute Fallback: Default language
            console.warn(`[i18n] Unsupported or missing language trigger. Enforcing default fallback: ${DEFAULT_LANGUAGE}`);
            return DEFAULT_LANGUAGE;

        } catch (error) {
            console.error("[i18n] CRITICAL: Language detection failed. Forcing default fallback.", error);
            return DEFAULT_LANGUAGE;
        }
    }

    async init(gameId) {
        try {
            // Use centralized locales folder at ../locales/ relative to game directories
            const response = await fetch(`../locales/${this.currentLang}.json`);

            if (!response.ok) {
                throw new Error(`HTTP fetch failed with status: ${response.status}`);
            }

            const data = await response.json();
            this.translations = data[gameId] || {};

            console.log(`[i18n] Dictionary loaded successfully for game ID: ${gameId}`);
            this.applyTranslationsToDOM();

        } catch (error) {
            console.error(`[i18n] ERROR: Failed to fetch dictionary for ${this.currentLang}.`, error);

            // Fallback to English if the requested language fails
            if (this.currentLang !== DEFAULT_LANGUAGE) {
                console.log(`[i18n] Falling back to English dictionary`);
                try {
                    const fallbackResponse = await fetch(`../locales/${DEFAULT_LANGUAGE}.json`);
                    if (fallbackResponse.ok) {
                        const fallbackData = await fallbackResponse.json();
                        this.translations = fallbackData[gameId] || {};
                        this.applyTranslationsToDOM();
                        console.log(`[i18n] English fallback dictionary loaded successfully`);
                    }
                } catch (fallbackError) {
                    console.error(`[i18n] CRITICAL: English fallback also failed`, fallbackError);
                }
            }
        }
    }

    applyTranslationsToDOM() {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (this.translations[key]) {
                if (el.tagName === 'INPUT' || el.tagName === 'BUTTON') {
                    el.value = this.translations[key];
                    el.textContent = this.translations[key];
                } else {
                    el.textContent = this.translations[key];
                }
            } else {
                console.warn(`[i18n] Warning: Missing translation key in dictionary: ${key}`);
            }
        });
    }

    // Manual translation trigger for dynamic Canvas/JavaScript text
    t(key) {
        if (!this.translations[key]) {
            console.warn(`[i18n] Warning: Missing dynamic translation key: ${key}`);
            return key; 
        }
        return this.translations[key];
    }
}

// Instantiate globally for the games to access
const gameI18n = new I18nLoader();
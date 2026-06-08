(function () {
    "use strict";

    var LANGS = ["pt", "en", "es", "fr", "ru", "zh", "ja", "hi", "de"];
    var STORAGE_KEY = "image-ia-lang";
    var LANG_CHOSEN_KEY = "image-ia-lang-chosen";
    var THEME_KEY = "image-ia-theme";
    var COPY_MS = 2000;
    var SITE = "image.ia.br";
    var SWIPE_MIN = 36;

    var currentLang = "pt";

    function pageTitle(suffix) {
        return SITE + " // " + suffix;
    }

    var T = {
        en: {
            label: "English", htmlLang: "en",
            badge: "Domain for sale",
            lead: "This domain is available for purchase.",
            copyAria: "Copy email", copyAriaDone: "Email copied", copyDone: "Copied",
            langPrev: "Previous language", langNext: "Next language", langChoose: "choose", langMenu: "Choose language",
            themeLight: "Use light theme", themeDark: "Use dark theme",
            footer: "All rights reserved.",
            titleSuffix: "domain for sale",
            description: "The domain image.ia.br is for sale.",
        },
        zh: {
            label: "中文", htmlLang: "zh-CN",
            badge: "域名出售",
            lead: "该域名可供购买。",
            copyAria: "复制邮箱", copyAriaDone: "邮箱已复制", copyDone: "已复制",
            langPrev: "上一个语言", langNext: "下一个语言", langChoose: "选择", langMenu: "选择语言",
            themeLight: "使用浅色主题", themeDark: "使用深色主题",
            footer: "版权所有。",
            titleSuffix: "域名出售",
            description: "域名 image.ia.br 正在出售。",
        },
        es: {
            label: "Español", htmlLang: "es",
            badge: "Dominio en venta",
            lead: "Este dominio está disponible para compra.",
            copyAria: "Copiar correo", copyAriaDone: "Correo copiado", copyDone: "Copiado",
            langPrev: "Idioma anterior", langNext: "Siguiente idioma", langChoose: "elegir", langMenu: "Elegir idioma",
            themeLight: "Usar tema claro", themeDark: "Usar tema oscuro",
            footer: "Todos los derechos reservados.",
            titleSuffix: "dominio en venta",
            description: "El dominio image.ia.br está en venta.",
        },
        pt: {
            label: "Português", htmlLang: "pt-BR",
            badge: "Domínio à venda",
            lead: "Este domínio está disponível para compra.",
            copyAria: "Copiar e-mail", copyAriaDone: "E-mail copiado", copyDone: "Copiado",
            langPrev: "Idioma anterior", langNext: "Próximo idioma", langChoose: "escolher", langMenu: "Escolher idioma",
            themeLight: "Usar tema claro", themeDark: "Usar tema escuro",
            footer: "Todos os direitos reservados.",
            titleSuffix: "domínio à venda",
            description: "O domínio image.ia.br está à venda.",
        },
        hi: {
            label: "हिन्दी", htmlLang: "hi",
            badge: "डोमेन बिक्री के लिए",
            lead: "यह डोमेन खरीद के लिए उपलब्ध है।",
            copyAria: "ईमेल कॉपी करें", copyAriaDone: "ईमेल कॉपी हो गया", copyDone: "कॉपी हो गया",
            langPrev: "पिछली भाषा", langNext: "अगली भाषा", langChoose: "चुनें", langMenu: "भाषा चुनें",
            themeLight: "लाइट थीम", themeDark: "डार्क थीम",
            footer: "सर्वाधिकार सुरक्षित।",
            titleSuffix: "डोमेन बिक्री",
            description: "डोमेन image.ia.br बिक्री के लिए है।",
        },
        fr: {
            label: "Français", htmlLang: "fr",
            badge: "Domaine à vendre",
            lead: "Ce domaine est disponible à l'achat.",
            copyAria: "Copier l'e-mail", copyAriaDone: "E-mail copié", copyDone: "Copié",
            langPrev: "Langue précédente", langNext: "Langue suivante", langChoose: "choisir", langMenu: "Choisir la langue",
            themeLight: "Thème clair", themeDark: "Thème sombre",
            footer: "Tous droits réservés.",
            titleSuffix: "domaine à vendre",
            description: "Le domaine image.ia.br est à vendre.",
        },
        ru: {
            label: "Русский", htmlLang: "ru",
            badge: "Домен на продажу",
            lead: "Этот домен доступен для покупки.",
            copyAria: "Копировать email", copyAriaDone: "Email скопирован", copyDone: "Скопировано",
            langPrev: "Предыдущий язык", langNext: "Следующий язык", langChoose: "выбрать", langMenu: "Выбрать язык",
            themeLight: "Светлая тема", themeDark: "Тёмная тема",
            footer: "Все права защищены.",
            titleSuffix: "домен на продажу",
            description: "Домен image.ia.br продаётся.",
        },
        de: {
            label: "Deutsch", htmlLang: "de",
            badge: "Domain zu verkaufen",
            lead: "Diese Domain steht zum Kauf zur Verfügung.",
            copyAria: "E-Mail kopieren", copyAriaDone: "E-Mail kopiert", copyDone: "Kopiert",
            langPrev: "Vorherige Sprache", langNext: "Nächste Sprache", langChoose: "wählen", langMenu: "Sprache wählen",
            themeLight: "Helles Design", themeDark: "Dunkles Design",
            footer: "Alle Rechte vorbehalten.",
            titleSuffix: "Domain zu verkaufen",
            description: "Die Domain image.ia.br steht zum Verkauf.",
        },
        ja: {
            label: "日本語 · Japan", htmlLang: "ja",
            badge: "ドメイン売却",
            lead: "このドメインは購入可能です。",
            copyAria: "メールをコピー", copyAriaDone: "コピーしました", copyDone: "コピー済",
            langPrev: "前の言語", langNext: "次の言語", langChoose: "選択", langMenu: "言語を選択",
            themeLight: "ライトテーマ", themeDark: "ダークテーマ",
            footer: "全著作権所有。",
            titleSuffix: "ドメイン売却",
            description: "ドメイン image.ia.br は売却中です。",
        },
    };

    function langIndex(lang) {
        return LANGS.indexOf(lang);
    }

    function detectBrowserLang() {
        var list = navigator.languages && navigator.languages.length
            ? navigator.languages
            : [navigator.language || "pt"];

        for (var i = 0; i < list.length; i++) {
            var base = (list[i] || "").toLowerCase().split("-")[0];
            if (LANGS.indexOf(base) >= 0) return base;
        }
        return "pt";
    }

    function initialLang() {
        var q = new URLSearchParams(location.search).get("lang");
        if (q && LANGS.indexOf(q) >= 0) {
            return { lang: q, persist: true };
        }

        try {
            if (localStorage.getItem(LANG_CHOSEN_KEY) === "1") {
                var saved = localStorage.getItem(STORAGE_KEY);
                if (saved && LANGS.indexOf(saved) >= 0) {
                    return { lang: saved, persist: true };
                }
            }
        } catch (e) { /* ignore */ }

        return { lang: detectBrowserLang(), persist: false };
    }

    function systemTheme() {
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }

    function getStoredTheme() {
        try {
            var stored = localStorage.getItem(THEME_KEY);
            if (stored === "light" || stored === "dark") return stored;
        } catch (e) { /* ignore */ }
        return null;
    }

    function applyTheme(theme) {
        document.documentElement.setAttribute("data-theme", theme);

        var meta = document.querySelector('meta[name="theme-color"]');
        if (meta) {
            meta.setAttribute("content", theme === "dark" ? "#0b0b0b" : "#ffffff");
        }

        var btn = document.querySelector("[data-theme-toggle]");
        if (btn && T[currentLang]) {
            var label = theme === "dark" ? T[currentLang].themeLight : T[currentLang].themeDark;
            btn.setAttribute("aria-label", label);
        }
    }

    function bindTheme() {
        var btn = document.querySelector("[data-theme-toggle]");
        if (!btn) return;

        btn.addEventListener("click", function () {
            var next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
            try {
                localStorage.setItem(THEME_KEY, next);
            } catch (e) { /* ignore */ }
            applyTheme(next);
        });

        var mq = window.matchMedia("(prefers-color-scheme: dark)");
        mq.addEventListener("change", function () {
            if (!getStoredTheme()) applyTheme(systemTheme());
        });
    }

    function syncUrl(lang) {
        var url = new URL(location.href);
        if (lang === "pt") {
            url.searchParams.delete("lang");
        } else {
            url.searchParams.set("lang", lang);
        }
        var qs = url.searchParams.toString();
        history.replaceState(null, "", url.pathname + (qs ? "?" + qs : "") + url.hash);
    }

    function buildCarousel() {
        var track = document.querySelector(".lang-carousel__track");
        if (!track) return;

        track.innerHTML = "";
        LANGS.forEach(function (code) {
            var slide = document.createElement("span");
            slide.className = "lang-carousel__slide";
            slide.textContent = T[code].label;
            track.appendChild(slide);
        });
    }

    function buildPicker() {
        var menu = document.querySelector("[data-lang-picker-menu]");
        if (!menu) return;

        menu.innerHTML = "";
        LANGS.forEach(function (code) {
            var li = document.createElement("li");
            var btn = document.createElement("button");
            btn.type = "button";
            btn.className = "lang-picker__option";
            btn.setAttribute("role", "option");
            btn.setAttribute("data-lang", code);
            btn.textContent = T[code].label;
            btn.addEventListener("click", function () {
                closePicker();
                switchLang(code, true);
            });
            li.appendChild(btn);
            menu.appendChild(li);
        });
    }

    function updatePickerActive(lang) {
        document.querySelectorAll(".lang-picker__option").forEach(function (btn) {
            var on = btn.getAttribute("data-lang") === lang;
            btn.classList.toggle("is-active", on);
            btn.setAttribute("aria-selected", on ? "true" : "false");
        });
    }

    function positionPickerMenu() {
        var toggle = document.querySelector("[data-lang-picker-toggle]");
        var menu = document.querySelector("[data-lang-picker-menu]");
        if (!toggle || !menu || menu.hidden) return;

        menu.classList.remove("is-drop-up", "is-align-left");

        var tr = toggle.getBoundingClientRect();
        var mr = menu.getBoundingClientRect();
        var gap = 6;
        var pad = 8;
        var spaceBelow = window.innerHeight - tr.bottom - gap - pad;
        var spaceAbove = tr.top - gap - pad;

        if (mr.height > spaceBelow && spaceAbove > spaceBelow) {
            menu.classList.add("is-drop-up");
            mr = menu.getBoundingClientRect();
        }

        if (mr.right > window.innerWidth - pad) {
            menu.classList.add("is-align-left");
        }
    }

    function closePicker() {
        var root = document.querySelector("[data-lang-picker]");
        var toggle = document.querySelector("[data-lang-picker-toggle]");
        var menu = document.querySelector("[data-lang-picker-menu]");
        if (!root || !toggle || !menu) return;
        root.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        menu.hidden = true;
        menu.classList.remove("is-drop-up", "is-align-left");
    }

    function openPicker() {
        var root = document.querySelector("[data-lang-picker]");
        var toggle = document.querySelector("[data-lang-picker-toggle]");
        var menu = document.querySelector("[data-lang-picker-menu]");
        if (!root || !toggle || !menu) return;
        root.classList.add("is-open");
        toggle.setAttribute("aria-expanded", "true");
        menu.hidden = false;
        updatePickerActive(currentLang);
        requestAnimationFrame(function () {
            positionPickerMenu();
        });
    }

    function bindPicker() {
        var toggle = document.querySelector("[data-lang-picker-toggle]");
        if (!toggle) return;

        toggle.addEventListener("click", function (e) {
            e.stopPropagation();
            var menu = document.querySelector("[data-lang-picker-menu]");
            if (menu && !menu.hidden) {
                closePicker();
            } else {
                openPicker();
            }
        });

        document.addEventListener("click", function (e) {
            if (!e.target.closest("[data-lang-picker]")) closePicker();
        });

        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape") closePicker();
        });

        window.addEventListener("resize", function () {
            positionPickerMenu();
        });

        window.addEventListener("scroll", function () {
            positionPickerMenu();
        }, true);
    }

    function setCarouselPosition(lang, animate) {
        var track = document.querySelector(".lang-carousel__track");
        if (!track) return;
        var idx = langIndex(lang);
        if (idx < 0) return;

        track.classList.toggle("is-animating", !!animate);
        track.style.transform = "translateX(-" + idx * 100 + "%)";
    }

    function apply(lang, persist) {
        var t = T[lang];
        if (!t) return;

        currentLang = lang;

        document.documentElement.lang = t.htmlLang;
        document.documentElement.removeAttribute("dir");
        document.title = pageTitle(t.titleSuffix);

        var meta = document.querySelector('meta[name="description"]');
        if (meta) meta.setAttribute("content", t.description);

        document.querySelectorAll("[data-i18n]").forEach(function (el) {
            var k = el.getAttribute("data-i18n");
            if (t[k] !== undefined) el.textContent = t[k];
        });

        document.querySelectorAll("[data-i18n-aria]").forEach(function (el) {
            if (el.classList.contains("is-copied")) return;
            var k = el.getAttribute("data-i18n-aria");
            if (t[k] !== undefined) el.setAttribute("aria-label", t[k]);
        });

        if (persist) {
            try {
                localStorage.setItem(STORAGE_KEY, lang);
                localStorage.setItem(LANG_CHOSEN_KEY, "1");
            } catch (e) { /* ignore */ }
        }

        syncUrl(lang);

        var theme = document.documentElement.getAttribute("data-theme") || "light";
        applyTheme(theme);
        updatePickerActive(lang);
    }

    function switchLang(lang, animate) {
        if (!T[lang] || lang === currentLang) return;
        closePicker();
        apply(lang, true);
        setCarouselPosition(lang, animate);
    }

    function cycleLang(delta) {
        var idx = langIndex(currentLang);
        var next = LANGS[(idx + delta + LANGS.length) % LANGS.length];
        switchLang(next, true);
    }

    function bindCarousel() {
        var root = document.querySelector("[data-lang-carousel]");
        if (!root) return;

        var prev = root.querySelector(".lang-carousel__prev");
        var next = root.querySelector(".lang-carousel__next");
        var windowEl = root.querySelector(".lang-carousel__window");

        if (prev) {
            prev.addEventListener("click", function () {
                cycleLang(-1);
            });
        }

        if (next) {
            next.addEventListener("click", function () {
                cycleLang(1);
            });
        }

        if (!windowEl) return;

        var startX = 0;
        var startY = 0;
        var tracking = false;

        windowEl.addEventListener("touchstart", function (e) {
            if (!e.touches.length) return;
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            tracking = true;
        }, { passive: true });

        windowEl.addEventListener("touchend", function (e) {
            if (!tracking || !e.changedTouches.length) return;
            tracking = false;

            var dx = e.changedTouches[0].clientX - startX;
            var dy = e.changedTouches[0].clientY - startY;

            if (Math.abs(dx) < SWIPE_MIN || Math.abs(dx) < Math.abs(dy)) return;
            cycleLang(dx < 0 ? 1 : -1);
        }, { passive: true });

        windowEl.addEventListener("keydown", function (e) {
            if (e.key === "ArrowLeft") {
                e.preventDefault();
                cycleLang(-1);
            } else if (e.key === "ArrowRight") {
                e.preventDefault();
                cycleLang(1);
            }
        });
    }

    function copyAriaLabel(btn, copied) {
        var key = copied ? "copyAriaDone" : "copyAria";
        var t = T[currentLang];
        if (t && t[key]) btn.setAttribute("aria-label", t[key]);
    }

    function bindCopy() {
        document.querySelectorAll(".email-copy[data-copy]").forEach(function (btn) {
            var timer;
            btn.addEventListener("click", function () {
                var text = btn.getAttribute("data-copy");
                if (!text) return;

                function done() {
                    btn.classList.add("is-copied");
                    var doneEl = btn.querySelector(".email-copy__done");
                    if (doneEl) doneEl.setAttribute("aria-hidden", "false");
                    copyAriaLabel(btn, true);
                    clearTimeout(timer);
                    timer = setTimeout(function () {
                        btn.classList.remove("is-copied");
                        if (doneEl) doneEl.setAttribute("aria-hidden", "true");
                        copyAriaLabel(btn, false);
                    }, COPY_MS);
                }

                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(text).then(done).catch(fallback);
                } else {
                    fallback();
                }

                function fallback() {
                    var ta = document.createElement("textarea");
                    ta.value = text;
                    ta.setAttribute("readonly", "");
                    ta.style.cssText = "position:fixed;left:-9999px";
                    document.body.appendChild(ta);
                    ta.select();
                    try {
                        if (document.execCommand("copy")) done();
                    } finally {
                        document.body.removeChild(ta);
                    }
                }
            });
        });
    }

    buildCarousel();
    buildPicker();
    var init = initialLang();
    apply(init.lang, init.persist);
    setCarouselPosition(init.lang, false);
    bindTheme();
    bindCarousel();
    bindPicker();
    bindCopy();
})();

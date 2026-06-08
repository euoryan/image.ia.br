(function () {
    "use strict";

    var LANGS = ["pt", "en", "es"];
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
        pt: {
            badge: "Domínio à venda",
            lead: "Este domínio está disponível para compra.",
            copyAria: "Copiar e-mail",
            copyAriaDone: "E-mail copiado",
            copyDone: "Copiado",
            langPrev: "Idioma anterior",
            langNext: "Próximo idioma",
            themeToggle: "Alternar tema",
            themeLight: "Usar tema claro",
            themeDark: "Usar tema escuro",
            footer: "Todos os direitos reservados.",
            titleSuffix: "domínio à venda",
            description: "O domínio image.ia.br está à venda.",
            htmlLang: "pt-BR",
        },
        en: {
            badge: "Domain for sale",
            lead: "This domain is available for purchase.",
            copyAria: "Copy email",
            copyAriaDone: "Email copied",
            copyDone: "Copied",
            langPrev: "Previous language",
            langNext: "Next language",
            themeToggle: "Toggle theme",
            themeLight: "Use light theme",
            themeDark: "Use dark theme",
            footer: "All rights reserved.",
            titleSuffix: "domain for sale",
            description: "The domain image.ia.br is for sale.",
            htmlLang: "en",
        },
        es: {
            badge: "Dominio en venta",
            lead: "Este dominio está disponible para compra.",
            copyAria: "Copiar correo",
            copyAriaDone: "Correo copiado",
            copyDone: "Copiado",
            langPrev: "Idioma anterior",
            langNext: "Siguiente idioma",
            themeToggle: "Cambiar tema",
            themeLight: "Usar tema claro",
            themeDark: "Usar tema oscuro",
            footer: "Todos los derechos reservados.",
            titleSuffix: "dominio en venta",
            description: "El dominio image.ia.br está en venta.",
            htmlLang: "es",
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
            var tag = (list[i] || "").toLowerCase();
            if (tag.indexOf("en") === 0) return "en";
            if (tag.indexOf("es") === 0) return "es";
            if (tag.indexOf("pt") === 0) return "pt";
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
        if (btn) {
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
    }

    function switchLang(lang, animate) {
        if (!T[lang] || lang === currentLang) return;
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

    var init = initialLang();
    apply(init.lang, init.persist);
    setCarouselPosition(init.lang, false);
    bindTheme();
    bindCarousel();
    bindCopy();
})();

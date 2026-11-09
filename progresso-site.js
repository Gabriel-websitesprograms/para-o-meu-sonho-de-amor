(() => {
    const progressKey = "projeto-leticia-progresso-site-v6";
    const previousProgressKey = "projeto-leticia-progresso-site-v5";
    const legacyProgressKey = "projeto-leticia-progresso-site-v4";
    const removedRouteIndex = 3;
    const menuPath = "Site principal/nossas-coisas/Botoes.html";
    const routes = [
        { path: "Site principal/historia/NossaHistoria.html", title: "Nossa história", chapter: "Nossa história", query: "tocarMusica=sim" },
        { path: "Site principal/nossas-coisas/constelacao.html", title: "Nossa Constelação", chapter: "Nossa Constelação" },
        { path: "Site principal/datas/27 de agosto de 2026.html", title: "27 de agosto de 2026", chapter: "Datas" },
        { path: "Site principal/datas/10deoutubrode2026.html", title: "10 de outubro de 2026", chapter: "Datas" },
        { path: "Site principal/datas/21 de outubro de 2026.html", title: "21 de outubro de 2026", chapter: "Datas" },
        { path: "Site principal/datas/24 de outubro de 2026.html", title: "24 de outubro de 2026", chapter: "Datas" },
        { path: "Site principal/datas/01 de novembro de 2026.html", title: "O dia em que conheci meus sogros", chapter: "Datas" },
        { path: "Site principal/nossas-coisas/Fotos.html", title: "Fotos", chapter: "Nossas coisas" },
        { path: "Site principal/nossas-coisas/videos.html", title: "Vídeos", chapter: "Nossas coisas" },
        { path: "Site principal/nossas-coisas/presentes.html", title: "Presentes", chapter: "Nossas coisas" },
        { path: "Site principal/nossas-coisas/nossa-playlist.html", title: "Nossa playlist", chapter: "Nossas coisas" },
        { path: "Site principal/nossas-coisas/viagens.html", title: "Viagens dos nossos sonhos", chapter: "Viagens dos nossos sonhos" },
        { path: "Site principal/nossas-coisas/paises-para-viajar.html", title: "Passaporte de viagens", chapter: "Agência de viagens" },
        { path: "Site principal/nossas-coisas/nossas-memorias.html", title: "Nossas memórias", chapter: "Nossas memórias" },
        { path: "Site principal/nossas-coisas/Suas series favoritos.html", title: "Séries favoritas", chapter: "Suas coisas favoritas" },
        { path: "Site principal/nossas-coisas/SeusFilmesfavoritos.html", title: "Filmes favoritos", chapter: "Suas coisas favoritas" },
        { path: "Site principal/nossas-coisas/suasmusicasfavoritas.html", title: "Músicas favoritas", chapter: "Suas coisas favoritas" },
        { path: "Site principal/nossas-coisas/o-bahia-dela.html", title: "O Bahia dela", chapter: "Suas coisas favoritas" },
        { path: "Site principal/nossas-coisas/frank-ocean.html", title: "Frank Ocean", chapter: "Suas coisas favoritas" },
        { path: "Site principal/nossas-coisas/Musicas dedicadas.html", title: "Músicas dedicadas", chapter: "Dedico a você" },
        { path: "Pedido-de-namoro.html", title: "Um Pedido", chapter: "Um Pedido", final: true }
    ];

    const script = document.currentScript;
    if (!script?.src) {
        console.error("Não foi possível localizar a URL do sistema de progressão.");
        return;
    }

    const siteRoot = new URL("./", script.src);
    const menuUrl = new URL(menuPath.split("/").map(encodeURIComponent).join("/"), siteRoot);
    const unlockedLinkParameter = "roteiroCompleto";
    const unlockedLinkMode = new URLSearchParams(window.location.search).get(unlockedLinkParameter) === "sim";
    if (unlockedLinkMode) menuUrl.searchParams.set(unlockedLinkParameter, "sim");
    const photosRouteIndex = routes.findIndex((route) => route.title === "Fotos");
    const chapters = [...new Set(routes.map((route) => route.chapter))];
    const getRouteUrl = (route) => {
        const url = new URL(route.path.split("/").map(encodeURIComponent).join("/"), siteRoot);
        if (route.query) url.search = route.query;
        if (unlockedLinkMode) url.searchParams.set(unlockedLinkParameter, "sim");
        return url;
    };
    const normalizePath = (pathname) => {
        try {
            return decodeURIComponent(pathname).replace(/\\/g, "/").replace(/\/+$/, "").toLocaleLowerCase("pt-BR");
        } catch (error) {
            console.error("Não foi possível interpretar o endereço da página.", error);
            return pathname.replace(/\\/g, "/").replace(/\/+$/, "").toLocaleLowerCase("pt-BR");
        }
    };
    const reservedPagePath = normalizePath(new URL(
        "Site principal/datas/15deoutubrode2026.html".split("/").map(encodeURIComponent).join("/"),
        siteRoot
    ).pathname);

    const currentPath = normalizePath(window.location.pathname);
    const currentIndex = routes.findIndex((route) =>
        currentPath === normalizePath(getRouteUrl(route).pathname)
    );
    const isMenu = currentPath === normalizePath(menuUrl.pathname);

    const createElement = (tagName, className, text) => {
        const element = document.createElement(tagName);
        if (className) element.className = className;
        if (text) element.textContent = text;
        return element;
    };
    if (currentPath === reservedPagePath) {
        document.title = "Página reservada";
        const screen = createElement("main", "progression-lock-screen");
        const card = createElement("section", "progression-lock-card");
        const heading = createElement("h1", "", "Página reservada");
        const description = createElement("p", "", "Este espaço será usado para um novo texto.");
        const returnLink = createElement("a", "progression-button", "Voltar ao menu");
        returnLink.href = menuUrl.href;
        card.append(heading, description, returnLink);
        screen.append(card);
        document.body.replaceChildren(screen);
        document.body.classList.add("progression-blocked", "progression-ready");
        return;
    }
    if (currentIndex === -1 && !isMenu) {
        document.body.classList.add("progression-ready");
        return;
    }
    const getChapterIndex = (routeIndex) => chapters.indexOf(routes[routeIndex].chapter);
    const getChapterPage = (routeIndex) => {
        const chapter = routes[routeIndex].chapter;
        const chapterRoutes = routes.filter((route) => route.chapter === chapter);
        const page = chapterRoutes.findIndex((route) => route === routes[routeIndex]);
        return { page: page + 1, total: chapterRoutes.length };
    };
    const createChapterProgress = (routeIndex, pagesCompleted) => {
        const { total } = getChapterPage(routeIndex);
        const meter = createElement("div", "progression-meter");
        const bar = document.createElement("progress");
        bar.className = "progression-meter-bar";
        bar.max = total;
        bar.value = Math.min(pagesCompleted, total);
        bar.setAttribute("aria-label", `Páginas concluídas neste capítulo: ${bar.value} de ${total}`);
        const count = createElement("span", "progression-meter-count", `${bar.value} de ${total} páginas`);
        meter.append(bar, count);
        return { meter, bar, count };
    };
    const getChapterStart = (chapterIndex) =>
        routes.findIndex((route) => route.chapter === chapters[chapterIndex]);
    const isChapterUnlocked = (chapterIndex) =>
        chapterIndex === 0 || completed >= getChapterStart(chapterIndex);
    const lockedChapterMessages = [
        "Calma, apressada kkkk",
        "Devagar, princesa kkk",
        "Também quero que você chegue aqui",
        "Calmaaaa",
        "Acho que você tem que seguir uma ordem, não? Kkkkk"
    ];
    let lockedMessageIndex = 0;
    let lockedMessageElement;
    let lockedMessageTimer = 0;
    const showLockedChapterMessage = () => {
        if (!lockedMessageElement) {
            lockedMessageElement = createElement("p", "chapter-lock-message");
            lockedMessageElement.setAttribute("role", "status");
            lockedMessageElement.setAttribute("aria-live", "polite");
            lockedMessageElement.setAttribute("aria-atomic", "true");
            document.body.append(lockedMessageElement);
        }

        lockedMessageElement.textContent =
            lockedChapterMessages[lockedMessageIndex % lockedChapterMessages.length];
        lockedMessageIndex += 1;
        lockedMessageElement.classList.add("is-visible");
        window.clearTimeout(lockedMessageTimer);
        lockedMessageTimer = window.setTimeout(() => {
            lockedMessageElement.classList.remove("is-visible");
        }, 3200);
    };
    const maskLockedChapters = () => {
        document.querySelectorAll(".menu-romantico [data-chapter-index]").forEach((item) => {
            const chapterIndex = Number(item.dataset.chapterIndex) - 1;
            if (!Number.isInteger(chapterIndex) || isChapterUnlocked(chapterIndex)) return;

            item.classList.add("chapter-locked");
            item.querySelector(".submenu")?.remove();
            const control = [...item.children].find((child) =>
                child.matches("a, button")
            );
            if (!control) return;

            const label = createElement("button", "chapter-locked-label");
            label.type = "button";
            label.setAttribute("aria-label", "Capítulo bloqueado. Clique para uma mensagem.");
            label.title = "Clique para uma mensagem";
            label.addEventListener("click", showLockedChapterMessage);
            const number = control.querySelector(".menu-roteiro-numero");
            if (number) {
                const chapterNumber = number.cloneNode(true);
                chapterNumber.setAttribute("aria-hidden", "true");
                label.append(chapterNumber);
            }
            label.append(createElement("span", "chapter-locked-icon", "🔒"));
            label.setAttribute("aria-label", "Capítulo bloqueado");
            label.setAttribute("role", "img");
            control.replaceWith(label);
        });
    };
    const showLockedPage = () => {
        document.title = "Capítulo bloqueado";
        const screen = createElement("main", "progression-lock-screen");
        const card = createElement("section", "progression-lock-card");
        const heading = createElement("h1", "", "🔒 Capítulo bloqueado");
        const description = createElement(
            "p",
            "",
            "Leia as páginas anteriores na ordem para liberar esta página."
        );
        const returnLink = createElement("a", "progression-button", "Voltar ao menu");
        returnLink.href = menuUrl.href;
        card.append(heading, description, returnLink);
        screen.append(card);
        document.body.replaceChildren(screen);
        document.body.classList.add("progression-blocked", "progression-ready");
    };

    let completed = 0;
    let storageAvailable = true;
    let storageError = "";
    try {
        const shouldRestart = !unlockedLinkMode
            && currentIndex === 0
            && new URLSearchParams(window.location.search).get("reiniciarProgresso") === "sim";
        let saved = shouldRestart
            ? null
            : unlockedLinkMode
                ? String(routes.length)
                : window.localStorage.getItem(progressKey);
        if (saved === null && !shouldRestart) {
            const previousProgress = window.localStorage.getItem(previousProgressKey);
            const legacyProgress = previousProgress === null
                ? window.localStorage.getItem(legacyProgressKey)
                : null;
            const progressToMigrate = previousProgress ?? legacyProgress;
            if (progressToMigrate !== null) {
                const previousCompleted = Number(progressToMigrate);
                const maximumPreviousProgress = previousProgress === null ? routes.length : routes.length - 1;
                if (!Number.isInteger(previousCompleted) || previousCompleted < 0 || previousCompleted > maximumPreviousProgress) {
                    throw new TypeError("O valor salvo para o progresso anterior do site é inválido.");
                }
                const afterRemovedRoute = previousProgress === null
                    ? Math.max(0, previousCompleted - (previousCompleted > removedRouteIndex ? 1 : 0))
                    : previousCompleted;
                const migratedCompleted = afterRemovedRoute + (afterRemovedRoute > 1 ? 1 : 0);
                saved = String(migratedCompleted);
                window.localStorage.setItem(progressKey, saved);
            }
        }
        if (saved !== null) {
            const parsed = Number(saved);
            if (!Number.isInteger(parsed) || parsed < 0 || parsed > routes.length) {
                throw new TypeError("O valor salvo para o progresso do site é inválido.");
            }
            completed = parsed;
        }
        if (unlockedLinkMode) {
            window.localStorage.setItem(progressKey, String(routes.length));
        }
        if (shouldRestart) {
            window.localStorage.setItem(progressKey, "0");
            const cleanUrl = new URL(window.location.href);
            cleanUrl.searchParams.delete("reiniciarProgresso");
            window.history.replaceState(window.history.state, "", cleanUrl);
        }
    } catch (error) {
        storageAvailable = false;
        storageError = "Não foi possível acessar o armazenamento do navegador. O progresso não será salvo.";
        console.error("Não foi possível carregar o progresso do site.", error);
    }

    if (isMenu) {
        maskLockedChapters();
        if (unlockedLinkMode) {
            document.querySelectorAll(".menu-romantico [data-chapter-index] > a").forEach((link) => {
                const unlockedUrl = new URL(link.href);
                unlockedUrl.searchParams.set(unlockedLinkParameter, "sim");
                link.href = unlockedUrl.href;
            });
        }
        const photoFrame = document.querySelector(".photo-frame");
        if (photoFrame) photoFrame.hidden = completed <= photosRouteIndex;
        document.body.classList.add("progression-ready");
        const isComplete = completed === routes.length;
        if (completed === routes.length - 1) {
            const unlockPanel = createElement("section", "progression-panel progression-unlock-link");
            unlockPanel.setAttribute("aria-labelledby", "progression-unlock-title");
            const unlockDetails = createElement("div", "progression-details");
            const unlockHeading = createElement("p", "progression-title", "Uma versão completa para guardar");
            unlockHeading.id = "progression-unlock-title";
            unlockDetails.append(unlockHeading);
            const unlockMessage = createElement(
                "p",
                "progression-message",
                "Antes do pedido, abra este link para deixar todas as partes do roteiro liberadas."
            );
            const unlockButton = createElement("a", "progression-button", "Abrir versão completa →");
            const unlockedUrl = new URL(menuUrl.href);
            unlockedUrl.searchParams.set(unlockedLinkParameter, "sim");
            unlockButton.href = unlockedUrl.href;
            unlockPanel.append(unlockDetails, unlockMessage, unlockButton);
            const menu = document.querySelector(".menu-romantico");
            if (menu) {
                menu.insertAdjacentElement("afterend", unlockPanel);
            } else {
                document.body.insertBefore(unlockPanel, document.body.firstChild);
            }
        }
        if (isComplete) return;

        const start = createElement("section", "progression-panel progression-start");
        start.setAttribute("aria-labelledby", "progression-start-title");
        const heading = createElement("p", "progression-title", "Continuar nosso roteiro");
        heading.id = "progression-start-title";
        const routeIndex = Math.min(completed, routes.length - 1);
        const route = routes[routeIndex];
        const chapterTransitionPending = completed > 0
            && getChapterIndex(completed - 1) !== getChapterIndex(routeIndex);
        const step = createElement(
            "p",
            "progression-step",
            chapterTransitionPending
                ? `Próximo capítulo: ${route.chapter}`
                : `Capítulo ${getChapterIndex(routeIndex) + 1} de ${chapters.length} · ${route.chapter}`
        );
        const details = createElement("div", "progression-details");
        details.append(heading, step);
        const chapterStart = getChapterStart(getChapterIndex(routeIndex));
        const progress = createChapterProgress(routeIndex, completed - chapterStart);
        const message = createElement("p", "progression-message");
        message.setAttribute("role", "status");
        message.setAttribute("aria-live", "polite");
        const startLink = chapterTransitionPending ? null : createElement("a", "progression-button");
        if (startLink) {
            startLink.textContent = completed === 0 ? "Começar capítulo 1 →" : "Continuar →";
            start.append(details, progress.meter, message, startLink);
        } else {
            heading.textContent = "Capítulo concluído";
            message.textContent = "Escolha o próximo capítulo no menu para continuar.";
            start.append(details, progress.meter, message);
        }
        const menu = document.querySelector(".menu-romantico");
        if (menu) {
            menu.insertAdjacentElement("afterend", start);
        } else {
            document.body.insertBefore(start, document.body.firstChild);
        }

        if (storageAvailable) {
            if (startLink) startLink.href = getRouteUrl(route).href;
        } else {
            if (startLink) startLink.href = getRouteUrl(route).href;
            message.textContent = storageError;
        }
        return;
    }

    document.body.classList.add("progression-content-page");
    document.querySelectorAll(".menu-romantico").forEach((navigation) => navigation.remove());

    if (!isChapterUnlocked(getChapterIndex(currentIndex)) || currentIndex > completed) {
        showLockedPage();
        return;
    }
    const route = routes[currentIndex];
    const nextRoute = routes[currentIndex + 1];
    const chapterIndex = getChapterIndex(currentIndex);
    const { page, total } = getChapterPage(currentIndex);
    const chapterStart = getChapterStart(chapterIndex);
    const chapterProgress = createChapterProgress(currentIndex, completed - chapterStart);
    const isChapterEnd = !nextRoute || nextRoute.chapter !== route.chapter;
    const isFinalRoute = route.final === true;
    const isNextUnreadPage = currentIndex === completed;

    const panel = createElement(
        "section",
        `progression-panel ${isChapterEnd ? "progression-chapter-transition" : "progression-page-navigation"}`
    );
    panel.setAttribute("aria-labelledby", "progression-title");
    const heading = createElement(
        "p",
        "progression-title",
        isFinalRoute ? "Roteiro completo!" : isChapterEnd ? "Capítulo concluído" : "Continue a leitura"
    );
    heading.id = "progression-title";
    const step = createElement(
        "p",
        "progression-step",
        isChapterEnd
            ? `Capítulo ${chapterIndex + 1} de ${chapters.length} · ${route.chapter}`
            : `${route.chapter} · Página ${page} de ${total}`
    );
    const details = createElement("div", "progression-details");
    details.append(heading, step);
    const message = createElement("p", "progression-message");
    message.setAttribute("role", "status");
    message.setAttribute("aria-live", "polite");
    const nextLink = createElement("a", "progression-button");
    const previousLink = createElement(
        "a",
        "progression-button progression-back-button",
        currentIndex > 0 ? "← Página anterior" : "← Voltar ao menu"
    );
    previousLink.href = currentIndex > 0 ? getRouteUrl(routes[currentIndex - 1]).href : menuUrl.href;
    nextLink.textContent = isFinalRoute
        ? "Abrir menu completo →"
        : isChapterEnd
            ? "Voltar ao menu e escolher o próximo capítulo →"
            : `Próxima página: ${nextRoute.title} →`;
    nextLink.hidden = true;
    panel.hidden = isFinalRoute;
    const actions = createElement("div", "progression-actions");
    actions.append(previousLink, nextLink);
    panel.append(details, chapterProgress.meter, message, actions);
    const photosFooter = document.querySelector(".photos-footer");
    if (photosFooter) {
        photosFooter.insertAdjacentElement("beforebegin", panel);
    } else {
        document.body.append(panel);
    }
    document.body.classList.add("progression-ready");

    if (!storageAvailable) {
        panel.hidden = false;
        message.textContent = storageError;
        return;
    }
    if (!isNextUnreadPage) {
        const hasNextRoute = currentIndex < routes.length - 1;
        nextLink.href = isChapterEnd || !hasNextRoute
            ? menuUrl.href
            : getRouteUrl(nextRoute).href;
        nextLink.textContent = isFinalRoute
            ? "Abrir menu completo →"
            : isChapterEnd
                ? "Voltar ao menu e escolher o próximo capítulo →"
                : hasNextRoute
                    ? `Próxima página: ${nextRoute.title} →`
                    : "Voltar ao menu";
        nextLink.hidden = false;
        panel.hidden = isFinalRoute;
        message.textContent = isFinalRoute
            ? "Roteiro completo. Você pode voltar ao menu."
            : isChapterEnd
                ? "Capítulo concluído. Escolha o próximo no menu."
                : `Próxima página: ${nextRoute.title}.`;
    }

    let finished = false;
    let saveFailed = false;
    let finalAcceptanceAt = null;
    let finalRevealTimer = 0;
    const revealFinalPanel = () => {
        if (!isFinalRoute || !finished || finalAcceptanceAt === null || !panel.hidden) return;
        const remainingDelay = 45000 - (performance.now() - finalAcceptanceAt);
        if (remainingDelay > 0) {
            if (!finalRevealTimer) {
                finalRevealTimer = window.setTimeout(() => {
                    finalRevealTimer = 0;
                    revealFinalPanel();
                }, remainingDelay);
            }
            return;
        }
        panel.hidden = false;
    };

    if (isFinalRoute && currentIndex >= completed) {
        window.addEventListener("proposal:accepted", () => {
            if (finalAcceptanceAt !== null) return;
            finalAcceptanceAt = performance.now();
            revealFinalPanel();
        }, { once: true });
    }

    const finishPage = () => {
        if (finished || saveFailed || !storageAvailable) return;
        if (!isNextUnreadPage) {
            finished = true;
            panel.hidden = isFinalRoute;
            const hasNextRoute = currentIndex < routes.length - 1;
            nextLink.href = isChapterEnd || !hasNextRoute
                    ? menuUrl.href
                    : getRouteUrl(nextRoute).href;
            nextLink.textContent = isFinalRoute
                    ? "Abrir menu completo →"
                    : isChapterEnd
                        ? "Voltar ao menu e escolher o próximo capítulo →"
                        : hasNextRoute
                            ? `Próxima página: ${nextRoute.title} →`
                        : "Voltar ao menu";
            nextLink.hidden = false;
            message.textContent = isFinalRoute
                    ? "Roteiro completo. Você pode voltar ao menu."
                    : isChapterEnd
                        ? "Capítulo concluído. Escolha o próximo no menu."
                        : `Próxima página: ${nextRoute.title}.`;
            return;
        }
        const nextCompleted = currentIndex + 1;
        const isLastPage = currentIndex + 1 === routes.length;
        try {
            window.localStorage.setItem(progressKey, String(nextCompleted));
            completed = nextCompleted;
            finished = true;
            if (isLastPage) {
                revealFinalPanel();
            } else {
                panel.hidden = false;
            };
            heading.textContent = isLastPage
                ? "Roteiro completo!"
                : isChapterEnd
                    ? "Capítulo concluído!"
                    : "Página concluída!";
            chapterProgress.bar.value = Math.min(nextCompleted - chapterStart, total);
            chapterProgress.bar.setAttribute(
                "aria-label",
                `Páginas concluídas neste capítulo: ${chapterProgress.bar.value} de ${total}`
            );
            chapterProgress.count.textContent = `${chapterProgress.bar.value} de ${total} páginas`;
            nextLink.href = isLastPage || isChapterEnd ? menuUrl.href : getRouteUrl(nextRoute).href;
            nextLink.textContent = isLastPage
                ? "Abrir menu completo →"
                : isChapterEnd
                    ? "Voltar ao menu e escolher o próximo capítulo →"
                    : `Próxima página: ${nextRoute.title} →`;
            nextLink.hidden = false;
            message.textContent = isChapterEnd
                ? "Progresso do capítulo salvo."
                : "Página salva no roteiro.";
        } catch (error) {
            saveFailed = true;
            panel.hidden = false;
            message.textContent = "Não foi possível salvar o progresso. Ative o armazenamento local e tente novamente.";
            console.error("Não foi possível salvar o progresso do site.", error);
        }
    };

    const minimumViewDurationMs = 2500;
    const pageShownAt = performance.now();
    let endCheckTimer = 0;
    const checkPageEnd = () => {
        if (finished || saveFailed) return;
        if (window.scrollY + window.innerHeight < document.documentElement.scrollHeight - 4) return;

        const remainingViewTime = minimumViewDurationMs - (performance.now() - pageShownAt);
        if (remainingViewTime > 0) {
            if (!endCheckTimer) {
                endCheckTimer = window.setTimeout(() => {
                    endCheckTimer = 0;
                    checkPageEnd();
                }, remainingViewTime);
            }
            return;
        }

        finishPage();
    };

    if (!storageAvailable) {
        finished = true;
    } else {
        window.addEventListener("scroll", checkPageEnd, { passive: true });
        window.addEventListener("resize", checkPageEnd);
        window.setTimeout(checkPageEnd, 0);
    }
})();

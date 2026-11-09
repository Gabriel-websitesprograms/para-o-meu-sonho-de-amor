(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const cursor = document.createElement("span");
    cursor.className = "airplane-cursor";
    cursor.setAttribute("aria-hidden", "true");
    cursor.textContent = "✈";
    document.body.append(cursor);
    document.body.classList.add("airplane-cursor-active");

    let lastParticleTime = 0;
    let lastX = 0;
    let lastY = 0;
    let hasMoved = false;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const createHeart = (x, y) => {
        const heart = document.createElement("span");
        heart.className = "airplane-heart-particle";
        heart.setAttribute("aria-hidden", "true");
        heart.textContent = "♡";
        heart.style.left = `${x}px`;
        heart.style.top = `${y}px`;
        heart.style.setProperty("--heart-rotation", `${Math.round(Math.random() * 50 - 25)}deg`);
        document.body.append(heart);
        heart.addEventListener("animationend", () => heart.remove(), { once: true });
    };

    window.addEventListener("pointermove", (event) => {
        cursor.style.left = `${event.clientX}px`;
        cursor.style.top = `${event.clientY}px`;
        cursor.classList.add("is-visible");

        if (!reducedMotion) {
            const now = performance.now();
            const distance = Math.hypot(event.clientX - lastX, event.clientY - lastY);
            if (now - lastParticleTime >= 85 && (distance >= 4 || !hasMoved)) {
                createHeart(event.clientX - 8, event.clientY + 12);
                lastParticleTime = now;
            }
        }

        lastX = event.clientX;
        lastY = event.clientY;
        hasMoved = true;
    }, { passive: true });

    window.addEventListener("pointerleave", () => cursor.classList.remove("is-visible"));
    window.addEventListener("pointerdown", () => cursor.classList.add("is-clicking"));
    window.addEventListener("pointerup", () => cursor.classList.remove("is-clicking"));
})();

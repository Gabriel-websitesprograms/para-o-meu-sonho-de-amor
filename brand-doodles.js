(() => {
    const script = document.currentScript;
    const edgeOnly = script?.dataset.edgeOnly === "true";
    const positions = [
        { left: [6, 36], top: [8, 35] },
        { left: [64, 94], top: [8, 35] },
        { left: [6, 36], top: [65, 90] },
        { left: [64, 94], top: [65, 90] }
    ];

    for (let index = positions.length - 1; index > 0; index -= 1) {
        const swapIndex = Math.floor(Math.random() * (index + 1));
        [positions[index], positions[swapIndex]] = [positions[swapIndex], positions[index]];
    }

    const fragment = document.createDocumentFragment();

    for (const side of ["left", "right"]) {
        const blossom = document.createElement("span");
        blossom.className = `edge-blossom edge-blossom-${side}`;
        blossom.style.backgroundImage = `url("${new URL("imagens/flor-de-cerejeira-bordas.png", script.src).href}")`;
        blossom.style.position = "fixed";
        blossom.style.zIndex = "-1";
        blossom.setAttribute("aria-hidden", "true");
        fragment.append(blossom);
    }

    if (!edgeOnly) {
        for (const position of positions) {
            const doodle = document.createElement("span");
            doodle.className = "love-doodle";
            doodle.textContent = "G+L";
            doodle.setAttribute("aria-hidden", "true");
            doodle.style.left = `${position.left[0] + Math.random() * (position.left[1] - position.left[0])}%`;
            doodle.style.top = `${position.top[0] + Math.random() * (position.top[1] - position.top[0])}%`;
            doodle.style.transform = `rotate(${Math.round(Math.random() * 36 - 18)}deg)`;
            fragment.append(doodle);
        }
    }

    document.body.append(fragment);
})();

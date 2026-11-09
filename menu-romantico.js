document.querySelectorAll("[data-voltar]").forEach((link) => {
    link.addEventListener("click", (event) => {
        if (window.history.length > 1) {
            event.preventDefault();
            window.history.back();
        }
    });
});

const menuRomantico = document.querySelector(".menu-romantico");

if (menuRomantico) {
    const indicador = menuRomantico.querySelector(".indicador");
    const itensMenu = [...menuRomantico.querySelectorAll(".menu-item")];
    let itemAtivo = itensMenu[0];

    const moverIndicador = (item) => {
        if (!indicador || !item) return;
        itemAtivo = item;
        itensMenu.forEach((itemMenu) => itemMenu.classList.toggle("is-active", itemMenu === item));
        indicador.style.top = `${item.offsetTop}px`;
        indicador.style.left = `${item.offsetLeft}px`;
        indicador.style.width = `${item.offsetWidth}px`;
        indicador.style.height = `${item.offsetHeight}px`;
        indicador.style.opacity = "1";
    };

    itensMenu.forEach((item) => {
        item.addEventListener("pointerenter", () => moverIndicador(item));
    });

    menuRomantico.addEventListener("focusin", (event) => {
        const item = event.target instanceof Element
            ? event.target.closest(".menu-item")
            : null;
        if (item) moverIndicador(item);
    });

    menuRomantico.addEventListener("pointerleave", () => {
        const itemEmFoco = document.activeElement instanceof Element
            ? document.activeElement.closest(".menu-item")
            : null;
        moverIndicador(itensMenu.includes(itemEmFoco) ? itemEmFoco : itensMenu[0]);
    });

    window.addEventListener("resize", () => moverIndicador(itemAtivo));
    moverIndicador(itemAtivo);
}

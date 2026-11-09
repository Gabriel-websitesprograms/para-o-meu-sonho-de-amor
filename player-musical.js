(() => {
const scriptDoPlayer = document.currentScript;
const serie = scriptDoPlayer?.dataset.serie;
const trilhas = {
    supernatural: {
        titulo: "Carry On Wayward Son — Kansas",
        arquivo: "Trilhas-sonoras-series-e-filmes/trilhasonora-supernatural/Kansas - Carry On Wayward Son (Official Audio).mp3",
    },
    vampireDiaries: {
        titulo: "Skinny Love — Birdy",
        arquivo: "Trilhas-sonoras-series-e-filmes/Diariodeumvampro-trilhasonora/Birdy - Skinny Love (Official Music Video).mp3",
    },
};
const nomesSeries = {
    supernatural: "Supernatural",
    theOriginals: "The Originals",
    vampireDiaries: "The Vampire Diaries",
};

if (!scriptDoPlayer || !nomesSeries[serie]) {
    throw new Error("O player precisa informar uma série válida em data-serie.");
}

const faixa = trilhas[serie];
const chaveEstado = `player-serie-${serie}`;
const player = document.createElement("section");
const botao = document.createElement("button");
const volumeLabel = document.createElement("label");
const volume = document.createElement("input");
const estado = document.createElement("span");
const audio = new Audio();
let ultimoSalvamento = 0;

player.className = `player-serie player-serie--${serie}`;
player.setAttribute("aria-label", `Trilha sonora de ${nomesSeries[serie]}`);
botao.className = "player-serie__toggle";
botao.type = "button";
botao.disabled = !faixa;
botao.setAttribute("aria-pressed", "false");
botao.textContent = faixa ? "Tocar música" : "Áudio pendente";
volumeLabel.className = "player-serie__volume-label";
volumeLabel.htmlFor = `volume-serie-${serie}`;
volumeLabel.textContent = "Volume";
volume.type = "range";
volume.id = `volume-serie-${serie}`;
volume.className = "player-serie__volume";
volume.min = "0";
volume.max = "1";
volume.step = "0.05";
volume.value = "0.35";
volume.disabled = !faixa;
estado.className = "player-serie__status";
estado.setAttribute("aria-live", "polite");
estado.textContent = faixa
    ? "Tentando iniciar a trilha automaticamente."
    : `Adicione um arquivo de áudio de ${nomesSeries[serie]} para ativar a trilha.`;
audio.preload = "metadata";
audio.loop = true;
audio.volume = Number(volume.value);
audio.hidden = true;

player.append(botao, volumeLabel, volume, estado, audio);
document.body.append(player);

if (!faixa) {
    return;
}

audio.src = new URL(faixa.arquivo, scriptDoPlayer.src).href;
audio.addEventListener("error", () => {
    estado.textContent = "Não foi possível carregar a trilha sonora. Verifique se o arquivo está disponível.";
    console.error(`Falha ao carregar a trilha de ${serie}: ${audio.src}`);
});

const salvarEstado = () => {
    try {
        sessionStorage.setItem(chaveEstado, JSON.stringify({
            tempo: audio.currentTime,
            reproduzindo: !audio.paused,
            volume: audio.volume,
        }));
    } catch (error) {
        console.error("Não foi possível preservar o estado da trilha entre páginas.", error);
    }
};

try {
    const estadoSalvo = JSON.parse(sessionStorage.getItem(chaveEstado) || "null");
    if (estadoSalvo) {
        if (Number.isFinite(estadoSalvo.tempo) && estadoSalvo.tempo > 0) {
            audio.addEventListener("loadedmetadata", () => {
                if (Number.isFinite(audio.duration) && audio.duration > 0) {
                    audio.currentTime = estadoSalvo.tempo % audio.duration;
                }
            }, { once: true });
    }
        if (Number.isFinite(estadoSalvo.volume)) {
            audio.volume = Math.max(0, Math.min(1, estadoSalvo.volume));
            volume.value = String(audio.volume);
        }
    }
} catch (error) {
    console.error("Não foi possível restaurar o estado da trilha sonora.", error);
}

const atualizarControles = () => {
    const estaTocando = !audio.paused;
    botao.textContent = estaTocando ? "Pausar música" : "Tocar música";
    botao.setAttribute("aria-pressed", String(estaTocando));
};

audio.addEventListener("play", () => {
    atualizarControles();
    estado.textContent = faixa.titulo;
});
audio.addEventListener("pause", atualizarControles);
audio.addEventListener("timeupdate", () => {
    if (audio.currentTime - ultimoSalvamento < 5) return;
    ultimoSalvamento = audio.currentTime;
    salvarEstado();
});

volume.addEventListener("input", () => {
    audio.volume = Number(volume.value);
    salvarEstado();
});

botao.addEventListener("click", async () => {
    if (!audio.paused) {
        audio.pause();
        salvarEstado();
        estado.textContent = "Trilha pausada.";
        return;
    }

    try {
        await audio.play();
    } catch (error) {
        estado.textContent = "Não foi possível reproduzir a trilha. Verifique o arquivo e as permissões do navegador.";
        console.error(`Falha ao reproduzir a trilha de ${serie}.`, error);
    }
});

window.addEventListener("pagehide", salvarEstado);

audio.play().catch((error) => {
    estado.textContent = "A reprodução automática foi bloqueada pelo navegador. Use “Tocar música” para iniciar.";
    if (error.name !== "NotAllowedError") {
        console.error(`Falha ao iniciar automaticamente a trilha de ${serie}.`, error);
    }
});
})();

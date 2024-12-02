document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("modal");
    const closeButton = document.getElementById("closeButton");
    const modalImage = document.getElementById("modalImage");
    const modalText = document.getElementById("modalText");
    const fbButton = document.getElementById("fbButton");

    document.querySelectorAll(".day-card").forEach((card) => {
        card.addEventListener("click", () => {
            if (card.classList.contains("locked")) return;

            const day = card.getAttribute("data-day");
            fetch(`${day}.txt`)
                .then((response) => response.text())
                .then((data) => {
                    const lines = data.trim().split("\n");
                    const content = lines.slice(0, -1).join("\n");
                    const link = lines[lines.length - 1];

                    modalImage.src = `${day}.jpg`;
                    modalText.textContent = content;
                    fbButton.href = link;

                    modal.style.display = "flex";
                })
                .catch(() => alert(`Hiba történt a(z) ${day}. napi tartalom betöltésekor.`));
        });
    });

    closeButton.addEventListener("click", () => {
        modal.style.display = "none";
    });

    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
});

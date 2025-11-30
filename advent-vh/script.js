document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("modal");
    const closeButton = document.getElementById("closeButton");
    const modalImage = document.getElementById("modalImage");
    const modalText = document.getElementById("modalText");
    const fbButton = document.getElementById("fbButton");
    const modalTitle = document.getElementById("modalTitle");

    document.querySelectorAll(".day-card").forEach((card) => {
        card.addEventListener("click", () => {
            if (card.classList.contains("locked")) return;

            const day = card.getAttribute("data-day");
            fetch(`${day}.txt`)
                .then((response) => response.text())
                .then((data) => {
                    const lines = data.split("\n");
                    const streetName = lines[0];
                    const content = lines.slice(1, -1).join("<br>");
                    const link = lines[lines.length - 1];

                    modalTitle.textContent = `${day}. ablak: ${streetName}`;
                    modalImage.src = `${day}.jpg`;
                    modalText.innerHTML = `<p>${content}</p>`;
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

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('snow-canvas');
    const ctx = canvas.getContext('2d');

    // A canvas méretének beállítása
    function setCanvasSize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    const snowflakes = [];
    const numberOfSnowflakes = 100; // Hópelyhek száma

    // Hópehely osztály
    class Snowflake {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1; // 1 és 4 közötti méret
            this.speedX = Math.random() * 0.5 - 0.25; // Enyhe vízszintes mozgás
            this.speedY = Math.random() * 1.5 + 0.5; // 0.5 és 2 közötti sebesség
        }

        // Hópehely frissítése (mozgatása)
        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Ha a hópehely leért, dobjuk vissza a tetejére
            if (this.y > canvas.height) {
                this.y = 0;
                this.x = Math.random() * canvas.width;
            }
        }

        // Hópehely rajzolása
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'; // Átlátszó fehér
            ctx.fill();
        }
    }

    // Hópelyhek inicializálása
    function init() {
        for (let i = 0; i < numberOfSnowflakes; i++) {
            snowflakes.push(new Snowflake());
        }
    }

    // Animációs ciklus
    function animate() {
        // A canvas törlése minden képkockán
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        snowflakes.forEach(snowflake => {
            snowflake.update();
            snowflake.draw();
        });

        requestAnimationFrame(animate);
    }

    // Indítás
    init();
    animate();
});
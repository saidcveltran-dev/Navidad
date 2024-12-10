// Configuración del sorteo
const eventDate = new Date('2024-12-10T11:00:00'); // Fecha y hora del sorteo
const countdownElement = document.getElementById('countdown');
const eventDateElement = document.getElementById('event-date');
let sorteoRealizado = false; // Estado del sorteo

// Mostrar la fecha y hora del sorteo en formato local
eventDateElement.textContent = eventDate.toLocaleString('es-es');

// Prevenir múltiples envíos del webhook
let webhookSent = false;

// Actualización del temporizador principal
function updateCountdown() {
    const now = new Date();
    const difference = eventDate - now;

    if (difference <= 0 && !secondaryCountdownStarted && !sorteoRealizado) {
        clearInterval(interval);
        startSecondaryCountdown();
    } else if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        countdownElement.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;

        if (difference <= 5 * 60 * 1000 && !webhookSent) {
            sendWebhookAlert();
            webhookSent = true;
        }
    }
}

// Temporizador adicional de 10 segundos
let secondaryCountdownStarted = true;

function startSecondaryCountdown() {
    const now = new Date();
    if (now >= eventDate) {
        countdownElement.textContent = "El sorteo ya se realizó. El ganador se encuentra en Discord en #Anuncios.";
        return;
    }

    secondaryCountdownStarted = true;
    let countdown = 10;

    const interval = setInterval(() => {
        countdownElement.textContent = `${countdown} segundos`;
        if (countdown === 0) {
            clearInterval(interval);
            if (!sorteoRealizado) {
                showRoulette();
            } else {
                displayCompletedMessage();
            }
        }
        countdown--;
    }, 1000);
}

// Mostrar mensaje de sorteo ya realizado
function displayCompletedMessage() {
    countdownElement.textContent = "El sorteo ya se realizó. El ganador se encuentra en Discord en #Anuncios.";
}

// Función para mostrar la ruleta
function showRoulette() {
    sorteoRealizado = true;
    fetch('participants.json')
        .then(response => response.json())
        .then(data => loadRoulette(data, new Date().getTime()))
        .catch(error => console.error("Error al cargar participantes:", error));
}

// Enviar alerta al Discord Webhook
function sendWebhookAlert() {
    fetch('https://discord.com/api/webhooks/1315864338032230410/ryOF60AKczhJzslfqoRZnSqJPXovneg8ISZG82p_cZvm-Ivfbp9YDS96mfxAaB-z1CP7', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            embeds: [
                {
                    title: "🎅 ¡El sorteo navideño está cerca! 🎄",
                    description: "**Faltan menos de 5 minutos para el evento. ¡Prepárate!** @everyone",
                    color: 16711680,
                    image: { url: 'https://cdn.discordapp.com/attachments/1315114302990192731/1315913138071408790/christmas_banner.gif' },
                    footer: {
                        text: "¡Nos vemos en el evento!",
                        icon_url: 'https://cdn-icons-png.flaticon.com/512/3723/3723050.png'
                    },
                    fields: [
                        { name: "🎁 Premio", value: "**ELECCIÓN DE LA TIENDA** (GRATIS)", inline: true },
                        { name: "🎮 Fecha y Hora", value: "25 Dic 2024, 6:00 PM", inline: true }
                    ],
                    url: "https://www.surcraft.xyz"
                }
            ],
            components: [
                {
                    type: 1,
                    components: [
                        {
                            type: 2,
                            style: 5,
                            label: "Ir a la página del evento",
                            url: "https://www.surcraft.xyz"
                        }
                    ]
                }
            ]
        })
    }).then(response => console.log("Webhook de alerta enviado."))
      .catch(console.error);
}
// Muestra el conteo de jugadores de SurCraft Network
fetch('https://api.mcsrvstat.us/2/play.surcraft.xyz')
    .then(response => response.json())
    .then(data => {
        if (data.online) {
            document.getElementById('player-count').textContent = 
                `${data.players.online}`;
        } else {
            document.getElementById('player-count').textContent = "Servidor offline";
        }
    })
    .catch(() => {
        document.getElementById('player-count').textContent = "Error al cargar";
    });
// Iniciar temporizador
const interval = setInterval(updateCountdown, 1000);

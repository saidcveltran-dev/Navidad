
// Lógica de la ruleta
function loadRoulette(participants, seed) {
    const rouletteContainer = document.getElementById('roulette-container');
    rouletteContainer.innerHTML = ''; // Limpiar ruleta previa
    rouletteContainer.style.display = 'block';

    const totalSegments = participants.reduce((sum, p) => sum + p.count, 0);
    const anglePerSegment = 360 / totalSegments;
    let currentAngle = 0;

    participants.forEach(participant => {
        for (let i = 0; i < participant.count; i++) {
            const segment = document.createElement('div');
            segment.classList.add('roulette-segment');
            segment.style.transform = `rotate(${currentAngle}deg)`;
            segment.style.backgroundColor = i % 2 === 0 ? '#FFB6C1' : '#FF6961';
            segment.textContent = participant.name;
            rouletteContainer.appendChild(segment);
            currentAngle += anglePerSegment;
        }
    });

    spinRoulette(participants, seed);
}

function spinRoulette(participants, seed) {
    const rouletteContainer = document.getElementById('roulette-container');
    const totalSegments = participants.reduce((sum, p) => sum + p.count, 0);
    const randomAngle = Math.floor(seed % totalSegments) * (360 / totalSegments);
    const finalAngle = 3600 - randomAngle;

    rouletteContainer.style.transition = 'transform 10s ease-out';
    rouletteContainer.style.transform = `rotate(${finalAngle}deg)`;

    setTimeout(() => {
        const winner = determineWinner(participants, randomAngle / (360 / totalSegments));
        displayWinner(winner);
        announceWinner(winner);
    }, 10000);
}

function determineWinner(participants, winnerIndex) {
    let cumulativeCount = 0;
    for (const participant of participants) {
        cumulativeCount += participant.count;
        if (winnerIndex < cumulativeCount) return participant;
    }
}

function displayWinner(winner) {
    const winnerDisplay = document.getElementById('winner-display');
    winnerDisplay.style.display = 'block';
    document.getElementById('winner-name').textContent = winner.name;
}

function announceWinner(winner) {
    fetch('https://discord.com/api/webhooks/1315864338032230410/ryOF60AKczhJzslfqoRZnSqJPXovneg8ISZG82p_cZvm-Ivfbp9YDS96mfxAaB-z1CP7', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            content: `@everyone 🎉 ¡Felicidades a ${winner.name} por ganar el sorteo navideño! 🎄`,
            embeds: [
                {
                    title: "🎁 Ganador del Sorteo",
                    description: `${winner.name} ha ganado el premio principal.`,
                    color: 65280
                }
            ]
        })
    }).then(response => console.log("Ganador anunciado en Discord."))
      .catch(console.error);
}

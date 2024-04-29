let playerNameInput = document.getElementById('playername-input'); // Nome do Jogador [String]
let roundsInput = document.getElementById('rounds-input'); // Número de Rounds [String]

let currentRound = 1; // Round Atual
let victoriesPlayer = 0; // Vitórias do Jogador
let victoriesComputer = 0; // Vitórias do Computador
let totalRounds = 0; // Rounds Totais escolhidos pelo jogador no registro

let max_round_game_config = 100; // Número máximo de rodadas aceitáveis

let tempoDecorrido = 0; // Tempo decorrido em segundos
let cronometroInterval; // Referência para o intervalo do cronômetro
let cronometroRodando = false;

document.addEventListener('DOMContentLoaded', function() {
    if (roundsInput) {
        roundsInput.placeholder = `Até ${max_round_game_config} rodadas`;
    }
})

function registerPlayer() {
    const nameErrorWarning = document.getElementById('name-error-warning');
    const roundsNumberErrorWarning = document.getElementById('roundsnumber-error-warning');

    // Validação do nome do jogador
    const playerName = playerNameInput.value.trim();
    if (playerName === "") {
        nameErrorWarning.innerText = 'Digite um nome válido.';
        return;
    } else {
        nameErrorWarning.innerText = '';
    }

    // Validação do número de rodadas
    const roundsToWin = parseInt(roundsInput.value);
    if (isNaN(roundsToWin) || roundsToWin < 1 || roundsToWin > max_round_game_config) {
        roundsNumberErrorWarning.innerText = `O número de rodadas deve ser entre 1 e .${max_round_game_config}`;
        return;
    } else {
        roundsNumberErrorWarning.innerText = '';
        totalRounds = roundsToWin;
    }

    // Ocultar o formulário após validação
    const infoPlayerForm = document.getElementById('form-div');
    if (infoPlayerForm) {
        infoPlayerForm.style.display = 'none';
    }

    // Atualizar nome do jogador no elemento de texto
    const formattedPlayerName = capitalize(playerName);
    const playerNameElement = document.getElementById('player-name');
    if (playerNameElement) {
        playerNameElement.innerText = formattedPlayerName;
    }

    console.log("O jogo vai começar!");
    gameStart();
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function gameStart() {
    // Iniciar cronômetro
    iniciarCronometro();

    // Atualizar informações da rodada inicial
    updateRoundInfo();
}

function iniciarCronometro() {
    if (!cronometroRodando) {
        cronometroInterval = setInterval(() => {
            tempoDecorrido++; // Incrementa o tempo decorrido em segundos
            updateTempoDecorrido(); // Atualiza o texto do tempo decorrido
        }, 1000); // Intervalo de 1 segundo (1000 milissegundos)
        cronometroRodando = true;
    }
}

function pausarCronometro() {
    if (cronometroRodando) {
        clearInterval(cronometroInterval); // Para o intervalo do cronômetro
        cronometroRodando = false;
    }
}

function updateTempoDecorrido() {
    const gameTimeText = document.getElementById('timer-text-id');
    if (gameTimeText) {
        const minutos = Math.floor(tempoDecorrido / 60);
        const segundos = tempoDecorrido % 60;
        gameTimeText.innerText = `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
    }
}

function updateRoundInfo(resultMessage) {
    const currentRoundText = document.getElementById('atual-round-text-id');
    const maxRoundText = document.getElementById('max-round-choice-text-id');
    const resultRoundText = document.getElementById('text-round-info');
    const playerPointsDashboard = document.getElementById('player-points');
    const computerPointsDashboard = document.getElementById('computer-points');

    if (typeof resultMessage !== 'undefined') {
        // Executa a atribuição apenas se resultMessage não for undefined
        resultRoundText.innerHTML = resultMessage;
    }

    playerPointsDashboard.innerText = victoriesPlayer;
    computerPointsDashboard.innerText = victoriesComputer;
    currentRoundText.innerText = currentRound.toString();
    maxRoundText.innerText = totalRounds.toString();
}

function getPlayerChoice(choice) {
    if (currentRound <= totalRounds) {
        const computerChoice = getComputerChoice();
        const roundWinner = verificarVencedor(computerChoice, choice);

        // Exibir resultado da rodada
        const resultMessage = getRoundResultMessage(roundWinner, computerChoice, choice);

        // Atualizar placar de vitórias
        if (roundWinner === 'player') {
            victoriesPlayer++;
        } else if (roundWinner === 'computer') {
            victoriesComputer++;
        }

        updateRoundInfo(resultMessage);
    }
    
    currentRound++;

    if (currentRound > totalRounds) {
        // Fim do jogo, exibir resultado final
        pausarCronometro();
        displayGameResult();
    }
}

function getComputerChoice() {
    const choices = ['pedra', 'papel', 'tesoura'];
    const randomNumber = Math.floor(Math.random() * choices.length);
    return choices[randomNumber];
}

function verificarVencedor(computerChoice, playerChoice) {
    const winConditions = {
        'pedra': 'tesoura',
        'papel': 'pedra',
        'tesoura': 'papel'
    };

    if (computerChoice === playerChoice) {
        return 'empate';
    } else if (winConditions[playerChoice] === computerChoice) {
        return 'player';
    } else {
        return 'computer';
    }
}

function getRoundResultMessage(winner, computerChoice, playerChoice) {
    const choiceNames = {
        'pedra': '\u{1F5FF} PEDRA',
        'papel': '\u{1F9FB} PAPEL',
        'tesoura': '\u{270C}\u{FE0F} TESOURA'  // Combinação de emojis para Tesoura
    };

    const computerChoiceName = choiceNames[computerChoice];
    const playerChoiceName = choiceNames[playerChoice];

    if (winner === 'player') {
        return `${playerChoiceName} <small><b>[player]</b></small> vence ${computerChoiceName} <small><b>[computer]</b></small>`;
    } else if (winner === 'computer') {
        return `${computerChoiceName} <small><b>[computer]</b></small> vence ${playerChoiceName} <small><b>[player]</b></small>`;
    } else {
        return `Empate! Ambos escolheram <b>${playerChoiceName}</b>`;
    }
}

function displayGameResult() {
    console.log('Fim do jogo!');
    console.log(`Vitórias do jogador: ${victoriesPlayer}`);
    console.log(`Vitórias do computador: ${victoriesComputer}`);

    // Aqui você pode exibir o resultado final na interface do usuário
}
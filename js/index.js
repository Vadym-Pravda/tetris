////Sorry for my code )))
const PLAYFIELD_COLUMNS = 10;
const PLAYFIELD_ROWS = 20;

const TETROMINO_NAMES = [
    'O',
    'L',
    'J',
    'S',
    'Z',
    'T',
    'I'
];
const TETROMINOES = {
    O: [
        [1, 1],
        [1, 1]
    ],
    L: [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0],
    ],
    J: [
        [0, 1, 1],
        [0, 1, 0],
        [0, 1, 0],
    ],
    S: [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0],
    ],
    Z: [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0],
    ],
    T: [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0],
    ],
    I: [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ]
};

const gameOverBlock = document.querySelector('.game-over');
const btnRestart = document.querySelector('.restart')

///---------buttons------------///////

const controlBtnContainer = document.querySelector('.control-btn-game');
const btnPause = document.querySelector('.pause')

btnPause.addEventListener('click', togglePauseGame);
controlBtnContainer.addEventListener('click', (event) => {
    const clickedBtn = event.target.closest('.btn');
    if (clickedBtn) {
        handleButtonClick(clickedBtn.dataset.action);
    }
});

// import {
//     PLAYFIELD_COLUMNS,
//     PLAYFIELD_ROWS,
//     TETROMINO_NAMES,
//     TETROMINOES,
//     gameOverBlock,
//     btnRestart
// } from './utils.js';


// ДЗ №1
// 1. Додати інші фігури
// 2. Стилізувати нові фігури на свій погляд
// 3. Додати функцію рандому котра буде видавати випадкову фігуру
// 4. Ценрування фігури коли вона з'являється
// 5. Додати функцію ранромних кольорів для кожної нової фігури

// ДЗ №2
// 1. Поставити const rowTetro = -2; прописати код щоб працювало коректно
// 2. Зверстати поле для розрахунку балів гри
// 3. Прописати логіку і код розрахунку балів гри (1 ряд = 10; 2 ряди = 30; 3 ряди = 50; 4 = 100)
// 4. Реалізувати самостійний рух фігур до низу

// ДЗ №3
// 1. Зробити розмітку висновків гри по її завершенню
// 2. Зверстати окрему кнопку рестарт, що перезапускатиме гру посеред гри
// 3. Додати клавіатуру на екрані браузеру для руху фігур

// 4. Створити секцію, що відображатиме наступну фігуру, що випадатиме
// 5. Додати рівні гри при котрих збільшується швидкість 
//    падіння фігур та виводити їх на екран
// 6. Зберігати і виводити найкращий власний результат

let nextTetromino,
    timerInterval,
    formattedTime,
    currentSpeedLevel = 1,
    timeoutDuration,
    result;

let playfield,
    tetromino,
    timeoutId,
    requestId,
    cells,
    score = 0,
    isPaused = false,
    isGameOver = false;

init();
const timerInstance = startTimer();

function init() {
    gameOverBlock.style.display = 'none';
    isGameOver = false;
    generatePlayfield();
    generateNextTetromino(); // generate Next Tetromino
    generateTetromino();
    startLoop();
    cells = document.querySelectorAll('.tetris div');
    score = 0;
    countScore(null);
    drawNextTetromino(); // display Next Tetromino
    startTimer();
}
// Keydown events

document.addEventListener('keydown', onKeyDown)
btnRestart.addEventListener('click', function () {
    init();
});

function togglePauseGame() {
    isPaused = !isPaused;

    if (isPaused) {
        stopLoop();
    } else {
        startLoop();
    }
}

function onKeyDown(event) {
    // console.log(event);
    if (event.key == 'p') {
        togglePauseGame();
    }
    // if event.key == 'p'
    if (isPaused) {
        return
    }

    switch (event.key) {
        case ' ':
            dropTetrominoDown();
            break;
        case 'ArrowUp':
            rotateTetromino();
            break;
        case 'ArrowDown':
            moveTetrominoDown();
            break;
        case 'ArrowLeft':
            moveTetrominoLeft();
            break;
        case 'ArrowRight':
            moveTetrominoRight();
            break;
    }

    draw();
}

function dropTetrominoDown() {
    while (!isValid()) {
        tetromino.row++;
    }
    tetromino.row--;
}

function moveTetrominoDown() {
    tetromino.row += 1;
    if (isValid()) {
        tetromino.row -= 1;
        placeTetromino();
    }
}
function moveTetrominoLeft() {
    tetromino.column -= 1;
    if (isValid()) {
        tetromino.column += 1;
    }
}
function moveTetrominoRight() {
    tetromino.column += 1;
    if (isValid()) {
        tetromino.column -= 1;
    }
}



// functions generate playdields and tetromino

function generatePlayfield() {
    document.querySelector('.tetris').innerHTML = '';
    for (let i = 0; i < PLAYFIELD_ROWS * PLAYFIELD_COLUMNS; i++) {
        const div = document.createElement('div');
        document.querySelector('.tetris').append(div);
    }

    playfield = new Array(PLAYFIELD_ROWS).fill()
        .map(() => new Array(PLAYFIELD_COLUMNS).fill(0))
    // console.log(playfield);
}



//----------update function generateTetromino----------//

function generateTetromino() {
    tetromino = nextTetromino;
    generateNextTetromino();
    drawNextTetromino();
}


// draw

function drawPlayField() {

    for (let row = 0; row < PLAYFIELD_ROWS; row++) {
        for (let column = 0; column < PLAYFIELD_COLUMNS; column++) {
            // if(playfield[row][column] == 0) { continue };
            const name = playfield[row][column];
            const cellIndex = convertPositionToIndex(row, column);
            cells[cellIndex].classList.add(name);
        }
    }

}

function drawTetromino() {
    const name = tetromino.name;
    const tetrominoMatrixSize = tetromino.matrix.length;

    for (let row = 0; row < tetrominoMatrixSize; row++) {
        for (let column = 0; column < tetrominoMatrixSize; column++) {
            if (isOutsideTopBoard(row)) { continue }
            if (tetromino.matrix[row][column] == 0) { continue }
            const cellIndex = convertPositionToIndex(tetromino.row + row, tetromino.column + column);
            cells[cellIndex].classList.add(name);
        }
    }
}

function draw() {
    cells.forEach(function (cell) { cell.removeAttribute('class') });
    drawPlayField();
    drawTetromino();
}

function countScore(destroyRows) {
    switch (destroyRows) {
        case 1:
            score += 10;
            break;
        case 2:
            score += 30;
            break;
        case 3:
            score += 50;
            break;
        case 4:
            score += 100;
            break;
        default:
            score += 0;
    }
    document.querySelector('.score').innerHTML = score;
}

//------------GAME OVER---------//

function gameOver() {
    stopLoop();
    timerInstance.stop();
    updateRecords();  // new record

    const gameOverBlock = document.querySelector('.game-over');
    const resultElement = gameOverBlock.querySelector('.result');
    const timeElement = gameOverBlock.querySelector('.time');
    const speedElement = gameOverBlock.querySelector('.max-speed');

    const currentScore = score;
    const currentTime = formattedTime;
    const currentSpeed = currentSpeedLevel;

    resultElement.textContent = currentScore;
    timeElement.textContent = currentTime;
    speedElement.textContent = currentSpeed;

    const allRecords = getRecordsFromLocalStorage();

    displayRecords(allRecords);

    gameOverBlock.style.display = 'grid';
}




function getRandomElement(array) {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
}

function convertPositionToIndex(row, column) {
    return row * PLAYFIELD_COLUMNS + column;
}

function isOutsideTopBoard(row) {
    return tetromino.row + row < 0;
}

function placeTetromino() {
    const matrixSize = tetromino.matrix.length;
    for (let row = 0; row < matrixSize; row++) {
        for (let column = 0; column < matrixSize; column++) {
            if (!tetromino.matrix[row][column]) continue;
            if (isOutsideTopBoard(row)) {
                isGameOver = true;
                return;
            }
            playfield[tetromino.row + row][tetromino.column + column] = tetromino.name;
        }
    }
    const filledRows = findFilledRows();
    // console.log(filledRows);
    removeFillRows(filledRows);
    generateTetromino();
}

function removeFillRows(filledRows) {

    for (let i = 0; i < filledRows.length; i++) {
        const row = filledRows[i];
        dropRowsAbove(row);
    }
    countScore(filledRows.length);
}

function dropRowsAbove(rowDelete) {
    for (let row = rowDelete; row > 0; row--) {
        playfield[row] = playfield[row - 1];
    }

    playfield[0] = new Array(PLAYFIELD_COLUMNS).fill(0);
}

function findFilledRows() {
    const filledRows = [];
    for (let row = 0; row < PLAYFIELD_ROWS; row++) {
        let filledColumns = 0;
        for (let column = 0; column < PLAYFIELD_COLUMNS; column++) {
            if (playfield[row][column] != 0) {
                filledColumns++;
            }
        }
        if (PLAYFIELD_COLUMNS == filledColumns) {
            filledRows.push(row);
        }
    }
    return filledRows;
}

function moveDown() {
    moveTetrominoDown();
    draw();
    stopLoop();
    startLoop();
    if (isGameOver) {
        gameOver();
    }
}

function startLoop() {
    let timeoutDuration;

    switch (true) {
        case score >= 500:
            timeoutDuration = 300;
            currentSpeedLevel = 5;
            break;
        case score >= 400:
            timeoutDuration = 400;
            currentSpeedLevel = 4;
            break;
        case score >= 300:
            timeoutDuration = 500;
            currentSpeedLevel = 3;
            break;
        case score >= 200:
            timeoutDuration = 600;
            currentSpeedLevel = 2;
            break;
        case score >= 100:
            timeoutDuration = 700;
            currentSpeedLevel = 1;
            break;
        default:
            timeoutDuration = 700;
    }
    displaySpeed()
    timeoutId = setTimeout(() => (requestId = requestAnimationFrame(moveDown)), timeoutDuration);
}

function stopLoop() {
    cancelAnimationFrame(requestId);
    timeoutId = clearTimeout(timeoutId);
}

function rotateTetromino() {
    const oldMatrix = tetromino.matrix;
    const rotatedMatrix = rotateMatrix(tetromino.matrix);
    // array = rotateMatrix(array);
    tetromino.matrix = rotatedMatrix;
    if (isValid()) {
        tetromino.matrix = oldMatrix;
    }
}

function rotateMatrix(matrixTetromino) {
    const N = matrixTetromino.length;
    const rotateMatrix = [];
    for (let i = 0; i < N; i++) {
        rotateMatrix[i] = [];
        for (let j = 0; j < N; j++) {
            rotateMatrix[i][j] = matrixTetromino[N - j - 1][i];
        }
    }
    return rotateMatrix;
};



function isValid() {
    const matrixSize = tetromino.matrix.length;
    for (let row = 0; row < matrixSize; row++) {
        for (let column = 0; column < matrixSize; column++) {
            if (!tetromino.matrix[row][column]) { continue; }
            // if(tetromino.matrix[row][column] == 0){ continue; }
            if (isOutsideOfGameBoard(row, column)) { return true }
            if (hasCollisions(row, column)) { return true }
        }
    }
    return false;
}

function isOutsideOfGameBoard(row, column) {
    return tetromino.column + column < 0 ||
        tetromino.column + column >= PLAYFIELD_COLUMNS ||
        tetromino.row + row >= playfield.length
}

function hasCollisions(row, column) {
    return playfield[tetromino.row + row]?.[tetromino.column + column]
}


//-----------------Next tetromino------------//


function generateNextTetromino() {
    const nameTetro = getRandomElement(TETROMINO_NAMES);
    const matrixTetro = TETROMINOES[nameTetro];
    const rowTetro = -2;
    const columnTetro = Math.floor(PLAYFIELD_COLUMNS / 2 - matrixTetro.length / 2);

    nextTetromino = {
        name: nameTetro,
        matrix: matrixTetro,
        row: rowTetro,
        column: columnTetro,
    };
}

function drawNextTetromino() {
    const nextTetrominoElement = document.querySelector('.next-tetromino');
    nextTetrominoElement.innerHTML = '';

    const matrixSize = nextTetromino.matrix.length;
    const cellSize = 25; // style ssize next tetromino

    nextTetrominoElement.style.gridTemplateColumns = `repeat(${matrixSize}, ${cellSize}px)`;
    nextTetrominoElement.style.gridTemplateRows = `repeat(${matrixSize}, ${cellSize}px)`;

    for (let row = 0; row < matrixSize; row++) {
        for (let column = 0; column < matrixSize; column++) {
            const cell = document.createElement('div');
            cell.classList.add('tetromino-cell');

            if (nextTetromino.matrix[row][column] !== 0) {
                cell.classList.add(nextTetromino.name);
            }

            cell.style.width = `${cellSize}px`;
            cell.style.height = `${cellSize}px`;
            nextTetrominoElement.appendChild(cell);
        }
    }
}

//---------------timer--------------//
function padZero(value) {
    return value < 10 ? `0${value}` : value;
}

function startTimer() {
    let totalSeconds = 0;

    const timerElement = document.querySelector('.timer');
    console.log(timerElement);

    function updateTimer() {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        formattedTime = `${padZero(minutes)}:${padZero(seconds)}`;

        timerElement.textContent = formattedTime;

        totalSeconds++;
    }

    // check have timer
    if (timerInterval) {
        clearInterval(timerInterval);
    }

    // create new timer
    timerInterval = setInterval(updateTimer, 1000);
    //stop timer
    return {
        stop: function () {
            clearInterval(timerInterval);
        },
    };
}

//------------------buttons--------------// 

function handleButtonClick(action) {
    if (!isPaused) {
        switch (action) {
            case 'left':
                moveTetrominoLeft();
                break;
            case 'rotate':
                rotateTetromino();
                break;
            case 'down':
                moveTetrominoDown();
                break;
            case 'drop':
                dropTetrominoDown();
                break;
            case 'right':
                moveTetrominoRight();
                break;
        }
        draw();
    }
}

///--------------------Save to LocalStorage--------//

function getRecordsFromLocalStorage() {
    const recordsString = localStorage.getItem('tetrisRecords');
    return recordsString ? JSON.parse(recordsString) : [];
}

function saveRecordsToLocalStorage(records) {
    localStorage.setItem('tetrisRecords', JSON.stringify(records));
}

function updateRecords() {
    const storedRecords = getRecordsFromLocalStorage();
    const currentScore = score;
    const currentTime = formattedTime;
    const currentSpeed = currentSpeedLevel;

    const newRecord = { score: currentScore, time: currentTime, speed: currentSpeed };

    storedRecords.push(newRecord);

    storedRecords.sort((a, b) => b.score - a.score);

    const topRecords = storedRecords.slice(0, 3); //only three place


    saveRecordsToLocalStorage(topRecords);
}

//--------------display records--------------//

function displayRecords(records) {
    const recordsContainer = document.querySelector('.records-container');
    recordsContainer.innerHTML = '';

    records.forEach((record, index) => {
        const recordDiv = document.createElement('div');
        recordDiv.classList.add('records-place');
        recordDiv.innerHTML = `
            <h3>Place #${index + 1}</h3>
            <div>Score: <span class="result">${record.score}</span></div>
            <div>Time: <span class="time">${record.time}</span> sec.</div>
            <div>Speed: <span class="max-speed">${record.speed}</span></div>
        `;
        recordsContainer.appendChild(recordDiv);
    });
}

//------------display speed level--------//
function displaySpeed() {
    const speed = document.querySelector('.speed');
    speed.innerHTML = '';
    speed.textContent = currentSpeedLevel;
}

//拷贝到了index-1305.js里

import readlineSync from "readline-sync";
import figlet from "figlet";
import gradient from "gradient-string";

import chalk from "chalk";
import chalkAnimation from "chalk-animation";

import { setTimeout as waitingTime } from "timers/promises";
console.clear();

const greetWord1 = "Willkommen zu deinem Abenteuer \n";
const greetWord2 =
    "                       in der Welt       \n                  der Haustierpflege       \n               und Abenteuer";

// 问题选项
const petType = [
    "Tiger 🐯 (seine Angriffskraft ist höher)",
    "Affe 🐒 (seine Intelligenz ist höher)",
    "Hase 🐰 (seine Zuneigung ist höher)",
];
let petName = "";
let whichPet;
let maxPetHP;
let maxEnemyHP;
// 初始选择索引
let selectedIndex = 0;
//重新进入主地图的判断
let restart = false;
//重新进入宠物家庭地图的判断
let goPetMap = false;
//重新进入宠物战斗系统地图的判断
let goToFight = false;

function printWelcomeMessage() {
    figlet(greetWord1, { font: "Standard" }, function (err, data1) {
        const rainbowText = chalkAnimation.rainbow(data1);

        setTimeout(() => {
            rainbowText.stop();
            figlet(greetWord2, { font: "Small" }, function (err, data2) {
                const rainbowText1 = chalkAnimation.rainbow(data2);

                setTimeout(() => {
                    rainbowText1.stop();
                    console.clear();
                    printPetSelection();
                }, 3000);
            });
        }, 1000);
    });
}

async function printPetSelection() {
    while (true) {
        console.log(
            `Wähle dein Haustier aus: (Use ${chalk.bold.yellow(
                "u"
            )}(up ⬆️) and ${chalk.bold.yellow(
                "d"
            )}(down ⬇️) to navigate, press ${chalk.bold.blue(
                "Space"
            )} to select), press ${chalk.bold.red("q")} to quit the game)`
        );
        for (let i = 0; i < petType.length; i++) {
            if (i === selectedIndex) {
                console.log("> \x1b[36m" + petType[i] + "\x1b[0m");
            } else {
                console.log("  " + petType[i]);
            }
        }

        const key = readlineSync.keyIn("", {
            hideEchoBack: true,
            mask: "",
            limit: "udq ",
        });
        // 根据按键更新选择索引
        if (key === "u") {
            selectedIndex =
                selectedIndex === 0 ? petType.length - 1 : selectedIndex - 1;
        } else if (key === "d") {
            selectedIndex =
                selectedIndex === petType.length - 1 ? 0 : selectedIndex + 1;
        } else if (key === "q") {
            // Ctrl+C 退出程序
            process.exit();
        } else if (key === " ") {
            // space键表示选定
            break;
        }
        console.clear();
    }
    // 打印最终选择
    console.log("You selected:", petType[selectedIndex]);
    console.log(chalk.bold.greenBright("Kluge Wahl"));
    petName = readlineSync.question("Wie heißt dein Haustier? ");
    console.log(
        `Bist du bereit? 🥳 ${chalk.bold.blueBright(
            petName
        )}, Wir beginnen ein neues Abenteuer! 🥳`
    );

    await waitingTime(3000);
    console.clear();
    startGame();
}

function startGame() {
    // 初始化游戏并开始
    gameInMainMap.start();
}
printWelcomeMessage();

let itemsList = { apples: 0, flours: 0, sugar: 0 };
class MainMap {
    constructor() {
        this.map = [
            "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "X                                                              🎄                           X",
            "X                       🌻                                    🎄  🎄                        X",
            "X                     🌻  🌻                                 🎄   🎄🎄🎄                    X",
            "X                   🌻      🌻                       🎄🎄🎄🎄🎄          🎄🎄🎄              X",
            "X                 🌻          🌻                     🎄                        🎄             X",
            "X               🌻             🌻                🎄 🎄                         🎄             X",
            "X              🌻🌻🌻🌻🌻🌻🌻🌻🌻                 🎄                        🎄               X",
            "X             🌻                🌻               🎄                       🎄                  X",
            "X             🌻                🌻              🎄                     🎄                     X",
            "X             🌻                🌻                                   🎄                       X",
            "X             🌻                                                      🎄                     X",
            "X             🌻                                 🎄🎄🎄                 🎄🎄                  X",
            "X             🌻                                      🎄                   🎄                X",
            "X             🌻🌻🌻🌻🌻🌻🌻🌻🌻🌻                 🎄                      🎄               X",
            "X                                                 🎄                      🎄                 X",
            "X                                                🎄🎄🎄🎄🎄🎄🎄🎄🎄🎄🎄🎄🎄                  X",
            "X                                                                                            X",
            "X                                                                                            X",
            "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
        ];
        this.playerPosition = { x: 1, y: 1 };
        this.isRunning = true;
        this.isAtHome = false;
        this.isAdventureMap = false;

        this.applePositions = []; //随机生成苹果的位置
        this.enemyPosition = []; //随机产生怪兽的位置，暂时只产生3个

        this.generateApples(3); // 生成3个苹果
    }

    generateApples(numApples) {
        for (let i = 0; i < numApples + 3; i++) {
            // 随机生成苹果的 x 和 y 坐标 (x: 52~74; y:5~15)
            const randomX = Math.floor(Math.random() * (74 - 52)) + 52; // 在地图上52到74的数中间随机产生一个x的坐标
            const randomY = Math.floor(Math.random() * (15 - 5)) + 5; // 在地图上5到15的数中间随机产生一个y的坐标
            // // 检查随机生成的位置是否为空地，若不是则重新生成
            // while (this.map[randomY][randomX] !== " ") {
            //     randomX =
            //         Math.floor(Math.random() * (this.map[0].length - 2)) + 1;
            //     randomY = Math.floor(Math.random() * (this.map.length - 2)) + 1;
            // }
            if (i < numApples)
                this.applePositions.push({
                    x: randomX,
                    y: randomY,
                });
            //前面的那些给苹果
            else this.enemyPosition.push({ x: randomX, y: randomY }); //最后的3个给怪兽
        }
    }

    getApplesAndEnemies(itemsList) {
        const randomApples = Math.floor(Math.random() * 5) + 1;
        const randomFlours = Math.floor(Math.random() * 3) + 1;
        const randomSugar = Math.floor(Math.random() * 3) + 1;
        // console.log(
        //     `Herzlichen Glückwunsch zu ${randomApples} Äpfeln, ${randomFlours} Mehl und ${randomSugar} Zucker. Möchtest du sie behalten oder wegwerfen?`
        // );
        if (
            this.applePositions.some(
                (item) =>
                    item.x === this.playerPosition.x &&
                    item.y === this.playerPosition.y
            )
        ) {
            const takeApples = readlineSync.question(
                `Herzlichen Glückwunsch zu ${randomApples} Äpfeln, ${randomFlours} Mehl und ${randomSugar} Zucker. Möchtest du sie behalten oder wegwerfen? (y/n)`
            );

            if (takeApples === "y") {
                itemsList.apples += randomApples;
                itemsList.flours += randomFlours;
                itemsList.sugar += randomSugar;
                console.log(
                    `Du hast jetzt ${itemsList.apples} Äpfel, ${itemsList.flours} Mehl und ${itemsList.sugar} Zucker.`
                );
            } else return;
        } else if (
            this.enemyPosition.some(
                (item) =>
                    item.x === this.playerPosition.x &&
                    item.y === this.playerPosition.y
            )
        ) {
            const fightEnemy = readlineSync.question(
                `Vorsicht, du hast ein Monster getroffen. Möchtest du gegen es kämpfen? (y/n)`
            );

            if (fightEnemy === "y") {
                //进入战斗画面
                goToFight = true;
                petAdventureMode.petFightStart();
            } else return;
        }

        return itemsList;
    }

    //打印主地图
    printMap() {
        console.clear();
        whichPet = petType[selectedIndex].split(" ")[0]; //??? 为何定义全局时，取不到值
        for (let row of this.map) {
            // 将玩家标记 'M' 替换为 ASCII 艺术, 不同的宠物对应不同的图标
            if (whichPet === "Tiger") row = row.replace("M", "🐯");
            // 这里可以使用任何你喜欢的 ASCII 艺术
            else if (whichPet === "Affe") row = row.replace("M", "🐒");
            else if (whichPet === "Hase") row = row.replace("M", "🐰");
            console.log(row);
        }
        // 打印玩家当前位置坐标
        console.log("player's Position:", this.playerPosition);
        console.log("truesure's Position ", this.applePositions);
        console.log("enemy's Position ", this.enemyPosition);
    }

    movePlayer(direction) {
        let newX = this.playerPosition.x;
        let newY = this.playerPosition.y;

        switch (direction) {
            case "w":
                newY--;
                break;
            case "s":
                newY++;
                break;
            case "a":
                newX--;
                break;
            case "d":
                newX++;
                break;
            default:
                break;
        }

        if (this.map[newY][newX] === " ") {
            this.map[this.playerPosition.y] =
                this.map[this.playerPosition.y].slice(
                    0,
                    this.playerPosition.x
                ) +
                " " +
                this.map[this.playerPosition.y].slice(
                    this.playerPosition.x + 1
                );
            this.playerPosition.x = newX;
            this.playerPosition.y = newY;
            this.map[this.playerPosition.y] =
                this.map[this.playerPosition.y].slice(
                    0,
                    this.playerPosition.x
                ) +
                "M" +
                this.map[this.playerPosition.y].slice(
                    this.playerPosition.x + 1
                );
        }
    }

    start() {
        // let flag = true;
        let move;
        if (restart === true) this.isRunning = true;
        this.generateApples(3);
        while (this.isRunning) {
            console.log(this.isRunning);
            if (!this.isRunning) break;
            this.printMap();

            // at home
            if (
                this.playerPosition.x >= 16 &&
                this.playerPosition.x <= 30 &&
                this.playerPosition.y >= 8 &&
                this.playerPosition.y <= 13
            ) {
                this.isAtHome = true;
                console.log("Zuhause 🏠, schönes Zuhause 🏡 !");
                move = readlineSync.keyIn(
                    "Use W/A/S/D to move (or H to houseMap or Q to quit ): ",
                    // "Use W/A/S/D to move ( or Q to quit ): ",
                    { limit: "wasdqh" }
                );
            } else if (
                // in Adventure map
                this.playerPosition.x >= 50 &&
                this.playerPosition.x <= 76 &&
                this.playerPosition.y >= 5 &&
                this.playerPosition.y <= 15
            ) {
                this.isAdventureMap = true;
                console.log(
                    "Beachte, du bist jetzt auf der Abenteuerkarte. Hier kannst du Glück haben und Schätze 🍎 finden, aber natürlich auch Gefahren 🗡️ begegnen.!"
                );

                //添加随机遇到苹果和怪兽
                this.getApplesAndEnemies(itemsList);

                // 下面的这行代码必须要在，不然会出现代码乱跳的琴况
                move = readlineSync.keyIn(
                    "Use W/A/S/D to move ( or Q to quit ): ",
                    { limit: "wasdq" }
                );
            } else {
                this.isAtHome = false;
                this.isAdventureMap = false;
                move = readlineSync.keyIn(
                    "Use W/A/S/D to move (or Q to quit): ",
                    { limit: "wasdq" }
                );
            }

            //询问是否进入宠物养成系统
            if (move.toLowerCase() === "h") {
                const isPetCare = readlineSync.question(
                    "Do you want to play with your Pet (y/n)? "
                );
                if (isPetCare === "y") {
                    this.isRunning = false;
                    goPetMap = true;
                    myPetCareMode.startPetCareMode();
                }
            }

            // }

            // //询问是否进入宠物养成系统
            // if (move.toLowerCase() === "h") {
            //     const isPetCare = readlineSync.question(
            //         "Do you want to play with your Pet (y/n)? "
            //     );
            //     if (isPetCare === "y") {
            //         this.isRunning = false;
            //         goPetMap = true;
            //         myPetCareMode.startPetCareMode();
            //     }
            // }

            if (move.toLowerCase() === "q") {
                this.isRunning = false;
                console.log("Game over. Thanks for playing!");
                break;
            }

            this.movePlayer(move.toLowerCase());
        }
    }
}
const gameInMainMap = new MainMap();

//------- 宠物养成系统 ------------
let applePie = 0;
const foodList = { apple: 10, flour: 10, sugar: 10 };
class Pet {
    constructor(name, type = "", hunger = 5, affinity = 5, IQ = 5, HP = 100) {
        this.name = name;
        this.type = type;
        this.hunger = hunger;
        this.affinity = affinity;
        this.IQ = IQ;
        this.HP = HP;

        this.isPlaying = true;
    }

    addAffinity(value) {
        this.affinity = Math.min(this.affinity + value, 10);
    }

    reduceAffinity(value) {
        this.affinity = Math.max(this.affinity - value, 0);
    }

    addHunger(value) {
        this.hunger = Math.min(this.hunger + value, 10);
    }

    reduceHunger(value) {
        this.hunger = Math.max(this.hunger - value, 0);
    }

    addIQ(value) {
        this.IQ = Math.min(this.IQ + value, 10);
    }

    reduceIQ(value) {
        this.IQ = Math.max(this.IQ - value, 0);
    }

    addHP(value) {
        this.HP = Math.min(this.HP + value, 10);
    }

    //foodStock() {}

    feed() {
        while (true) {
            console.log(this.hunger);
            if (this.hunger === 10) {
                // console.log(`I am full. I want to go to adventure`); // 显示不出来????
                const getMessage = readlineSync.keyIn(
                    "I am full. I want to go to adventure. Or we can do other things. Use space to go back!",
                    { limit: " " }
                );
                if (getMessage === " ") return;
            }

            if (applePie && foodList.apple) {
                const foods = readlineSync.question(`1. apple ; 2. applePie `);
                if (foods === "1") {
                    this.addHunger(2);
                    this.addAffinity(3);
                    foodList.apple--;
                    console.log("hunger", this.hunger);
                    console.log("affinity", this.affinity);
                    petMaps.printPetMap();
                    // this.printPetMap();
                }
                if (foods === "2") {
                    this.addHunger(5);
                    this.addAffinity(5);
                    applePie--;
                }
            } else if (!applePie) {
                const makeFood = readlineSync.question(
                    `we don't have applePie any more, do you want to cook? (y/n): `
                );
                if (makeFood === "y") {
                    this.cook(foodList);
                }
            } else if (!applePie && !foodList.apple)
                return `we don't have enought apples and applePie, you need go out to pick it`;
        }
    }
    cook(foodList) {
        if (foodList.apple >= 2 && foodList.flour >= 1 && foodList.sugar >= 1) {
            applePie++;
            foodList.apple -= 2;
            foodList.flour--;
            foodList.surge--;
            console.log(`applePie + 1, `);
        } else {
            return `we don't have enought apples, you need go out to pick it`;
        }
    }
    play() {
        if (this.hunger > 8) return `${this.name} ist zu hungrig zum spielen`;
        this.addAffinity(2);
        this.addHunger(3);

        return `${this.name} hat gespielt!`;
    }
    healed() {
        this.addHP(50);
        // console.log(`${attacker.playerName} increase his 5 healthPoints `);
    }

    // sleep() {
    //     this.reduceAffinity(5);
    //     this.addHunger(2);
    //     return `${this.name} hat geschlafen!`;
    // }

    randomNumForQuiz(randomNumArr) {
        while (randomNumArr.length < 4) {
            let randomNum = Math.floor(Math.random() * 10);
            if (!randomNumArr.includes(randomNum)) randomNumArr.push(randomNum);
        }
        console.log(
            `Lasst uns jetzt 'Bulls and Cows game' spielen. \n ${chalk.bold.bgYellow(
                "Regeln"
            )}: 1. Die Geheimzahl muss aus 4 Ziffern bestehen und jede Ziffer muss einzigartig sein.\n2. Wenn die Ziffern übereinstimmen und sich an der richtigen Stelle befinden, werden sie als "🐃" gezählt. \n3. Wenn sie sich an unterschiedlichen Positionen befinden, werden sie als "🐄" gezählt. \n4. Wenn die Ziffern nicht richtig sind, werden sie als "😿" gezählt.`
        );
        return randomNumArr;
    }
    quiz() {
        //bulls and cows game
        let randomNumArr = [];
        this.randomNumForQuiz(randomNumArr);
        let round = 1;
        while (true) {
            let result = [];
            const guess = readlineSync.question(
                "Gib mir eine nicht wiederholende Vier aus den Zahlen 0 bis 9: "
            );
            console.log("deine zahle ist: ", guess);
            console.log("Round ", round);
            // console.log(randomNumArr);
            for (let i = 0; i < randomNumArr.length; i++) {
                if (randomNumArr[i] === +guess.split("")[i]) result[i] = "🐃";
                else if (randomNumArr.includes(+guess.split("")[i]))
                    result[i] = "🐄";
                else result[i] = "😿";
            }

            if (!result.every((e) => e === "🐃"))
                console.log(
                    `Round${round}, your answer is ${result}, not collect, continue... `
                ); // 🔥 🎆 🥇 🥈 🥉
            if (result.every((e) => e === "🐃")) {
                if (round <= 3) {
                    this.addIQ(5);
                    console.log(
                        `🎆 Wow,${chalk.blue(
                            petName
                        )}, du bist wirklich großartig! Du hast es nur in ${round} Versuchen geschafft 🥇❗❗❗ 🎆`
                    );
                }
                if (round > 3 && round < 7) {
                    this.addIQ(3);
                    console.log(
                        `${chalk.blue(
                            petName
                        )}, Du bist sehr gut, du hast es nur in ${round} Versuchen geschafft. Beim nächsten Mal wird es noch besser sein 🥈❗ `
                    );
                }
                if (round >= 7) {
                    this.addIQ(2);
                    console.log(
                        `Herzlichen Glückwunsch,${chalk.blue(
                            petName
                        )}, du hast es im ${round}ten Versuch geschafft. `
                    );
                }
                // round = 1;
                // this.playAgain(randomNumArr);
                const playAgain = readlineSync.question(
                    "Do you want to play again? (y/n) "
                );
                if (playAgain === "y") {
                    console.clear();
                    petMaps.printPetMap();
                    randomNumArr = [];
                    this.randomNumForQuiz(randomNumArr);
                    round = 0;
                }
                if (playAgain === "n") break;
                //  break;
            } else {
                if (round >= 7 && round < 10)
                    console.log(
                        `Viel Glück, ${chalk.blue(
                            petName
                        )}, du hast noch ⏲️ ${chalk.yellow(
                            10 - round
                        )} Versuche.`
                    );
                if (round === 10) {
                    this.reduceIQ(1);
                    console.log(
                        ` 😅 ,${chalk.blue(
                            petName
                        )}, Spiel vorbei, du hast verloren. Ich wünsche Ihnen einen schönen Tag. Willkommen zur nächsten Herausforderung.`
                    );
                    // round = 1;
                    // this.playAgain(randomNumArr);
                    const playAgain = readlineSync.question(
                        "Do you want to play again? (y/n) "
                    );
                    if (playAgain === "y") {
                        console.clear();
                        petMaps.printPetMap();
                        randomNumArr = [];
                        this.randomNumForQuiz(randomNumArr);
                        round = 0;
                    }
                    if (playAgain === "n") break;
                }
            }
            round++;
        }
    }

    startPetCareMode() {
        let petCareModes;

        if (goPetMap === true) this.isPlaying = true;
        while (this.isPlaying) {
            petMaps.printPetMap();
            petCareModes = readlineSync.keyIn(
                "Use 1/2/3 to choose (or b to mainMap or Q to quit ): ",
                { limit: "123bq" }
            );

            switch (petCareModes) {
                case "1":
                    this.feed();
                    break;
                case "2":
                    this.play();
                    break;
                case "3":
                    this.quiz();
                    break;
                case "4":
                    this.healed();
                    break;
                case "q":
                    this.isPlaying = false;
                    console.log("Game over. Thanks for playing!");
                    process.exit();
                // break;
                case "b":
                    this.isPlaying = false;
                    restart = true; // go back to main map
                    gameInMainMap.start();
                    break;
                default:
                    break;
            }
        }
    }
}
const myPetCareMode = new Pet(petName, whichPet);

//怪兽战斗模式初始化
class Enemies {
    constructor(name, type, HP, attack) {
        this.name = name;
        this.type = type;
        this.HP = HP;
        this.attack = attack;
    }
}

const goldEagle = new Enemies("Adlersturz", "Eagle", 100, 20);
const zuBat = new Enemies("Nachtjäger", "Bat", 100, 20);
const wolfsRuf = new Enemies("Einsamer Wolf", "Wolf", 100, 20);
const enemiesList = [goldEagle, zuBat, wolfsRuf];

//进入宠物战斗系统
const WeaponsList = [
    { weaponName: "Stab des Feuers", weaponAttack: 15 },
    { weaponName: "Donnerstab", weaponAttack: 15 },
    { weaponName: "Engelstab", weaponAttack: 15 },
    { weaponName: "Dunkelheitsstab", weaponAttack: 15 },
    { weaponName: "Drachenstab", weaponAttack: 15 },
    { weaponName: "Weisenstab", weaponAttack: 15 },
];
let isFight;
let randomEnemy;
let enemyType = "";
let enemyRandom;
class PetAdventure extends Pet {
    constructor(attack, weaponName = "", weaponAttack = 0, ...args) {
        super(...args);

        this.attack = attack;

        this.weapons = {
            weaponName: weaponName,
            weaponAttack: weaponAttack,
        };
        this.isFighting = true;
    }
    // reduceHP(value) {
    //     this.HP = Math.max(this.HP - value, 0);
    // }

    // async fight(enemy) {
    //     while (true) {
    //         enemy.HP = enemy.HP - (this.attack + this.weapons.weaponAttack);
    //         enemy.HP <= 0 ? (enemy.HP = 0) : enemy.HP;
    //         console.log(`${this.name} fight ${enemy.name}(${enemy.HP})`);

    //         await this.waitForKeyPress();

    //         this.HP = this.HP - enemy.attack;
    //         this.HP <= 0 ? (this.HP = 0) : this.HP;
    //         console.log(`${enemy.name} fight ${this.name}(${this.HP})`);

    //         await this.waitForKeyPress();

    //         petMaps.printPetFightMap(); //每次HP变化时都要更新地图

    //         if (enemy.HP <= 0) this.getWeapons();
    //         if (this.HP <= 0) {
    //             this.isFighting = false;
    //             goPetMap = true;
    //             console.log(
    //                 `your HP is ${this.HP} now, you must be go home to heal.`
    //             );
    //             myPetCareMode.startPetCareMode();
    //             break;
    //         }
    //     }
    // }

    // waitForKeyPress() {
    //     return new Promise((resolve) => {
    //         readlineSync.keyInPause("Press any key to continue");
    //         resolve();
    //     });
    // }

    // fight(enemy) {
    //     const delay = 1000; // 1秒的延迟时间

    //     const printFightMessage = () => {
    //         enemy.HP = enemy.HP - (this.attack + this.weapons.weaponAttack);
    //         enemy.HP <= 0 ? (enemy.HP = 0) : enemy.HP;
    //         console.log(`${this.name} fight ${enemy.name}(${enemy.HP})`);

    //         this.HP = this.HP - enemy.attack;
    //         this.HP <= 0 ? (this.HP = 0) : this.HP;
    //         console.log(`${enemy.name} fight ${this.name}(${this.HP})`);

    //         petMaps.printPetFightMap(); //每次HP变化时都要更新地图

    //         if (enemy.HP <= 0) this.getWeapons();
    //         if (this.HP <= 0) {
    //             this.isFighting = false;
    //             goPetMap = true;
    //             console.log(
    //                 `your HP is ${this.HP} now, you must be go home to heal.`
    //             );
    //             myPetCareMode.startPetCareMode();
    //             return; // 结束递归调用
    //         }

    //         // 递归调用，模拟间隔显示消息
    //         setTimeout(printFightMessage, delay);
    //     };

    //     // 开始首次调用，启动消息显示
    //     printFightMessage();
    // }

    // fight(enemy) {
    //     const delay = 1000; // 1秒的延迟时间

    //     const fightInterval = setInterval(() => {
    //         enemy.HP = enemy.HP - (this.attack + this.weapons.weaponAttack);
    //         enemy.HP <= 0 ? (enemy.HP = 0) : enemy.HP;
    //         console.log(`${this.name} fight ${enemy.name}(${enemy.HP})`);

    //         this.HP = this.HP - enemy.attack;
    //         this.HP <= 0 ? (this.HP = 0) : this.HP;
    //         console.log(`${enemy.name} fight ${this.name}(${this.HP})`);

    //         petMaps.printPetFightMap(); //每次HP变化时都要更新地图

    //         if (enemy.HP <= 0) this.getWeapons();
    //         if (this.HP <= 0) {
    //             this.isFighting = false;
    //             goPetMap = true;
    //             console.log(
    //                 `your HP is ${this.HP} now, you must be go home to heal.`
    //             );
    //             myPetCareMode.startPetCareMode();
    //             clearInterval(fightInterval); // 清除定时器
    //         }
    //     }, delay);
    // }

    fight(enemy) {
        while (true) {
            enemy.HP = enemy.HP - (this.attack + this.weapons.weaponAttack);
            enemy.HP <= 0 ? (enemy.HP = 0) : enemy.HP;
            // setTimeout(() => {
            //     console.log(
            //         `${this.playerName} fight ${enemy.Name}(${enemy.HP})`
            //     );
            // }, 3000);
            readlineSync.keyInPause(
                `${this.name} fight ${enemy.name}(${enemy.HP}), press any key to continue`
            );
            this.HP = this.HP - enemy.attack;
            this.HP <= 0 ? (this.HP = 0) : this.HP;
            // setTimeout(() => {
            //     console.log(`${enemy.Name} fight ${this.Name}(${this.HP})`);
            // }, 3000);
            readlineSync.keyInPause(
                `${enemy.name} fight ${this.name}(${this.HP}), press any key to continue`
            );
            // console.log(
            //     `${this.playerName} fight ${enemy.playerName}(${enemy.HP})`
            // );
            petMaps.printPetFightMap(); //每次HP变化时都要更新地图

            if (enemy.HP <= 0) this.getWeapons();
            if (this.HP <= 0) {
                this.isFighting = false;
                goPetMap = true;
                readlineSync.keyInPause(
                    `your HP is ${this.HP} now, you must be go home to heal. press any key to continue`
                );
                myPetCareMode.startPetCareMode();
                break;
            }
        }
    }
    fightOrGoHome(enemy) {
        if (this.HP > 50) {
            if (this.IQ > 15) {
                isFight = readlineSync.keyIn(
                    `Die HP des Feindes sind l, die Angriffskraft ist n; Deine HP sind m, deine Angriffskraft ist k. Möchtest du kämpfen, nach Hause gehen oder weiter erkunden? (k for kämpfen, h for nach Hause gehen und e for weiter erkunden)`,
                    { limit: "khe" }
                );
            } else {
                if (enemy.HP > this.HP && enemy.attack > this.attack) {
                    isFight = readlineSync.keyIn(
                        `Gefahr, du könntest wahrscheinlich umkommen. Möchtest du kämpfen, nach Hause gehen oder weiter erkunden? (k for kämpfen, h for nach Hause gehen und e for weiter erkunden)`,
                        { limit: "khe" }
                    );
                } else {
                    isFight = readlineSync.keyIn(
                        `Du hast möglicherweise die Möglichkeit, deinen Feind zu besiegen. Möchtest du kämpfen, nach Hause gehen oder weiter erkunden? (k for kämpfen, h for nach Hause gehen und e for weiter erkunden)`,
                        { limit: "khe" }
                    );
                }
            }
        } else if (this.HP === 0) {
            this.isFighting = false;
            goPetMap = true;
            readlineSync.keyInPause(
                `your HP is ${this.HP} now, you must be go home to heal. press any key to continue`
            );
            myPetCareMode.startPetCareMode();
        } else {
            isFight = readlineSync.keyIn(
                `Deine Lebenspunkte sind zu niedrig. Es besteht die Möglichkeit, dass du im Kampf sterben wirst. Es wird empfohlen, zunächst nach Hause zu gehen und dich zu heilen. Möchtest du kämpfen, nach Hause gehen oder weiter erkunden? (k for kämpfen, h for nach Hause gehen und e for weiter erkunden)`,
                { limit: "khe" }
            );
        }
        if (isFight === "k") {
            this.fight(enemiesList[randomEnemy]);
        }
        if (isFight === "h") {
            goPetMap = true;
            // console.log(goPetMap);
            // readlineSync.keyInPause("press any key to continue");
            myPetCareMode.startPetCareMode();
        }
        if (isFight === "e") {
            gameInMainMap.start();
        }
    }
    getWeapons() {
        // const WeaponsList = [
        //     { weaponName: "Stab des Feuers", weaponAttack: 15 },
        //     { weaponName: "Donnerstab", weaponAttack: 15 },
        //     { weaponName: "Engelstab", weaponAttack: 15 },
        //     { weaponName: "Dunkelheitsstab", weaponAttack: 15 },
        //     { weaponName: "Drachenstab", weaponAttack: 15 },
        //     { weaponName: "Weisenstab", weaponAttack: 15 },
        // ];

        const randomWeaponIndex = Math.floor(
            Math.random() * WeaponsList.length
        );

        const equipWeapon = readlineSync.question(
            `Du hast ${WeaponsList[randomWeaponIndex].weaponName} erhalten, Angriffskraft ist ${WeaponsList[randomWeaponIndex].weaponAttack}; Dein aktuelles ist ${this.weapons.weaponName}, Angriffskraft ist ${this.weapons.weaponAttack}. Möchtest du es ersetzen? (y/n)`
        );
        if (equipWeapon === "y") {
            this.weapons.weaponName = WeaponsList[randomWeaponIndex].weaponName;
            this.weapons.weaponAttack =
                WeaponsList[randomWeaponIndex].weaponAttack;
        }
    }

    petFightStart() {
        console.clear();
        maxPetHP = myPetCareMode.HP;
        randomEnemy = Math.floor(Math.random() * enemiesList.length);
        enemyType = enemiesList[randomEnemy].type;
        enemyRandom = enemiesList[randomEnemy];
        maxEnemyHP = enemiesList[randomEnemy].HP;
        if (goToFight === true) this.isFighting = true;
        while (this.isFighting) {
            petMaps.printPetFightMap();
            console.log(enemiesList[randomEnemy]);
            console.log(("my HP is: ", this.HP));
            this.fightOrGoHome(enemiesList[randomEnemy]);
        }
    }
}

const petAdventureMode = new PetAdventure(10, "", 0, petName, whichPet);

//所有图片，宠物在家的模式和宠物战斗的模式
class AllPetMaps {
    constructor() {
        this.mapTiger = [
            "================================= 💓💓💓 ===============================",
            "                                                                        ",
            `     __  _-==-=_,-.                     |    ----${myPetCareMode.name}----                   `,
            "     /--`'\\_@-@.--<                    |                                 ",
            "     `--'\\ \\   <___/.                 |                                ",
            `           \\ \\\   " /                 | hunger: ${myPetCareMode.hunger}        `,
            "            >=\\_/`<                    |                               ",
            `           /= | \\_|/                   | affinity:${myPetCareMode.affinity}     `,
            `          /===\\____/                   | HP:   ${myPetCareMode.HP}              `,
            `                                                                        `,
            `                                         IQ:     ${myPetCareMode.IQ}               `,
            `                                           ----------------------        `,
            `                                                                        `,
            `                                                                        `,
            `                                                                        `,
            `                                                                        `,
            `  1. feeding    2. playing    3. quiz   4. to heal                      `,
            ` (you can chose 1, 2 or 3, to play with your pet;)                      `,
            ` (press "q" to quit the game, press "b" to go back to main map)         `,
            "================================ 💓💓💓 ================================",
        ];

        this.mapManky = [
            "================================= 💓💓💓 ===============================",
            "                                                                        ",
            `             __,__                                                       `,
            `    .--.  .-"     "-.  .--.                                              `,
            `   /.. ./  .-. .-. .'/ ..  )              ----${myPetCareMode.name}----             `,
            `  || '  |  /   Y     |   ' ||            | hunger: ${myPetCareMode.hunger}`,
            `  ||     )   0 | 0   (     ||            | IQ:     ${myPetCareMode.IQ}    `,
            `   ('-  ).-" '''' "-./, -' /             | affinity:${myPetCareMode.affinity}`,
            `    '._. (_   ^ ^   _ ) ._.'             | HP:   ${myPetCareMode.HP}      `,
            `        |  (._   _.)  |                  ----------------------           `,
            "        `.  ( '~' )   /                                                  ",
            `         '._ '-=-' _.'                                                   `,
            `            '~---~'                                                      `,
            `                                                                        `,
            `                                                                        `,
            `                                                                        `,
            `                                                                        `,
            `                                                                        `,
            `                                                                        `,
            `                                                                        `,
            `  1. feeding    2. playing    3. quiz   4. to heal                      `,
            ` (you can chose 1, 2 or 3, to play with your pet;)                      `,
            ` (press "q" to quit the game, press "b" to go back to main map)         `,
            "================================ 💓💓💓 ================================",
        ];
        this.mapRabbit = [
            "================================= 💓💓💓 ===============================",
            "                                                                        ",
            `     ***                                                                `,
            `     ** **                                                              `,
            `    **   **                               ----${myPetCareMode.name}----            `,
            `    **   **         ****                | hunger: ${myPetCareMode.hunger} `,
            `    **   **       **   ****             | IQ:    ${myPetCareMode.IQ}      `,
            `    **  **       *   **   **            | affinity: ${myPetCareMode.affinity}   `,
            `     **  *      *  **  ***  **          | HP:    ${myPetCareMode.HP}     `,
            `       **  *    *  **     **  *          ----------------------         `,
            "        ** **  ** **        **                                          ",
            `        **   **  **                                                     `,
            `       *           *                                                    `,
            `      *             *                                                   `,
            `     *    0     0    *                                                  `,
            `     *   /   @   \\   *                                                 `,
            `     *   \\__/ \\__/   *                                                `,
            `       *     W     *                                                    `,
            `         **     **                                                      `,
            `           *****                                                        `,
            `                                                                        `,
            `                                                                        `,
            `  1. feeding    2. playing    3. quiz   4. to heal                      `,
            ` (you can chose 1, 2 or 3, to play with your pet;)                      `,
            ` (press "q" to quit the game, press "b" to go back to main map)         `,
            "================================ 💓💓💓 ================================",
        ];
        this.mapTigerFight = [
            "🐯=============== 💓🐯💓 ==============🐯",
            `🛡️                                      🗡️`,
            `🗡️                                      🛡️`,
            `🛡️                                      🗡️`,
            `🗡️                                      🛡️`,
            `🛡️                                      🗡️`,
            `🗡️           __  _-==-=_,-.             🛡️`,
            "🛡️          /--`'\\_@-@.--<              🗡️",
            "🗡️          `--'\\ \\   <___/.            🛡️",
            `🛡️                \\ \\\   " /             🗡️`,
            "🗡️                 >=\\_/`<              🛡️",
            `🛡️                /= | \\_|/             🗡️`,
            `🗡️               /===\\____/             🛡️`,
            `🛡️                                      🗡️`,
            "🗡️                                      🛡️",
            `🛡️                                      🗡️`,
            `🗡️                                      🛡️`,
            `🛡️                                      🗡️`,
            `🗡️                                      🛡️`,
            `🛡️       HP 🩷🩷🩷🩷🩷🩷🩷🩷🩷🩷       🗡️`,
            `🗡️                                      🛡️`,
            `🛡️      💟 🩶 💗   ♡❤️💖💙              🗡️`,
            `🗡️                                      🛡️`,
            "🐯=============== 💓🐯💓 ===============🐯",
        ];
        this.mapMankyFight = [
            "🐵=============== 💓🐵💓 ===============🐵",
            `🛡️                                      🗡️`,
            `🗡️                                      🛡️`,
            `🛡️                                      🗡️`,
            `🗡️                 __,__                🛡️`,
            `🛡️        .--.  .-"     "-.  .--.       🗡️`,
            `🗡️       /.. ./  .-. .-. .'/ ..  )      🛡️`,
            `🛡️      || '  |  /   Y     |   ' ||     🗡️`,
            `🗡️      ||     )   0 | 0   (     ||     🛡️`,
            `🛡️       ('-  ).-" '''' "-./, -' /      🗡️`,
            `🗡️        '._. (_   ^ ^   _ ) ._.'      🛡️`,
            `🛡️            |  (._   _.)  |           🗡️`,
            "🗡️            `.  ( '~' )   /           🛡️",
            `🛡️             '._ '-=-' _.'            🗡️`,
            `🗡️                '~---~'               🛡️`,
            `🛡️                                      🗡️`,
            `🗡️                                      🛡️`,
            `🛡️                                      🗡️`,
            `🗡️                                      🛡️`,
            `🗡️       HP 🩷🩷🩷🩷🩷🩷🩷🩷🩷🩷       🛡️`,
            `🛡️                                      🗡️`,
            `🗡️      💟 🩶 💗                        🛡️`,
            `🛡️                                      🗡️`,
            "🐵=============== 💓🐵💓 ===============🐵",
        ];
        this.mapRabbitFight = [
            "🐰=============== 💓🐰💓 ===============🐰",
            `🛡️      ***                             🗡️`,
            `🗡️      ** **                           🛡️`,
            `🛡️     **   **                          🗡️`,
            `🗡️     **   **         ****             🛡️`,
            `🛡️     **   **       **   ****          🗡️`,
            `🗡️     **  **       *   **   **         🛡️`,
            `🛡️      **  *      *  **  ***  **       🗡️`,
            `🗡️        **  *    *  **     **  *      🛡️`,
            "🛡️         ** **  ** **        **       🗡️",
            `🗡️         **   **  **                  🛡️`,
            `🛡️        *           *                 🗡️`,
            `🗡️       *             *                🛡️`,
            `🛡️      *    0     0    *               🗡️`,
            `🗡️      *   /   @   \\   *              🛡️`,
            `🛡️      *   \\__/ \\__/   *             🗡️`,
            `🗡️        *     W     *                 🛡️`,
            `🛡️          **     **                   🗡️`,
            `🗡️            *****                     🛡️`,
            `🛡️       HP 🩷🩷🩷🩷🩷🩷🩷🩷🩷🩷       🗡️`,
            `🗡️                                      🛡️`,
            `🛡️      💟 🩶 💗                        🗡️`,
            `🗡️                                      🛡️`,
            "🐰=============== 💓🐰💓 ===============🐰",
        ];
        this.mapEagleFight = [
            "🦅=============== 💓🦅💓 ===============🦅",
            `🛡️                                      🗡️`,
            `🗡️                                      🛡️`,
            `🛡️            .------._                 🗡️`,
            '🗡️      .-"""`-.<´)    `-._             🛡️',
            `🛡️     (.--. _   '._'---.__.-'          🗡️`,
            `🗡️      '';'-.-'         '-    ._       🛡️`,
            `🛡️        .--'''  '._      - '   .      🗡️`,
            "🗡️         `''''-.    `---'             🛡️",
            "🛡️                  `\\                 🗡️",
            "🗡️                  `\\      .'         🛡️",
            "🛡️                  `'. '               🗡️",
            "🗡️                    `'.               🛡️",
            `🛡️                                      🗡️`,
            `🗡️                                      🛡️`,
            `🛡️                                      🗡️`,
            `🗡️                                      🛡️`,
            `🛡️                                      🗡️`,
            `🗡️                                      🛡️`,
            `🛡️       HP 🩷🩷🩷🩷🩷🩷🩷🩷🩷🩷       🗡️`,
            `🗡️                                      🛡️`,
            `🛡️      💟 🩶 💗                        🗡️`,
            `🗡️                                      🛡️`,
            "🦅=============== 💓🦅💓 ===============🦅",
        ];
        this.mapBatFight = [
            "🦇================ 💓🦇💓 ================🦇",
            `🛡️                                        🗡️`,
            `🗡️                                        🛡️`,
            `🛡️                                        🗡️`,
            `🗡️                                        🛡️`,
            `🛡️              /'.    .'\\                🗡️`,
            `🗡️              \\(\\__/ )/                 🛡️`,
            `🛡️         ___   / (.)(.)\\   ___          🗡️`,
            '🗡️    _.-"`_  `-.|  ____  |.-`  _`"-._    🛡️',
            "🛡️  .-'.-'//||`'-.  V--V  /.-'`||\\'-.'-.  🗡️",
            "🗡️`'-'-.// ||    / .___.      || \\.-'-'`  🛡️",
            "🛡️      `-.||_.._|        |_.._||.-'      🗡️",
            `🗡️              \\ ((  )) /                🛡️`,
            "🛡️                '.    .'                🗡️",
            "🗡️                  `/`                   🛡️",
            `🛡️                                        🗡️`,
            `🗡️                                        🛡️`,
            `🛡️                                        🗡️`,
            `🗡️                                        🛡️`,
            `🛡️       HP 🩷🩷🩷🩷🩷🩷🩷🩷🩷🩷         🗡️`,
            `🗡️                                        🛡️`,
            `🛡️      💟 🩶 💗                          🗡️`,
            `🗡️                                        🛡️`,
            "🦇================ 💓🦇💓 ================🦇",
        ];
        this.mapWolfFight = [
            "🐺================ 💓🐺💓 ===============🐺",
            `🛡️                           __          🗡️`,
            `🗡️                          .d$$b        🛡️`,
            `🛡️                        .' TO$;\\       🗡️`,
            `🗡️                       /  : TP._;      🛡️`,
            `🛡️                      / _.;  :Tb|      🗡️`,
            `🗡️                     /   /   ;j$j      🛡️`,
            `🛡️                 _.-"       d$$$$      🗡️`,
            `🗡️                .' ..       d$$$$;       🛡️`,
            "🛡️               /  /P'      d$$$$P. |     🗡️",
            `🗡️              /   "      .d$$$P' |\\^"l  🛡️`,
            "🛡️           .'           `T$P^'''''  :  🗡️",
            `🗡️       ._.'      _.'                ;  🛡️`,
            '🛡️    `-.-".-"-"" ._.       _.-"    .-"  🗡️',
            '🗡️   `.-" _____  ._              .-"     🛡️',
            `🛡️  -(.g$$$$$$$b.              .'        🗡️`,
            `🗡️     ""^^T$$$P^)            .(:        🛡️`,
            `🛡️                                       🗡️`,
            `🗡️                                       🛡️`,
            `🛡️       HP 🩷🩷🩷🩷🩷🩷🩷🩷🩷🩷        🗡️`,
            `🗡️                                       🛡️`,
            `🛡️      💟 🩶 💗                         🗡️`,
            `🗡️                                       🛡️`,
            "🐺================ 💓🐺💓 ===============🐺",
        ];
    }

    updateHP(petAdventureMode, enemyRandom) {
        const maxPetHeart = 3 * Math.ceil(maxPetHP / 10); // 最大HP值，也就是最多的红心数量🩷
        const maxEnemyHeart = 3 * Math.ceil(maxEnemyHP / 10);
        const hpSymbol = "🩷 "; // 红心符号  🩷  :heart
        // const blackHPSymbol = "🩶";
        // readlineSync.keyInPause(
        //     `enemy's mxpHP is ${maxEnemyHP}, pet's mxpHP is ${maxPetHP}, press any key`
        // );

        // 计算需要多少个红心来表示当前HP
        const petHeartsNeeded = Math.ceil(petAdventureMode.HP / 10);
        const enemyHeartsNeeded = Math.ceil(enemyRandom.HP / 10);
        // readlineSync.keyInPause(`enemy's HP is ${enemyRandom.HP}`);
        // 构建新的HP字符串
        const petHPString = hpSymbol.repeat(petHeartsNeeded);
        const enemyHPString = hpSymbol.repeat(enemyHeartsNeeded);

        // 更新地图数组中的HP值
        const petFight = this.whichPetFightMap(whichPet);
        const enemyFight = this.whichEnemyFightMap(enemyType);
        //这里需要字符串的长度是20,才能显示10个🩶或🩷
        petFight.splice(
            19,
            1,
            `🛡️        HP ${petHPString.padEnd(maxPetHeart, "🩶 ")}           🗡️`
        );
        enemyFight.splice(
            19,
            1,
            `🛡️        HP ${enemyHPString.padEnd(
                maxEnemyHeart,
                "🩶 "
            )}             🗡️`
        );
        // readlineSync.keyInPause(
        //     `🗡️   HP ${petHPString.padEnd(20, blackHPSymbol)}       🛡️`
        // );
        // readlineSync.keyInPause(
        //     `enemy's heart is ${maxEnemyHeart}, pet's heart is ${maxPetHeart}, press any key`
        // );
        // this.mapRabbitFight.splice(
        //     19,
        //     1,
        //     `🗡️   HP ${hpString.padEnd(maxHP, "🩶")}       🛡️`
        // );

        // 输出更新后的地图
        // console.log(this.mapRabbitFight.join("\n"));
        return petFight[19] + "                " + enemyFight[19];
    }

    whichPetFightMap(whichPet) {
        let mapPetFight = [];
        if (whichPet === "Tiger") mapPetFight = this.mapTigerFight;
        else if (whichPet === "Affe") mapPetFight = this.mapMankyFight;
        else if (whichPet === "Hase") mapPetFight = this.mapRabbitFight;
        return mapPetFight;
    }
    whichEnemyFightMap(enemyType) {
        let mapEnemyFight = [];
        if (enemyType === "Eagle") mapEnemyFight = this.mapEagleFight;
        else if (enemyType === "Bat") mapEnemyFight = this.mapBatFight;
        else if (enemyType === "Wolf") mapEnemyFight = this.mapWolfFight;
        return mapEnemyFight;
    }
    printPetMap() {
        console.clear();
        let mapPet = [];
        if (whichPet === "Tiger") mapPet = this.mapTiger;
        else if (whichPet === "Affe") mapPet = this.mapManky;
        else if (whichPet === "Hase") mapPet = this.mapRabbit;
        // this.whichPetMap(whichPet);
        for (let rowPet of mapPet) {
            // 在每次打印地图之前，更新地图中显示饥饿度的部分
            if (rowPet.includes("hunger:")) {
                const updatedRow = rowPet.replace(
                    /hunger: \d+/,
                    `hunger: ${myPetCareMode.hunger}`
                );
                // console.log(myPetCareMode.hunger);
                console.log(updatedRow);
            } else {
                console.log(rowPet);
            }
        }
    }

    printPetFightMap() {
        console.clear();
        const updatedRowStr = this.updateHP(petAdventureMode, enemyRandom);
        const mapPetFight = this.whichPetFightMap(whichPet);
        const mapEnemyFight = this.whichEnemyFightMap(enemyType);
        for (let i = 0; i < mapPetFight.length; i++) {
            let rowPet = mapPetFight[i] + "                " + mapEnemyFight[i];
            if (i === 19) console.log(updatedRowStr);
            else console.log(rowPet);
        }
    }
}
const petMaps = new AllPetMaps();

//        .------._
//  .-"""`-.<')    `-._
// (.--. _   `._       `'---.__.-'
//  `   `;'-.-'         '-    ._
//    .--'``  '._      - '   .
//     `""'-.    `---'    ,
//           `\
//             `\      .'
//               `'. '
//             jgs `'.

//                /'.    .'\
//                \( \__/ )/
//          ___   / (.)(.) \   ___
//     _.-"`_  `-.|  ____  |.-`  _`"-._
//  .-'.-'//||`'-.\  V--V  /.-'`||\\'-.'-.
// `'-'-.// ||    / .___.  \    || \\.-'-'`
//       `-.||_.._|        |_.._||.-'
//                \ ((  )) /
//            jgs  '.    .'
//                   `\/`

//                              __
//                             .d$$b
//                           .' TO$;\
//                          /  : TP._;
//                         / _.;  :Tb|
//                        /   /   ;j$j
//                    _.-"       d$$$$
//                  .' ..       d$$$$;
//                 /  /P'      d$$$$P. |\
//                /   "      .d$$$P' |\^"l
//              .'           `T$P^"""""  :
//          ._.'      _.'                ;
//       `-.-".-'-' ._.       _.-"    .-"
//     `.-" _____  ._              .-"
//    -(.g$$$$$$$b.              .'
//      ""^^T$$$P^)            .(:
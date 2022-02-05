#!/usr/bin/env node

import chalk from "chalk";
// To capture user's inputs
import inquirer from "inquirer";
// To animate simple console logs
import chalkAnimation from "chalk-animation";
// To display huge ascii character texts
import figlet from "figlet";
// For applying gradient onto huge texts
import gradient from "gradient-string";
// Importing the spinner which loads when an answer is selected
import { createSpinner } from "nanospinner";
// To use the fetch API
import fetch from "node-fetch";
import Audic from "audic";
// Fetching the music file that we'll play when the game is over.
const imperialMarch = new Audic(
  "https://ia800304.us.archive.org/30/items/StarWarsTheImperialMarchDarthVadersTheme/Star%20Wars-%20The%20Imperial%20March%20%28Darth%20Vader%27s%20Theme%29.mp3#t=00:00:09"
);

let questions = [];
let corrects = [];
let options = [];
let fetchQuestions = async () => {
  let req = await fetch(
    "https://opentdb.com/api.php?amount=5&category=9&difficulty=easy&type=multiple"
  );
  let res = await req.json();
  // Filtering and storing all questions, their correct answers and other options; as the API response contains other unnecessary data too
  res.results.forEach((elem) => {
    questions.push(elem.question);
    corrects.push(elem.correct_answer);
    options.push(
      [elem.correct_answer, ...elem.incorrect_answers].sort((a, b) => a - b)
    );
  });
};
// Will store the player's name inside this and will increment the score variable by 1 everytime the player gets the question's answer correct!
let playerName,
  score = 0;
// To make the gameplay a little slower to make it quite realistic
const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));

await welcome();
await askName();
await fetchQuestions();
await question1();
await question2();
await question3();
await question4();
await question5();
await winner();

// Welcome text
async function welcome() {
  const rainbowTitle = chalkAnimation.rainbow(
    "A Fun Trivia Quiz Game by Jeel Patel!\n"
  );
  await sleep();
  rainbowTitle.stop();
  console.log(`
  ${chalk.bgBlue(" HOW TO PLAY ")}
  There will be questions on everything.
  If you get any question wrong you will be ${chalk.bgRed(" killed ")}
  So get all the questions right...
  
  `);
}
// Asking user their name
async function askName() {
  const answers = await inquirer.prompt({
    name: "player_name",
    type: "input",
    message: "What is your name?",
    default() {
      return "Player";
    },
  });
  playerName = answers.player_name;
}
// Starting to bombard questions one by one
async function question1() {
  const answers = await inquirer.prompt({
    name: "question_1",
    type: "list",
    message: `${questions[0]}\n`,
    choices: options[0],
  });
  return handleAnswer(answers.question_1 == corrects[0]);
}
async function question2() {
  const answers = await inquirer.prompt({
    name: "question_2",
    type: "list",
    message: `${questions[1]}\n`,
    choices: options[1],
  });
  return handleAnswer(answers.question_2 == corrects[1]);
}
async function question3() {
  const answers = await inquirer.prompt({
    name: "question_3",
    type: "list",
    message: `${questions[2]}\n`,
    choices: options[2],
  });
  return handleAnswer(answers.question_3 == corrects[2]);
}
async function question4() {
  const answers = await inquirer.prompt({
    name: "question_4",
    type: "list",
    message: `${questions[3]}\n`,
    choices: options[3],
  });
  return handleAnswer(answers.question_4 == corrects[3]);
}
async function question5() {
  const answers = await inquirer.prompt({
    name: "question_5",
    type: "list",
    message: `${questions[4]}\n`,
    choices: options[4],
  });
  return handleAnswer(answers.question_5 == corrects[4]);
}
// Checking if the answer is true or not and respond accordingly
async function handleAnswer(isCorrect) {
  const spinner = createSpinner("Checking answer...").start();
  await sleep();
  if (isCorrect) {
    spinner.success({
      text: `Congratulations! ${playerName}. That's a legit answer!`,
    });
    score++;
    await sleep();
  } else {
    spinner.error({
      text: `💀💀💀 Wrong answer, be careful ${playerName}!`,
    });
    await sleep();
    // process.exit(1);
  }
}
// Announcing the score from 5 at the end of the game
async function winner() {
  console.clear();
  await imperialMarch.play();
  const msg = `Congrats, ${playerName} !\nHere's your $ 1 , 0 0 0 , 0 0 0`;
  const ender = chalkAnimation.glitch(`Your Score: ${score}/5\n`);
  figlet(msg, (err, data) => {
    console.log(gradient.pastel.multiline(data));
    ender.start();
  });
  await sleep(20000);
  imperialMarch.destroy();
  process.exit(1);
}

import React from "react";
import timeToExplain from "../shared/time-to-explain";

export const rules = [
    <span>Split players into two teams.</span>,
    <span><strong>Each player adds 5 words</strong> to the game (in the language you agree on).</span>,
    <span>When all players have entered their words, you can start the game.</span>,
    <span>{`Each team gets ${timeToExplain} seconds to `}<strong>guess as many words as possible</strong>, with one player explaining the words to their teammates.</span>,
    <span>Teams take alternating turns. In each team’s turn, <strong>one player explains and the others guess</strong>.</span>,
    <span>When all words have been guessed, a new round is started.</span>,
    <span>The <strong>game is played in several rounds</strong> and each round defines how a word must be explained. In each round <strong>explaining gets harder but the words get more familiar</strong>.</span>,
]

export const rounds = [
    <span><strong>Describe</strong> (explain the word without using parts of the word itself)</span>,
    <span><strong>One word</strong> (explain the word with a single word)</span>,
    <span><strong>Pantomime</strong> (use arms/legs/body – no sounds allowed)</span>,
    <span><strong>Finger pantomime</strong> (explain with your fingers – make sure your teammates cannot see your face)</span>,
    <span><strong>Sound</strong> (solely use sounds – make sure your teammates do not see you)</span>,
]

export const roundsShort = ["Describe", "One word", "Pantomime", "Finger pantomime", "Sound"];

export const roundsEmoji = ["💬", "💥️", "🕺", "✌️", "🎙"];




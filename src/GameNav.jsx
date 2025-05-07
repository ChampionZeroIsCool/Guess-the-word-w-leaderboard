import React, { useState, useEffect } from 'react'

export function GameNav() {
    const [currentWordLength, setCurrentWordLength] = useState(4)
    let wordBank = ['MOVE', 'APPLE', 'BANANA', 'DEFAULT', 'SELECTED', 'PINEAPPLE', 'PINEAPPLES', 'WATERMELONS', 'LEADERBOARDS'];
    const [currentWord, setCurrentWord] = useState(wordBank[currentWordLength - 4])
    const [guessedLetters, setGuessedLetters] = useState(['A', 'E', 'I', 'P'])

    useEffect(() => {
        setCurrentWord(wordBank[currentWordLength - 4])
    }, [currentWordLength])

    return (
        <div>
             <p className="text-gray-900 font-semibold text-6xl pb-5">Game</p>
             <div className="text-gray-900 text-2xl gap-1 flex pb-10">
                <label htmlFor="wordLength" className="pl-1">Select word length:</label>
                <select onChange={(e) => setCurrentWordLength(Number(e.target.value))} name="wordLength" className="cursor-pointer">
                    <option selected={currentWordLength == 4} defaultValue={4}>4</option>
                    <option selected={currentWordLength == 5} defaultValue={5}>5</option>
                    <option selected={currentWordLength == 6} defaultValue={6}>6</option>
                    <option selected={currentWordLength == 7} defaultValue={7}>7</option>
                    <option selected={currentWordLength == 8} defaultValue={8}>8</option>
                    <option selected={currentWordLength == 9} defaultValue={9}>9</option>
                    <option selected={currentWordLength == 10} defaultValue={10}>10</option>
                    <option selected={currentWordLength == 11} defaultValue={11}>11</option>
                    <option selected={currentWordLength == 12} defaultValue={12}>12</option>
                </select>
                <button onClick={() => {
                    let random = Math.round((Math.random() * (8) + 4));
                    while (random == currentWordLength) {
                        random = Math.round((Math.random() * (8) + 4));
                    }
                    setCurrentWordLength(random);
                }} className='cursor-pointer border-2 border-black px-3 rounded-full flex gap-2 items-center hover:font-bold hover:border-4'>Randomise</button>
             </div>
             <div className="text-gray-900 font-semibold text-6xl pb-5 pl-1 flex gap-6">
                {currentWord.split('').map((letter) => {
                    if (guessedLetters.includes(letter)) {
                        return (
                            <div className="flex flex-col items-center">
                                <span className="text-6xl">{letter}</span>
                                <span className="text-6xl -mt-14">__</span>
                            </div>
                        )
                    } else {
                        return (
                            <div className="flex flex-col items-center">
                                <span className="text-6xl">&nbsp;</span>
                                <span className="text-6xl -mt-14">__</span>
                            </div>
                        )
                    }
                })}
             </div>
        </div>
    )
}
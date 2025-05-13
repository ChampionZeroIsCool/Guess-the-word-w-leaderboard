import React, { useState, useEffect } from 'react'
import {
    ArrowPathIcon
} from '@heroicons/react/24/outline'

export function GameNav() {
    const [currentWordLength, setCurrentWordLength] = useState(4)
    let wordBank = ['MOVE', 'APPLE', 'BANANA', 'DEFAULT', 'SELECTED', 'PINEAPPLE', 'PINEAPPLES', 'WATERMELONS', 'LEADERBOARDS'];
    const [currentWord, setCurrentWord] = useState(wordBank[currentWordLength - 4])
    const [guessedLetters, setGuessedLetters] = useState(['A', 'E', 'I', 'P'])

    useEffect(() => {
        setCurrentWord(wordBank[currentWordLength - 4])
    }, [currentWordLength])

    return (
        <div className='text-gray-900'>
             <p className='font-semibold text-6xl pb-5'>Game</p>
             <div className='text-2xl gap-1 flex pb-8 items-center'>
                <label htmlFor='wordLength'>Select word length:</label>
                <select onChange={(e) => setCurrentWordLength(Number(e.target.value))} name='wordLength' className='cursor-pointer'>
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
                }} className='cursor-pointer border-2 border-black p-2.5 px-3 ml-1.5 rounded-full group hover:font-bold flex gap-2 items-center'>Randomise
                    <ArrowPathIcon className='h-6 w-6 stroke-2 group-hover:stroke-4'></ArrowPathIcon>
                </button>
             </div>
             <div className='font-semibold text-6xl pb-10 flex gap-6'>
                {currentWord.split('').map((letter) => {
                    if (guessedLetters.includes(letter)) {
                        return (
                            <div className='flex flex-col items-center'>
                                <span className='text-6xl'>{letter}</span>
                                <span className='text-6xl -mt-14'>__</span>
                            </div>
                        )
                    } else {
                        return (
                            <div className='flex flex-col items-center'>
                                <span className='text-6xl'>&nbsp;</span>
                                <span className='text-6xl -mt-14'>__</span>
                            </div>
                        )
                    }
                })}
             </div>
             <div className='flex items-center pb-1'>
                <p className='text-2xl'>Enter a letter:</p>
                <input type='text' onInput={(e) => {e.target.value = e.target.value.toUpperCase().replace(/[^A-Za-z]/g, '')}} className='text-2xl border-2 border-black rounded-xl p-2 ml-2' placeholder='A' maxLength={1} />
             </div>
             {

             }
             <p className='font-semibold text-2xl pb-5'>'E' has already been guessed</p>
             <div className='text-2xl'>
                <p>Guessed letters: A, E, I, P</p>
                <p className='pb-3'>Guesses left: 10</p>
                <p className='pb-7'>____________________</p>
             </div>
             <div className='text-2xl'>
                <p>Stats:</p>
                <p>Wins: 1 (50%)</p>
                <p>Losses: 1 (50%)</p>
                <p>Total: 2</p>
             </div>
        </div>
    )
}
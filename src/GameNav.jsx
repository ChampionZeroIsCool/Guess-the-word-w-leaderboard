import React, { useState, useEffect } from 'react'
import {
    ArrowPathIcon,
    ArrowRightIcon
} from '@heroicons/react/24/outline'
import fileText from './assets/words.txt?raw'

export function GameNav() {
    const [currentWordLength, setCurrentWordLength] = useState(4)
    const [currentWord, setCurrentWord] = useState('')
    const [guessedLetters, setGuessedLetters] = useState([])
    const [guess, setGuess] = useState('')
    const handleGuess = (letter) => {
        if (!guessedLetters.includes(letter) && guess.length === 1) {
            setGuessedLetters(guessedLetters => [...guessedLetters, letter])
        }
        setGuess('')
    }
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleGuess(event.target.value)
        }
    }
    const handleChange = (event) => {
        setGuess(event.target.value.toUpperCase().replace(/[^A-Za-z]/g, ''))
    }
    const handleButtonClick = () => {
        handleGuess(guess)
    }
    
    console.log(currentWord)
    useEffect(() => {
        console.log(guessedLetters)
    }, [guessedLetters])

    useEffect(() => {
      const word = fileText.split('\n').filter((word) => word.length === currentWordLength)[Math.floor(Math.random() * fileText.split('\n').filter((word) => word.length === currentWordLength).length)].toUpperCase();
      setCurrentWord(word);
    }, [currentWordLength])

    return (
        <div className='text-gray-900'>
             <p className='font-semibold text-6xl pb-5'>Game</p>
             <div className='text-2xl gap-1 flex pb-8 items-center'>
                <label htmlFor='wordLength'>Select word length:</label>
                <select onChange={(e) => setCurrentWordLength(Number(e.target.value))} value={currentWordLength} name='wordLength' className='cursor-pointer'>
                    {[4,5,6,7,8,9,10].map((length) => (
                            <option key={length} value={length}>{length}</option>
                    ))}
                </select>
                <button onClick={() => {
                    let random = Math.round((Math.random() * (6) + 4));
                    while (random == currentWordLength) {
                        random = Math.round((Math.random() * (6) + 4));
                    }
                    setCurrentWordLength(random);
                }} className='cursor-pointer border-2 border-black p-2.5 px-3 ml-1.5 rounded-full group hover:font-bold flex gap-2 items-center'>Randomise
                    <ArrowPathIcon className='h-6 w-6 stroke-2 group-hover:stroke-4'></ArrowPathIcon>
                </button>
             </div>
             <div className='font-semibold text-6xl pb-10 flex gap-6'>
                {currentWord.split('').map((letter, index) => {
                    if (guessedLetters.includes(letter)) {
                        return (
                            <div className='flex flex-col items-center' key={index}>
                                <span className='text-6xl'>{letter}</span>
                                <span className='text-6xl -mt-14'>__</span>
                            </div>
                        )
                    } else {
                        return (
                            <div className='flex flex-col items-center' key={index}>
                                <span className='text-6xl'>&nbsp;</span>
                                <span className='text-6xl -mt-14'>__</span>
                            </div>
                        )
                    }
                })}
             </div>
             <div className='flex relative items-center pb-1'>
                <p className='text-2xl'>Enter a letter:</p>
                <button onClick={handleButtonClick} className='cursor-pointer absolute left-[356.9px] border-2 border-black p-1.5 px-1.75 rounded-xl'>
                    <ArrowRightIcon className='h-6 w-6 stroke-2 hover:stroke-4'></ArrowRightIcon>
                </button>
                <input type='text' value={guess} onChange={handleChange} onKeyDown={handleKeyDown} onInput={(e) => {e.target.value = e.target.value.toUpperCase().replace(/[^A-Za-z]/g, '')}} className='text-2xl border-2 border-black rounded-xl p-2 ml-2' placeholder='A' maxLength={1}></input>
             </div>

             <p className='font-semibold text-2xl pb-5'>'E' has already been guessed</p>
             <div className='text-2xl'>
                <p>Guessed letters: {guessedLetters.sort().map((letter, index) => {
                    const isLast = index === guessedLetters.length - 1;
                    return (
                        <span key={index} className='text-2xl'>{letter}{!isLast && ', '}</span>
                    )
                })}</p>
                <p className='pb-3'>Guesses left: 10</p>
                <p className='pb-7'>____________________</p>
             </div>
             <div className='text-2xl'>
                <p>Stats:</p>
                <p>Wins: 1 (50%)</p>
                <p>Losses: 1 (50%)</p>
                <p>Total games: 2</p>
             </div>
        </div>
    )
}
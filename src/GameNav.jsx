import React, { useState, useEffect, useRef } from 'react'
import {
    ArrowPathIcon,
    ArrowRightIcon
} from '@heroicons/react/24/outline'
import fileText from './assets/words.txt?raw'

export function GameNav() {
    const [currentWordLength, setCurrentWordLength] = useState(Math.round((Math.random() * (6) + 4)))
    const [currentWord, setCurrentWord] = useState('')
    const [guessedLetters, setGuessedLetters] = useState([])
    const [guess, setGuess] = useState('')
    const [guessesLeft, setGuessesLeft] = useState(Math.min(10, currentWordLength + 2))
    const guessResult = useRef(null)

    const [wins, setWins] = useState(0)
    const [losses, setLosses] = useState(0)
    const [totalGames, setTotalGames] = useState(0)
    const [winsPercentage, setWinsPercentage] = useState(0)
    const [lossesPercentage, setLossesPercentage] = useState(0)

    const [gameResult, setGameResult] = useState(null)
    const [showSummary, setShowSummary] = useState(false)

    const handleGuess = (letter) => {
        if (guess.length === 1) {
            if (!guessedLetters.includes(letter)) {
                const updatedGuessedLetters = [...guessedLetters, letter]
                setGuessedLetters(updatedGuessedLetters)
                if (currentWord.includes(letter)) {
                    if ([...new Set(currentWord)].every(l => updatedGuessedLetters.includes(l))) {
                        guessResult.current.innerHTML = `Correct, <b>'${letter}'</b> is in the word`
                        setWins(wins => wins + 1)
                        setWinsPercentage(Math.round((wins + 1) / (totalGames + 1) * 100))
                        setLossesPercentage(100 - Math.round((wins + 1) / (totalGames + 1) * 100))
                        setTotalGames(totalGames => totalGames + 1)
                        setGameResult('win')
                        setShowSummary(true)
                    } else {
                        guessResult.current.innerHTML = `Correct, <b>'${letter}'</b> is in the word`
                    }
                } else {
                    if (guessesLeft > 1) {
                        guessResult.current.innerHTML = `Wrong, <b>'${letter}'</b> is not in the word`
                        setGuessesLeft(guessesLeft => guessesLeft - 1)
                    } else {
                        guessResult.current.innerHTML = `Wrong, <b>'${letter}'</b> is not in the word`
                        setLosses(losses => losses + 1)
                        setLossesPercentage(Math.round((losses + 1) / (totalGames + 1) * 100))
                        setWinsPercentage(100 - Math.round((losses + 1) / (totalGames + 1) * 100))
                        setTotalGames(totalGames => totalGames + 1)
                        setGameResult('loss')
                        setShowSummary(true)
                    }
                }
            } else {
                    guessResult.current.innerHTML = `<b>'${letter}'</b> has already been guessed`
            }
            setGuess('')
        }
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
        <div className='text-gray-900 text-2xl'>
             <p className='font-semibold text-6xl pb-5'>Game</p>
             <div className='gap-1 flex pb-8 items-center'>
                <label htmlFor='wordLength'>Select word length:</label>
                <select onChange={(e) => {
                    setCurrentWordLength(Number(e.target.value))
                    setGuessesLeft(Math.min(10, Number(e.target.value) + 2));
                }} value={currentWordLength} name='wordLength' className='cursor-pointer'>
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
                    setGuessesLeft(Math.min(10, random + 2));
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
                <p>Enter a letter:</p>
                <button onClick={handleButtonClick} className='cursor-pointer absolute left-[357px] border-2 border-black p-1.5 px-1.75 rounded-xl'>
                    <ArrowRightIcon className='h-6 w-6 stroke-2 hover:stroke-4'></ArrowRightIcon>
                </button>
                <input type='text' value={guess} onChange={handleChange} onKeyDown={handleKeyDown} onInput={(e) => {e.target.value = e.target.value.toUpperCase().replace(/[^A-Za-z]/g, '')}} className='text-2xl border-2 border-black rounded-xl p-2 ml-2' placeholder='A' maxLength={1} readOnly={showSummary}></input>
             </div>
             <p ref={guessResult}><b>Guess a letter</b></p>
             <div>
                {gameResult === 'win' && showSummary && (
                    <div>
                        <p className='pb-7'>You win, the word was <b>'{currentWord}'</b></p>
                        <button onClick={() => {
                                setGuessesLeft(Math.min(10, currentWordLength + 2));
                                setGuessedLetters([]);
                                const word = fileText.split('\n').filter((word) => word.length === currentWordLength)[Math.floor(Math.random() * fileText.split('\n').filter((word) => word.length === currentWordLength).length)].toUpperCase();
                                setCurrentWord(word);
                                setGuess('');
                                guessResult.current.innerHTML = 'Guess a letter';
                                setGameResult(null);
                                setShowSummary(false);
                        }} className='cursor-pointer border-2 border-black p-2.5 px-3 rounded-full group hover:font-bold flex gap-2 items-center'> Play again
                            <ArrowPathIcon className='h-6 w-6 stroke-2 group-hover:stroke-4' />
                        </button>
                    </div>
                )}
                {gameResult === 'loss' && showSummary && (
                    <div>
                        <p className='pb-7'>You lose, the word was <b>'{currentWord}'</b></p>
                        <button onClick={() => {
                                setGuessesLeft(Math.min(10, currentWordLength + 2));
                                setGuessedLetters([]);
                                const word = fileText.split('\n').filter((word) => word.length === currentWordLength)[Math.floor(Math.random() * fileText.split('\n').filter((word) => word.length === currentWordLength).length)].toUpperCase();
                                setCurrentWord(word);
                                setGuess('');
                                guessResult.current.innerHTML = 'Guess a letter';
                                setGameResult(null);
                                setShowSummary(false);
                        }} className='cursor-pointer border-2 border-black p-2.5 px-3 rounded-full group hover:font-bold flex gap-2 items-center'> Play again
                            <ArrowPathIcon className='h-6 w-6 stroke-2 group-hover:stroke-4' />
                        </button>
                    </div>
                )}
                {!showSummary && (
                    <div className='pt-5'>
                        <p>Guessed letters: <b>{
                            guessedLetters.sort().map((letter, index) => {
                                const isLast = index === guessedLetters.length - 1;
                                return <span key={index}>{letter}{!isLast && ', '}</span>
                        })}</b></p>
                        <p>Guesses left: <b>{guessesLeft}</b></p>
                    </div>
                )}
             </div>
             <div>
                <p className='pb-7 pt-3'>____________________</p>
                <p>Stats:</p>
                <p>Wins: <b>{wins}</b> {totalGames > 0 && `(${winsPercentage}%)`}</p>
                <p>Losses: <b>{losses}</b> {totalGames > 0 && `(${lossesPercentage}%)`}</p>
                <p>Total games: <b>{totalGames}</b></p>
             </div>
        </div>
    )
}
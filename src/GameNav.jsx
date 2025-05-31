import React, { useState, useEffect, useRef, useCallback } from 'react'
import {
    ArrowPathIcon,
    ArrowRightIcon
} from '@heroicons/react/24/outline'
import fileText from './assets/words.txt?raw'

export function GameNav(props) {
    const [currentWordLength, setCurrentWordLength] = useState(Math.round(Math.random() * 6 + 4))
    const [currentWord, setCurrentWord] = useState('')
    const [guessedLetters, setGuessedLetters] = useState([])
    const [guess, setGuess] = useState('')
    const [guessesLeft, setGuessesLeft] = useState(0)
    const guessResult = useRef(null)

    const [wins, setWins] = useState(0)
    const [losses, setLosses] = useState(0)
    const [totalGames, setTotalGames] = useState(0)
    const [winsPercentage, setWinsPercentage] = useState(0)
    const [lossesPercentage, setLossesPercentage] = useState(0)

    const [gameResult, setGameResult] = useState(null)
    const [showSummary, setShowSummary] = useState(false)

    const pickNewWord = useCallback((length = currentWordLength) => {
        const words = fileText.split('\n').filter(word => word.length === length);
        const word = words[Math.floor(Math.random() * words.length)].toUpperCase();
        setCurrentWord(word);
        setGuessesLeft(Math.min(10, length + 2));
        setGuessedLetters([]);
        setGuess('');
        guessResult.current.innerHTML = '<b>Guess a letter</b>';
        setGameResult(null);
        setShowSummary(false);
    }, [currentWordLength])

    const handleGuess = (letter) => {
        if (letter.length !== 1 || showSummary) return;

        if (!guessedLetters.includes(letter)) {
            const updatedGuessedLetters = [...guessedLetters, letter]
            setGuessedLetters(updatedGuessedLetters)
            props.setHasUnsavedChanges(true)
            guessResult.current.className = 'text-gray-900'

            if (currentWord.includes(letter)) {
                guessResult.current.innerHTML = `Correct, <b>'${letter}'</b> is in the word`
                const allLettersGuessed = [...new Set(currentWord)].every(l => updatedGuessedLetters.includes(l))
                if (allLettersGuessed) {
                    const updatedWins = wins + 1;
                    const updatedTotalGames = totalGames + 1;
                    setWins(updatedWins);
                    setTotalGames(updatedTotalGames);
                    setWinsPercentage(Math.round((updatedWins / updatedTotalGames) * 100));
                    setLossesPercentage(100 - Math.round((updatedWins / updatedTotalGames) * 100));
                    setGameResult('win')
                    setShowSummary(true)
                }
            } else {
                const remainingGuesses = guessesLeft - 1
                setGuessesLeft(remainingGuesses)
                guessResult.current.innerHTML = `Wrong, <b>'${letter}'</b> is not in the word`

                if (remainingGuesses <= 0) {
                    const updatedLosses = losses + 1;
                    const updatedTotalGames = totalGames + 1;
                    setLosses(updatedLosses);
                    setTotalGames(updatedTotalGames);
                    setLossesPercentage(Math.round((updatedLosses / updatedTotalGames) * 100));
                    setWinsPercentage(100 - Math.round((updatedLosses / updatedTotalGames) * 100));
                    setGameResult('loss')
                    setShowSummary(true)
                }
            }
        } else {
            guessResult.current.className = 'text-red-500'
            guessResult.current.innerHTML = `<b>'${letter}'</b> has already been guessed`
        }
        setGuess('')
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleGuess(guess)
        }
    }

    const handleChange = (event) => {
        setGuess(event.target.value.toUpperCase().replace(/[^A-Za-z]/g, ''))
    }

    const handleButtonClick = () => {
        handleGuess(guess)
    }

    const handleDropdownChange = (value) => {
        setCurrentWordLength(value);
    }

    const handleRandomise = () => {
        let random = Math.round(Math.random() * 6 + 4)
        while (random === currentWordLength) {
            random = Math.round(Math.random() * 6 + 4)
        }
        setCurrentWordLength(random)
    }

    const handlePlayAgain = () => {
        pickNewWord()
        props.setHasUnsavedChanges(false)
    }

    useEffect(() => {
        pickNewWord(currentWordLength)
    }, [currentWordLength, pickNewWord])

    useEffect(() => {
        const handleBeforeUnload = (event) => {
            if (props.hasUnsavedChanges) {
                event.preventDefault()
                event.returnValue = ''
            }
        }
        window.addEventListener('beforeunload', handleBeforeUnload)
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload)
        }
    }, [props.hasUnsavedChanges])

    useEffect(() => {
        console.log(currentWord)
    }, [currentWord])

    return (
        <div className='text-gray-900 text-2xl'>
            <p className='font-semibold text-6xl pb-5'>Game</p>
            <div className='gap-1 flex pb-8 items-center'>
                <label htmlFor='wordLength'>Select word length:</label>
                <select disabled={showSummary} onChange={(e) => handleDropdownChange(Number(e.target.value))} value={currentWordLength} name='wordLength' className='cursor-pointer'>
                    {[4,5,6,7,8,9,10].map((length) => (
                        <option key={length} value={length}>{length}</option>
                    ))}
                </select>
                <button onClick={handleRandomise} className='cursor-pointer border-2 border-black p-2.5 px-3 ml-1.5 rounded-full group hover:font-bold flex gap-2 items-center' disabled={showSummary}>
                    Randomise
                    <ArrowPathIcon className='h-6 w-6 stroke-2 group-hover:stroke-4' />
                </button>
            </div>
            <div className='font-semibold text-6xl pb-10 flex gap-6'>
                {currentWord.split('').map((letter, index) => (
                    <div className='flex flex-col items-center' key={index}>
                        <span className='text-6xl'>{guessedLetters.includes(letter) ? letter : '\u00A0'}</span>
                        <span className='text-6xl -mt-14'>__</span>
                    </div>
                ))}
            </div>
            <div className='flex relative items-center pb-1'>
                <p>Enter a letter:</p>
                <div className='relative ml-1'>
                    <input
                        type='text'
                        value={guess}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        onInput={(e) => { e.target.value = e.target.value.toUpperCase().replace(/[^A-Za-z]/g, '') }}
                        className='text-2xl border-2 border-black rounded-xl p-2 ml-2'
                        placeholder='A'
                        maxLength={1}
                        readOnly={showSummary}
                    />
                    <button onClick={handleButtonClick} className='cursor-pointer absolute right-1.5 top-1/2 -translate-y-1/2 border-2 border-black p-1.5 px-1.75 rounded-xl'>
                        <ArrowRightIcon className='h-6 w-6 stroke-2 hover:stroke-4' />
                    </button>
                </div>
            </div>
            <p ref={guessResult}><b>Guess a letter</b></p>
            <div>
                {showSummary && gameResult === 'win' && (
                    <div>
                        <p className='pb-7'>You win, the word was <b>'{currentWord}'</b></p>
                        <button onClick={handlePlayAgain} className='cursor-pointer border-2 border-black p-2.5 px-3 rounded-full group hover:font-bold flex gap-2 items-center'>Play again
                            <ArrowPathIcon className='h-6 w-6 stroke-2 group-hover:stroke-4' />
                        </button>
                    </div>
                )}
                {showSummary && gameResult === 'loss' && (
                    <div>
                        <p className='pb-7'>You lose, the word was <b>'{currentWord}'</b></p>
                        <button onClick={handlePlayAgain} className='cursor-pointer border-2 border-black p-2.5 px-3 rounded-full group hover:font-bold flex gap-2 items-center'>Play again
                            <ArrowPathIcon className='h-6 w-6 stroke-2 group-hover:stroke-4' />
                        </button>
                    </div>
                )}
                {!showSummary && (
                    <div className='pt-5'>
                        <p>Guessed letters: <b>{guessedLetters.sort().join(', ')}</b></p>
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
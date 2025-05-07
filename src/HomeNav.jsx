import {
    ArrowRightIcon
  } from '@heroicons/react/24/outline'

export function HomeNav(props) {
  return (
    <div className="pl-1">
        <p className="text-gray-900 font-semibold text-6xl pb-5">How to play</p>
        <p className="text-gray-900 text-2xl">
            Welcome to Guess the Word!<br></br>
            This is a word guessing game similar to hangman. The aim of the game is to guess a mystery word that is 4-12 letters long.<br></br>
            Each turn you will pick a letter and if it is in the word, it will be revealed. If it is not in the word, you get one less chance at guessing the word.<br></br>
            You have 10 chances to guess the word. If you run out of guesses, you lose the game. If you guess the full word before that, you win.<br></br>
            <br></br>
            <button onClick={() => props.setCurrentNav('Game')} className='cursor-pointer border-2 border-black p-2.5 px-3 rounded-full flex gap-2 items-center hover:font-bold hover:border-4 group'>Play now 
                <ArrowRightIcon className='h-6 w-6 stroke-2 group-hover:stroke-4'></ArrowRightIcon>
            </button>
            <br></br>
            You can also enter the leaderboard by entering a username. This will score you based on how many lifetime wins you have.<br></br>
            <br></br>
            <button onClick={() => props.setCurrentNav('Leaderboard')} className='cursor-pointer border-2 border-black p-2.5 px-3 rounded-full flex gap-2 items-center hover:font-bold hover:border-4 group'>Leaderboard 
                <ArrowRightIcon className='h-6 w-6 stroke-2 group-hover:stroke-4'></ArrowRightIcon>
            </button>
        </p>
    </div>
  )
}

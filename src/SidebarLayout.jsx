import { useEffect, useState } from 'react'

import { HomeNav }  from './HomeNav.jsx'
import { GameNav }  from './GameNav.jsx'
import { LeaderboardNav }  from './LeaderboardNav.jsx'

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  TransitionChild,
} from '@headlessui/react'
import {
  Bars3Icon,
  XMarkIcon,
  GlobeAsiaAustraliaIcon,
  PuzzlePieceIcon,
  HomeIcon,
} from '@heroicons/react/24/outline'
import { ExclamationTriangleIcon } from '@heroicons/react/24/solid'

const navigation = [
  { name: 'Home', href: '#', icon: HomeIcon, current: true },
  { name: 'Game', href: '#', icon: PuzzlePieceIcon, current: false },
  { name: 'Leaderboard', href: '#', icon: GlobeAsiaAustraliaIcon, current: false },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function SidebarLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentNav, setCurrentNav] = useState('Home')
  console.log(currentNav)

  const [wins, setWins] = useState(() => {
    const storedWins = localStorage.getItem('wins')
    return storedWins ? parseInt(storedWins, 10) : 0
  })
  const [losses, setLosses] = useState(() => {
    const storedLosses = localStorage.getItem('losses')
    return storedLosses ? parseInt(storedLosses, 10) : 0
  })
  const [totalGames, setTotalGames] = useState(() => {
    const storedWins = localStorage.getItem('wins')
    const storedLosses = localStorage.getItem('losses')
    return (storedWins ? parseInt(storedWins, 10) : 0) + (storedLosses ? parseInt(storedLosses, 10) : 0)
  })
  const [winsPercentage, setWinsPercentage] = useState(() => {
    const storedWins = localStorage.getItem('wins')
    const storedLosses = localStorage.getItem('losses')
    const wins = storedWins ? parseInt(storedWins, 10) : 0
    const losses = storedLosses ? parseInt(storedLosses, 10) : 0
    const totalGames = wins + losses
    return totalGames > 0 ? Math.round((wins / totalGames) * 100) : 0
  })
  const [lossesPercentage, setLossesPercentage] = useState(() => {  
    const storedWins = localStorage.getItem('wins')
    const storedLosses = localStorage.getItem('losses')
    const wins = storedWins ? parseInt(storedWins, 10) : 0
    const losses = storedLosses ? parseInt(storedLosses, 10) : 0
    const totalGames = wins + losses
    return totalGames > 0 ? Math.round((losses / totalGames) * 100) : 0
  })
  
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [showExitGameConfirmBox, setShowExitGameConfirmBox] = useState(false)
  const [pendingNav, setPendingNav] = useState(null)
  const handleUnsavedChanges = (nextNav) => {
    if (hasUnsavedChanges) {
      setPendingNav(() => () => {
        setCurrentNav(nextNav)
        setHasUnsavedChanges(false)
        setShowExitGameConfirmBox(false)
        setSidebarOpen(false)
      })
      setShowExitGameConfirmBox(true)
    } else {
      setCurrentNav(nextNav)
      setSidebarOpen(false)
    }
  }

  const [showResetConfirmBox, setShowResetConfirmBox] = useState(false)
  const handleReset = () => setShowResetConfirmBox(true)

  const [username, setUsername] = useState(() => {
    const storedUsername = localStorage.getItem('username')
    return storedUsername ? storedUsername : ''
  })

  useEffect(() => {
    const storedWins = localStorage.getItem('wins')
    const storedLosses = localStorage.getItem('losses')
    const storedTotalGames = (storedWins ? parseInt(storedWins, 10) : 0) + (storedLosses ? parseInt(storedLosses, 10) : 0)
    const storedWinsPercentage = storedTotalGames > 0 ? Math.round((parseInt(storedWins, 10) / storedTotalGames) * 100) : 0
    const storedLossesPercentage = storedTotalGames > 0 ? Math.round((parseInt(storedLosses, 10) / storedTotalGames) * 100) : 0
    if (storedWins !== null) setWins(parseInt(storedWins))
    if (storedLosses !== null) setLosses(parseInt(storedLosses))
    if (storedTotalGames !== null) setTotalGames(storedTotalGames)
    if (storedWinsPercentage !== null) setWinsPercentage(storedWinsPercentage)
    if (storedLossesPercentage !== null) setLossesPercentage(storedLossesPercentage)
  }, [])

  useEffect(() => {
    localStorage.setItem('wins', wins);
    localStorage.setItem('losses', losses);
    localStorage.setItem('totalGames', totalGames);
    localStorage.setItem('winsPercentage', winsPercentage);
    localStorage.setItem('lossesPercentage', lossesPercentage);
    localStorage.setItem('username', username);
  }, [wins, losses, totalGames, winsPercentage, lossesPercentage, username]);

  return (
    <>
      {/*
        This example requires updating your template:

        ```
        <html class='h-full bg-white'>
        <body class='h-full'>
        ```
      */}
      <div>
        <Dialog open={sidebarOpen} onClose={setSidebarOpen} className='relative z-50 lg:hidden'>
          <DialogBackdrop
            transition
            className='fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-[closed]:opacity-0'
          />

          <div className='fixed inset-0 flex'>
            <DialogPanel
              transition
              className='relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-[closed]:-translate-x-full'
            >
              <TransitionChild>
                <div className='absolute left-full top-0 flex w-16 justify-center pt-5 duration-300 ease-in-out data-[closed]:opacity-0'>
                  <button type='button' onClick={() => setSidebarOpen(false)} className='-m-2.5 p-2.5'>
                    <span className='sr-only'>Close sidebar</span>
                    <XMarkIcon aria-hidden='true' className='size-6 text-white' />
                  </button>
                </div>
              </TransitionChild>
              {/* Sidebar component, swap this element with another sidebar if you like */}
              <div className='flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-4 ring-1 ring-white/10'>
                <div className='flex h-1 shrink-0 items-center'>
                </div>
                <nav className='flex flex-1 flex-col'>
                  <ul role='list' className='flex flex-1 flex-col gap-y-7'>
                    <li>
                      <ul role='list' className='-mx-2 space-y-1'>
                        {navigation.map((item) => (
                          <li key={item.name}>
                            <button
                              onClick={() => {handleUnsavedChanges(item.name)}}
                              className={classNames(
                                item.name === currentNav
                                  ? 'bg-gray-800 text-white'
                                  : 'cursor-pointer text-gray-400 hover:bg-gray-800 hover:text-white',
                                'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold',
                              )}
                            >
                              <item.icon aria-hidden='true' className='size-6 shrink-0' />
                              {item.name}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </li>
                  </ul>
                </nav>
              </div>
            </DialogPanel>
          </div>
        </Dialog>

        {/* Static sidebar for desktop */}
        <div className='hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col'>
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className='flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-4'>
            <div className='flex h-1 shrink-0 items-center'>
            </div>
            <nav className='flex flex-1 flex-col'>
              <ul role='list' className='flex flex-1 flex-col gap-y-7'>
                <li>
                  <ul role='list' className='-mx-2 space-y-1'>
                    {navigation.map((item) => (
                      <li key={item.name}>
                        <button
                          onClick={() => {handleUnsavedChanges(item.name)}}
                            className={classNames(
                            item.name === currentNav
                              ? 'bg-gray-800 text-white'
                              : 'cursor-pointer text-gray-400 hover:bg-gray-800 hover:text-white',
                            'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold',
                          )}
                        >
                          <item.icon aria-hidden='true' className='size-6 shrink-0' />
                          {item.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div className='lg:pl-72'>
          <div className='sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8'>
            <button type='button' onClick={() => setSidebarOpen(true)} className='-m-2.5 p-2.5 text-gray-700 lg:hidden'>
              <span className='sr-only'>Open sidebar</span>
              <Bars3Icon aria-hidden='true' className='size-6' />
            </button>
            <p className='text-gray-900 text-2xl font-semibold -m-2 text-center w-full'>Guess the Word</p>
          </div>

          {showExitGameConfirmBox && (
            <div className='fixed inset-0 z-50 flex items-center justify-center bg-gray-900/75'>
              <div className='bg-white rounded-lg p-6 place-items-center relative'>
                <button
                  onClick={() => setShowExitGameConfirmBox(false)}
                  className='absolute top-3 right-3 text-gray-900'
                >
                  <XMarkIcon className='h-6 w-6 stroke-2 hover:stroke-4 cursor-pointer' />
                </button>
                <div className='flex items-center mb-4'>
                  <ExclamationTriangleIcon className='h-12 w-12 text-yellow-400 mr-4 -mb-1' />
                  <p className='text-4xl font-semibold mb-1'>Exit game?</p>
                </div>
                <p className='mb-4 -mt-1.25'>Switching menu will not save current game progress.</p>
                <div>
                  <button
                    onClick={() => { if (pendingNav) pendingNav() }}
                    className='cursor-pointer w-40 py-2 mr-4 bg-green-400 text-white rounded-lg hover:bg-green-800'
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => {
                      setShowExitGameConfirmBox(false)
                      setPendingNav(null)
                    }}
                    className='cursor-pointer w-40 py-2 bg-red-400 text-white rounded-lg hover:bg-red-800'
                  >
                    No
                  </button>
                </div>
              </div>
            </div>
          )}

          {showResetConfirmBox && (
            <div className='fixed inset-0 z-50 flex items-center justify-center bg-gray-900/75'>
              <div className='bg-white rounded-lg p-6 place-items-center relative'>
                <button
                  onClick={() => setShowResetConfirmBox(false)}
                  className='absolute top-3 right-3 text-gray-900'
                >
                  <XMarkIcon className='h-6 w-6 stroke-2 hover:stroke-4 cursor-pointer' />
                </button>
                <div className='flex items-center mb-4'>
                  <ExclamationTriangleIcon className='h-12 w-12 text-yellow-400 mr-4 -mb-1' />
                  <p className='text-4xl font-semibold mb-1'>Reset score?</p>
                </div>
                <p className='mb-4 -mt-1.25'>This cannot be undone. Leaderboard will be updated.</p>
                <div>
                  <button
                    onClick={() => {
                      setWins(0)
                      setLosses(0)
                      setTotalGames(0)
                      setWinsPercentage(0)
                      setLossesPercentage(0)
                      localStorage.removeItem('wins')
                      localStorage.removeItem('losses')
                      localStorage.removeItem('totalGames')
                      localStorage.removeItem('winsPercentage')
                      localStorage.removeItem('lossesPercentage')
                      setShowResetConfirmBox(false)
                    }}
                    className='cursor-pointer w-40 py-2 mr-4 bg-green-400 text-white rounded-lg hover:bg-green-800'
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => { setShowResetConfirmBox(false) }}
                    className='cursor-pointer w-40 py-2 bg-red-400 text-white rounded-lg hover:bg-red-800'
                  >
                    No
                  </button>
                </div>
              </div>
            </div>
          )}

          <main className='py-10'>
            <div className='px-4 sm:px-6 lg:px-8'>
              { currentNav === 'Home' && <HomeNav setCurrentNav={setCurrentNav}/> }
              { currentNav === 'Game' && <GameNav 
                hasUnsavedChanges={hasUnsavedChanges}
                setHasUnsavedChanges={setHasUnsavedChanges}
                wins={wins}
                setWins={setWins}
                losses={losses}
                setLosses={setLosses}
                totalGames={totalGames}
                setTotalGames={setTotalGames}
                winsPercentage={winsPercentage}
                setWinsPercentage={setWinsPercentage}
                lossesPercentage={lossesPercentage}
                setLossesPercentage={setLossesPercentage}
                handleReset={handleReset}
              /> }
              { currentNav === 'Leaderboard' && <LeaderboardNav
                wins={wins}
                totalGames={totalGames}
                username={username}
                setUsername={setUsername}
              /> }
            </div>
          </main>
        </div>
      </div>
    </>
  )
}

import React, { useRef, useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY)
import {
    ArrowRightIcon,
    MinusCircleIcon,
} from '@heroicons/react/24/outline';

export function LeaderboardNav(props) {
    const [inputUsername, setInputUsername] = React.useState('');
    const usernameStatus = React.useRef(null);

    const handleUsernameUpdate = () => {
        if (inputUsername.length === 0) {
            usernameStatus.current.className = 'text-red-500';
            usernameStatus.current.innerHTML = 'Username cannot be empty';
            setInputUsername('');
            return;
        }
        if (inputUsername === props.username) {
            usernameStatus.current.className = 'text-red-500';
            usernameStatus.current.innerHTML = 'Username must be different from current username';
            setInputUsername('');
            return;
        }
        if (inputUsername.length < 3 || inputUsername.length > 15 || /^[-_.]|[-_.]$/.test(inputUsername)) {
            usernameStatus.current.className = 'text-red-500';
            usernameStatus.current.innerHTML = 'Username must be between 3 and 15 characters and cannot start/end with underscore, hyphen, or period';
            setInputUsername('');
            return;
        }

        const cleaned = inputUsername.replace(/[^A-Za-z0-9_.-]/g, '');
        setInputUsername(cleaned);
        props.setUsername(cleaned);

        usernameStatus.current.className = 'text-gray-900';
        usernameStatus.current.innerHTML = `Username set to '<b>${cleaned}</b>'`;
        props.setUsername(cleaned);
        insertTableData(cleaned);
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleUsernameUpdate();
        }
    }

    async function confirmRemove() {
        const { error } = await supabase.from('Users').delete().eq('user_id', inputUsername).select();
        if (error) {
            console.error('Error removing username:', error);
            usernameStatus.current.className = 'text-red-500';
            usernameStatus.current.innerHTML = 'Error removing username, please try again';
            usernameStatus.current.innerHTML = '';
            setInputUsername('');
            return;
        }
    }

    const handleRemoveUsername = () => {
        usernameStatus.current.innerHTML = '';
        setInputUsername('');

        if (!props.username) {
            usernameStatus.current.className = 'text-red-500';
            usernameStatus.current.innerHTML = 'No username to remove';
            return;
        }

        confirmRemove();
        props.setUsername('');
    }

    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        getTableData();
    }, []);

    async function getTableData() {
        const {data} = await supabase.from('Users').select('*');
        setTableData(data || []);
        console.log('Table data fetched:', data);
    }

    async function insertTableData(cleaned) {
        const { data, error } = await supabase.from('Users').insert([
            { user_id: cleaned, wins: props.wins, totalGames: props.totalGames, }
        ]).select();
        console.log(error);
        if (error) {
            usernameStatus.current.className = 'text-red-500';
            usernameStatus.current.innerHTML = 'Username taken, please pick something different';
            setInputUsername('');
            return;
        }
    }

    useEffect(() => {
        const channels = supabase.channel('custom-all-channel')
        .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'Users' },
            (payload) => {
            console.log('Change received!', payload)
            getTableData();
            }
        )
        .subscribe()

        return () => {
            supabase.removeChannel(channels);
        }
    }, []);

    useEffect(() => {
        setInputUsername(props.username || '');
      }, [props.username]);

    useEffect(() => {
        console.log(props.username)
    }, [props.username]);

    return (
        <div className='text-gray-900 text-2xl'>
            <p className='font-semibold text-6xl pb-5'>Leaderboard</p>
            <p>Enter a username to put yourself on the leaderboard.</p>
            <div className='flex relative items-center pb-1 pt-3'>
                <p>Username:</p>
                <div className='relative ml-1'>
                    <input type='text' name='inputUsername' value={inputUsername} onChange={(e) => {
                        const rawValue = e.target.value;
                        const formatted = rawValue.replace(/[^A-Za-z0-9_.-]/g, '');
                        setInputUsername(formatted);
                    }} onKeyDown={handleKeyDown} className='border-2 border-black rounded-xl p-2 ml-2 w-100' maxLength={15} />
                    <button onClick={() => handleUsernameUpdate(props.username)} className='cursor-pointer absolute right-1.5 top-1/2 -translate-y-1/2 border-2 border-black p-1.5 px-1.75 rounded-xl'>
                        <ArrowRightIcon className='h-6 w-6 stroke-2 hover:stroke-4' />
                    </button>
                </div>
                <div className='italic font-semibold text-sm ml-2'>
                    <p>*Max length: 15 characters</p>
                    <p>*Special characters/emojis are unsupported</p>
                </div>
            </div>
            <p ref={usernameStatus}></p>
            <p>To remove your username and leaderboard status, press 'Remove'.</p>
            <button onClick={handleRemoveUsername} className='cursor-pointer border-2 border-black p-2.5 px-3 mt-2 rounded-xl group hover:font-bold flex gap-2 items-center'>Remove
                <MinusCircleIcon className='h-6 w-6 stroke-2 group-hover:stroke-4' />
            </button>
            { tableData.length > 0 && (
                <div className='mt-5'>
                    <p className='font-semibold text-2xl'>Leaderboard:</p>
                    <ul className='list-disc pl-5'>
                        {tableData.map((user, index) => (
                            <li key={index} className='py-1'>{user.user_id} - Wins: {user.wins}, Total Games: {user.totalGames}</li>
                        ))}
                    </ul>
                </div>
            )    
            }
        </div>
    )
}//confirm box for remove
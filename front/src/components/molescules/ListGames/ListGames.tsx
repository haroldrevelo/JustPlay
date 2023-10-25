import React, { useState, useEffect } from 'react';
import { deleteGame, fetchGames, Game } from '../../../api/gamesApi/gamesApi';
import moment from 'moment';
import { MapPinIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/solid'
import { useModal } from '../ModalCreate/ModalContext';
import ModalCreate from '../ModalCreate/ModalCreate';

export type ListGamesProps = {
    id: string | number;
    ubicacion: string;
    fecha: string;
    equipos: string;
    imagen: string | File;
}

const ListGames: React.FC = () => {
    const [games, setGames] = useState<Game[]>([]);
    const { update, setUpdate, searchText, setSearchText } = useModal();
    const [updateDelete, setUpdateDelete] = useState<boolean>(false)
    const [openUpdate, setOpenUpdate] = useState(false)
    const [editGame, setEditGame] = useState()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const gamesData = await fetchGames(searchText);
                setGames(gamesData);
                if('message' in gamesData){
                    console.log('EL ERROR', gamesData)
                }
            } catch (error: any) {
                console.log('Error fetching games data:', error.message);
            }
        };

        setUpdate(false)
        setUpdateDelete(false)
        fetchData();
    }, [update, setUpdate, updateDelete, searchText]);

    const handleDeleteGame = async (id: string) => {
        try {
            await deleteGame(id);
            setUpdate(true);
        } catch (error) {
            console.error('Error deleting game:', error);
        }
    };

    const handleEditGame = (game: any) => {
        setEditGame(game)
        setOpenUpdate(true)
    }

    return (
        <main>
            {openUpdate ? <ModalCreate isOpen={true} onClose={() => setOpenUpdate(false)} game={editGame} /> : ''}
            <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
                <ul className="divide-y divide-gray-100 p-2">
                    {games.length ? games.map((game) => (
                        <li key={game.id} className="flex justify-between gap-x-6 py-5">
                            <div className="flex min-w-0 gap-x-4">
                                <img className="h-16 w-16 flex-none rounded-full bg-gray-50" src={`data:image/${game.imageType};base64,${game.image}`} alt="" />
                                <div className="min-w-0 flex-auto">
                                    <p className="text-md font-semibold leading-6 text-gray-900">{game.equipos}</p>
                                    <p className="mt-1 truncate text-xs leading-5 text-gray-500">{moment(game.fecha).format('MMMM D, YYYY')}</p>
                                </div>
                            </div>
                            <div className="sm:flex sm:flex-col sm:items-end justify-center">
                                <div className="flex text-md leading-6 text-gray-900 flex-nowrap">
                                    <MapPinIcon className="h-7 w-7 mr-2 flex-shrink-0" aria-hidden="true" />
                                    {game.ubicacion}
                                </div>
                            </div>
                            <div className="shrink-0 sm:flex sm:flex-inline sm:items-center">
                                <span className="sm:ml-1">
                                    <button
                                        type="button"
                                        className="inline-flex items-center rounded-md bg-gray-800 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                        onClick={() => handleEditGame(game)}
                                    >
                                        <PencilIcon className="h-5 w-5 flex-shrink-0 text-white" aria-hidden="true" />
                                    </button>
                                </span>
                                <span className="sm:ml-1">
                                    <button
                                        type="button"
                                        className="inline-flex items-center rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                        onClick={() => handleDeleteGame(String(game.id))}
                                    >
                                        <TrashIcon className="h-5 w-5 flex-shrink-0 text-white" aria-hidden="true" />

                                    </button>
                                </span>
                            </div>
                        </li>
                    )) :
                        <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
                            <div className="text-center">
                                <p className="text-base font-semibold text-indigo-600">404</p>
                                <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">Page not found</h1>
                                <p className="mt-6 text-base leading-7 text-gray-600">Maybe you can search for something else or create a new game</p>
                                <div className="mt-10 flex items-center justify-center gap-x-6">
                                    <a
                                        href="#"
                                        className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                        onClick={() => setSearchText('')}
                                    >
                                        Reset Search
                                    </a>
                                </div>
                            </div>
                        </main>}
                </ul>
            </div>
        </main>
    )
}

export default ListGames;
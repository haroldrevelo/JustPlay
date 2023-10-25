import { Fragment, useEffect, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { UserCircleIcon } from '@heroicons/react/24/outline'
import { Game, createGame, updateGame } from '../../../api/gamesApi/gamesApi';
import moment from 'moment';
import { useModal } from './ModalContext';

type ModalCreateType = {
    isOpen: boolean;
    onClose: () => void;
    game?: Game
}

const ModalCreate: React.FC<ModalCreateType> = ({ isOpen, onClose, game }) => {
    console.log('game', game)
    const [open, setOpen] = useState(isOpen)
    const [imageEdit, setImageEdit] = useState(false)
    const [imagePreview, setImagePreview] = useState<string | null>(game?.image ? `data:image/${game.imageType};base64,${game.image}`: null);
    const [imageFormData, setImageFormData] = useState<FormData | null>(null);
    const [formData, setFormData] = useState({
        date: game?.fecha ? new Date(game?.fecha).toISOString().split('T')[0] : '',
        firstTeam: game?.equipos.split(' vs ')[0] || '',
        secondTeam: game?.equipos.split(' vs ')[1] || '',
        ubicacion: game?.ubicacion || 'United States',
        image: game?.image || '',
    });
    const { setUpdate } = useModal()

    const cancelButtonRef = useRef(null)
    const fileInputRef = useRef<HTMLInputElement>(null);

    const setClose = () => {
        setOpen(false)
        onClose()
    }

    useEffect(() => {
        return () => {
            if (game && typeof game.image === 'string' && (game.image as string).startsWith('blob:')) {
                URL.revokeObjectURL(game.image as string);
            }
            if (formData.image && typeof formData.image === 'string' && (formData.image as string).startsWith('blob:')) {
                URL.revokeObjectURL(formData.image as string);
            }
        };
    }, [game, formData.image]);

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setImageEdit(true);
        const file = e.target.files && e.target.files[0];

        if (file) {
            const formData = new FormData();
            formData.append('image', file);
            setImageFormData(formData);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleImageChangeClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleAction = async (gameId?: string) => {
        console.log('IMAGE', imageFormData?.get('image'))
        const gameData = {
            ubicacion: formData.ubicacion,
            fecha: moment(formData.date).toISOString(),
            equipos: formData.firstTeam + ' vs ' + formData.secondTeam,
            image: imageFormData?.get('image') as Blob,
        }

        if (game && gameId) {
            try {
                const response = updateGame(gameId, gameData)

                if (await response) {
                    console.log('Game updated successfully!');
                    setFormData({
                        date: gameData?.fecha || '',
                        firstTeam: gameData?.equipos.split(' vs ')[0] || '',
                        secondTeam: gameData?.equipos.split(' vs ')[1] || '',
                        ubicacion: gameData?.ubicacion || 'United States',
                        image: gameData?.image || '',
                    });
                    setUpdate(true)
                    setImageEdit(false)
                    onClose();
                } else {
                    console.error('Error updating game:', response);
                }
            } catch (error) {
                console.error('Error updating game:', error);
            }

        } else {
            try {
                const response = createGame(gameData)

                if (await response) {
                    console.log('Game created successfully!');
                    setFormData({
                        date: '',
                        firstTeam: '',
                        secondTeam: '',
                        ubicacion: '',
                        image: '',
                    });
                    setUpdate(true)
                    onClose();
                } else {
                    console.error('Error creating game:', response);
                }
            } catch (error) {
                console.error('Error creating game:', error);
            }
        }

    };

    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={() => setClose()}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                    <div className="sm:flex sm:items-start justify-center">
                                        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                            <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                                                {game ? 'UPDATE GAME' : 'CREATE GAME'}
                                            </Dialog.Title>
                                            <form>
                                                <div className="border-b border-gray-900/10 pb-12">
                                                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                                        <div className="sm:col-span-3">
                                                            <label htmlFor="image" className="block text-sm font-medium leading-6 text-gray-900">
                                                                Image
                                                            </label>
                                                            <div className="mt-2 flex items-center gap-x-3">
                                                                {imagePreview ? (
                                                                    <img src={imagePreview} alt="Selected" className="h-12 w-12 object-cover rounded-full" />
                                                                ) : game && !imageEdit ? (
                                                                    <img className="h-16 w-16 flex-none rounded-full bg-gray-50" src={`data:image/${game.imageType};base64,${game.image}`} alt="" />
                                                                ) : (
                                                                    <UserCircleIcon className="h-12 w-12 text-gray-300" aria-hidden="true" />
                                                                )}
                                                                <input
                                                                    type="file"
                                                                    accept="image/jpeg, image/png"
                                                                    ref={fileInputRef}
                                                                    onChange={handleFileInputChange}
                                                                    className="hidden"
                                                                />
                                                                <button
                                                                    type="button"
                                                                    className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                                                    onClick={handleImageChangeClick}
                                                                >
                                                                    Change
                                                                </button>
                                                            </div>
                                                        </div>

                                                        <div className="sm:col-span-3">
                                                            <label htmlFor="fecha" className="block text-sm font-medium leading-6 text-gray-900">
                                                                Date
                                                            </label>
                                                            <div className="mt-3">
                                                                <input
                                                                    type="date"
                                                                    name="date"
                                                                    id="date"
                                                                    value={formData.date}
                                                                    onChange={handleInputChange}
                                                                    className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="sm:col-span-3">
                                                            <label htmlFor="first-team" className="block text-sm font-medium leading-6 text-gray-900">
                                                                First Team
                                                            </label>
                                                            <div className="mt-2">
                                                                <input
                                                                    type="text"
                                                                    name="firstTeam"
                                                                    id="first-team"
                                                                    value={formData.firstTeam}
                                                                    onChange={handleInputChange}
                                                                    className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="sm:col-span-3">
                                                            <label htmlFor="second-team" className="block text-sm font-medium leading-6 text-gray-900">
                                                                Second Team
                                                            </label>
                                                            <div className="mt-2">
                                                                <input
                                                                    type="text"
                                                                    name="secondTeam"
                                                                    id="second-team"
                                                                    value={formData.secondTeam}
                                                                    onChange={handleInputChange}
                                                                    className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="sm:col-span-3">
                                                            <label htmlFor="ubicacion" className="block text-sm font-medium leading-6 text-gray-900">
                                                                Country
                                                            </label>
                                                            <div className="mt-2">
                                                                <select
                                                                    id="ubicacion"
                                                                    name="ubicacion"
                                                                    value={formData.ubicacion}
                                                                    onChange={handleInputChange}
                                                                    className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                                                >
                                                                    <option>United States</option>
                                                                    <option>Argentina</option>
                                                                    <option>Canada</option>
                                                                    <option>Colombia</option>
                                                                    <option>Mexico</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                    <button
                                        type="button"
                                        className="inline-flex w-full justify-center rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                                        onClick={() => handleAction(game ? String(game.id) : '')}
                                    >
                                        {game ? 'Update Game' : 'Create Game'}
                                    </button>
                                    <button
                                        type="button"
                                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                        onClick={() => setClose()}
                                        ref={cancelButtonRef}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    )
}

export default ModalCreate
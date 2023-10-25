import React, { useState, ChangeEvent } from 'react'
import ModalCreate from '../../molescules/ModalCreate/ModalCreate'
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid'
import { useModal } from '../../molescules/ModalCreate/ModalContext'

const Header: React.FC = () => {
    const [openCreate, setOpenCreate] = useState(false)
    const {searchText, setSearchText} = useModal();

    const handleSearchChange = (event:  ChangeEvent<HTMLInputElement>): void => {
      setSearchText(event.target.value);
    };

    return (
        <header className="bg-gray-800 shadow">
            {openCreate ? <ModalCreate isOpen={true} onClose={() => setOpenCreate(false)} /> : ''}
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                <div className="lg:flex lg:items-center lg:justify-between">
                    <div className="min-w-0 flex-1">
                        <h2 className="text-2xl font-bold leading-7 text-white sm:truncate sm:text-3xl sm:tracking-tight">
                            List of Games
                        </h2>
                    </div>

                    <form>
                        <label
                            htmlFor="default-search"
                            className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">
                            Search
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
                                <MagnifyingGlassIcon className="h-6 w-6 text-gray-300" aria-hidden="true" />
                            </div>
                            <input
                                type="search"
                                id="default-search"
                                className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="Teams o locations ..."
                                value={searchText}
                                onChange={handleSearchChange}
                                required
                            />
                        </div>
                    </form>

                    <div className="mt-5 flex lg:ml-4 lg:mt-0">
                        <span className="sm:ml-3">
                            <button
                                type="button"
                                className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                onClick={() => setOpenCreate(true)}
                            >
                                Create Game
                            </button>
                        </span>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header

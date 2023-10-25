const urlEnv: string = (process.env.REACT_APP_API_BASE_URL as string)

export interface Game {
  id?: string;
  ubicacion: string;
  fecha: string;
  equipos: string;
  image: Blob;
  imageType: string;
}

export const fetchGames = async (searchText: string): Promise<Game[]> => {
  try {
    const response = await fetch(`${urlEnv}/games?search=${encodeURIComponent(searchText)}`);
    const games: Game[] = await response.json();
    return games;
  } catch (error: any) {
    throw new Error('Error fetching games data: ' + error.message || error);
  }
};

export const createGame = async (gameData: Partial<Game>): Promise<Game> => {
    try {
      const formData = new FormData();
      formData.append('ubicacion', gameData.ubicacion || '');
      formData.append('fecha', gameData.fecha || '');
      formData.append('equipos', gameData.equipos || '');
  
      if (gameData.image instanceof File) {
        formData.append('image', gameData.image);
      }
  
      const response = await fetch(`${urlEnv}/games`, {
        method: 'POST',
        body: formData,
      });
  
      const savedGame: Game = await response.json();
      return savedGame;
    } catch (error: any) {
      throw new Error('Error saving game data: ' + error.message || error);
    }
};

export const updateGame = async (gameId: string, updatedGame: Partial<Game>): Promise<Game> => {
    const formData = new FormData();
      formData.append('ubicacion', updatedGame.ubicacion || '');
      formData.append('fecha', updatedGame.fecha || '');
      formData.append('equipos', updatedGame.equipos || '');
  
      if (updatedGame.image instanceof File) {
        console.log('IMAGE', updatedGame.image)
        formData.append('image', updatedGame.image);
      }
    try {
      const response = await fetch(`${urlEnv}/games/${gameId}`, {
        method: 'PUT',
        body: formData,
      });
  
      const updatedGameData: Game = await response.json();
      return updatedGameData;
    } catch (error: any) {
      throw new Error('Error updating game data: ' + error.message || error);
    }
};

export const deleteGame = async (gameId: string): Promise<void> => {
    try {
      const response = await fetch(`${urlEnv}/games/${gameId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
      });
  
      if (response) {
        console.log('Game successfully deleted');
      } else {
        throw new Error('Failed to delete game');
      }
    } catch (error: any) {
      throw new Error('Error deleting game: ' + error.message || error);
    }
  };
  
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
exports.app = app;
app.use(express_1.default.json());
app.use(body_parser_1.default.json({ limit: '50mb' }));
app.use(body_parser_1.default.urlencoded({ limit: '50mb', extended: true, parameterLimit: 500000 }));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    next();
});
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const upload = (0, multer_1.default)({ storage: storage });
app.get('/', async (req, res) => {
    res.status(200).send('JustPlay api is running!');
});
app.get('/games', async (req, res) => {
    const searchTerm = req.query.search;
    console.log('searchTerm', searchTerm);
    try {
        let games;
        if (searchTerm) {
            games = await prisma.games.findMany({
                where: {
                    OR: [
                        {
                            equipos: {
                                contains: searchTerm,
                            },
                        },
                        {
                            ubicacion: {
                                contains: searchTerm,
                            },
                        }
                    ],
                },
            });
        }
        else {
            games = await prisma.games.findMany();
        }
        if (games.length === 0) {
            res.status(404).json({ message: 'No games found' });
        }
        else {
            const gamesWithBase64Image = games.map((game) => {
                const base64Image = Buffer.from(game.image).toString('base64');
                return { ...game, image: base64Image };
            });
            res.status(200).json(gamesWithBase64Image);
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error retrieving games' });
    }
});
app.post('/games', upload.single('image'), async (req, res) => {
    const { ubicacion, fecha, equipos } = req.body;
    const { file } = req;
    if (!ubicacion || !fecha || !equipos || !file) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    try {
        const newGame = await prisma.games.create({
            data: {
                ubicacion,
                fecha,
                equipos,
                image: fs_1.default.readFileSync(file ? file.path : ''),
                imageType: file.mimetype
            },
        });
        res.status(200).json(newGame);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating game' });
    }
});
app.put('/games/:id', upload.single('image'), async (req, res) => {
    const gameId = parseInt(req.params.id);
    const { ubicacion, fecha, equipos } = req.body;
    const { file } = req;
    if (!ubicacion || !fecha || !equipos || !file) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    try {
        const updatedGame = await prisma.games.update({
            where: { id: gameId },
            data: {
                ubicacion,
                fecha,
                equipos,
                image: fs_1.default.readFileSync(file ? file.path : ''),
                imageType: file.mimetype
            },
        });
        res.status(200).json(updatedGame);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating game' });
    }
});
app.delete('/games/:id', async (req, res) => {
    const gameId = parseInt(req.params.id);
    try {
        const existingGame = await prisma.games.findUnique({
            where: { id: gameId },
        });
        if (!existingGame) {
            return res.status(404).json({ error: 'Game not found' });
        }
        await prisma.games.delete({
            where: { id: gameId },
        });
        res.status(200).json({ message: 'Game deleted successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error deleting game' });
    }
});

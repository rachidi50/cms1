
const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');

dotenv.config();

const FRONT_PATH = path.join(__dirname, '../front');

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(FRONT_PATH));

// Modèle User
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);

// Page d'accueil
app.get('/', (req, res) => {
    res.sendFile(path.join(FRONT_PATH, 'index.html'));
});

// Connexion MongoDB
async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        process.exit(1);
    }
}

// Route de test
app.get('/api/test', (req, res) => {
    res.json({
        message: 'Backend Express fonctionne correctement'
    });
});

// Inscription
app.post('/api/register', async (req, res) => {
    try {
        let { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: 'Email et mot de passe obligatoires'
            });
        }

        email = email.trim().toLowerCase();

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({
                message: 'Adresse email invalide'
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                message: 'Le mot de passe doit contenir au moins 8 caractères'
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                message: 'Cette adresse email est déjà utilisée'
            });
        }


        const user = new User({
            email,
            password
        });

        await user.save();

        return res.status(201).json({
            message: 'Utilisateur créé avec succès',
            user: {
                id: user._id,
                email: user.email,
                createdAt: user.createdAt
            }
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: 'Cette adresse email est déjà utilisée'
            });
        }

        console.error('Register error:', error.message);

        return res.status(500).json({
            message: 'Erreur interne du serveur'
        });
    }
});

// Connexion
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

       

        const user = await User.findOne({
            email: email.trim().toLowerCase()
        });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({
                message: 'Email ou mot de passe incorrect'
            });
        }

        return res.status(200).json({
            message: 'Identifiants vérifiés avec succès',
            user: {
                id: user._id,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Login error:', error.message);

        return res.status(500).json({
            message: 'Erreur interne du serveur'
        });
    }
});

// Démarrage du serveur
const PORT = process.env.PORT || 3000;

async function startServer() {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

startServer();
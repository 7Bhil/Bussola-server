const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Import des routes
const authRoutes = require('./routes/authRoutes');
const newsRoutes = require('./routes/newsRoutes');
const actionRoutes = require('./routes/actionRoutes');
const projectRoutes = require('./routes/projectRoutes');
const formRoutes = require('./routes/formRoutes');
const testimonialRoutes = require('./routes/testimonialRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Configuration CORS pour supporter plusieurs origines (Client, Admin et Localhost)
const allowedOrigins = [
  'https://bussola-client.vercel.app',
  'https://bussola-admin-nu.vercel.app',
  'http://localhost:5173',
  'http://localhost:5174'
];

if (process.env.CLIENT_URL) {
  const extraOrigins = process.env.CLIENT_URL.split(',').map(o => o.trim());
  allowedOrigins.push(...extraOrigins);
}

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      callback(null, true);
    } else {
      callback(new Error(`CORS Error: Origin ${origin} not allowed`));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 204
};

// CORS doit être avant helmet pour que les requêtes preflight OPTIONS passent
app.use(cors(corsOptions));

// --- Middlewares ---
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Limiteur de requêtes global (exclut les requêtes OPTIONS preflight)
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: 'Trop de requêtes, veuillez réessayer plus tard.' },
  skip: (req) => req.method === 'OPTIONS'
});
app.use('/api/', globalLimiter);

// Database connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/busola';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connecté à MongoDB'))
  .catch(err => console.error('Erreur de connexion MongoDB:', err));

// --- Utilisation des Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/actions', actionRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api', formRoutes); // Newsletter et Contact

app.get('/', (req, res) => {
  res.send('API Busola opérationnelle (Architecture MVC)');
});

// --- Gestion des Erreurs ---
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Une erreur interne est survenue',
    error: process.env.NODE_ENV === 'production' ? {} : err
  });
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});

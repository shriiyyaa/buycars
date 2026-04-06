require('dotenv').config();
const express = require('express');
const cors = require('cors');
require('./db/database');
require('./db/seed');

const authRoutes = require('./routes/auth');
const oemRoutes = require('./routes/oem');
const inventoryRoutes = require('./routes/inventory');

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.use('/api/auth', authRoutes);
app.use('/api/oem', oemRoutes);
app.use('/api/inventory', inventoryRoutes);

app.get('/', (req, res) => res.json({ message: 'BuyCars API is running!' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.use(cors({
  origin: ['http://localhost:3000', 'https://buycars-gamma.vercel.app'],
  credentials: true
}));
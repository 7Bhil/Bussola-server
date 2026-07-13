const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/busola';
const BACKUP_DIR = path.join(__dirname, '../backups');

if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const backupPath = path.join(BACKUP_DIR, `backup-${timestamp}`);

console.log(`Démarrage de la sauvegarde dans : ${backupPath}`);

// Extraction du nom de la base de données depuis l'URI
const dbNameMatch = MONGODB_URI.match(/\/([^\/?]+)(\?|$)/);
const dbName = dbNameMatch ? dbNameMatch[1] : 'busola';

const command = `mongodump --uri="${MONGODB_URI}" --out="${backupPath}"`;

exec(command, (error, stdout, stderr) => {
    if (error) {
        console.error(`Erreur lors de la sauvegarde : ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`Statut : ${stderr}`);
    }
    console.log(`Sauvegarde réussie : ${stdout}`);
    
    // Nettoyage optionnel : garder seulement les 7 dernières sauvegardes
    const files = fs.readdirSync(BACKUP_DIR)
        .filter(f => f.startsWith('backup-'))
        .map(f => ({ name: f, time: fs.statSync(path.join(BACKUP_DIR, f)).mtime.getTime() }))
        .sort((a, b) => b.time - a.time);

    if (files.length > 7) {
        files.slice(7).forEach(f => {
            const oldPath = path.join(BACKUP_DIR, f.name);
            fs.rmSync(oldPath, { recursive: true, force: true });
            console.log(`Ancienne sauvegarde supprimée : ${f.name}`);
        });
    }
});

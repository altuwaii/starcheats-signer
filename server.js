const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { execFile } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const app = express();
app.use(cors());
const upload = multer({ dest: path.join(os.tmpdir(), 'starcheats/') });

app.post('/api/sign', upload.fields([
  { name: 'ipa' }, { name: 'provision' }, { name: 'p12' }
]), (req, res) => {
  const { ipa, provision, p12 } = req.files;
  const password = req.body.password;

  if (!ipa || !provision || !p12 || !password) {
    return res.status(400).send('Missing files or password.');
  }

  const outputPath = path.join(os.tmpdir(), `signed_${Date.now()}.ipa`);

  execFile('zsign', [
    '-f', ipa[0].path,
    '-m', provision[0].path,
    '-c', p12[0].path,
    '-p', password,
    '-o', outputPath
  ], (err, stdout, stderr) => {
    if (err) {
      console.error(stderr);
      return res.status(500).send('Signing failed. Check your password and files.');
    }
    res.download(outputPath, 'signed.ipa', () => {
      fs.unlinkSync(ipa[0].path);
      fs.unlinkSync(provision[0].path);
      fs.unlinkSync(p12[0].path);
      fs.unlinkSync(outputPath);
    });
  });
});

app.listen(7860, () => console.log('StarCheats Signer running on port 7860'));

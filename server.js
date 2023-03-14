const express = require('express');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const register = require('./controllers/register.js');
const signin = require('./controllers/signin.js');
const profile = require('./controllers/profile.js');
const image = require('./controllers/image.js');
  
const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());

const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  'https://<project>.supabase.co', 
  '<your-anon-key>'
)

app.get('/', (req, res) => { res.send('success!!!') });
app.post('/signin', (req, res) => { signin.handleSignin(req, res, supabase, bcrypt) });
app.post('/register', (req, res) => { register.handleRegister(req, res, supabase, bcrypt) });
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, supabase) });
app.put('/image', (req, res) => { image.handleImage(req, res, supabase) });
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res) });
app.listen(port, () => console.log(`HelloNode app listening on port ${port}!`));

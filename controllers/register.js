const handleRegister = (req, res, supabase, bcrypt) => {
    const { email, name, password } = req.body

    if (!email || !name || !password) {
        return res.status(400).json('incorrect form submission')
    }
    
    const hash = bcrypt.hashSync(password, 8);  
    
    async function insertNewLoginAndUser() {
        const newUser = await supabase
                  .from('users')
                  .insert([{ 
                      email: email,
                      name: name,
                      joined: new Date() 
        }])
      
        const newLogin = await supabase
              .from('login')
              .insert([{
                  hash: hash,
                  email: email    
        }])
        
        const fetchNewUser = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
      
        if (newUser.error || newLogin.error) {
            console.log('error creating new user and login') 
            return res.status(400).json('error creating new user')   
        }
        if (newUser && newLogin) {
          console.log('a new user with a login was created.')
          res.json(fetchNewUser.data[0])
        } 
    }

    insertNewLoginAndUser()
    .then(() => {
        console.log('insertNewLoginAndUser function was called')
    })
    .catch(err => res.status(400).json('unable to register')) 
}

module.exports = {
    handleRegister: handleRegister    
}
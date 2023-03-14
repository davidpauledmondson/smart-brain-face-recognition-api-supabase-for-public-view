const handleSignin = (req, res, supabase, bcrypt) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json('incorrect form submission')
    }

    async function fetchUserAndLoginForSignIn() {
        const fetchUser = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
        
        const fetchLogin = await supabase
            .from('login')
            .select('*')
            .eq('email', email)
        
        if (fetchUser.error || fetchLogin.error) {
            console.log('error getting user') 
            return res.status(400).json('error getting user')   
        }

        const isValid = bcrypt.compareSync(password, fetchLogin.data[0].hash);
        
        if (isValid) { 
            console.log("the user was signed in successfully.")
            return res.json(fetchUser.data[0])    
        } else {
            console.log('wrong credentials')
            return res.status(400).json('wrong credentials')
        }
    }
    
    fetchUserAndLoginForSignIn()
    .then(() => {
        console.log('fetchUserAndLoginForSignIn function was called')
    })
    .catch(err => res.status(400).json('wrong credentials!!!'))   
}

module.exports = {
   handleSignin:handleSignin    
}
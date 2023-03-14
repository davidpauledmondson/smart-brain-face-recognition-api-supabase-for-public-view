const handleProfileGet = (req, res, supabase) => {
    const { id } = req.params

    async function fetchUserForProfile() {
        const { data, error } = await supabase
        .from('users')
        .select()
        .eq('id', id)
        
        if (error) {
            console.log('could not fetch user')
            return res.status(400).json('error getting user')    
        } else if (data.length === 0) {
            console.log('no user found');        
            return res.status(400).json('no user found')
        } else if (data.length !==0) {
            console.log('profile was called successfully')       
            return res.json(data[0])
        }
    }
    
    fetchUserForProfile()
    .then(() => {
        console.log('fetchUserForProfile function was called')
    })
    .catch(err => res.status(400).json('error getting user'))
}

module.exports = {
    handleProfileGet: handleProfileGet
}
const Clarifai = require('clarifai');

const app = new Clarifai.App({
    apiKey: 'your-Clarifai-apiKey-goes-here'
});

//Sometimes the Clarifai Models go down for updates. 
//So, check the Face Detect Model on their site: 
//https://www.clarifai.com/models/face-detection
//If that isn't working, then you might have to wait for the server to be back up.

// Old Way:
// app.models.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)

//-----This deals with Clarifai------
const handleApiCall = (req, res) => {
    app.models
        .predict('face-detection',req.body.input)
        .then(data => {
            res.json(data);
        })
        .catch(err => res.status(400).json('unable to work with API'))
}
//-----------------------------------------------------

//-----This will update the SQl table and Web page info on the user's number of photo entries---
const handleImage = (req, res, supabase) => {
    const { id } = req.body
    
    //-----This updated version DOES NOT use the SQL Function increment-----
    async function updateUserEntries() {
        const fetchUser = await supabase
        .from('users')
        .select('*')
        .eq('id', id)

        let updatedEntry = fetchUser.data[0].entries + 1

        const addToUserEntries = await supabase
            .from('users')
            .update([{ entries: updatedEntry }])
            .eq('id', id)

        if (fetchUser.error || addToUserEntries.error) {
            console.log('error updating user entries') 
            return res.status(400).json('error updating user entries')   
        }
        if (fetchUser && addToUserEntries) {
            console.log('success updating user entries')
            console.log("entries", updatedEntry)
            return res.json(updatedEntry);   
        }
        else {
            return res.status(400).json('unable to get entries')    
        }
    }
    //--------------------------------------------------------------------

    //-----This updated version DOES use the SQL Function increment-----
    // async function updateUserEntries() {
    //     const updateEntries = await supabase
    //         .rpc('increment', { x: 1, row_id: id })

    //     const fetchUser = await supabase
    //         .from('users')
    //         .select('*')
    //         .eq('id', id)    

    //     if (updateEntries.error || fetchUser.error) {
    //         console.log('error updating user entries') 
    //         return res.status(400).json('error updating user entries')   
    //     }
    //     if (updateEntries && fetchUser) {
    //         console.log('success updating user entries')
    //         console.log("entries", fetchUser.data[0].entries)
    //         return res.json(fetchUser.data[0].entries);   
    //     }
    //     else {
    //         return res.status(400).json('unable to get entries')    
    //     }
    // }
    //--------------------------------------------------------------------

    updateUserEntries()
    .then(() => {
        console.log('updateUserEntries function was called')
    })
    .catch(err => res.status(400).json('unable to get entries'))   
}

module.exports = {
    handleImage: handleImage,
    handleApiCall: handleApiCall
}
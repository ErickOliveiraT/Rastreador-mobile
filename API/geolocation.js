const axios = require('axios');
const cred = require('./credencials')

module.exports = {

    getAddress(latitude, longitude, login) {

        const url = 'http://my.locationiq.com/v2/reverse.php?'
        const query = `token=${cred.token}&lat=${latitude}&lon=${longitude}&format=json`
        const getUrl = url+query;
        
        return new Promise((resolve) => {
            axios.get(getUrl+query)
            .then(function (response) {
                let address = response.data.address;
                resolve(address);
            })
            .catch(function (error) {
                console.log(error);
                resolve(false);
            });
        })
    }
}
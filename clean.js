console.log('clean')


require('dotenv').config()
const initDatabase = require('./config/database')
const fs = require('fs')
const modelsPath = `./app/models`
const { removeExtensionFromFile } = require('./app/middleware/utils')

initDatabase()

// Loop models path and loads every file as a model except index file
const models = fs.readdirSync(modelsPath).filter((file) => {
    return removeExtensionFromFile(file) !== 'index'
})

const deleteModelFromDB = (modelFileName) => {
    return new Promise((resolve, reject) => {
        model = require(`./app/models/${modelFileName}`)
        console.log('Cleaning...: ', modelFileName, model.modelName)
        model.deleteMany({}, (err, row) => {
            if (err) {
                console.log('Error: ', modelFileName)
                reject(err)
            } else {
                console.log('Cleaned: ', modelFileName)
                resolve(row)
            }
        })
    })
  }
  
const clean = async () => {
    try {
        const promiseArray = models.map(
            async (model) => await deleteModelFromDB(model)
        )
        await Promise.all(promiseArray)
        console.log('Cleanup complete!')
        process.exit(0)
    } catch (err) {
        console.log(err)
        process.exit(0)
    }
}
  
clean()

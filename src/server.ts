import mongoose from 'mongoose'
import app from './app'
import config from './app/config'

async function main() {
  try {
    await mongoose.connect(config.database_url as string)
    console.log('✅ MongoDB connected successfully')
    app.listen(config.port, () => {
      console.log(`EMS App is listening on port ${config.port}`)
    })
  } catch (err) {
    console.log(err)
  }
}

main()

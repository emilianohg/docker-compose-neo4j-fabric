import express, { Application } from 'express';
import cors from 'cors';
import companyRoutes from './routes/companyRoutes';
import {database}  from './database/database'
import { config as dotenvConfig }  from 'dotenv';

class Server {

    public app:Application;

    constructor(){
        this.app = express();
        this.config();
        this.routes();
        this.connectDB();
        dotenvConfig();
    }

    config():void{
        this.app.set('port',process.env.PORT || 8100);
      
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.static('public'));

    }

    routes():void{
      this.app.use('/api/companies',companyRoutes);
    }

    async connectDB():Promise<void>{
      database.authenticate()
    }
    start():void{
      this.app.listen(this.app.get('port'), () => {
              console.log('Server on port',this.app.get('port'))
      });
    }
    
    }
    
    export default Server;

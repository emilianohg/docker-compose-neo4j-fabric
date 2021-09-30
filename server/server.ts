import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { database }  from './database/database'
import companyRoutes from './routes/companyRoutes';
import statesRoutes from './routes/statesRoutes'

dotenv.config();

class Server {

    public app:Application;

    constructor(){
        this.app = express();
        this.config();
        this.routes();
        this.connectDB();
    }

    config():void{
        this.app.set('port',process.env.PORT || 8200);
      
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.static('public'));

    }

    routes():void{
        this.app.use('/api/states', statesRoutes);
        this.app.use('/api/companies', companyRoutes);
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

import express, { Application } from 'express';
import cors from 'cors';
import companyRoutes from './routes/companyRoutes';
import {database}  from './database/database'
import dotenv from 'dotenv';
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
        this.app.set('port',process.env.PORT || 8100);
      
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.static('public'));

    }

    routes():void{
        this.app.use('/api/companies', companyRoutes);
        this.app.use('/api/states', statesRoutes);
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

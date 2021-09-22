import express, { Application } from 'express';
import cors from 'cors';
import companyRoutes from './routes/companyRoutes';
import { database }  from './database/database'

class Server {

    public app:Application;

    constructor(){
        this.app = express();
        this.config();
        this.routes();
    }

    config():void{
        this.app.set('port',process.env.PORT || 8300);
      
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.static('public'));

    }

    routes():void{
      this.app.use('/api/companies',companyRoutes);

    }
    
    start():void{
      this.app.listen(this.app.get('port'), () => {
          console.log('Server on port',this.app.get('port'))
      });
    }
    
    }
    
    export default Server;
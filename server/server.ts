import express, { Application } from 'express';
import cors from 'cors';
import productRoutes from './routes/productRoutes';

class Server {

    public app:Application;

    constructor(){
        this.app = express();
        this.config();
        this.routes();
    }

    config():void{
        this.app.set('port',process.env.PORT || 8080);
      
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.static('public'));

    }

    routes():void{
      this.app.use('/api/products',productRoutes);

    }
    
    start():void{
      this.app.listen(this.app.get('port'), () => {
          console.log('Server on port',this.app.get('port'))
      });
    }
    
    }
    
    export default Server;
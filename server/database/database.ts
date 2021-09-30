import neo4j from 'neo4j-driver';
import dotenv from 'dotenv';

class Database {
    driver : typeof neo4j.Driver;

    constructor() {

        dotenv.config();


        console.log(this.port);

        
        // cambiar a bolt
        this.driver  = neo4j.driver(
          `bolt://${this.host}:${this.port}`,
          neo4j.auth.basic(this.username, this.password),
        );

    }

    async execute(call: <T>(session: typeof neo4j.Session) => T | any) {
        const session = this.driver.session({
            database: this.dbname,
            defaultAccessMode: neo4j.session.WRITE
        });
        const response = await call(session);
        await session.close();
        return response;
    }

    async authenticate (){
        await this.driver.verifyConnectivity({ database: this.dbname })
            .then(success => console.log('Connected ', success))
            .catch(error => console.log("Error: ", error))
    }

    get host(): string {
        return process.env.DB_HOST || 'localhost';
    }

    get port(): string {
        return process.env.PORT_DB || '17687';
    }

    get username(): string {
        return process.env.DB_USER || 'neo4j';
    }

    get password(): string {
        return process.env.DB_PASS || 'password';
    }

    get dbname(): string {
        return process.env.DB_NAME || 'dbcanada';
    }

}

export const database = new Database();




import neo4j from 'neo4j-driver'

class Database {
    driver : typeof neo4j.Driver;
    session: typeof neo4j.Session;

    constructor() {
        this.driver  = neo4j.driver(
          `neo4j://${this.host}:${this.port}`,
          neo4j.auth.basic(this.username, this.password),
        );

        this.session = this.driver.session({
            database: 'dbcanada',
            defaultAccessMode: neo4j.session.WRITE
        });
    }

    async authenticate (){
        await this.driver.verifyConnectivity({ database: this.dbname })
            .then(success => console.log('Connected ', success))
            .catch(error => console.log("Error: ", error))
    }

    get host() {
        return process.env.DB_HOST;
    }

    get port() {
        return process.env.DB_PORT;
    }

    get username() {
        return process.env.DB_NAME;
    }

    get password() {
        return process.env.DB_PASS;
    }

    get dbname() {
        return process.env.DB_NAME;
    }

}

export const database = new Database();




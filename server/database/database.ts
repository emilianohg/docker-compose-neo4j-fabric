import neo4j from 'neo4j-driver'

class Database {
    driver : typeof neo4j.Driver;
    session: typeof neo4j.Session;

    constructor() {
        this.driver  = neo4j.driver("neo4j://localhost:17687", neo4j.auth.basic("neo4j", "password"));
        this.session = this.driver.session({database: 'dbcanada',defaultAccessMode: neo4j.session.WRITE});
    }

    async authenticate (){
    await this.driver.verifyConnectivity({ database: "dbcanada" })
    .then(success => console.log('Connected ', success))
    .catch(error => console.log("Error: ", error))
    }

}

export const database = new Database();




import dotenv from 'dotenv'
import neo4j from 'neo4j-driver'

dotenv.config();

class Database {


    constructor(){
        console.log('runnign')
      const driver = neo4j.driver("bolt://localhost:17690", neo4j.auth.basic("neo4j", "password"));
       var x =  driver.verifyConnectivity
       console.log(x);
    }


}

export const database = new Database();



   
   
    // const session = driver.session({
    //     database: 'dbcanada',
    //     defaultAccessMode: neo4j.session.WRITE
    // })

    



    // export default session;


    // try {
    //     const result = await session.run(
    //       'CREATE (a:Person {name: $name}) RETURN a',
    //       { name: personName }
    //     )
      
    //     const singleRecord = result.records[0]
    //     const node = singleRecord.get(0)
      
    //     console.log(node.properties.name)
    //   } finally {
    //     await session.close()
    //   }
      
// on application exit:
// await driver.close()





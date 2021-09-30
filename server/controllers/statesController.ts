import { Response } from 'express';
import { database } from '../database/database'

//endpoint
class StatesController {

  public async list(req: any, res: Response) {

    const { country } = req.query;

    console.log(country);

    try {

      const states = await database.execute(async session => {

        let query = `
          MATCH (s:State) 
          RETURN 
            s.stateID as id,
            s.state as name,
            s.country as country
        `;

        if (country !== undefined) {
          query = `
            MATCH (s:State) 
            WHERE s.country = "${country}"
            RETURN 
              s.stateID as id,
              s.state as name,
              s.country as country
          `;
        }

        const states = await session.run(query);
        

        return states.records.map(record => {
          return {
            id: record.get('id').low,
            name: record.get('name'),
            country: record.get('country'),
          };
        });

      });

      res.json({
        ok: true,
        data: states
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        ok: false,
        msg: error
      });
    }
  }

}
export const statesController = new StatesController();

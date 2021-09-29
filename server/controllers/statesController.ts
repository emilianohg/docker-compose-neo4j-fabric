import { Response } from 'express';
import { database } from '../database/database'

//endpoint
class StatesController {

  public async list(req: any, res: Response) {

    try {

      const query = `
        MATCH (s:State) 
        RETURN 
          s.stateID as id,
          s.state as name,
          s.country as country
      `;

      const states = database.session.run(query);
      const nodes = (await states).records.map(record => {
        return {
          id: record.get('id').low,
          name: record.get('name'),
          country: record.get('country'),
        };
      });

      console.log(nodes);

      res.json({
        ok: true,
        data: nodes
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

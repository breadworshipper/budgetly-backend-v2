import { app } from "../../index.js";
import bodyParser from 'body-parser';

async function bodyParserSetup(){
    app.use(bodyParser.urlencoded({extended: false}));
}

export {bodyParserSetup};

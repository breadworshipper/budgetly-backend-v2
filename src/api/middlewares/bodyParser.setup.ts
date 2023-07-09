import { app } from "../../index.js";
import bodyParser from 'body-parser';

async function bodyParserSetup(){
    app.use(bodyParser.urlencoded({extended: false}));
    console.log("bodyParser done setting-up")
}

export {bodyParserSetup};

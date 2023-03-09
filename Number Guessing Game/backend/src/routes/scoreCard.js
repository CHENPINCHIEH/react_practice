import { Router } from "express";
import ScoreCard from "../models/ScoreCard";

const router = Router();

// Header.js handleClear
router.delete("/cards", async (req, res) => {
    try {
        await ScoreCard.deleteMany({});
        res.status(200).send({ message: 'Database cleared' })
        console.log("Database deleted");
    } catch (e) {
        throw new Error("Database deletion failed");
    }
});

// Body.js handleQuery
router.get("/cards", async (req, res) => {
    let queryType = req.query.type;
    let queryString = req.query.queryString;
    let isEmptyStr =isEmpty(queryString);

    if (!isEmptyStr){
        if (queryType == "name") {
            try{
                const results = await ScoreCard.find({ name: queryString });
                sendResponse(results);
            }catch(e){
                 throw new Error("Database query failed");
            }
            
        } else {
            try{
                const results = await ScoreCard.find({ subject: queryString });
                sendResponse(results);
            }catch(e){
                throw new Error("Database query failed");
            }
        }
    }

    function isEmpty(str) {
        return (!str || str.trim().length === 0);
    }

    function sendResponse(results){
        let msg = printMsg(results);
        let erromsg = erroMsg();

        if (results.length) {
            res.status(200).send({ messages: msg, message: erromsg });
        } else {
            let msg = false;
            res.status(200).send({ messages: msg, message: erromsg });
        }
    }

    function erroMsg() {
        let erroMsg = `${queryType}(${queryString}) not found!`;
        return erroMsg
    }

    function printMsg(results) {
        let printMsg = [`Found card with ${queryType}:`];
        results.map((e) => {
            printMsg.push(`(${e.name}, ${e.subject}, ${e.score})`) ;
        });

        return printMsg
    }
});

// Body.js handleAdd
router.post("/card", async (req, res) => {

    let name = req.body.name;
    let subject = req.body.subject;
    let score = req.body.score;

    const isExist = await ScoreCard.find({ name: name, subject: subject });
    if (isExist[0]) {
        const updated = await ScoreCard.updateOne({ name: name, subject: subject }, { score: score });
        // console.log("updated");
        res.status(200).send({ message: `Updating(${name},${subject},${score})`, card: true });
    } else {
        const newScoreCard = new ScoreCard({ name, subject, score });
        newScoreCard.save();
        // console.log("user save");
        res.status(200).send({ message: `Adding(${name},${subject},${score})`, card: true });
    }
});

export default router;
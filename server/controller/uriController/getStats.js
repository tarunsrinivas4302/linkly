const { Stats } = require("../../model/index.js");
const { sendJSON } = require("../../utils/common.js");
const CustomError = require("../../classes/CustomError.js");


const getStats = async (req, res, next) => {
    try {

        const { urlID } = req.body;
        const { id: userID } = req.user;
        if (!userID) throw new CustomError("Unauthorized", 401);
        if (!urlID) throw new CustomError("Bad Request", 400);

        const query = {
            url: urlID,
            user: userID,
        };

        const data = await Stats.find(query);

        if (!data) throw new CustomError("No Data Found", 404);


        let totalClicks = data[data.length - 1]?.clicks;




        let modifiedData = {
            length: data.length,
            totalClicks: totalClicks,
            city: data.map(i => i.city),
            state: data.map(i => i.state),
            device: data.map(i => i.device),

        }

        sendJSON(res, modifiedData, "Data Fetched Sucessfully", 200)

    } catch (err) { next(err) }
}
module.exports = getStats;

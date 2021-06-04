const query = require("./utils/query");

exports.handler = async (event) => {
  try {
    const res = await query(JSON.parse(event.body));
    return {
      statusCode: 200,
      body: JSON.stringify(res),
    };
  } catch (err) {
    console.log(err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        err: "Something went wrong fetching books",
      }),
    };
  }
};

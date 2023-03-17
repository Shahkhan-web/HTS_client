const { use_db } = require("../config/db_pool");
const s3 = require("../config/s3manager");

const update = async (req, res) => {
  let req_id = await req.params.id;
  let data = await req.body;
  if (data.profile.length) {
    const upload = await s3.direct_upload(data.profile,data.key);
    if (upload.status === 400) {
      res.status(400).json({ err: upload.err });
      return;
    }
    data = { ...data, profile: `${process.env.SERVER_URL}/image/${upload.key}`,key:''}
  }
  try {
    console.log(data);
    updateTeachers(data, req_id);
    res.status(200).json({ status: 200 });
    return;
  } catch (errr) {
    res.status(500).send(errr);
  }
  return;
};

module.exports = {
    update
}
const { use_db } = require("../config/db_pool");
const QRCode = require("qrcode");
const { uploadtos3 } = require("../config/s3manager");

//helper function

function generateId() {
  // Generate random digits, letters, and concatenate them into a string
  const idDigits1 = Math.floor(Math.random() * 100)
    .toString()
    .padStart(2, "0");
  const idDigits2 = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  const idLetters =
    String.fromCharCode(65 + Math.floor(Math.random() * 26)) +
    String.fromCharCode(65 + Math.floor(Math.random() * 26));
  return idDigits1 + idLetters + idDigits2;
}
const generateQR = async (url) => {
  try {
    return await QRCode.toDataURL(url);
  } catch (err) {
    return err;
  }
};

const add_farmer = async (req, res) => {
  const { timeStamp, honeyInfo } = req.body;

  // Generate the SQL query string
  const columns = Object.keys(honeyInfo).join(",");
  const values = Object.values(honeyInfo)
    .map((value) => `'${value}'`)
    .join(",");
  const ticket_id = generateId();
  const query = `INSERT INTO qr_info (ticket_id,timeStamp, ${columns}) VALUES ('${ticket_id}','${timeStamp}', ${values})`;
  const qr_code = await generateQR(
    `${process.env.CLIENT_URL}/ticket/${ticket_id}`
  );
  await uploadtos3(qr_code, ticket_id);
  // Execute the SQL query using the database pool
  try {
    await use_db(query);
    res.status(200).json({ id: ticket_id });
    console.log(`Successfully inserted data with timestamp ${timeStamp}`);
    return;
  } catch (err) {
    console.error(`Error inserting data with timestamp ${timeStamp}: ${err}`);
    res.status(400).json({ err: err });
    return;
  }
};
const get_farmer = async (req, res) => {
  const { ticket_id } = req.params;
  const farmer = await use_db(
    `select * from qr_info where ticket_id = '${ticket_id}'`
  );
  if(farmer.rowCount === 0){
    res.json({err:'not found',status:404})
    return
  }   
  res.json(farmer.rows[0]);
  return
};

module.exports = {
  add_farmer,
  get_farmer,
};
// honey_origin,
// _honey_type,
// honey_weight,
// honey_coordinates,
// h_m_f,
// moister,
// acidity,
// ph,
// color,
// electrical_cunductivity,
// diastate,

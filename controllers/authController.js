const { use_db } = require("../config/db_pool");

const submit = (req,res) => {
    email = req.body.email
    let sql = `insert into users (email) values ('${email}')`
    use_db(sql) 
    res.json({success:200})
};

module.exports = {
    submit
}
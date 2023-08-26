const companymodel = require('../../model/admin/companymodel');

exports.getcompny = async (req, res, next) => {
    try{
      res.render('admin/officemaster/companymaster');
    }catch(err){
      console.log('Data Not Fetched');
    }
  };
const mongoose = require('mongoose');

// Define the schema
const companyMasterSchema = new mongoose.Schema({
  company_name: { type: String, required: [true, 'Company Name is required'] },
  gstin: { type: String, required: [true, 'GSTIN is required'], unique: true },
  panno: { type: String, required: [true, 'PAN No is required'], unique: true },
  logo: { type: String, default: '' },
  address: { type: String, default: '' },
  contact_person_name: { type: String, default: '' },
  contact_person_contact: { type: String, default: '' },
  contact_person_email: { type: String, default: '' },
}, { timestamps: true });

// Create the model
const CompanyMaster = mongoose.model('CompanyMaster', companyMasterSchema);

// Export the model
module.exports = CompanyMaster;

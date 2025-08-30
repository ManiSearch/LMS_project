const fs = require('fs');

// Read the current faculty data
const facultyData = JSON.parse(fs.readFileSync('public/faculty.json', 'utf8'));

// Fix each faculty member's structure
const fixedFaculty = facultyData.map(faculty => {
  const fixed = { ...faculty };
  
  // Fix contact_info structure
  if (fixed.contact_info) {
    // Use present_address as the main address
    if (fixed.contact_info.present_address) {
      fixed.contact_info.address = fixed.contact_info.present_address;
      delete fixed.contact_info.present_address;
      delete fixed.contact_info.permanent_address;
    }
    
    // Add alternate_phone field if missing
    if (!fixed.contact_info.alternate_phone) {
      fixed.contact_info.alternate_phone = fixed.contact_info.alternate_phone_number || '';
    }
    
    // Fix emergency contact phone field
    if (fixed.contact_info.emergency_contact && fixed.contact_info.emergency_contact.contact_number) {
      fixed.contact_info.emergency_contact.phone = fixed.contact_info.emergency_contact.contact_number;
      delete fixed.contact_info.emergency_contact.contact_number;
    }
  }
  
  return fixed;
});

// Write the fixed data back
fs.writeFileSync('public/faculty.json', JSON.stringify(fixedFaculty, null, 2));
console.log('Faculty structure fixed successfully!');

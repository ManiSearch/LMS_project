// Debug test for entity service
import entityService from './services/entityService';

// Test function to debug entity creation
export const testEntityCreation = async () => {
  console.log('🧪 Starting entity creation test...');
  
  const testData = {
    name: "Test Institution",
    code: "TEST001",
    type: "college",
    educationalAuthority: "Test Authority",
    affiliation_number: "TEST/2025/001",
    description: "This is a test institution for debugging purposes.",
    address_line1: "123 Test Street",
    city: "Test City",
    district: "Test District",
    state: "Test State", 
    country: "India",
    pincode: "600001",
    contact_person: "Test Person",
    designation: "Principal",
    email: "test@test.com",
    phone: "+919876543210",
    website: "https://test.com",
    capacity: "1000",
    established_year: "2000",
    num_departments: "5",
    num_faculties: "50",
    num_students: "800"
  };

  try {
    console.log('🧪 Test data:', testData);
    const result = await entityService.createEntity(testData);
    console.log('🧪 Test result:', result);
    
    if (result.success) {
      console.log('✅ Test PASSED: Entity created successfully');
    } else {
      console.log('❌ Test FAILED: Entity creation failed');
      console.log('❌ Errors:', result.errors);
      console.log('❌ Message:', result.message);
    }
    
    return result;
  } catch (error) {
    console.error('🧪 Test ERROR:', error);
    return null;
  }
};

// Run test immediately when imported
testEntityCreation();

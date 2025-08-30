import { RequestHandler } from "express";
import { writeFileSync } from "fs";
import { join } from "path";

// Write students data to JSON file
export const writeStudentsData: RequestHandler = (req, res) => {
  try {
    const studentsData = req.body;
    
    // Validate that we received an array
    if (!Array.isArray(studentsData)) {
      return res.status(400).json({ 
        error: 'Invalid data format: expected array of student objects' 
      });
    }

    // Write to public/students.json
    const filePath = join(process.cwd(), 'public', 'students.json');
    const jsonData = JSON.stringify(studentsData, null, 2);
    
    writeFileSync(filePath, jsonData, 'utf8');
    
    console.log(`✅ Successfully wrote ${studentsData.length} student records to students.json`);
    
    res.json({ 
      success: true, 
      message: `Successfully saved ${studentsData.length} student records`,
      count: studentsData.length 
    });
  } catch (error) {
    console.error('Error writing students data:', error);
    res.status(500).json({ 
      error: 'Failed to write student data',
      details: error.message 
    });
  }
};

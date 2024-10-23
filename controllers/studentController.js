const Student = require('../models/Student');

exports.createStudent = async (req, res) => {
    try {
      const { name, studentCode, isActive } = req.body;
  
      // Validate request body
      if (!name || !studentCode || typeof isActive !== 'boolean') {
        return res.status(400).json({
          success: false,
          message: "Validation failed: 'name', 'studentCode' are required and 'isActive' must be a boolean.",
        });
      }
  
      const newStudent = new Student({
        fullName: name,
        studentCode,
        isActive,
      });
  
      const savedStudent = await newStudent.save();
  
      // Customize the response to exclude __v
      const { __v, ...studentData } = savedStudent.toObject();
  
      res.status(201).json({
        success: true,
        message: 'Student created successfully',
        data: studentData,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };
  

// Get All Students
exports.getAllStudents = async (req, res) => {
    try {
      // Use lean() to return plain JavaScript objects
      const students = await Student.find().lean(); 
  
      // Format the response to include only the desired fields
      const formattedStudents = students.map(({ _id, fullName, studentCode, isActive }) => ({
        _id,
        name :fullName,
        studentCode,
        isActive
      }));
  
      res.status(200).json({
        success: true,
        data: formattedStudents,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error',
      });
    }
  };

  exports.getStudentById = async (req, res) => {
    const { id } = req.params; // Extract the student ID from the request parameters

    try {
        // Find the student by ID
        const student = await Student.findById(id).lean(); 

        if (!student) {
            // If no student is found, return a 404 response
            return res.status(404).json({
                success: false,
                message: 'Student not found',
            });
        }

        // Format the response
        const { _id, fullName, studentCode, isActive } = student;
        res.status(200).json({
            success: true,
            data: {
                _id,
                name: fullName, // Adjust to match your original response structure
                studentCode,
                isActive,
            },
        });
    } catch (error) {
        console.error('Error fetching student by ID:', error);
        
        // Return a 500 error for any unexpected errors
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

exports.updateStudent = async (req, res) => {
    const { id } = req.params; // Extract the student ID from the request parameters
    const { name, isActive } = req.body; // Extract the data to update from the request body

    try {
        // Validate the request body (you can add more validation as needed)
        if (!name || typeof isActive !== 'boolean') {
            return res.status(400).json({
                success: false,
                message: 'Invalid input data',
            });
        }

        // Find and update the student
        const student = await Student.findByIdAndUpdate(
            id,
            { fullName: name, isActive }, // Update fields to match your schema
            { new: true, runValidators: true, lean: true } // Options for updating
        );

        if (!student) {
            // If no student is found, return a 404 response
            return res.status(404).json({
                success: false,
                message: 'Student not found',
            });
        }

        // Format the response
        const { _id, studentCode } = student; // Extract studentCode from the updated student
        res.status(200).json({
            success: true,
            message: 'Student updated successfully',
            data: {
                _id,
                name: student.fullName, // Adjust to match your original response structure
                studentCode,
                isActive,
            },
        });
    } catch (error) {
        console.error('Error updating student:', error);
        
        // Return a 500 error for any unexpected errors
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

exports.deleteStudent = async (req, res) => {
    const { id } = req.params; // Extract the student ID from the request parameters

    try {
        // Validate the ID format (optional, based on your needs)
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid student ID format',
            });
        }

        // Find and delete the student by ID
        const student = await Student.findByIdAndDelete(id);

        if (!student) {
            // If no student is found, return a 404 response
            return res.status(404).json({
                success: false,
                message: 'Student not found',
            });
        }

        // If deletion is successful, return a success response
        res.status(200).json({
            success: true,
            message: 'Student deleted successfully',
        });
    } catch (error) {
        console.error('Error deleting student:', error);

        // Return a 500 error for any unexpected errors
        res.status(500).json({
            success: false,
            message: 'Something went wrong on the server',
        });
    }
};

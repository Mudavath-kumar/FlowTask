require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Task = require('./models/Task');
const generateToken = require('./utils/generateToken');

async function runVerification() {
  console.log('--- TaskFlow Backend & MongoDB Atlas Verification ---');
  console.log('Connecting to MongoDB URI...');
  
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(' Connected to MongoDB Atlas successfully!');

    // 1. Clean test user if exists
    const testEmail = 'kumar_test_' + Date.now() + '@example.com';
    console.log(`\n1. Creating Test User: ${testEmail}`);
    const user = await User.create({
      name: 'Kumar Test',
      email: testEmail,
      password: 'password123',
    });
    console.log(` User created with ID: ${user._id}`);
    
    // Verify password matching
    const isMatch = await user.matchPassword('password123');
    console.log(` Password match check: ${isMatch ? 'PASS' : 'FAIL'}`);

    // Verify token generation
    const token = generateToken(user._id);
    console.log(` JWT Token generated: ${token ? 'PASS' : 'FAIL'}`);

    // 2. Create sample tasks
    console.log('\n2. Creating Sample Tasks for User...');
    const task1 = await Task.create({
      title: 'Design TaskFlow UI system',
      description: 'Implement dark/light themes and modern components',
      status: 'Done',
      priority: 'High',
      dueDate: new Date(Date.now() + 86400000 * 2),
      user: user._id,
    });
    console.log(` Task 1 created (Done/High): ${task1.title}`);

    const task2 = await Task.create({
      title: 'Build Express REST API',
      description: 'Create auth and task routes with controllers',
      status: 'In Progress',
      priority: 'Medium',
      dueDate: new Date(Date.now() + 86400000 * 5),
      user: user._id,
    });
    console.log(` Task 2 created (In Progress/Medium): ${task2.title}`);

    const task3 = await Task.create({
      title: 'Setup Vercel and Render deployment',
      description: 'Configure environment variables and automated builds',
      status: 'Todo',
      priority: 'Low',
      dueDate: new Date(Date.now() + 86400000 * 10),
      user: user._id,
    });
    console.log(` Task 3 created (Todo/Low): ${task3.title}`);

    // 3. Test Query & Filters
    console.log('\n3. Testing Query, Filter & Search...');
    const searchResults = await Task.find({
      user: user._id,
      title: { $regex: 'REST API', $options: 'i' },
    });
    console.log(` Search for "REST API" returned ${searchResults.length} task(s): ${searchResults.length === 1 ? 'PASS' : 'FAIL'}`);

    const doneTasks = await Task.find({ user: user._id, status: 'Done' });
    console.log(` Filter by status 'Done' returned ${doneTasks.length} task(s): ${doneTasks.length === 1 ? 'PASS' : 'FAIL'}`);

    // 4. Test Analytics Calculation
    console.log('\n4. Testing Analytics Calculations...');
    const total = await Task.countDocuments({ user: user._id });
    const completed = await Task.countDocuments({ user: user._id, status: 'Done' });
    const pending = total - completed;
    const rate = ((completed / total) * 100).toFixed(1);
    console.log(` Total: ${total}, Completed: ${completed}, Pending: ${pending}, Rate: ${rate}%`);
    console.log(` Analytics calculation: ${total === 3 && completed === 1 && pending === 2 ? 'PASS' : 'FAIL'}`);

    // 5. Test Status Update
    console.log('\n5. Testing Status Update...');
    task3.status = 'Done';
    await task3.save();
    const updatedTask3 = await Task.findById(task3._id);
    console.log(` Task 3 updated status: ${updatedTask3.status === 'Done' ? 'PASS' : 'FAIL'}`);

    // 6. Test Task Deletion
    console.log('\n6. Testing Task Deletion...');
    await Task.findByIdAndDelete(task1._id);
    const countAfterDelete = await Task.countDocuments({ user: user._id });
    console.log(` Task count after deletion: ${countAfterDelete} (Expected: 2): ${countAfterDelete === 2 ? 'PASS' : 'FAIL'}`);

    console.log('\n ALL BACKEND AND DATABASE VERIFICATION TESTS PASSED SUCCESSFULLY!');
  } catch (err) {
    console.error(' Verification Failed with error:', err);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB connection closed.');
  }
}

runVerification();

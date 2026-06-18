require('dotenv').config();
const mongoose = require('mongoose');

const Student = require('../models/tc/student');

const NEW_BASE_URL = 'https://tc.divinewisdom.edu.in';

async function connectDB() {
    await mongoose.connect(process.env.DATA_BASE);
    console.log('✅ MongoDB connected');
}

async function migrateTcUrls() {
    try {
        await connectDB();

        const students = await Student.find({
            tcKey: { $exists: true, $ne: null }
        }).select('_id tcKey student_name');

        console.log(`📦 Found ${students.length} records`);

        let updated = 0;

        for (const student of students) {

            const tcUrl = `${NEW_BASE_URL}/${student.tcKey}`;

            await Student.updateOne(
                { _id: student._id },
                {
                    $set: {
                        tcUrl
                    },
                    $unset: {
                        TC: ""
                    }
                }
            );

            updated++;

            console.log(
                `✅ ${student.student_name} -> ${tcUrl}`
            );
        }

        console.log('\n======================');
        console.log(`✅ Updated: ${updated}`);
        console.log('🗑 Removed TC object');
        console.log('======================');

        process.exit(0);

    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

migrateTcUrls();
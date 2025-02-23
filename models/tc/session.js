const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  year: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Session', sessionSchema);




{/* 
  <script>
  document.getElementById('createSessionForm').addEventListener('submit', function (e) {
    // Prevent the form from submitting immediately
    e.preventDefault();

  // Get the values of the start and end years
  const startYear = document.getElementById('start_year').value;
  const endYear = document.getElementById('end_year').value;
  const lastTwoDigits = endYear.slice(-2);
  // Create the session name (e.g., "Session 2024-25")
  const sessionYear = `Session ${startYear}-${lastTwoDigits}`;

  // Create a hidden input field to send the sessionYear as the "year" field
  const yearInput = document.createElement('input');
  yearInput.type = 'hidden';
  yearInput.name = 'year';
  yearInput.value = sessionYear;

  // Append the hidden input field to the form
  this.appendChild(yearInput);

  // Now submit the form
  this.submit();
            });
</script> 

*/}
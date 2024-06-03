document.getElementById('upload').addEventListener('change', handleFileSelect, false);

function handleFileSelect(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function(event) {
        const csv = event.target.result;
        processCSV(csv);
    };
    reader.readAsText(file);
}

function processCSV(csv) {
    const lines = csv.split('\n');
    const validEmails = [];
    const invalidEmails = [];

    lines.forEach(line => {
        const email = line.trim();
        if (validateEmail(email)) {
            validEmails.push(email);
        } else {
            invalidEmails.push(email);
        }
    });

    document.getElementById('valcount').textContent = validEmails.length;
    document.getElementById('invalcount').textContent = invalidEmails.length;

    // Populate the tables with emails
    populateTable('val', validEmails);
    populateTable('inval', invalidEmails);
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

function populateTable(tableId, emails) {
    const table = document.getElementById(tableId);
    while (table.rows.length > 1) {
        table.deleteRow(1);
    }

    emails.forEach(email => {
        const row = table.insertRow();
        const cell = row.insertCell(0);
        cell.textContent = email;
    });
}

document.getElementById('scroll-top-btn').addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

window.addEventListener('scroll', function() {
    const scrollBtn = document.getElementById('scroll-top-btn');
    if (window.scrollY > 200) {
        scrollBtn.style.display = 'block';
    } else {
        scrollBtn.style.display = 'none';
    }
});

function sendEmail() {
    const validEmails = Array.from(document.querySelectorAll('#val tr td')).map(td => td.textContent);
    validEmails.forEach(email => {
        Email.send({
            Host: "smtp.yourisp.com",
            Username: "username",
            Password: "password",
            To: email,
            From: document.getElementById("from").value,
            Subject: document.getElementById("subject").value,
            Body: document.getElementById("msg").value,
        }).then(function(message) {
            console.log("Mail sent to " + email);
        });
    });
    alert("Mail has been sent to all valid emails");
}

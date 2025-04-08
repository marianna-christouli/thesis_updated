/*import { jsPDF } from "jspdf";
import "jspdf-autotable"; DEN MPORO ALLO ME THN BLAKEIA AYTH*/

document.addEventListener("DOMContentLoaded", function () {

    const registerForm = document.getElementById("registerForm");
    const loginForm = document.getElementById("loginForm");
    const contactForm = document.getElementById("contactForm");   
    let currentUser = localStorage.getItem("currentUser");

    // Προκαθορισμένος Admin
    const adminUsername = "admin";
    const adminPassword = "Admin123!";

    // Δημιουργία του Admin αν δεν υπάρχει ήδη
    if (!localStorage.getItem("adminCreated")) {
        localStorage.setItem("adminUsername", adminUsername);
        localStorage.setItem("adminPassword", adminPassword);
        localStorage.setItem("adminCreated", "true");
        console.log("Admin δημιουργήθηκε!");
    }

    // Διαχείριση Σύνδεσης
    if (loginForm) {
        loginForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const username = document.getElementById("loginUsername").value.trim();
            const password = document.getElementById("loginPassword").value.trim();

            const users = JSON.parse(localStorage.getItem("users")) || [];
            const user = users.find(u => u.username === username);

            let blockedUsers = JSON.parse(localStorage.getItem("blockedUsers")) || [];
            if (blockedUsers.includes(username)) {
                alert("Ο διαχειριστής απέρριψε την πρόσβασή σας. Δεν μπορείτε να συνδεθείτε.");
                return;
            }

            // Έλεγχος για την αναγνώριση του admin
            if (username === adminUsername && password === adminPassword) {
                // Αν είναι admin, μεταφέρεται στο admin panel
                localStorage.setItem("currentUser", username);
                setTimeout(() => {
                    window.location.href = "admin.html";
                }, 100);
            } //else if (user && user.password === password) {
                else if (user && user.password === btoa(password)){
                localStorage.setItem("currentUser", username);
                setTimeout(() => {
                    window.location.href = "instructions.html";
                }, 100);
            } else {
                alert("Λάθος όνομα χρήστη ή κωδικός πρόσβασης!");
            }
        });
    }

    // Διαχείριση Εγγραφής
    if (registerForm) {
        registerForm.addEventListener("submit", function (event) {
            let valid = true;
            const inputs = registerForm.querySelectorAll("input, select");
            const errorMessages = registerForm.querySelectorAll(".error");

            const usernameField = registerForm.querySelector("input[name='username']");
            if (usernameField && isUsernameTaken(usernameField.value.trim())) {
                valid = false;
                showError(usernameField, "Το όνομα χρήστη υπάρχει ήδη. Παρακαλώ επιλέξτε ένα άλλο.");
            }

            // Καθαρισμός προηγούμενων μηνυμάτων
            errorMessages.forEach(msg => msg.remove());

            // Έλεγχος για κενά πεδία
            inputs.forEach(input => {
                if (input.value.trim() === "") {
                    valid = false;
                    showError(input, "Αυτό το πεδίο είναι υποχρεωτικό.");
                }
            });

            // Έλεγχος εγκυρότητας email
            const emailField = registerForm.querySelector("input[type='email']");
            if (emailField && !validateEmail(emailField.value)) {
                valid = false;
                showError(emailField, "Παρακαλώ εισάγετε ένα έγκυρο email.");
            }

            // Έλεγχος ισχυρότητας κωδικού πρόσβασης
            const passwordField = registerForm.querySelector("input[type='password']");
            if (passwordField && !validatePassword(passwordField.value)) {
                valid = false;
                showError(passwordField, "Ο κωδικός πρέπει να έχει τουλάχιστον 8 χαρακτήρες, ένα κεφαλαίο γράμμα, έναν αριθμό και ένα ειδικό σύμβολο.");
            }
            
            // Αν όλα είναι έγκυρα, καταχωρεί τα δεδομένα
            if (!valid) {
                event.preventDefault();
            } else {
                const user = {
                    username: document.getElementById('username').value.trim(),
                    email: document.getElementById('email').value.trim(),
                    password: document.getElementById('password').value.trim(), // Αν θέλετε να αποθηκεύσετε και τον κωδικό
                    //password: btoa(document.getElementById('password').value.trim()),
                    gender: document.getElementById('gender').value,
                    age: document.getElementById('age').value,
                    education: document.getElementById('education').value,
                    experience: document.getElementById('experience').value,
                    organizationName: document.getElementById('organizationName').value.trim(),
                    organizationType: document.getElementById('organizationType').value,
                    location: document.getElementById('location').value,
                    role: document.getElementById('role').value,
                    usageYears: document.getElementById('usageYears').value,
                    serviceName: document.getElementById('serviceName').value.trim(),
                    
                    // Προσθήκη του πεδίου "status" με τιμή "Σε αναμονή"
                    status: "Σε αναμονή"
                };

                // Αποθήκευση του χρήστη στο localStorage 
                const users = JSON.parse(localStorage.getItem("users")) || [];
                users.push(user);
                localStorage.setItem("users", JSON.stringify(users));

                // Αποθήκευση του τρέχοντος χρήστη στο localStorage
                localStorage.setItem("currentUser", user.username);
                
                alert("Η εγγραφή σας καταχωρήθηκε! Περιμένετε έγκριση από τον διαχειριστή.");
                registerForm.reset();
            }
        });
    }

    // Συνάρτηση εμφάνισης σφαλμάτων
    function showError(element, message) {
        const error = document.createElement("div");
        error.className = "error";
        error.style.color = "red";
        error.style.fontSize = "14px";
        error.style.marginTop = "5px";
        error.innerText = message;
        element.parentNode.appendChild(error);
    }

    // Συνάρτηση για έλεγχο εγκυρότητας email
    function validateEmail(email) {
        const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return re.test(email);
    }

    // Συνάρτηση για έλεγχο ισχυρού κωδικού πρόσβασης
    function validatePassword(password) {
        const re = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        return re.test(password);
    }

    // Συνάρτηση για έλεγχο αν το όνομα χρήστη είναι ήδη καταχωρημένο
    function isUsernameTaken(username) {
        const users = JSON.parse(localStorage.getItem("users")) || [];
        return users.some(user => user.username === username);
    }

    const logoutButton = document.getElementById("logoutButton");

    // Διαχείριση Αποσύνδεσης
    if (logoutButton) {
        logoutButton.addEventListener("click", function () {
            sessionStorage.removeItem("loggedIn");
            localStorage.removeItem("loggedIn");
            localStorage.removeItem("currentUser");
            window.location.href = "index.html";
        });
    }

    if (contactForm) {
        contactForm.addEventListener("submit", function(event) {
            event.preventDefault();
    
            // Παίρνουμε τα δεδομένα από τη φόρμα
            const name = document.getElementById("name").value;
            const email = document.getElementById("email").value;
            const subject = document.getElementById("subject").value;
            const message = document.getElementById("message").value;
    
            // Δημιουργούμε ένα αντικείμενο με τα δεδομένα
            const contactData = {
                name: name,
                email: email,
                subject: subject,
                message: message
            };
    
            // Παίρνουμε τα δεδομένα από το localStorage αν υπάρχουν, αλλιώς ξεκινάμε με έναν άδειο πίνακα
            let contacts = JSON.parse(localStorage.getItem("contacts")) || [];
    
            // Προσθέτουμε το νέο αντικείμενο στον πίνακα
            contacts.push(contactData);
    
            // Αποθηκεύουμε τα δεδομένα πίσω στο localStorage
            localStorage.setItem("contacts", JSON.stringify(contacts));
    
            // Εμφανίζουμε το μήνυμα επιτυχίας
            alert("Το μήνυμά σας εστάλη! Ο διαχειριστής θα επικοινωνήσει σύντομα μαζί σας.");
    
            contactForm.reset();
        });
    }
    
    function loadUsers() {
        const genderLabels = {
            male: "Άντρας",
            female: "Γυναίκα",
            other: "Άλλο"
        };
        
        const ageLabels = {
            "<18": "<18",
            "18-30": "18 - 30",
            "30-40": "30 - 40",
            "40-50": "40 - 50",
            "50-60": "50 - 60",
            ">65": ">65"
        };
        
        const educationLabels = {
            secondary: "Δευτεροβάθμια Εκπαίδευση",
            tertiary: "Τριτόβαθμια Εκπαίδευση",
            postgraduate: "Μεταπτυχιακές - Διδακτορικές Σπουδές"
        };
        
        const experienceLabels = {
            "0-2": "0 - 2",
            "3-5": "3 - 5",
            "6-10": "6 - 10",
            "11-15": "11 - 15",
            "16-25": "16 - 25",
            ">26": ">26"
        };
        
        const organizationTypeLabels = {
            public: "Δημόσιος",
            private: "Ιδιωτικός"
        };
        
        const locationLabels = {
            urban: "Αστική Περιοχή",
            rural: "Περιοχή Εκτός Αστικού Ιστού"
        };
        
        const roleLabels = {
            qualityManager: "Επικεφαλής Ποιότητας",
            medicalDirector: "Διευθυντής Ιατρικής Υπηρεσίας",
            nursingDirector: "Διευθυντής Νοσηλευτικής Υπηρεσίας",
            telehealthManager: "Επικεφαλής Τηλε-υγείας",
            financialDirector: "Οικονομικός Διευθυντής",
            itManager: "Επικεφαλής Πληροφορικής",
            dataProtectionOfficer: "Υπεύθυνος Προστασίας Δεδομένων",
            patientRep: "Εκπρόσωπος Ασθενών",
            healthcareProvider: "Βασικός Πάροχος Τηλε-υγείας",
            externalHealthcarePro: "Εξωτερικός Επαγγελματίας Υγείας",
            other: "Άλλο"
        };
        
        const usageYearsLabels = {
            "1-3": "1 - 3",
            "4-6": "4 - 6",
            "7-10": "7 - 10",
            ">11": ">11"
        };
        
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const userListContainer = document.getElementById("users");
    
        if (userListContainer) {
            userListContainer.innerHTML = "";  // Καθαρίζουμε τα προηγούμενα δεδομένα
    
            if (users.length === 0) {
                userListContainer.innerHTML = "<tr><td colspan='4'>Δεν υπάρχουν χρήστες προς έγκριση.</td></tr>";
            }
    
            users.forEach((user, index) => {
                const isStatusPending = user.status === "Σε αναμονή";
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${user.username}</td>
                    <td>${user.email}</td>
                    <td>
                        <strong>Φύλο:</strong> ${genderLabels[user.gender] || user.gender}<br>
                        <strong>Ηλικία:</strong> ${ageLabels[user.age] || user.age}<br>
                        <strong>Εκπαίδευση:</strong> ${educationLabels[user.education] || user.education}<br>
                        <strong>Εμπειρία:</strong> ${experienceLabels[user.experience] || user.experience}<br>
                        <strong>Όνομα Οργανισμού:</strong> ${user.organizationName}<br>
                        <strong>Τύπος Οργανισμού:</strong> ${organizationTypeLabels[user.organizationType] || user.organizationType}<br>
                        <strong>Τοποθεσία:</strong> ${locationLabels[user.location] || user.location}<br>
                        <strong>Ρόλος:</strong> ${roleLabels[user.role] || user.role}<br>
                        <strong>Χρόνια Χρήσης Υπηρεσίας:</strong> ${usageYearsLabels[user.usageYears] || user.usageYears}<br>
                        <strong>Όνομα Υπηρεσίας:</strong> ${user.serviceName}
                    </td>
                    <td>${user.status || "Σε αναμονή"}</td>
                    <td>
                        ${isStatusPending ? `
                            <button class="approve" id="approve-${index}" onclick="approveUser(${index})">Έγκριση</button>
                            <button class="reject" id="reject-${index}" onclick="rejectUser(${index})">Απόρριψη</button>
                        ` : `
                            <span>Ολοκληρώθηκε</span>
                        `}
                    </td>
                `;
                userListContainer.appendChild(row);
            });
        } else {
            console.warn("Το στοιχείο με id 'users' δεν βρέθηκε στο DOM.");
        }
    }

    loadUsers();
    // Έγκριση χρήστη
    function approveUser(index) {
        const users = JSON.parse(localStorage.getItem("users")) || [];
        users[index].status = "Εγκρίθηκε";
        localStorage.setItem("users", JSON.stringify(users));

        // Αποθήκευση του μηνύματος για τον χρήστη
        localStorage.setItem(`message_${users[index].username}`, "Η εγγραφή σας εγκρίθηκε από τον διαχειριστή!");

        alert("Ο χρήστης εγκρίθηκε!");
        loadUsers();
    }

    // Απόρριψη χρήστη
    function rejectUser(index) {
        const users = JSON.parse(localStorage.getItem("users")) || [];
        users[index].status = "Απορρίφθηκε";
        localStorage.setItem("users", JSON.stringify(users));

        let blockedUsers = JSON.parse(localStorage.getItem("blockedUsers")) || [];
        blockedUsers.push(users[index].username);
        localStorage.setItem("blockedUsers", JSON.stringify(blockedUsers));

        localStorage.setItem(`message_${users[index].username}`, "Η εγγραφή σας απορρίφθηκε από τον διαχειριστή!");

        alert("Ο χρήστης απορρίφθηκε!");
        loadUsers();
    }

    window.approveUser = approveUser;
    window.rejectUser = rejectUser;


    function getExportData() {
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const currentUser = localStorage.getItem("currentUser");
        console.log("currentUser:", currentUser); 

        if (currentUser === adminUsername) {
            return users;
        } else {
            // Διαφορετικά, επιστρέφουμε μόνο τα δεδομένα του τρέχοντος χρήστη.
            return users.filter(user => user.username === currentUser);
        }
    }

    getExportData();

    function exportToCSV() {
        const data = getExportData();
        const csvData = [];
        
        // Επικεφαλίδες: Προσθέτουμε τις ερωτήσεις
        let headers = "ΧΡΗΣΤΗΣ,ΥΠΗΡΕΣΙΑ,ΑΝΘΡΩΠΟΚΕΝΤΡΙΚΟΤΗΤΑ,ΚΛΙΝΙΚΗ ΑΠΟΤΕΛΕΣΜΑΤΙΚΟΤΗΤΑ,ΑΣΦΑΛΕΙΑ - ΑΠΟΡΡΗΤΟ,ΣΥΝΟΛΟ";
        for (let i = 1; i <= 16; i++) {
            headers += `,ΕΡΩΤΗΣΗ ${i}`;
        }
        csvData.push(headers);
        
        data.forEach(user => {
            const totalScore = (parseInt(user.score1) || 0) + (parseInt(user.score2) || 0) + (parseInt(user.score3) || 0);
            if (totalScore > 0) {
                let row = `${user.username},${user.organizationName},${user.score1},${user.score2},${user.score3},${totalScore}`;
               
                // Ανάκτηση του answerValue από το localStorage και μετατροπή σε πίνακα
                let answerValue1 = [];
                let answerValue2 = [];
                let answerValue3 = [];

                try {
                    answerValue1 = JSON.parse(localStorage.getItem('answerValue1')) || [];
                    answerValue2 = JSON.parse(localStorage.getItem('answerValue2')) || [];
                    answerValue3 = JSON.parse(localStorage.getItem('answerValue3')) || [];
                } catch (e) {
                    console.error('Σφάλμα κατά την ανάκτηση του answerValue:', e);
                }
            
                // Προσθήκη των απαντήσεων από το answerValue1 (9 απαντήσεις)
                for (let i = 0; i < 9; i++) {
                    row += `,${answerValue1[i] || ''}`; // Αν δεν υπάρχει απάντηση, αφήνουμε κενό
                }

                // Προσθήκη των απαντήσεων από το answerValue2 (4 απαντήσεις)
                for (let i = 0; i < 4; i++) {
                    row += `,${answerValue2[i] || ''}`; // Αν δεν υπάρχει απάντηση, αφήνουμε κενό
                }

                // Προσθήκη των απαντήσεων από το answerValue3 (3 απαντήσεις)
                for (let i = 0; i < 3; i++) {
                    row += `,${answerValue3[i] || ''}`; // Αν δεν υπάρχει απάντηση, αφήνουμε κενό
                }
                    
                csvData.push(row);
            }
        });
        
        const csvContent = "\uFEFF" + csvData.join('\n'); // Προσθέτουμε το BOM
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'results.csv';
        link.click();
    }

    function exportToPDF() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
    
        // Βάλε την γραμματοσειρά Open Sans που έχεις μετατρέψει σε Base64
        const fontBase64 = 'C:\Users\Admin\Downloads\encoded-20250331173644'; // Εδώ βάλε το Base64 αρχείο της γραμματοσειράς
    
        // Προσθήκη της γραμματοσειράς στο VFS
        doc.addFileToVFS("OpenSans-Regular.ttf", fontBase64);
        doc.addFont("OpenSans-Regular.ttf", "OpenSans", "normal");
        doc.setFont("OpenSans");
    
        let yOffset = 10;
    
        // Επικεφαλίδες
        doc.text("ΧΡΗΣΤΗΣ | ΑΝΘΡΩΠΟΚΕΝΤΡΙΚΟΤΗΤΑ | ΚΛΙΝΙΚΗ ΑΠΟΤΕΛΕΣΜΑΤΙΚΟΤΗΤΑ | ΑΣΦΑΛΕΙΑ - ΑΠΟΡΡΗΤΟ | ΣΥΝΟΛΟ", 10, yOffset);
        yOffset += 10;
    
        // Λήψη δεδομένων για εξαγωγή PDF
        const data = getExportData();
        data.forEach(user => {
            const totalScore = (parseInt(user.score1) || 0) + (parseInt(user.score2) || 0) + (parseInt(user.score3) || 0);
            if (totalScore > 0) {
                const rowText = `${user.username} | ${user.score1} | ${user.score2} | ${user.score3} | ${totalScore}`;
                doc.text(rowText, 10, yOffset);
                yOffset += 10;
                if (yOffset > 280) {
                    doc.addPage();
                    yOffset = 10;
                }
            }
        });
    
        // Αποθήκευση του αρχείου PDF
        doc.save("results.pdf");
    }   
        
    function exportToTXT() {
        // Βεβαιωθείτε ότι η συνάρτηση getExportData() επιστρέφει δεδομένα
        const data = getExportData(); 
    
        // Αν δεν υπάρχουν δεδομένα, σταματάμε την εκτέλεση της συνάρτησης
        if (!data || data.length === 0) {
            console.error("No data to export.");
            return;
        }
    
        // Δημιουργία του περιεχομένου του αρχείου .txt
        let textContent = "ΧΡΗΣΤΗΣ | ΑΝΘΡΩΠΟΚΕΝΤΡΙΚΟΤΗΤΑ | ΚΛΙΝΙΚΗ ΑΠΟΤΕΛΕΣΜΑΤΙΚΟΤΗΤΑ | ΑΣΦΑΛΕΙΑ - ΑΠΟΡΡΗΤΟ | ΣΥΝΟΛΟ\n";
        
        // Προσθήκη των δεδομένων στις γραμμές του κειμένου
        data.forEach(user => {
            const totalScore = (parseInt(user.score1) || 0) + (parseInt(user.score2) || 0) + (parseInt(user.score3) || 0);
            if (totalScore > 0) {
                const rowText = `${user.username} | ${user.score1} | ${user.score2} | ${user.score3} | ${totalScore}`;
                textContent += rowText + "\n";
            }
        });
    
        // Δημιουργία του Blob για το αρχείο .txt
        const blob = new Blob([textContent], { type: "text/plain;charset=utf-8" });
    
        // Δημιουργία του link για την εκκίνηση της λήψης
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "results.txt";  // Το όνομα του αρχείου που θα κατέβει
    
        // Αντικαθιστούμε την ενέργεια με την πραγματική κλήση της ενέργειας λήψης
        document.body.appendChild(link); // Προσθέτουμε το link στο DOM
        link.click();  // Εκκινεί το download
        document.body.removeChild(link); // Αφαιρούμε το link από το DOM μετά το download
    } 

    window.exportToCSV = exportToCSV;
    window.exportToPDF = exportToPDF;
    window.exportToTXT = exportToTXT;
});
